// =====================================================
// CONTENT: edit facts, missions, and looks here.
// Keep spoken text emoji-free (the voice reads it aloud).
// =====================================================

// Helpers for drawing planet surfaces.
// spot(x, y, width, height, color): an oval patch. Positions are % of the surface strip.
const spot = (x, y, rx, ry, c) =>
  `radial-gradient(${rx}% ${ry}% at ${x}% ${y}%, ${c} 0 75%, transparent 100%)`;
const CLOUD = "rgba(255, 255, 255, 0.75)";

// size  = how big it looks (not to scale; real sizes would make Mercury invisible)
// orbit = which ring (fraction of the solar system's width)
// angle = where on the ring it sits, in degrees
// year  = real time to go around the Sun, in Earth years
// spin  = seconds per full turn (smaller = faster)
const PLANETS = [
  {
    name: "Mercury", size: 24, orbit: 0.22, angle: 300, year: 0.24, spin: 40,
    surface: [
      spot(12, 30, 4, 8, "#8f8a82"), spot(34, 68, 5, 10, "#8f8a82"), spot(55, 35, 3, 6, "#8f8a82"),
      spot(76, 62, 4, 8, "#8f8a82"), spot(90, 28, 3, 6, "#8f8a82"), "#b9b3aa"
    ].join(", "),
    facts: [
      "Mercury is the smallest planet, and the closest one to the Sun.",
      "Mercury has no moons at all.",
      "Mercury zooms around the Sun fast. A year there is only 88 days long!"
    ]
  },
  {
    name: "Venus", size: 32, orbit: 0.31, angle: 200, year: 0.62, spin: 60, reverse: true,
    surface: [
      spot(25, 40, 10, 14, "rgba(255, 244, 214, 0.8)"), spot(68, 62, 12, 16, "rgba(255, 244, 214, 0.7)"),
      spot(48, 20, 8, 8, "rgba(200, 140, 70, 0.5)"),
      "linear-gradient(#f3d9a4, #e3b26a 40%, #f0d29a 60%, #d9a45a)"
    ].join(", "),
    facts: [
      "Venus is the hottest planet. Its thick clouds trap heat like a big blanket.",
      "Venus spins backwards compared to most planets. Watch it go the other way!",
      "Venus spins so slowly that one day there is longer than one whole year."
    ]
  },
  {
    name: "Earth", size: 34, orbit: 0.40, angle: 60, year: 1, spin: 14,
    surface: [
      spot(30, 22, 4, 7, CLOUD), spot(62, 78, 5, 8, CLOUD), spot(88, 38, 3, 6, CLOUD),
      "linear-gradient(#f4f8ff 0 7%, transparent 7% 93%, #f4f8ff 93%)",
      spot(14, 40, 7, 20, "#4caf50"), spot(22, 65, 4, 12, "#4caf50"), spot(46, 45, 8, 18, "#5cbf4f"),
      spot(72, 32, 6, 14, "#4caf50"), spot(80, 62, 5, 14, "#6a9f3a"), "#2f7fd8"
    ].join(", "),
    facts: [
      "Earth is our home! It is the only planet we know of with living things.",
      "Most of Earth is covered in water. That is why it looks so blue from space.",
      "Earth has one moon. You can see it in the night sky!"
    ]
  },
  {
    name: "Mars", size: 28, orbit: 0.49, angle: 150, year: 1.88, spin: 15,
    surface: [
      "linear-gradient(#fff 0 8%, transparent 8%)",
      spot(18, 50, 8, 16, "#8e2f0a"), spot(50, 38, 6, 12, "#9a3510"), spot(78, 60, 9, 14, "#8e2f0a"),
      "linear-gradient(#d0541c, #b5410f)"
    ].join(", "),
    facts: [
      "Mars is called the Red Planet, because its dirt is rusty and red.",
      "Mars has the tallest volcano in the solar system. It is called Olympus Mons.",
      "Mars has two tiny moons, named Phobos and Deimos."
    ]
  },
  {
    name: "Jupiter", size: 64, orbit: 0.62, angle: 330, year: 11.86, spin: 6,
    surface: [
      spot(30, 64, 6, 7, "#c0452a"), spot(70, 40, 3, 4, "rgba(255, 255, 255, 0.6)"),
      "linear-gradient(#e8c9a0 0 20%, #c58a5a 20% 32%, #ead7b8 32% 50%, #b9774a 50% 60%, #e6c79d 60% 80%, #c58a5a 80%)"
    ].join(", "),
    facts: [
      "Jupiter is the biggest planet. All the other planets could fit inside it!",
      "Jupiter has a giant storm called the Great Red Spot. It is bigger than Earth!",
      "Jupiter spins the fastest of all the planets. A day there is only about 10 hours."
    ]
  },
  {
    name: "Saturn", size: 54, orbit: 0.74, angle: 230, year: 29.46, spin: 7, rings: true,
    surface: [
      spot(40, 30, 4, 5, "rgba(255, 248, 225, 0.8)"), spot(80, 62, 3, 4, "rgba(255, 248, 225, 0.6)"),
      "linear-gradient(#f3e2b5 0 25%, #e0c385 25% 40%, #f0dba8 40% 60%, #d6b678 60% 75%, #f1dfb0 75%)"
    ].join(", "),
    facts: [
      "Saturn has beautiful rings made of ice and rock.",
      "Saturn has more than one hundred moons!",
      "Saturn is mostly gas. It is so light, it could float in a giant bathtub!"
    ]
  },
  {
    name: "Uranus", size: 40, orbit: 0.85, angle: 100, year: 84, spin: 10, vertical: true,
    surface: [
      spot(70, 30, 10, 5, "rgba(255, 255, 255, 0.6)"),
      "linear-gradient(#b0ecf0 0 18%, #93d8df 18% 30%, #b0ecf0 30% 55%, #8fd3db 55% 66%, #b0ecf0 66%)"
    ].join(", "),
    facts: [
      "Uranus spins on its side, like a ball rolling along. Watch it roll!",
      "Uranus has the coldest air of any planet. Brrr!",
      "Uranus has rings too, but they are thin and dark, so they are hard to see."
    ]
  },
  {
    name: "Neptune", size: 38, orbit: 0.95, angle: 15, year: 164.8, spin: 9,
    surface: [
      spot(35, 48, 7, 9, "#1f3a8a"), spot(62, 30, 8, 3, CLOUD), spot(80, 68, 6, 2.5, "rgba(255, 255, 255, 0.6)"),
      "linear-gradient(#5b8cff, #2f56c9)"
    ].join(", "),
    facts: [
      "Neptune is the farthest planet from the Sun.",
      "Neptune has the fastest winds of any planet!",
      "Neptune is so far away that one trip around the Sun takes 165 Earth years."
    ]
  }
];

