# TrustLens — Quick Reference

---

## Project Structure

```
d:\TrustLens\
├── index.html                     # Entry HTML with Google Fonts
├── package.json                   # React + GSAP + Three.js + deps
├── vite.config.js                 # Vite dev server config (port 5173)
├── .env.example                   # Template for API key config
├── .env                           # Your Gemini API key (create this)
├── user-manual/                   # This documentation folder
│
├── public/
│   └── vite.svg                   # Favicon
│
└── src/
    ├── main.jsx                   # React entry point
    ├── App.jsx                    # Root component, state, mode toggle
    ├── index.css                  # Glassmorphism design system
    │
    ├── components/
    │   ├── Navbar.jsx             # Fixed nav with frosted glass scroll
    │   ├── Hero.jsx               # Hero with 3D scene + GSAP entrance
    │   ├── TrustScene.jsx         # React Three Fiber 3D wireframes
    │   ├── AnalyticalConsole.jsx   # Terminal input + mode toggle
    │   ├── XRayView.jsx           # Rule-based analysis report
    │   ├── AIAnalysisView.jsx     # AI-powered analysis report
    │   ├── ArchitectureMatrix.jsx  # 4-stage architecture grid
    │   └── Footer.jsx             # Minimal footer
    │
    └── engine/
        ├── analyzer.js            # Main orchestrator (rule-based)
        ├── preprocess.js          # Text tokenization & normalization
        ├── contextClassifier.js   # Domain classification (Health/Finance/News)
        ├── signalDetector.js      # 6-category signal detection
        ├── scorer.js              # Weighted scoring engine
        ├── rules.js               # All keyword/regex rule definitions
        └── geminiService.js       # Gemini AI + Google Search grounding
```

---

## How to Run

```bash
cd d:\TrustLens
npm install          # First time only
npm run dev          # Start dev server at http://localhost:5173
```

---

## Configuration

### Gemini API Key (Optional — for AI Mode)

1. Get a free key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Create `.env` in the project root:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
3. Restart the dev server

Without a key, Rule-Based mode still works fully. AI mode will show a friendly setup prompt.

---

## Analysis Modes

### Rule-Based Engine (Offline)
- Fully offline, no API required
- Pattern-matching across 6 signal categories
- Context-aware (Health, Finance, News, General)
- Score: 0–100 with severity-weighted deductions

### AI-Powered (Gemini) (Online)
- Requires Gemini API key
- Uses Gemini 2.0 Flash with Google Search grounding
- Real-time web verification of claims
- Returns: score, signals, claim verification, web sources, reasoning

---

## Architecture Overview

```
              ┌──────────────┐
              │  User Input   │
              └──────┬───────┘
                     │
         ┌───────────┼───────────┐
         ▼                       ▼
  ┌─────────────┐       ┌──────────────┐
  │ Rule-Based  │       │  AI-Powered   │
  │   Engine    │       │   (Gemini)    │
  └──────┬──────┘       └──────┬───────┘
         │                     │
    ┌────┴────┐          ┌─────┴─────┐
    │Preprocess│          │ Gemini API │
    ├─────────┤          │ + Google   │
    │Classify │          │   Search   │
    ├─────────┤          │ Grounding  │
    │ Detect  │          └─────┬─────┘
    ├─────────┤                │
    │  Score  │                │
    └────┬────┘                │
         │                     │
         ▼                     ▼
  ┌─────────────┐       ┌──────────────┐
  │  XRayView   │       │AIAnalysisView│
  │  (results)  │       │  (results)   │
  └─────────────┘       └──────────────┘
```

---

## Score Bands

| Range | Level | Color |
|-------|-------|-------|
| 70–100 | Low Risk | Green |
| 40–69 | Moderate Risk | Amber |
| 0–39 | High Risk | Red |

---

## Signal Categories

| Category | Weight | Description |
|----------|--------|-------------|
| Emotional Language | 8 | Loaded language, fear-mongering, sensationalism |
| Urgency Cues | 10 | False deadlines, pressure tactics |
| Absolute Statements | 6 | "Always", "never", "guaranteed", "100%" |
| Lack of Source | 12 | Vague attribution, "experts say", no URLs |
| Excessive Formatting | 5 | ALL CAPS, !!!, mixed punctuation |
| Domain-Specific Risks | 10–15 | Health/Finance/News-specific red flags |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI components |
| Vite 6 | Build tool & dev server |
| GSAP + ScrollTrigger | Animations |
| React Three Fiber | 3D graphics (hero background) |
| Three.js | 3D rendering engine |
| Gemini 2.0 Flash | AI credibility analysis |
| Google Search Grounding | Real-time web verification |
