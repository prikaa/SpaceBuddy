# SpaceBuddy

**A talking space adventure for kids ages 5–9. No reading required.**

🔗 **Live demo:** https://prikaa.github.io/SpaceBuddy/

## The problem

Most kids' science websites assume the child can already read. Many 5- and 6-year-olds can't yet, so they get stuck on text-heavy pages and need an adult to help.

## Our solution

Astro, a friendly astronaut, **speaks** every fact and challenge out loud. Kids learn by **tapping**, not reading.

- **🔭 Explore:** tap any planet (or the Sun) and Astro tells you about it.
- **🎯 Missions:** Astro asks things like *"Can you find the planet with big, bright rings?"* Kids tap the answer, earn stars, and get gentle spoken hints when they guess wrong.
- **⭐ Galaxy Master:** finish every mission to earn the title.

Built for young kids: no accounts, no ads, no external links, and no personal information collected.

## How to run it

**Online:** open the live demo link above.

**Locally:** download the repo and open `index.html` in Chrome or Edge. Tap **Start Exploring!** to turn on Astro's voice. Make sure your sound is on.

## How it works

Plain HTML, CSS, and JavaScript with no frameworks or installs.

| File | What it does |
|------|--------------|
| `index.html` | Page structure: start screen, Astro, solar system |
| `style.css` | Space theme, planets, animations |
| `script.js` | Planet facts, missions, and Astro's voice |

Astro's voice uses the browser's built-in **Web Speech API** (`speechSynthesis`). All planet facts and missions live in two arrays at the top of `script.js`, so content can be edited without touching the game logic.

## Fact sources

Planet facts checked against [NASA Space Place](https://spaceplace.nasa.gov/).

## Team

- Name: role
- Name: role
- Name: role

## Built with help from

<!-- Fill in honestly, e.g. "Starter code generated with Claude, then customized by our team." Check your hackathon's rules on AI disclosure. -->