// Orbit speed on screen: closer planets are faster (true order), but the gaps are
// squished with a square root so Neptune still visibly moves.
const ORBIT_SECONDS_PER_ROOT_YEAR = 30;

const SUN_FACT = "This is the Sun! It is a star, not a planet. It gives us light and keeps us warm.";

const MISSIONS = [
  {
    prompt: "Can you find the biggest planet?",
    answer: "Jupiter",
    hint: "Look for the biggest planet in the solar system!"
  },
  {
    prompt: "Can you find the planet with beautiful rings?",
    answer: "Saturn",
    hint: "Look for the planet with a large ring system!"
  },
  {
    prompt: "Can you find the Red Planet?",
    answer: "Mars",
    hint: "Look for the small reddish planet!"
  },
  {
    prompt: "Can you find our home planet?",
    answer: "Earth",
    hint: "Look for the blue and green planet!"
  },
  {
    prompt: "Can you find the planet closest to the Sun?",
    answer: "Mercury",
    hint: "It is the first planet from the Sun!"
  },
  {
    prompt: "Can you find the hottest planet?",
    answer: "Venus",
    hint: "It is the second planet from the Sun!"
  },
  {
    prompt: "Can you find the planet that spins on its side?",
    answer: "Uranus",
    hint: "Look for the pale blue planet that rolls on its side!"
  },
  {
    prompt: "Can you find the planet farthest from the Sun?",
    answer: "Neptune",
    hint: "Look for the planet on the outermost ring!"
  },
  {
    prompt: "Which planet has the fastest winds?",
    answer: "Neptune",
    hint: "It is the blue planet farthest from the Sun!"
  },
  {
    prompt: "Which planet has the Great Red Spot?",
    answer: "Jupiter",
    hint: "Look for the biggest planet with a giant storm!"
  }
];

