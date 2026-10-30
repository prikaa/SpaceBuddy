// =====================================================
// SPACE JUNK VIEW: "What's around Earth?"
// Reads analysis/debris_summary.json, made by analysis/analyze_debris.py.
// Opens from Earth's zoom view. Uses say() from script.js.
// Three tabs: Overview (dot swarm), Biggest sources, Who owns it.
// =====================================================
(() => {
  const DATA_URL = "analysis/debris_summary.json";
  const MAX_DOTS = 400; // more dots than this gets slow and cluttered

  // One color per group. Debris is red on purpose: it's the problem.
  const GROUPS = {
    working: { label: "Working satellites", color: "#4ade80" },
    dead: { label: "Dead satellites", color: "#9ca3af" },
    "Rocket bodies": { label: "Rocket bodies", color: "#fb923c" },
    Debris: { label: "Debris", color: "#f87171" },
    Unknown: { label: "Unknown", color: "#c084fc" }
  };

  // Owner codes used in the CelesTrak catalog. Unknown codes are shown as-is.
  const OWNER_NAMES = {
    US: "United States",
    PRC: "China",
    CIS: "Russia / former USSR",
    FR: "France",
    JPN: "Japan",
    IND: "India",
    ESA: "European Space Agency",
    UK: "United Kingdom",
    ISS: "International Space Station",
    ITSO: "Intelsat"
  };
  // How Astro says them out loud.
  const SPOKEN_OWNERS = { US: "the United States", PRC: "China", CIS: "Russia", UK: "the United Kingdom" };
  const spokenOwner = code => SPOKEN_OWNERS[code] || (OWNER_NAMES[code] ?? code);

  const ownerName = code => OWNER_NAMES[code] ? `${OWNER_NAMES[code]} (${code})` : code;

  const $ = id => document.getElementById(id);
  const junk = $("junk");
  const junkBtn = $("junk-btn");
  const closeBtn = $("close-junk");
  const canvas = $("junk-canvas");
  const ctx = canvas.getContext("2d");
  const statEl = $("junk-stat");
  const detailsEl = $("junk-details");
  const legendEl = $("junk-legend");
  const sourcesEl = $("junk-sources");
  const ownersEl = $("junk-owners");
  const scaleEl = $("junk-scale");
  const tabs = [...junk.querySelectorAll(".junk-tab")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let data = null;
  let dots = [];
  let earthR = 0;
  let canvasW = 0;
  let rafId = null;
  let lines = {}; // what Astro says on each tab

  // Real Earth image (same one the zoom view uses). If it's missing,
  // we draw the plain blue Earth instead.
  const earthImg = new Image();
  let earthImgReady = false;
  earthImg.onload = () => { earthImgReady = true; };
  earthImg.src = "textures/earth.jpg";
  let earthSpin = 0; // how far the surface has scrolled (0 to 1)

  // Only show the button when Earth is the zoomed planet.
  document.addEventListener("zoom-open", e => {
    junkBtn.hidden = e.detail.name !== "Earth";
  });

  async function loadData() {
    if (data) return data;
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
    return data;
  }

  // Split satellites into working vs dead, keep the other types as they are.
  function countGroups(d) {
    const t = d.in_orbit_by_type;
    const total = Object.values(t).reduce((a, b) => a + b, 0);
    const working = d.working_satellites ?? Math.round(d.working_share * total);
    const counts = {
      working,
      dead: Math.max((t.Satellites || 0) - working, 0),
      "Rocket bodies": t["Rocket bodies"] || 0,
      Debris: t.Debris || 0,
      Unknown: t.Unknown || 0
    };
    return { counts, total };
  }

  // Round "objects per dot" up to a friendly number like 10, 20, 50, 100...
  function niceStep(raw) {
    if (raw <= 1) return 1;
    const pow = 10 ** Math.floor(Math.log10(raw));
    for (const m of [1, 2, 5, 10]) if (m * pow >= raw) return m * pow;
    return 10 * pow;
  }

  // =====================================================
  // OVERVIEW TAB: animated dot swarm
  // =====================================================
  function sizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvasW = canvas.clientWidth;
    canvas.width = canvasW * dpr;
    canvas.height = canvasW * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeDots(counts, perDot) {
    earthR = canvasW * 0.14;
    dots = [];
    for (const [key, n] of Object.entries(counts)) {
      const howMany = n > 0 ? Math.max(1, Math.round(n / perDot)) : 0;
      for (let i = 0; i < howMany; i++) {
        const r = earthR * (1.3 + Math.random() * 2.1);
        dots.push({
          r,
          angle: Math.random() * Math.PI * 2,
          speed: 0.6 * (earthR / r) ** 1.5, // closer = faster, like the planets
          color: GROUPS[key].color
        });
      }
    }
  }

  function drawEarth(c, dt) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(c, c, earthR, 0, Math.PI * 2);
    ctx.clip(); // everything below stays inside the circle

    if (earthImgReady) {
      // The image is a flat world map (2:1). Slide it sideways and draw it
      // twice so it wraps around, which makes Earth look like it's spinning.
      earthSpin = (earthSpin + dt / 14) % 1; // one turn every 14 s, like the planet view
      const h = earthR * 2;
      const w = h * 2;
      const x = c - earthR - w + earthSpin * w;
      ctx.drawImage(earthImg, x, c - earthR, w, h);
      ctx.drawImage(earthImg, x + w, c - earthR, w, h);
    } else {
      const g = ctx.createRadialGradient(c - earthR * 0.3, c - earthR * 0.3, earthR * 0.2, c, c, earthR);
      g.addColorStop(0, "#5bb0ff");
      g.addColorStop(1, "#1f5fbf");
      ctx.fillStyle = g;
      ctx.fillRect(c - earthR, c - earthR, earthR * 2, earthR * 2);
    }

    // Light and shadow on top, so it looks round (same as the planets).
    const shine = ctx.createRadialGradient(c - earthR * 0.35, c - earthR * 0.45, 0, c - earthR * 0.35, c - earthR * 0.45, earthR * 0.9);
    shine.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    shine.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = shine;
    ctx.fillRect(c - earthR, c - earthR, earthR * 2, earthR * 2);

    const shade = ctx.createRadialGradient(c, c, earthR * 0.5, c, c, earthR);
    shade.addColorStop(0, "rgba(0, 0, 0, 0)");
    shade.addColorStop(1, "rgba(0, 0, 0, 0.5)");
    ctx.fillStyle = shade;
    ctx.fillRect(c - earthR, c - earthR, earthR * 2, earthR * 2);

    ctx.restore();
  }

  function draw(dt) {
    const c = canvasW / 2;
    ctx.clearRect(0, 0, canvasW, canvasW);

    drawEarth(c, dt);

    for (const d of dots) {
      d.angle -= d.speed * dt; // counterclockwise
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(c + Math.cos(d.angle) * d.r, c + Math.sin(d.angle) * d.r, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function startSwarm() {
    stopSwarm();
    if (reducedMotion) { draw(0); return; }
    let last = performance.now();
    const frame = now => {
      draw((now - last) / 1000);
      last = now;
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
  }

  function stopSwarm() {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // =====================================================
  // BAR CHARTS (used by Sources and Owners tabs)
  // =====================================================
  function renderBars(listEl, rows, color) {
    listEl.innerHTML = "";
    if (rows.length === 0) {
      listEl.innerHTML = "<li>No data.</li>";
      return;
    }
    const max = Math.max(...rows.map(r => r.value));
    for (const row of rows) {
      const li = document.createElement("li");
      const name = document.createElement("span");
      name.textContent = row.label;
      const count = document.createElement("span");
      count.textContent = `${row.value.toLocaleString()} pieces`;
      const bar = document.createElement("span");
      bar.className = "bar";
      bar.innerHTML = `<span style="--w:${(row.value / max) * 100}%; --bar:${color}"></span>`;
      li.append(name, count, bar);
      listEl.appendChild(li);
    }
  }

  // =====================================================
  // FILL ALL TABS FROM THE DATA
  // =====================================================
  function render(d) {
    const { counts, total } = countGroups(d);
    const pct = Math.round((counts.working / total) * 100);
    const perDot = niceStep(total / MAX_DOTS);

    statEl.innerHTML =
      `About <strong>${total.toLocaleString()}</strong> tracked objects circle Earth. ` +
      `Only <strong>${pct}%</strong> are working satellites.`;
    scaleEl.textContent = `Each dot = ${perDot.toLocaleString()} real object${perDot === 1 ? "" : "s"}.`;

    // Overview legend
    legendEl.innerHTML = "";
    for (const [key, n] of Object.entries(counts)) {
      if (n === 0) continue;
      const li = document.createElement("li");
      li.innerHTML = `<span class="swatch" style="--c:${GROUPS[key].color}"></span>`;
      li.append(`${GROUPS[key].label}: ${n.toLocaleString()}`);
      legendEl.appendChild(li);
    }

    // Sources tab
    const sources = (d.top_debris_sources || []).slice(0, 6)
      .map(s => ({ label: s.name, value: s.pieces }));
    renderBars(sourcesEl, sources, "#f87171");

    // Owners tab
    const owners = Object.entries(d.debris_by_owner || {})
      .map(([code, n]) => ({ label: ownerName(code), value: n, code }));
    renderBars(ownersEl, owners, "#fb923c");

    // What Astro says on each tab
    lines = {
      overview: `Look at all this! Only ${pct} percent of the things going around Earth are working satellites. Most of the rest is space junk!`,
      sources: sources.length
        ? `The biggest source of space junk is ${sources[0].label}. It left ${sources[0].value.toLocaleString()} pieces that are still going around Earth!`
        : "",
      // Name the top three together: close counts shouldn't sound like one "winner".
      owners: owners.length >= 3
        ? `Most space junk comes from ${owners.slice(0, 3).map(o => spokenOwner(o.code)).join(", ").replace(/, ([^,]*)$/, ", and $1")}.`
        : ""
    };

    sizeCanvas();
    makeDots(counts, perDot);
  }

  // =====================================================
  // TABS
  // =====================================================
  function selectTab(tab, speak = true) {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute("aria-controls")).hidden = !on;
    }
    const key = tab.dataset.tab;
    if (key === "overview") startSwarm(); else stopSwarm(); // only animate when visible
    if (speak && lines[key]) say(lines[key]);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    // Left/right arrow keys move between tabs.
    tab.addEventListener("keydown", e => {
      const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });

  // =====================================================
  // OPEN / CLOSE
  // =====================================================
  async function openJunk() {
    junk.hidden = false;
    closeBtn.focus({ preventScroll: true });
    try {
      const d = await loadData();
      detailsEl.hidden = false;
      selectTab(tabs[0], false); // show Overview first so the canvas has a size
      render(d);
      startSwarm();
      say(lines.overview);
    } catch (err) {
      detailsEl.hidden = true;
      statEl.textContent =
        "No space junk data yet. Run analyze_debris.py in the analysis folder, then open the site with Go Live.";
      say("Hmm, I can't find the space junk data yet.");
      console.warn("Space junk data not loaded:", err);
    }
  }

  function closeJunk() {
    stopSwarm();
    junk.hidden = true;
    junkBtn.focus({ preventScroll: true });
    say("Back to Earth!");
  }

  junkBtn.addEventListener("click", openJunk);
  closeBtn.addEventListener("click", closeJunk);

  // Escape closes this view first, before the zoom view underneath.
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !junk.hidden) {
      e.stopImmediatePropagation();
      closeJunk();
    }
  }, true);
})();