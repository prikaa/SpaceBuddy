// =====================================================
// PROTECT SPACE: "What happens if we don't protect Earth's orbit?"
// 1. What is space junk?  2. Why is it dangerous?  3. How can we protect orbit?
// Adds its own top-bar button and screen, so index.html and script.js
// don't need to change (besides loading this file LAST).
// Uses say(), ASTRO_SVG, gameScreen, missionResults, and mission state from script.js.
// Every card is a button: kids tap it and Astro reads it aloud.
// =====================================================
(() => {
  // ---------- Content: edit text here ----------
  const QUESTION = "What happens if we don't protect Earth's orbit?";
  const CORE_MESSAGE = "Space is an incredible place to explore, but we must also protect it for future generations.";

  const SECTIONS = [
    {
      id: "what",
      number: "1",
      title: "What is space junk?",
      intro: "Space junk is anything people sent into space that isn't working anymore, but is still going around Earth.",
      cards: [
        { icon: "🛰️", title: "Dead satellites",
          text: "Satellites that stopped working, but are still circling Earth." },
        { icon: "🚀", title: "Old rocket parts",
          text: "Pieces of rockets that carried satellites up, then were left behind in orbit." },
        { icon: "💥", title: "Broken pieces",
          text: "Tiny bits from explosions and crashes. One crash can make thousands of pieces!" }
      ],
      dashboard: true // real numbers from our data go here
    },
    {
      id: "why",
      number: "2",
      title: "Why is space junk dangerous?",
      intro: "Space junk moves incredibly fast, so even a small piece can cause big damage.",
      cards: [
        { icon: "⚡", title: "Tiny but super fast",
          text: "Junk in low orbit zooms around Earth many times faster than a bullet. A tiny chip of paint once made a crack in a window on the space station!" },
        { icon: "🔁", title: "The Kessler Syndrome",
          text: "In 1978, NASA scientist Donald Kessler warned that one crash makes pieces, those pieces cause more crashes, and it can keep going like a chain reaction. In 2009, two satellites really did crash into each other, Iridium 33 and Cosmos 2251." },
        { icon: "🚧", title: "Harder future missions",
          text: "The more junk there is, the more satellites and astronauts have to dodge it. Too much junk could make some orbits too risky to use." }
      ]
    },
    {
      id: "how",
      number: "3",
      title: "How can we protect Earth's orbit?",
      intro: "Scientists and engineers are working on four big ways to keep space clean.",
      cards: [
        { icon: "🛠️", title: "Prevent new debris",
          text: "Build satellites and rockets that leave less junk behind, and never blow up satellites on purpose." },
        { icon: "🔥", title: "Safe disposal",
          text: "When a satellite is finished, bring it down so it burns up in the air, or move very high ones to a far-away graveyard orbit." },
        { icon: "👀", title: "Collision avoidance",
          text: "Track tens of thousands of objects, and move working satellites out of the way when junk gets too close. The space station does this too!" },
        { icon: "🤖", title: "Active debris removal",
          text: "Engineers are testing spacecraft that catch old junk with nets, harpoons, magnets, or robot arms. These are still being tested." }
      ]
    }
  ];

  // ---------- Top-bar button (placed before Freeze) ----------
  const navBtn = document.createElement("button");
  navBtn.id = "cleanup-btn";
  navBtn.className = "mode-btn";
  navBtn.setAttribute("aria-pressed", "false");
  navBtn.textContent = "🛡️ Protect Space";
  document.getElementById("orbit-btn").before(navBtn);

  // ---------- Build the screen ----------
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  };

  const screen = el("section", "screen");
  screen.id = "cleanup-screen";
  screen.hidden = true;

  // Header
  const header = el("header", "cleanup-header");
  const back = el("button", "big-btn small alt", "← Back to Explore");
  back.id = "cleanup-back";
  const astro = el("div", "astro small");
  astro.setAttribute("aria-hidden", "true");
  astro.innerHTML = ASTRO_SVG;
  const eyebrow = el("p", "cleanup-eyebrow", "PROTECT EARTH'S ORBIT");
  const h1 = el("h1", null, QUESTION);
  const jump = el("nav", "cleanup-jump");
  jump.setAttribute("aria-label", "Sections");
  header.append(back, astro, eyebrow, h1, jump);
  screen.append(header);

  // A card is a button; tapping it reads it aloud.
  function makeCard(card) {
    const btn = el("button", "cleanup-card");
    const icon = el("span", "cleanup-icon", card.icon);
    icon.setAttribute("aria-hidden", "true");
    btn.append(icon, el("strong", null, card.title), el("span", null, card.text));
    btn.addEventListener("click", () => say(`${card.title}. ${card.text}`));
    return btn;
  }

  let dashboardEl = null;
  for (const s of SECTIONS) {
    const sec = el("section", "cleanup-section");
    sec.id = `cleanup-${s.id}`;

    const head = el("div", "cleanup-section-head");
    const num = el("span", "cleanup-num", s.number);
    num.setAttribute("aria-hidden", "true");
    const h2 = el("h2", null, s.title);
    const listen = el("button", "icon-btn cleanup-listen", "🔊");
    listen.setAttribute("aria-label", `Hear: ${s.title}`);
    listen.addEventListener("click", () => say(`${s.title} ${s.intro}`));
    head.append(num, h2, listen);

    const grid = el("div", "cleanup-grid");
    s.cards.forEach(c => grid.appendChild(makeCard(c)));
    sec.append(head, el("p", "cleanup-intro", s.intro));

    if (s.dashboard) {
      dashboardEl = el("div", "cleanup-dashboard");
      dashboardEl.hidden = true; // shown once real data loads
      sec.append(grid, dashboardEl);
    } else {
      sec.append(grid);
    }
    screen.append(sec);

    // Jump chip in the header
    const chip = el("button", "cleanup-chip", `${s.number}. ${s.title}`);
    chip.addEventListener("click", () => {
      sec.scrollIntoView({ behavior: "smooth", block: "start" });
      say(`${s.title} ${s.intro}`);
    });
    jump.appendChild(chip);
  }

  // Core message
  const core = el("button", "cleanup-core");
  core.append(el("span", "cleanup-icon", "🌍"), el("strong", null, CORE_MESSAGE));
  core.addEventListener("click", () => say(CORE_MESSAGE));
  screen.append(core);

  document.getElementById("game-screen").after(screen);

  // ---------- Dashboard from our real data ----------
  async function loadDashboard() {
    try {
      const res = await fetch("analysis/debris_summary.json", { cache: "no-store" });
      if (!res.ok) return;
      const d = await res.json();
      const t = d.in_orbit_by_type || {};
      const total = Object.values(t).reduce((a, b) => a + b, 0);
      if (!total) return;
      const working = d.working_satellites ?? Math.round(d.working_share * total);
      const pctWorking = Math.round((working / total) * 100);
      const debris = t.Debris || 0;
      const leoShare = d.by_zone?.LEO && debris ? Math.round((d.by_zone.LEO.Debris / debris) * 100) : null;

      const tiles = [
        { big: total.toLocaleString(), label: "tracked objects around Earth",
          speak: `About ${total.toLocaleString()} tracked objects are going around Earth right now.` },
        { big: `${pctWorking}%`, label: "are working satellites",
          speak: `Only ${pctWorking} percent of them are working satellites.` },
        { big: debris.toLocaleString(), label: "pieces of broken debris",
          speak: `${debris.toLocaleString()} of them are pieces of broken debris.` }
      ];
      if (leoShare !== null) {
        tiles.push({ big: `${leoShare}%`, label: "of debris is in low Earth orbit",
          speak: `${leoShare} percent of the debris is in low Earth orbit, close to us.` });
      }

      dashboardEl.innerHTML = "";
      const title = el("h3", null, "📊 Our data says...");
      const row = el("div", "cleanup-tiles");
      for (const tile of tiles) {
        const b = el("button", "cleanup-tile");
        b.append(el("span", "cleanup-big", tile.big), el("span", null, tile.label));
        b.addEventListener("click", () => say(tile.speak));
        row.appendChild(b);
      }
      const more = el("button", "big-btn small teal", "🛰️ See all the data");
      // Opens the same space junk view as Earth's zoom (it sits on top of this page).
      more.addEventListener("click", () => document.getElementById("junk-btn")?.click());
      const src = el("p", "cleanup-source", "Data: CelesTrak satellite catalog, analyzed by our team.");
      dashboardEl.append(title, row, more, src);
      dashboardEl.hidden = false;
    } catch (err) {
      console.warn("Protect Space dashboard: no data yet", err);
    }
  }

  // ---------- Open / close (same pattern as Space Tech) ----------
  let resultsWereVisible = false;

  function openCleanup() {
    resultsWereVisible = !missionResults.hidden;
    missionResults.hidden = true;
    gameScreen.classList.remove("active");
    screen.hidden = false;
    screen.classList.add("active");
    window.scrollTo(0, 0);
    loadDashboard();
    say(`${QUESTION} Let's find out! Tap anything to hear about it.`);
  }

  function closeCleanup() {
    screen.classList.remove("active");
    screen.hidden = true;
    gameScreen.classList.add("active");
    missionResults.hidden = !resultsWereVisible;
    if (resultsWereVisible) return;
    if (mode === "missions" && currentMission && !missionRoundFinished) {
      say(`Question ${missionNumber} of 10: ${currentMission.prompt}`);
    } else {
      say("Welcome back! Tap any planet to visit it.");
    }
  }

  navBtn.addEventListener("click", openCleanup);
  back.addEventListener("click", closeCleanup);
})();