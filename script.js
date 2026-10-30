// =====================================================
// CONTENT: edit facts, missions, and colors here.
// Keep spoken text emoji-free (the voice reads it aloud).
// =====================================================
const PLANETS = [
  {
    name: "Mercury", size: 40,
    bg: "radial-gradient(circle at 35% 35%, #c9c4bc, #6e6a64)",
    fact: "Mercury is the smallest planet, and the closest one to the Sun."
  },
  {
    name: "Venus", size: 58,
    bg: "radial-gradient(circle at 35% 35%, #fbe3b0, #d29f55)",
    fact: "Venus is the hottest planet. Its thick clouds trap heat like a big blanket."
  },
  {
    name: "Earth", size: 60,
    bg: "radial-gradient(circle at 30% 35%, #6fd36f 0 18%, transparent 19%), radial-gradient(circle at 65% 65%, #6fd36f 0 14%, transparent 15%), radial-gradient(circle at 35% 35%, #5bb0ff, #1f5fbf)",
    fact: "Earth is our home! It is the only planet we know of with living things."
  },
  {
    name: "Mars", size: 48,
    bg: "radial-gradient(circle at 35% 35%, #ff8a5c, #b33a1d)",
    fact: "Mars is called the Red Planet, because its dirt is rusty and red."
  },
  {
    name: "Jupiter", size: 120,
    bg: "linear-gradient(#e8c9a0 0 20%, #c58a5a 20% 32%, #ead7b8 32% 50%, #b9774a 50% 60%, #e6c79d 60% 80%, #c58a5a 80%)",
    fact: "Jupiter is the biggest planet. It has a giant storm called the Great Red Spot that is bigger than Earth!"
  },
  {
    name: "Saturn", size: 96, rings: true,
    bg: "radial-gradient(circle at 35% 35%, #f6e7bd, #d4b16f)",
    fact: "Saturn has beautiful rings made of ice and rock."
  },
  {
    name: "Uranus", size: 76,
    bg: "radial-gradient(circle at 35% 35%, #c9f2f5, #6fc7d1)",
    fact: "Uranus spins on its side, like a ball rolling along."
  },
  {
    name: "Neptune", size: 74,
    bg: "radial-gradient(circle at 35% 35%, #6f9dff, #2a4bbf)",
    fact: "Neptune is the farthest planet from the Sun. It has the fastest winds of any planet!"
  }
];

const SUN_FACT = "This is the Sun! It is a star, not a planet. It gives us light and keeps us warm.";

const MISSIONS = [
  { prompt: "Can you find the biggest planet? Tap it!", answer: "Jupiter", hint: "Look for the biggest one of all!" },
  { prompt: "Can you find the planet with big, bright rings?", answer: "Saturn", hint: "Look for the planet wearing rings, like a hula hoop!" },
  { prompt: "Can you find the Red Planet?", answer: "Mars", hint: "Look for a small reddish planet!" },
  { prompt: "Can you find our home planet?", answer: "Earth", hint: "Look for the blue and green planet!" },
  { prompt: "Can you find the planet closest to the Sun?", answer: "Mercury", hint: "It is the one right next to the Sun!" },
  { prompt: "Can you find the hottest planet?", answer: "Venus", hint: "It is the second planet from the Sun!" },
  { prompt: "Can you find the planet that spins on its side?", answer: "Uranus", hint: "It is the pale blue one, right after Saturn!" },
  { prompt: "Can you find the planet farthest from the Sun?", answer: "Neptune", hint: "It is the very last planet!" }
];

// =====================================================
// ELEMENTS
// =====================================================
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const exploreBtn = document.getElementById("explore-btn");
const missionBtn = document.getElementById("mission-btn");
const starCount = document.getElementById("star-count");
const bubble = document.getElementById("speech-bubble");
const repeatBtn = document.getElementById("repeat-btn");
const solarSystem = document.getElementById("solar-system");
const sunBtn = document.getElementById("sun");

// =====================================================
// STATE
// =====================================================
let mode = "explore";      // "explore" or "missions"
let stars = 0;
let missionQueue = [];
let currentMission = null;
let busy = false;          // blocks taps while Astro celebrates

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

// =====================================================
// BUILD THE SOLAR SYSTEM
// =====================================================
PLANETS.forEach(p => {
  const btn = document.createElement("button");
  btn.className = "planet";
  btn.setAttribute("aria-label", p.name);

  const orb = document.createElement("span");
  orb.className = p.rings ? "orb rings" : "orb";
  orb.style.setProperty("--size", p.size);
  orb.style.setProperty("--bg", p.bg);

  const label = document.createElement("span");
  label.className = "name";
  label.textContent = p.name;

  btn.append(orb, label);
  btn.addEventListener("click", () => onPlanetTap(p, btn));
  solarSystem.appendChild(btn);
});

sunBtn.addEventListener("click", () => {
  if (mode === "explore") {
    animate(sunBtn, "bounce");
    say(SUN_FACT);
  } else {
    checkAnswer("the Sun", sunBtn);
  }
});

// =====================================================
// EXPLORE + MISSIONS
// =====================================================
function onPlanetTap(p, btn) {
  if (mode === "explore") {
    animate(btn, "bounce");
    say(`This is ${p.name}! ${p.fact}`);
  } else {
    checkAnswer(p.name, btn);
  }
}

function checkAnswer(name, btn) {
  if (busy || !currentMission) return;

  if (name === currentMission.answer) {
    busy = true;
    animate(btn, "correct");
    addStar();
    say(`Yes! That's ${name}! Great job!`, () => {
      busy = false;
      if (mode === "missions") nextMission();
    });
  } else {
    animate(btn, "wrong");
    say(`Oops, that's ${name}. ${currentMission.hint}`);
  }
}

// Called at the start and after each correct answer.
function nextMission() {
  if (missionQueue.length === 0) {
    if (currentMission) {
      // Just finished the last mission in the round
      currentMission = null;
      busy = true;
      say("Wow! You finished every mission! You are a Galaxy Master!", () => {
        busy = false;
        if (mode === "missions") nextMission();
      });
      return;
    }
    missionQueue = shuffle([...MISSIONS]);
  }
  currentMission = missionQueue.pop();
  say(currentMission.prompt);
}

function setMode(newMode) {
  mode = newMode;
  busy = false;
  exploreBtn.classList.toggle("active", mode === "explore");
  missionBtn.classList.toggle("active", mode === "missions");
  exploreBtn.setAttribute("aria-pressed", mode === "explore");
  missionBtn.setAttribute("aria-pressed", mode === "missions");

  if (mode === "explore") {
    say("Tap any planet to learn about it!");
  } else if (currentMission) {
    say(currentMission.prompt); // pick up where they left off
  } else {
    nextMission();
  }
}

// =====================================================
// BUTTONS
// =====================================================
startBtn.addEventListener("click", () => {
  startScreen.classList.remove("active");
  gameScreen.classList.add("active");
  say("Hi! I'm Astro, your space buddy! Tap any planet to learn about it.");
});

exploreBtn.addEventListener("click", () => setMode("explore"));
missionBtn.addEventListener("click", () => setMode("missions"));
repeatBtn.addEventListener("click", () => say(lastSpoken, lastOnDone));