// =====================================================
// ELEMENTS
// =====================================================
const $ = id => document.getElementById(id);
const startScreen = $("start-screen");
const gameScreen = $("game-screen");
const startBtn = $("start-btn");
const exploreBtn = $("explore-btn");
const missionBtn = $("mission-btn");
const orbitBtn = $("orbit-btn");
const spaceTechBtn = $("space-tech-btn");
const spaceTechScreen = $("space-tech-screen");
const spaceTechBackBtn = $("space-tech-back");
const techLearnButtons = document.querySelectorAll(".tech-learn-btn");
const techDetails = document.querySelectorAll(".tech-detail");
const starCount = $("star-count");
const bubble = $("speech-bubble");
const repeatBtn = $("repeat-btn");
const solarSystem = $("solar-system");
const zoom = $("zoom");
const zoomOrb = $("zoom-orb");
const zoomName = $("zoom-name");
const zoomFact = $("zoom-fact");
const moreBtn = $("more-btn");
const closeZoomBtn = $("close-zoom");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const missionResults = document.createElement("div");
missionResults.id = "mission-results";
missionResults.hidden = true;

missionResults.innerHTML = `
  <div class="mission-results-card" role="dialog"
       aria-modal="true" aria-labelledby="mission-results-title">

    <h2 id="mission-results-title">Mission Complete!</h2>

    <div id="mission-grade" aria-label="Your star rating"></div>

    <p id="mission-score"></p>

    <h3 id="mission-wrong-title">Questions to Review</h3>

    <ul id="mission-wrong-list"></ul>

    <div id="mission-results-buttons">
      <button id="mission-retry-btn" class="big-btn">
        🔄 Play Again
      </button>

      <button id="mission-explore-btn" class="big-btn alt">
        🔭 Back to Explore
      </button>
    </div>
  </div>
`;

document.body.appendChild(missionResults);

const missionGrade = document.getElementById("mission-grade");
const missionScore = document.getElementById("mission-score");
const missionWrongTitle = document.getElementById("mission-wrong-title");
const missionWrongList = document.getElementById("mission-wrong-list");
const missionRetryBtn = document.getElementById("mission-retry-btn");
const missionExploreBtn = document.getElementById("mission-explore-btn");

// =====================================================
// STATE
// =====================================================
let mode = "explore";      // "explore" or "missions"
let spaceTechOpen = false;
let missionResultsWasVisible = false;
let stars = 0;
let missionQueue = [];
let currentMission = null;
let busy = false;

// Mission round tracking
let missionNumber = 0;
let firstTryCorrect = 0;
let wrongQuestions = [];
let currentQuestionWrong = false;
let answeredThisRound = 0;
let missionRoundFinished = false;

let userFrozen = false;    // kid pressed Freeze

let zoomedPlanet = null;   // planet shown in the zoom view
let zoomFrom = null;       // the small orb it zoomed out of
let factIndex = 0;

