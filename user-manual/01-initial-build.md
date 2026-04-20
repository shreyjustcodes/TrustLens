# Phase 1: Initial Build — React + GSAP Landing Page

*Original conversation: TrustLens Landing Page Development*

---

## Implementation Plan

Build a premium, story-driven landing page for TrustLens, an explainable credibility assessment system. The page scrolls like a cinematic narrative — each section reveals itself with scroll-driven GSAP animations and 3D elements via React Three Fiber.

### Project Scaffold

- **Vite + React** project with dependencies: `gsap`, `three`, `@react-three/fiber`, `@react-three/drei`
- Google Fonts: Inter, Space Grotesk, JetBrains Mono

### Design System — `index.css`

CSS variables for the entire design system:
- Dark theme palette (near-black backgrounds, white/grey typography)
- Typography scale using Inter + Space Grotesk
- Spacing, border-radius, transition tokens
- Utility classes for layout, gradients, glassmorphism panels

### Components

| Component | Description |
|-----------|-------------|
| **Hero.jsx** | Massive "See Through the Noise" headline with gradient text, GSAP staggered entrance, 3D wireframe icosahedron background |
| **AnalyticalConsole.jsx** | Terminal-styled textarea with live word count, 20-word minimum validation, Ctrl+Enter shortcut, loading animation |
| **XRayView.jsx** | Animated score counter, risk/confidence/context badges, signal cards grid with severity coloring and matched trigger words |
| **ArchitectureMatrix.jsx** | Three-column grid explaining Context Classification, Signal Detection, and Weighted Scoring with staggered scroll reveals |
| **TrustScene.jsx** | React Three Fiber `<Canvas>` rendering 3D wireframe shapes (icosahedron, torus) with float animations |
| **Navbar.jsx** | Fixed nav with TrustLens logo + section scroll links, transparent → solid on scroll |
| **Footer.jsx** | Minimal footer with project description and links |

### Analysis Engine (Pure JS, No APIs)

| Module | Purpose |
|--------|---------|
| `analyzer.js` | Main entry: preprocess → classify → detect → score → report |
| `preprocess.js` | Tokenization, normalization, sentence splitting, word count |
| `contextClassifier.js` | Rule-based classification: Health / Finance / News / General |
| `signalDetector.js` | 6-category signal detection with keyword + regex matching |
| `scorer.js` | Weighted scoring: deductions, interaction penalties, normalization |
| `rules.js` | All keyword lists, weights, regex patterns, explanation templates |

---

## Walkthrough

### Project Structure

```
d:\TrustLens\
├── index.html                    # Entry HTML with Google Fonts
├── package.json                  # React + GSAP + Three.js deps
├── vite.config.js                # Vite dev server config
├── public/vite.svg               # Favicon
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Root component & state
    ├── index.css                 # Complete design system
    ├── components/
    │   ├── Navbar.jsx            # Fixed nav with scroll effect
    │   ├── Hero.jsx              # Hero section + GSAP entrance
    │   ├── TrustScene.jsx        # 3D wireframe scene (R3F)
    │   ├── AnalyticalConsole.jsx  # Terminal-style text input
    │   ├── XRayView.jsx          # Analysis report dashboard
    │   ├── ArchitectureMatrix.jsx # How-it-works grid
    │   └── Footer.jsx            # Minimal footer
    └── engine/
        ├── analyzer.js           # Main analysis orchestrator
        ├── preprocess.js         # Text tokenization
        ├── contextClassifier.js  # Domain classification
        ├── signalDetector.js     # 6-category signal detection
        ├── scorer.js             # Weighted scoring engine
        └── rules.js              # All rule definitions
```

### Key Features

- **6 signal categories**: Emotional Language, Urgency Cues, Absolutes, Lack of Source, Excessive Formatting, Domain-Specific Risks
- **4 context types**: Health, Finance, News, General
- **Scoring**: Starts at 100, applies weighted deductions with severity multipliers and interaction penalties
- **Score Bands**: 70–100 (Low Risk), 40–69 (Moderate Risk), 0–39 (High Risk)
