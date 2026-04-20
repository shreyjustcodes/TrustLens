# TrustLens — User Manual

Welcome to the TrustLens user manual. This folder contains all technical documentation for the TrustLens credibility assessment platform — from initial build through all upgrades.

## Documents

| Document | Description |
|----------|-------------|
| [01-initial-build.md](./01-initial-build.md) | Initial project scaffold: React + GSAP landing page, analysis engine, all components |
| [02-engine-bug-fixes.md](./02-engine-bug-fixes.md) | Signal detection fixes: flexible regex matching, all 6 categories triggering correctly |
| [03-glassmorphism-gemini-upgrade.md](./03-glassmorphism-gemini-upgrade.md) | Glassmorphism UI overhaul, Gemini AI integration, real-time search verification |
| [04-project-reference.md](./04-project-reference.md) | Quick reference: project structure, how to run, configuration, architecture overview |

## Quick Start

```bash
cd d:\TrustLens
npm install
npm run dev
```

For AI-powered analysis, create a `.env` file:
```
VITE_GEMINI_API_KEY=your_key_here
```

Get a free key from [Google AI Studio](https://aistudio.google.com/apikey).