// =====================================================
// ASTRO (original mascot drawn in SVG)
// =====================================================
const ASTRO_SVG = `
<svg viewBox="0 -12 100 132" xmlns="http://www.w3.org/2000/svg">
  <line x1="50" y1="8" x2="50" y2="-4" stroke="#f1f3f8" stroke-width="3"/>
  <circle cx="50" cy="-6" r="5" fill="#ff8a3d"/>
  <rect x="22" y="62" width="56" height="48" rx="18" fill="#f1f3f8"/>
  <rect x="38" y="76" width="24" height="16" rx="4" fill="#ff8a3d"/>
  <circle cx="50" cy="42" r="34" fill="#f1f3f8"/>
  <ellipse cx="50" cy="44" rx="24" ry="20" fill="#1b2a5e"/>
  <ellipse cx="40" cy="36" rx="7" ry="4" fill="#ffffff" opacity="0.5"/>
  <circle cx="42" cy="46" r="3" fill="#fff"/>
  <circle cx="58" cy="46" r="3" fill="#fff"/>
  <path d="M43 53 Q50 59 57 53" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;
document.querySelectorAll(".astro").forEach(el => { el.innerHTML = ASTRO_SVG; });

// =====================================================
// VOICE
// =====================================================
const canSpeak = "speechSynthesis" in window;
let voice = null;
let speechToken = 0;
let lastSpoken = "";
let lastOnDone = null;

function pickVoice() {
  const voices = speechSynthesis.getVoices();
  // Friendlier voices first; falls back to any English voice.
  const preferred = ["Samantha", "Google US English", "Microsoft Aria", "Microsoft Jenny"];
  voice =
    voices.find(v => preferred.some(p => v.name.includes(p))) ||
    voices.find(v => v.lang.startsWith("en")) ||
    null;
}
if (canSpeak) {
  pickVoice();
  speechSynthesis.addEventListener("voiceschanged", pickVoice);
}

// Shows text in the bubble, reads it aloud, then calls onDone (once).
function say(text, onDone = null) {
  bubble.textContent = text;
  lastSpoken = text;
  lastOnDone = onDone;

  const token = ++speechToken;
  let finished = false;
  const finish = () => {
    if (finished || token !== speechToken) return; // a newer message took over
    finished = true;
    if (onDone) onDone();
  };
  // Backup in case the browser never fires "end"
  setTimeout(finish, 1500 + text.length * 100);

  if (!canSpeak) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.rate = 0.9;
  u.pitch = 1.15;
  u.onend = finish;
  speechSynthesis.speak(u);
}

// =====================================================
// HELPERS
// =====================================================
function animate(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth; // restart the animation
  el.classList.add(cls);
  el.addEventListener("animationend", () => el.classList.remove(cls), { once: true });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function addStar() {
  stars++;
  starCount.textContent = `⭐ ${stars}`;
  animate(starCount, "pop");
}

// Gives an orb element a planet's surface, spin speed, and direction.
function setOrbLook(orb, p) {
  orb.className = "orb";
  if (p.rings) orb.classList.add("rings");
  if (p.vertical) orb.classList.add("vertical");
  if (p.reverse) orb.classList.add("reverse");
  orb.style.setProperty("--surface", p.surface);
  orb.style.setProperty("--spin", `${p.spin}s`);
}

// =====================================================
// BUILD THE SOLAR SYSTEM
// =====================================================
function buildSolarSystem() {
  // Orbit rings first, so planets draw on top of them
  PLANETS.forEach(p => {
    const ring = document.createElement("div");
    ring.className = "ring";
    ring.style.setProperty("--orbit", p.orbit);
    solarSystem.appendChild(ring);
  });

  // Sun in the middle
  const sunBtn = document.createElement("button");
  sunBtn.className = "sun-btn";
  sunBtn.setAttribute("aria-label", "The Sun");
  sunBtn.innerHTML = `<span class="body"><span class="sun"></span></span>`;
  const sunBody = sunBtn.querySelector(".body");
  sunBtn.addEventListener("click", () => {
    if (mode === "explore") {
      animate(sunBody, "bounce");
      say(SUN_FACT);
    } else {
      checkAnswer("the Sun", sunBody);
    }
  });
  solarSystem.appendChild(sunBtn);

  // Planets on their rings
  PLANETS.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "planet";
    btn.setAttribute("aria-label", p.name);
    btn.style.setProperty("--size", p.size);
    btn.style.setProperty("--orbit", p.orbit);
    btn.style.setProperty("--start", `${p.angle}deg`);
    btn.style.setProperty("--year", `${ORBIT_SECONDS_PER_ROOT_YEAR * Math.sqrt(p.year)}s`);
    btn.innerHTML = `<span class="body"><span class="orb"></span></span><span class="name">${p.name}</span>`;
    setOrbLook(btn.querySelector(".orb"), p);
    btn.addEventListener("click", () => onPlanetTap(p, btn));
    solarSystem.appendChild(btn);
  });
}
buildSolarSystem();

// =====================================================
// ORBITS: frozen when the kid asks, during Missions, and while zoomed in
// =====================================================
function updateOrbit() {
  const frozen =
    userFrozen ||
    mode === "missions" ||
    !zoom.hidden ||
    spaceTechOpen;

  solarSystem.classList.toggle("paused", frozen);

  orbitBtn.textContent = userFrozen ? "▶ Move" : "⏸ Freeze";
  orbitBtn.setAttribute("aria-pressed", userFrozen);

  orbitBtn.hidden = mode === "missions";
}

orbitBtn.addEventListener("click", () => {
  userFrozen = !userFrozen;
  updateOrbit();
  say(userFrozen
    ? "Freeze! Now the planets stay still."
    : "Watch! Planets closer to the Sun travel around it faster.");
});

// =====================================================
// ZOOM VIEW
// =====================================================

// Moves `big` so it starts exactly on top of `small`, then animates it to its real spot.
// Reversed (closing = true), it shrinks back down onto `small`.
function flip(small, big, closing, done) {
  if (reducedMotion) { if (done) done(); return; }
  big.style.transition = "none";
  big.style.transform = "";
  const a = small.getBoundingClientRect();
  const b = big.getBoundingClientRect();
  const dx = (a.left + a.width / 2) - (b.left + b.width / 2);
  const dy = (a.top + a.height / 2) - (b.top + b.height / 2);
  const shrunk = `translate(${dx}px, ${dy}px) scale(${a.width / b.width})`;

  big.style.transform = closing ? "" : shrunk;
  void big.offsetWidth; // lock in the starting position
  big.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
  big.style.transform = closing ? shrunk : "";
  if (done) setTimeout(done, 600);
}

function openZoom(p, btn) {
  zoomedPlanet = p;
  zoomFrom = btn.querySelector(".orb");
  factIndex = 0;

  setOrbLook(zoomOrb, p);
  zoomName.textContent = p.name;
  zoomFact.textContent = p.facts[0];

  zoom.hidden = false;
  updateOrbit(); // stop orbiting so the planet can zoom back to the same spot
  document.body.classList.add("no-scroll");
  flip(zoomFrom, zoomOrb, false);
  requestAnimationFrame(() => zoom.classList.add("open"));
  closeZoomBtn.focus({ preventScroll: true });

  say(`This is ${p.name}! ${p.facts[0]}`);
    document.dispatchEvent(new CustomEvent("zoom-open", { detail: p })); // lets junk.js react
}

function closeZoom() {
  if (!zoomedPlanet) return;
  const backTo = zoomFrom;
  zoom.classList.remove("open");
  flip(backTo, zoomOrb, true, () => {
    zoom.hidden = true;
    updateOrbit();
    zoomOrb.style.transform = "";
    document.body.classList.remove("no-scroll");
    backTo.closest("button").focus({ preventScroll: true });
  });
  zoomedPlanet = null;
  say("Tap another planet to visit it!");
}

function nextFact() {
  if (!zoomedPlanet) return;
  factIndex = (factIndex + 1) % zoomedPlanet.facts.length;
  const fact = zoomedPlanet.facts[factIndex];
  zoomFact.textContent = fact;
  say(fact);
}

moreBtn.addEventListener("click", nextFact);
closeZoomBtn.addEventListener("click", closeZoom);
zoom.querySelector(".zoom-backdrop").addEventListener("click", closeZoom);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeZoom();
});

// =====================================================
// EXPLORE + MISSIONS
// =====================================================
function onPlanetTap(p, btn) {
  if (mode === "explore") {
    openZoom(p, btn);
  } else {
    checkAnswer(p.name, btn.querySelector(".body"));
  }
}

function checkAnswer(name, bodyEl) {
  if (busy || !currentMission || missionRoundFinished) return;

  if (name === currentMission.answer) {
    busy = true;

    animate(bodyEl, "correct");

    // Only award a star if the first answer was correct.
    if (!currentQuestionWrong) {
      firstTryCorrect++;
      addStar();
    }

    answeredThisRound++;

    say(
      !currentQuestionWrong
        ? `Correct! That's ${name}! You earned a star!`
        : `Correct! That's ${name}! Let's try the next question!`,
      () => {
        busy = false;

        if (answeredThisRound >= 10) {
          finishMissionRound();
        } else {
          nextMission();
        }
      }
    );

  } else {
    animate(bodyEl, "wrong");

    // Record the question only once, when the first wrong answer happens.
    if (!currentQuestionWrong) {
      currentQuestionWrong = true;

      wrongQuestions.push({
        number: missionNumber,
        question: currentMission.prompt,
        answer: currentMission.answer
      });
    }

    // Wrong answers never add stars.
    say(`Not quite! ${currentMission.hint}`);
  }
}

