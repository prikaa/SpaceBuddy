// =====================================================
// PLANET INFO: real stats, facts, photo textures, and a zoomable Sun.
// Loaded AFTER script.js. It adds to the planets script.js already built,
// so script.js itself doesn't need to change.
//
// Facts researched by our team. Images: Solar System Scope textures,
// CC BY 4.0 (https://www.solarsystemscope.com/textures/).
// Put the images in a "textures" folder. Missing images fall back to
// the drawn surfaces, so nothing breaks.
// =====================================================
(() => {
  const tex = file => `url("textures/${file}")`;
  const temp = c => `${c}°C (${Math.round(c * 9 / 5 + 32)}°F)`;

  // facts: what Astro says (first one is read when you zoom in)
  // stats: the info cards shown under the name
  const INFO = {
    Mercury: {
      texture: "mercury.jpg",
      facts: [
        "Mercury is the closest planet to the Sun, and the smallest planet in our solar system.",
        "One day on Mercury, from sunrise to sunrise, lasts 176 Earth days!",
        "Mercury has no moons at all."
      ],
      stats: [["Type", "Rocky planet"], ["Diameter", "4,879 km"], ["Average temp", temp(167)],
              ["Distance from Sun", "58 million km"], ["One year", "88 Earth days"]]
    },
    Venus: {
      texture: "venus.jpg",
      facts: [
        "Venus has a very thick atmosphere that traps heat. That makes it the hottest planet in our solar system.",
        "Venus spins the opposite way from most planets, so the Sun rises in the west!",
        "Venus spins so slowly that one day there is longer than one whole year."
      ],
      stats: [["Type", "Rocky planet"], ["Diameter", "12,104 km"], ["Average temp", temp(464)],
              ["Distance from Sun", "108 million km"], ["One year", "225 Earth days"]]
    },
    Earth: {
      texture: "earth.jpg",
      facts: [
        "Earth is our home, and the only planet where we know there is life.",
        "About 71 percent of Earth is covered by water!",
        "Earth has one moon. You can see it in the night sky!"
      ],
      stats: [["Type", "Rocky planet"], ["Diameter", "12,756 km"], ["Average temp", temp(15)],
              ["Distance from Sun", "150 million km"], ["One year", "365.25 days"]]
    },
    Mars: {
      texture: "mars.jpg",
      facts: [
        "Mars is a cold, rocky planet. Its dirt looks red because it has lots of iron, like rust.",
        "Mars has Olympus Mons, the biggest volcano we know of in the whole solar system!",
        "Mars has two tiny moons, named Phobos and Deimos."
      ],
      stats: [["Type", "Rocky planet"], ["Diameter", "6,792 km"], ["Average temp", temp(-65)],
              ["Distance from Sun", "228 million km"], ["One year", "687 Earth days"]]
    },
    Jupiter: {
      texture: "jupiter.jpg",
      facts: [
        "Jupiter is the biggest planet. It is made mostly of gases called hydrogen and helium.",
        "Jupiter's Great Red Spot is a giant storm that has been swirling for at least 150 years!",
        "Jupiter spins the fastest of all the planets. A day there is only about 10 hours."
      ],
      stats: [["Type", "Gas giant"], ["Diameter", "142,984 km"], ["Average temp", temp(-110)],
              ["Distance from Sun", "778 million km"], ["One year", "11.9 Earth years"]]
    },
    Saturn: {
      texture: "saturn.jpg",
      facts: [
        "Saturn is famous for its beautiful rings, made mostly of ice, with some rock and dust.",
        "Saturn is less dense than water. In a big enough bathtub, it would float!",
        "Saturn has more than one hundred moons!"
      ],
      stats: [["Type", "Gas giant"], ["Diameter", "120,536 km"], ["Average temp", temp(-140)],
              ["Distance from Sun", "1.4 billion km"], ["One year", "29.5 Earth years"]]
    },
    Uranus: {
      // No texture on purpose: it would break the sideways "rolling" spin.
      facts: [
        "Uranus is a cold, blue-green planet that spins almost on its side.",
        "Uranus is tilted so much that it looks like it is rolling around the Sun. Watch it roll!",
        "Uranus has rings too, but they are thin and dark, so they are hard to see."
      ],
      stats: [["Type", "Ice giant"], ["Diameter", "51,118 km"], ["Average temp", temp(-195)],
              ["Distance from Sun", "2.9 billion km"], ["One year", "84 Earth years"]]
    },
    Neptune: {
      texture: "neptune.jpg",
      facts: [
        "Neptune is the farthest planet from the Sun, with strong winds and storms.",
        "Neptune's winds can blow faster than 2,000 kilometers per hour!",
        "Neptune is so far away that one trip around the Sun takes 165 Earth years."
      ],
      stats: [["Type", "Ice giant"], ["Diameter", "49,528 km"], ["Average temp", temp(-200)],
              ["Distance from Sun", "4.5 billion km"], ["One year", "164.8 Earth years"]]
    }
  };

  const SUN = {
    name: "The Sun",
    isStar: true,
    spin: 25,
    surface: `${tex("sun.jpg")}, radial-gradient(circle at 40% 40%, #fff3b0, #ffb703 45%, #fb8500)`,
    facts: [
      "The Sun is the star at the center of our solar system. Its light and heat make life on Earth possible.",
      "The Sun holds more than 99 percent of all the stuff in our solar system!",
      "The Sun is about 4.6 billion years old."
    ],
    stats: [["Type", "Star"], ["Diameter", "About 1.39 million km"], ["Age", "About 4.6 billion years"]]
  };

  // ---------- 1. Add info + textures to the planets ----------
  for (const p of PLANETS) {
    const info = INFO[p.name];
    if (!info) continue;
    p.facts = info.facts;
    p.stats = info.stats;
    // Image on top; the old drawn surface stays underneath as a backup.
    if (info.texture) p.surface = `${tex(info.texture)}, ${p.surface}`;
  }
  // Redraw the planets that are already on screen.
  document.querySelectorAll(".planet").forEach(btn => {
    const p = PLANETS.find(x => x.name === btn.getAttribute("aria-label"));
    if (p) setOrbLook(btn.querySelector(".orb"), p);
  });

  // ---------- 2. Make the Sun zoomable ----------
  // Swap in a fresh Sun button (drops the old "just talk" click handler).
  const oldSun = document.querySelector(".sun-btn");
  const sunBtn = oldSun.cloneNode(false);
  sunBtn.innerHTML = `<span class="body"><span class="orb"></span></span>`;
  oldSun.replaceWith(sunBtn);
  const sunOrb = sunBtn.querySelector(".orb");
  setOrbLook(sunOrb, SUN);
  sunOrb.classList.add("sun-orb");

  sunBtn.addEventListener("click", () => {
    if (mode === "explore") openZoom(SUN, sunBtn);
    else checkAnswer("the Sun", sunBtn.querySelector(".body"));
  });

  // ---------- 3. Show stats in the zoom view ----------
  const zoomOrbEl = document.getElementById("zoom-orb");
  const statsEl = document.createElement("dl");
  statsEl.className = "zoom-stats";
  document.getElementById("zoom-name").after(statsEl);

  const credit = document.createElement("p");
  credit.className = "zoom-credit";
  credit.textContent = "Images: Solar System Scope, CC BY 4.0";
  document.querySelector(".zoom-text").appendChild(credit);

  document.addEventListener("zoom-open", e => {
    const p = e.detail;
    zoomOrbEl.classList.toggle("sun-orb", !!p.isStar);
    statsEl.innerHTML = "";
    for (const [label, value] of p.stats || []) {
      const item = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      item.append(dt, dd);
      statsEl.appendChild(item);
    }
    statsEl.hidden = !p.stats;
  });
})();