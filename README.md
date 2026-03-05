# CineInsight — AI Movie Intelligence

> Enter any IMDb movie ID and get AI-powered audience sentiment analysis, cast details, ratings, and plot summary — all in a cinematic glassmorphism UI.

## Live Demo

🔗 **[Deployed on Vercel →](#)** *(link added after deployment)*

---

## Features

- **Movie Details** — Title, poster, year, runtime, director, genres (via OMDB)
- **Cast Grid** — Profile photos, character names (via TMDB)
- **Plot Summary** — Short plot display
- **AI Audience Sentiment** — 2-3 sentence AI summary + positive/mixed/negative classification (via OpenRouter → Gemini)
- **Glassmorphism Design** — Frosted glass panels, animated gradient backgrounds, floating particles
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Graceful Error Handling** — 404 for unknown movies, retry on errors, validation for badly-formed IDs
- **Loading Skeletons** — Cinematic shimmer skeletons during data fetch
- **Framer Motion Animations** — Staggered entry, scroll-triggered reveals, shake on invalid input

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Single codebase for frontend + backend; Server Components for fast initial load; Route Handlers replace a separate Node.js server |
| Styling | **Tailwind CSS v4** | Utility-first, rapid iteration, consistent dark cinematic theme |
| Animations | **Framer Motion** | Premium-feel animations without heavy custom CSS |
| AI | **OpenRouter** (free Gemini 2.0 Flash) | Free tier with no rate limits; fastest model for summarizing reviews |
| Validation | **Zod** | Runtime type-safe validation for API inputs and IMDb ID format |
| Testing | **Jest + React Testing Library** | Industry standard for Next.js apps |
| Deployment | **Vercel** | 1-click deploy, native Next.js support, environment variables |

### Why no separate Node.js server?

Next.js App Router Route Handlers (`app/api/*/route.ts`) run server-side and can securely access environment variables, make external API calls, and be deployed to Vercel as serverless functions — eliminating the need for a separate backend service.

### Why OpenRouter instead of direct Gemini SDK?

OpenRouter provides a unified API gateway to multiple AI models with generous free tiers. Using `google/gemini-2.0-flash-exp:free` through OpenRouter means:
- **No rate limits** — the free tier is generous for demo/evaluation
- **No separate Google API key** — a single OpenRouter key handles everything
- **Easy model switching** — swap to any OpenRouter model by changing one constant

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+
- Three free API keys (details below)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd imdb-insight
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# OMDB API Key — https://www.omdbapi.com/apikey.aspx (free, 1000 req/day)
OMDB_API_KEY=your_omdb_api_key_here

# TMDB API Read Access Token (Bearer token, starts with "eyJ...")
# Get from: https://www.themoviedb.org/settings/api → "API Read Access Token"
TMDB_API_KEY=your_tmdb_read_access_token_here

# OpenRouter API Key — https://openrouter.ai/keys (free models available)
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> **Important:** TMDB requires the **API Read Access Token (v4 auth)** — the long `eyJ...` Bearer token, NOT the short API key (v3).

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter an IMDb ID like `tt0133093`.

### 4. Run Tests

```bash
npm test              # run all tests once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Deployment to Vercel

1. Push to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Under **Environment Variables**, add:
   - `OMDB_API_KEY`
   - `TMDB_API_KEY`
   - `OPENROUTER_API_KEY`
4. Click **Deploy**

---

## Data Flow

```
User enters "tt0133093"
  → /movie/tt0133093 (Next.js Server Component)
      ├─ fetchMovieById()     → OMDB API  → title, poster, cast, rating, plot
      ├─ findTmdbId()         → TMDB API  → TMDB movie ID
      ├─ fetchDetailedCast()  → TMDB API  → cast with photos & character names
      └─ fetchReviews()       → TMDB API  → up to 15 audience reviews
                                      ↓
                          analyzeReviews() → OpenRouter (Gemini 2.0 Flash)
                                      ↓
                      { summary, sentiment } displayed in InsightPanel
```

---

## Project Structure

```
imdb-insight/
├── app/
│   ├── api/
│   │   ├── movie/[imdbId]/
│   │   │   ├── route.ts          # Movie metadata (OMDB + TMDB cast)
│   │   │   └── reviews/route.ts  # Audience reviews (TMDB)
│   │   └── insights/route.ts     # AI sentiment (OpenRouter)
│   ├── movie/[imdbId]/
│   │   ├── page.tsx              # Movie details (Server Component)
│   │   ├── loading.tsx           # Skeleton loading state
│   │   └── error.tsx             # Error boundary
│   ├── not-found.tsx             # 404 page
│   ├── layout.tsx                # Root layout + metadata
│   ├── page.tsx                  # Home/search page
│   └── globals.css               # Global styles + glassmorphism tokens
├── components/
│   ├── BackgroundEffect.tsx      # Animated gradient orbs + particles
│   ├── SearchBar.tsx             # Animated input with validation
│   ├── MovieHero.tsx             # Poster, title, rating, genres
│   ├── CastGrid.tsx              # Scrollable cast with profile photos
│   ├── PlotSection.tsx           # Plot summary card
│   ├── InsightPanel.tsx          # AI summary + sentiment badge
│   └── SentimentBadge.tsx        # Positive/mixed/negative pill
├── lib/
│   ├── omdb.ts                   # OMDB API client
│   ├── tmdb.ts                   # TMDB API client
│   ├── gemini.ts                 # OpenRouter AI client
│   └── validators.ts             # Zod schemas + IMDb ID validation
├── types/
│   └── index.ts                  # TypeScript interfaces
└── __tests__/
    ├── validators.test.ts
    ├── SentimentBadge.test.tsx
    └── SearchBar.test.tsx
```

---

## Design System

The UI uses a **dark cinematic glassmorphism** design language:

- **Frosted glass panels** — `backdrop-filter: blur(20px)` with translucent backgrounds
- **Animated gradient orbs** — Three slowly drifting blurred color blobs
- **Floating particles** — CSS-animated dots rising through the viewport
- **Film grain texture** — Subtle SVG noise overlay for cinematic feel
- **Gold & crimson accents** — Warm, premium color palette
- **Animated gradient borders** — Conic-gradient rotation on key panels
- **Poster glow** — Pulsing box-shadow on movie posters
- **Staggered animations** — Elements fade in sequentially on load

---

## Assumptions

- TMDB is used as a secondary data source — some older/obscure movies may not have TMDB entries (the app falls back gracefully)
- AI sentiment analysis requires at least 1 TMDB review; if none exist, "No reviews found" is shown instead of an error
- OMDB free tier allows 1,000 requests/day — sufficient for demo/evaluation
- OpenRouter's free Gemini 2.0 Flash model is used for lowest latency; responses are JSON-parsed with a fallback if the model returns malformed output
- The TMDB API key field accepts the **v4 Bearer token** (not the short v3 API key)

---

## API Keys — Quick Guide

| Service | URL | Note |
|---|---|---|
| OMDB | https://www.omdbapi.com/apikey.aspx | Email verification required |
| TMDB | https://www.themoviedb.org/settings/api | Use "API Read Access Token" (v4), not the short key |
| OpenRouter | https://openrouter.ai/keys | Instant, free models available |
#   B R E W  
 