// Called at the start and after each correct answer.
function nextMission() {
  if (answeredThisRound >= 10) {
    finishMissionRound();
    return;
  }

  if (missionQueue.length === 0) {
    finishMissionRound();
    return;
  }

  currentMission = missionQueue.pop();
  missionNumber = answeredThisRound + 1;
  currentQuestionWrong = false;

  say(
    `Question ${missionNumber} of 10: ${currentMission.prompt}`
  );
}

function finishMissionRound() {
  if (missionRoundFinished) return;

  missionRoundFinished = true;
  busy = false;
  currentMission = null;

  // Stop the solar system while displaying the results.
  solarSystem.classList.add("paused");

  // Reset the star counter after the round has ended.
  stars = 0;
  starCount.textContent = "⭐ 0";

  // Rating is based on questions answered correctly on the first try.
  let rating = "";

  if (firstTryCorrect <= 3) {
    rating = "⭐";
  } else if (firstTryCorrect <= 8) {
    rating = "⭐⭐";
  } else {
    rating = "⭐⭐⭐";
  }

  missionGrade.textContent = rating;
  missionScore.textContent =
    `You answered ${firstTryCorrect} out of 10 questions correctly on your first try.`;

  // Show every question that had a wrong first answer.
  missionWrongList.replaceChildren();

  if (wrongQuestions.length === 0) {
    missionWrongTitle.textContent = "Perfect Round!";
    
    const item = document.createElement("li");
    item.className = "no-mistakes";
    item.textContent = "Amazing! You answered all 10 questions correctly on your first try!";
    missionWrongList.appendChild(item);

  } else {
    missionWrongTitle.textContent = "Questions to Review";

    wrongQuestions.forEach(itemData => {
      const item = document.createElement("li");

      const question = document.createElement("div");
      question.className = "wrong-question";
      question.textContent =
        `Question ${itemData.number}: ${itemData.question}`;

      const answer = document.createElement("div");
      answer.className = "correct-answer";
      answer.textContent =
        `Correct answer: ${itemData.answer}`;

      item.append(question, answer);
      missionWrongList.appendChild(item);
    });
  }

  missionResults.hidden = false;

  say("Mission complete! Check your score and review the questions.");
}

