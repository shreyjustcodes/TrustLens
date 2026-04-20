# Phase 3: Glassmorphism UI + Gemini AI + Real-Time Search

*Original conversation: Glassmorphism + Gemini Integration*

---

## Implementation Plan

Transform TrustLens from an offline rule-based credibility tool into an AI-powered analysis platform with Gemini API integration, real-time web search verification, and a stunning glassmorphism UI.

### Glassmorphism CSS Overhaul — `index.css`

Complete overhaul of the design system:
- **Enhanced glass cards**: Multi-layer frosted glass with `backdrop-filter: blur(24px)`, subtle gradient borders, inner glow effects
- **Aurora backgrounds**: Animated radial gradient blobs with `filter: blur(120px)` and drift animations
- **Glowing accents**: Neon-style accent colors with soft shadow halos (`text-shadow`, `box-shadow`)
- **Shimmer animations**: Loading effects for AI analysis states
- **Dual color scheme**: Purple (`--accent: #8b5cf6`) for rule-based, Cyan (`--cyan: #22d3ee`) for AI features

### Gemini API Service — `geminiService.js`

New service module:
- `analyzeWithGemini(text)` — sends text to Gemini 2.0 Flash with a structured prompt
- Uses **Google Search grounding** — Gemini automatically searches real-time web to verify claims
- Returns structured JSON: score, risk level, detected signals, claim verification, source citations, reasoning
- Error handling: API key missing, network errors, JSON parse failures
- Enriches response with grounding metadata (web sources from Google Search)

### New Component — `AIAnalysisView.jsx`

Displays Gemini analysis results:
- **Loading state**: Glassmorphic shimmer animation with progress bars
- **Error state**: API key setup instructions with link to Google AI Studio
- **Verdict panel**: Animated score counter with color-coded risk level and glow effect
- **Detected signals**: Categorized list with severity coloring
- **Claim verification**: Status indicators (✓ verified / ✗ unverified / ◐ partial)
- **Web sources**: Clickable source cards from Google Search grounding
- **AI reasoning**: Transparency panel showing Gemini's analysis logic

### Updated Components

| Component | Changes |
|-----------|---------|
| **App.jsx** | Dual state management (rule-based + AI), mode toggle, aurora background |
| **AnalyticalConsole.jsx** | Mode toggle (Rule-Based / AI-Powered), dynamic placeholder, `LIVE` badge |
| **Hero.jsx** | Updated tagline: "AI-Powered Credibility Engine", new subtitle mentioning Gemini |
| **ArchitectureMatrix.jsx** | 4th card: "AI Verification" with cyan icon styling |
| **Footer.jsx** | Updated description mentioning AI capabilities |

### Configuration

- `.env.example` — template: `VITE_GEMINI_API_KEY=your_gemini_api_key_here`
- API key stored as `VITE_GEMINI_API_KEY` in `.env` (client-side, fine for dev/demo)

---

## Walkthrough

### 1. Glassmorphism UI

Complete CSS redesign with deep frosted-glass aesthetic:
- Multi-layer glass panels with `backdrop-filter: blur(24px)`, gradient borders, inner glow
- Aurora background blobs with subtle animated drift
- Neon glow accents on badges, scores, and interactive elements
- Shimmer loading animations for AI analysis state
- All sections updated: Navbar, Hero, Console, X-Ray, Architecture, Footer

### 2. Gemini AI Integration

`geminiService.js` calls Gemini 2.0 Flash with Google Search grounding:
- AI analyzes text for manipulation signals, logical fallacies, factual accuracy
- Automatically searches real-time news and web sources to verify claims
- Returns structured JSON: score, signals, claim verification, source citations, reasoning

### 3. Mode Toggle

`AnalyticalConsole.jsx` now has a segmented toggle:
- **◈ Rule-Based Engine** — existing offline analysis (unchanged)
- **◆ AI-Powered (Gemini) LIVE** — real-time AI analysis with web verification

### 4. AI Analysis View

`AIAnalysisView.jsx` displays:
- AI verdict with animated score and risk level
- Detected manipulation signals with severity
- Claim-by-claim verification (✓ verified / ✗ unverified / ◐ partial)
- Clickable web source cards from Google Search
- AI reasoning transparency panel

### 5. Updated Architecture Section

`ArchitectureMatrix.jsx` — added 4th "AI Verification" card describing Gemini + Google Search grounding.

---

## Setup for AI Mode

Create a `.env` file in the project root:
```
VITE_GEMINI_API_KEY=your_api_key_here
```
Get a free key from [Google AI Studio](https://aistudio.google.com/apikey). Restart the dev server after adding the key.

> **Note:** The API key is exposed client-side via Vite's `import.meta.env`. For production, add a backend proxy.
