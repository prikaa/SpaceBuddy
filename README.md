# 🚀 SpaceBuddy

**A talking space adventure for kids ages 5–9, but all ages welcome. No reading required.**

**Live demo:** https://prikaa.github.io/SpaceBuddy/

## The problem

Most kids' science websites assume the child can already read. Many 5- and 6-year-olds can't yet, so they get stuck on text-heavy pages and need an adult to help.

There's a second, less-known problem in space itself: thousands of dead satellites and broken pieces are circling Earth, and most people (kids included) have never heard of it.

## Our solution

Astro, a friendly astronaut, **speaks** every fact and challenge out loud. Kids learn by **tapping**, not reading.

- **Explore:** planets orbit the Sun (closer planets move faster, like the real ones) and spin with real surface images. Venus spins backwards, and Uranus rolls on its side. Tap any planet or the Sun to zoom in, see real stats, and hear facts.
- **Missions:** 10-question rounds like *"Can you find the planet with beautiful rings?"* Kids tap the answer, earn stars for first-try answers, get spoken hints when they guess wrong, and review missed questions at the end.
- **What's around Earth?** (zoom into Earth): an animated view of every tracked object around Earth, built from real satellite catalog data, with tabs for the biggest debris sources and who owns the debris.
- **Protect Space:** *What happens if we don't protect Earth's orbit?* What space junk is, why it's dangerous (including the Kessler Syndrome), and four ways people are protecting orbit.
- **Space Tech:** telescopes, rockets, and satellites, and how they help us explore.
- **⏸ Freeze:** stops the orbits so younger kids can tap planets easily. Orbits also freeze automatically during Missions.

Built for young kids: no accounts, no ads, and no personal information collected.

## Data science: what's around Earth?

We analyzed the **CelesTrak satellite catalog** (SATCAT) with Python and pandas. The analysis lives in `analysis/analyze_debris.py` and exports a small summary (`analysis/debris_summary.json`) that the website reads.

**Questions we asked**
1. What is in Earth orbit right now, by type?
2. How much of it is actually a *working* satellite?
3. Which single events created the most debris that's still up there?
4. Who owns that debris?
5. Which orbit zones (LEO, MEO, GEO) is everything in?

**What we found** (catalog downloaded October 30, 2026)
- About **35,151** tracked objects are in Earth orbit.
- Only about **49%** are working satellites. The rest are dead satellites, rocket bodies, debris, or unknown.
- A single event, the **Fengyun-1C** breakup, still accounts for **2,314** tracked pieces, about **18%** of all tracked debris.
- Debris ownership is nearly a three-way tie: **China (4,229)**, the **United States (3,912)**, and **Russia / former USSR (3,888)**.

**Decisions we made, and why**
- **Grouping debris by parent launch, not launch date.** In the catalog, a fragment's launch date is its *parent's* launch date, not the day it broke apart. A "debris per year" chart would put the 2007 Fengyun-1C breakup in 1999. So we grouped fragments by the launch they came from (the first part of `OBJECT_ID`).
- **Questioning our own labels.** Our first version named each debris source after the first satellite on that launch. Checking the results, we realized that could blame a satellite for debris that likely came from the rocket stage on the same launch. We switched to naming sources by what the fragments themselves are called in the catalog.
- **"Working" means operational status, not object type.** "Payload" includes dead satellites, so we used the catalog's operational status codes to count only working ones.
- **Orbit zones from altitude.** We classified each object using its lowest and highest points (`PERIGEE`, `APOGEE`): LEO (entire orbit below 2,000 km), GEO (near-circular at about 35,786 km), MEO (in between), and high or stretched orbits.

**Limitations**
- The catalog only includes objects large enough to track (roughly softball-sized and up in low orbit). Many smaller pieces exist that aren't counted.
- On screen, dots sit in their real orbit zone, but distances are squished to fit and **not to scale**, and positions within a zone are illustrative.
- Planet sizes and orbit speeds are also not to scale; the order is real.

**Reproduce it**
```bash
cd analysis
pip install pandas
# download the full SATCAT CSV from CelesTrak and save it as satcat.csv
python analyze_debris.py
```
The raw catalog (`satcat.csv`) isn't committed because it's large and anyone can re-download it.

## How to run it

**Online:** open the live demo link above.

**Locally:** download the repo and open it with a local server, for example the **Live Server** extension in VS Code (**Go Live**). Opening `index.html` directly works for most of the site, but the space junk data won't load that way. Tap **Start Exploring!** to turn on Astro's voice, and make sure your sound is on. Chrome or Edge recommended.

## How it works

Plain HTML, CSS, and JavaScript with no frameworks or build step. Astro's voice uses the browser's built-in **Web Speech API** (`speechSynthesis`).

| File | What it does |
|------|--------------|
| `index.html` | Page structure: start screen, Astro, solar system, zoom view, Space Tech |
| `style.css` | Space theme, planets, orbits, animations |
| `script.js` | Planets, missions, Space Tech, zoom view, and Astro's voice |
| `planet-info.js` / `.css` | Real planet stats, facts, surface images, and the zoomable Sun |
| `junk.js` / `.css` | The "What's around Earth?" data view |
| `cleanup.js` / `.css` | The Protect Space page |
| `analysis/analyze_debris.py` | Data analysis (Python + pandas) |
| `analysis/debris_summary.json` | Analysis output the website reads |
| `textures/` | Planet and Sun surface images |

Most content (facts, missions, cards) lives in lists at the top of each file, so it can be edited without touching the logic.

## Sources

- Planet facts: researched by our team and checked against [NASA Space Place](https://spaceplace.nasa.gov/)
- Satellite and debris data: [CelesTrak SATCAT](https://celestrak.org/satcat)
- Planet images: [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0)

## Team

- Chanphourika, Yeap: HTML, CSS, JAVASCRIPT
- Ching Yee Dorothy, Chaung: HTML, CSS, JAVASCRIPT
- Alley,Zheng: Research, Content, Scriptwriter
- Xinling Fang: Research, Content, Scriptwriter

## Built with help from

Starter code and parts of the analysis and features were generated with Claude (an AI assistant), then reviewed, tested, and customized by our team.