function setMode(newMode) {
  mode = newMode;
  busy = false;

  exploreBtn.classList.toggle("active", mode === "explore");
  missionBtn.classList.toggle("active", mode === "missions");

  exploreBtn.setAttribute("aria-pressed", mode === "explore");
  missionBtn.setAttribute("aria-pressed", mode === "missions");

  missionResults.hidden = true;

  if (mode === "explore") {
    currentMission = null;
    missionRoundFinished = false;
    updateOrbit();
    say("Tap any planet to visit it!");
    return;
  }

  // Start a fresh round of 10 questions.
  stars = 0;
  starCount.textContent = "⭐ 0";

  missionQueue = shuffle([...MISSIONS]);
  currentMission = null;

  missionNumber = 0;
  firstTryCorrect = 0;
  wrongQuestions = [];
  currentQuestionWrong = false;
  answeredThisRound = 0;
  missionRoundFinished = false;

  updateOrbit();
  nextMission();
}

// =====================================================
// BUTTONS
// =====================================================
startBtn.addEventListener("click", () => {
  startScreen.classList.remove("active");
  gameScreen.classList.add("active");
  say("Hi! I'm Astro, your space buddy! Tap any planet to visit it.");
});

exploreBtn.addEventListener("click", () => setMode("explore"));
missionBtn.addEventListener("click", () => setMode("missions"));
repeatBtn.addEventListener("click", () => say(lastSpoken, lastOnDone));
missionRetryBtn.addEventListener("click", () => {
  setMode("missions");
});

missionExploreBtn.addEventListener("click", () => {
  setMode("explore");
});

// =====================================================
// SPACE TECH: PAGE NAVIGATION
// =====================================================

function openSpaceTech() {
  if (spaceTechOpen) return;

  // Remember whether the mission results were visible.
  missionResultsWasVisible = !missionResults.hidden;

  // Hide the mission results while viewing Space Tech.
  missionResults.hidden = true;

  // Switch from the solar system to the Space Tech page.
  gameScreen.classList.remove("active");

  spaceTechScreen.hidden = false;
  spaceTechScreen.classList.add("active");

  spaceTechOpen = true;

  // Pause the solar system while Space Tech is open.
  updateOrbit();

  // Update the selected navigation button.
  spaceTechBtn.classList.add("active");
  spaceTechBtn.setAttribute("aria-pressed", "true");

  // Announce the new page.
  say("Welcome to Space Tech! Explore the technology that helps us learn about space.");
}

function closeSpaceTech() {
  if (!spaceTechOpen) return;

  // Hide the Space Tech page.
  spaceTechScreen.classList.remove("active");
  spaceTechScreen.hidden = true;

  // Return to the existing game screen.
  gameScreen.classList.add("active");

  spaceTechOpen = false;

  // Restore the Space Tech button's appearance.
  spaceTechBtn.classList.remove("active");
  spaceTechBtn.setAttribute("aria-pressed", "false");

  // Restore the mission results if they were visible before.
  missionResults.hidden = !missionResultsWasVisible;

  // Resume or keep the solar system paused as appropriate.
  updateOrbit();

  // Give the user a suitable message when returning.
  if (missionResultsWasVisible) {
    // Keep the mission results visible without replacing them.
    return;
  }

  if (mode === "missions" && currentMission && !missionRoundFinished) {
    say(
      `Question ${missionNumber} of 10: ${currentMission.prompt}`
    );
  } else {
    say("Welcome back! Tap any planet to visit it.");
  }
}


// Open Space Tech from the navigation bar.
spaceTechBtn.addEventListener("click", openSpaceTech);

// Return to the solar system.
spaceTechBackBtn.addEventListener("click", closeSpaceTech);


// =====================================================
// SPACE TECH: LEARN MORE BUTTONS
// =====================================================

techLearnButtons.forEach(button => {
  button.addEventListener("click", () => {
    const techName = button.dataset.tech;

    // Find the matching detail panel.
    const targetId = `tech-detail-${techName}`;
    const targetDetail = $(targetId);

    if (!targetDetail) {
      console.warn(`Space Tech detail panel not found: ${targetId}`);
      return;
    }

    // Hide all detail panels first.
    techDetails.forEach(detail => {
      detail.hidden = true;
    });

    // Show the selected detail panel.
    targetDetail.hidden = false;

    // Read the first paragraph aloud, if one exists.
    const paragraph = targetDetail.querySelector("p");

    if (paragraph && paragraph.textContent.trim()) {
      const heading = targetDetail.querySelector("h2, h3");
      const headingText = heading
        ? `${heading.textContent.trim()}. `
        : "";

      say(`${headingText}${paragraph.textContent.trim()}`);
    }

    // Move the selected information into view.
    targetDetail.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest"
    });
  });
});