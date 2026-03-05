# AI Movie Insight Builder

A modern web application that allows users to enter an IMDb movie ID and get comprehensive movie details along with AI-powered audience sentiment analysis.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)

## Live Demo

🔗 **[Deployed on Vercel →](#)** *(Update with your deployed URL)*

---

## Features

### Movie Details
- Title and poster image
- Release year and runtime
- IMDb rating
- Genre tags
- Plot summary
- Director information

### Cast Information
- Displays top 10 cast members
- Profile photos and character names
- Animated grid layout

### User Reviews
- Audience reviews with ratings
- Expandable review content
- Helpful vote counts

### AI-Powered Insights
Leverages AI (via OpenRouter's free Llama 3.1 model) to provide:
- Summary of audience sentiment
- Sentiment classification (positive/mixed/negative)
- Sentiment score (0-100)
- Key themes mentioned in reviews
- Audience reaction summary
- Watch recommendation

### Modern UI/UX
- Beautiful gradient design with glassmorphism effects
- Smooth animations powered by Framer Motion
- Fully responsive (mobile, tablet, desktop)
- Dark mode support (system preference)
- Animated loading states
- Comprehensive error handling with retry functionality

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 16 (App Router) | Single codebase for frontend + backend; Server Components for fast load; API routes as serverless functions |
| **Frontend** | React 19 | Latest React for optimal performance and concurrent features |
| **Language** | TypeScript 5 | Type safety, better DX, catches errors at compile time |
| **Styling** | Tailwind CSS 4 | Utility-first CSS for rapid, consistent styling |
| **Animations** | Framer Motion | Production-ready animations for premium feel |
| **Icons** | Lucide React | Beautiful, consistent, tree-shakeable icons |
| **Scraping** | Cheerio | Fast HTML parsing for IMDb data extraction |
| **AI** | OpenRouter (Llama 3.1) | Free tier AI access without credit card |
| **Deployment** | Vercel | 1-click deploy, native Next.js support |

### Why This Stack?

1. **Next.js 16**: Provides both frontend and backend in one framework, with excellent deployment options on Vercel. The App Router enables Server Components for faster initial page loads.

2. **TypeScript**: Catches errors early, improves code quality, and provides excellent IDE support for maintainability.

3. **Tailwind CSS 4**: Rapid UI development with consistent design tokens. No context switching between CSS and JSX.

4. **Web Scraping (Cheerio)**: Since OMDB/TMDB API keys were unavailable, direct IMDb scraping provides reliable, up-to-date data without API key dependencies.

5. **OpenRouter API**: Offers free access to powerful AI models (Llama 3.1 8B) without requiring credit card or payment setup. Falls back to local sentiment analysis if unavailable.

6. **Framer Motion**: Declarative animations that enhance user experience without complex CSS keyframes.

---

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))

### 1. Clone & Install

```bash
git clone <repository-url>
cd BREW
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your OpenRouter API key:

```env
# OpenRouter API Key — https://openrouter.ai/keys
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site URL (update for production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter an IMDb ID like `tt0133093`.

### 4. Run Tests

```bash
npm test
```

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Under **Environment Variables**, add:
   - `OPENROUTER_API_KEY` - Your OpenRouter API key
   - `NEXT_PUBLIC_SITE_URL` - Your Vercel deployment URL
4. Click **Deploy**

Your app will be live in ~60 seconds!

---

## Usage

1. Enter an IMDb ID in the search box (e.g., `tt0133093`)
2. Click "Search" or press Enter
3. View movie details, cast, reviews, and AI-generated insights

### Example IMDb IDs

| IMDb ID | Movie |
|---------|-------|
| `tt0133093` | The Matrix |
| `tt1375666` | Inception |
| `tt0468569` | The Dark Knight |
| `tt0111161` | The Shawshank Redemption |

---

## Project Structure

```
BREW/
├── app/
│   ├── api/
│   │   ├── movie/route.ts        # IMDb scraping endpoint
│   │   └── insights/route.ts     # AI sentiment analysis
│   ├── components/
│   │   ├── CastList.tsx          # Cast member grid
│   │   ├── ErrorDisplay.tsx      # Error state with retry
│   │   ├── InsightsCard.tsx      # AI insights display
│   │   ├── LoadingSpinner.tsx    # Animated loader
│   │   ├── MovieCard.tsx         # Movie details card
│   │   ├── ReviewsSection.tsx    # User reviews list
│   │   └── SearchInput.tsx       # IMDb ID search
│   ├── types/
│   │   └── movie.ts              # TypeScript interfaces
│   ├── globals.css               # Global styles & animations
│   ├── layout.tsx                # Root layout + metadata
│   └── page.tsx                  # Main page component
├── __tests__/                    # Jest test files
├── public/                       # Static assets
├── .env.example                  # Environment template
├── jest.config.js                # Jest configuration
├── next.config.ts                # Next.js config (images)
└── package.json
```

---

## Data Flow

```
User enters "tt0133093"
      ↓
/api/movie?id=tt0133093
      ↓
   ┌──────────────────────────────────────┐
   │  Scrape IMDb in parallel:            │
   │  ├─ Movie details page               │
   │  ├─ Full credits page (cast)         │
   │  └─ Reviews page                     │
   └──────────────────────────────────────┘
      ↓
Return MovieData to frontend
      ↓
/api/insights (POST)
      ↓
   ┌──────────────────────────────────────┐
   │  OpenRouter (Llama 3.1):             │
   │  Analyze reviews → Generate:         │
   │  ├─ Sentiment summary                │
   │  ├─ Classification & score           │
   │  ├─ Key themes                       │
   │  └─ Recommendation                   │
   └──────────────────────────────────────┘
      ↓
Display results in animated UI
```

---

## Assumptions

1. **IMDb Structure**: The web scraping logic assumes IMDb's HTML structure remains consistent. May require updates if IMDb changes their markup.

2. **API Availability**: OpenRouter API is expected to be available. The app includes comprehensive fallback sentiment analysis using keyword matching if AI is unavailable.

3. **Rate Limiting**: No rate limiting implemented for demo purposes. Production deployment should add rate limiting middleware.

4. **Review Quality**: AI analysis quality depends on the number and quality of reviews available for each movie.

5. **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge) with JavaScript enabled.

---

## Known Limitations

- Web scraping may occasionally fail if IMDb blocks requests or changes structure
- Free tier AI models may have variable response times
- Some older or obscure movies may have limited review data
- Images from IMDb may require `unoptimized` flag in Next.js Image

---

## Future Improvements

- [ ] Add Redis caching for frequently searched movies
- [ ] Implement rate limiting for production
- [ ] Add user authentication for saving favorites
- [ ] Support TV series and episodes
- [ ] Add movie comparison feature
- [ ] Implement PWA features (offline support)
- [ ] Add search history
- [ ] Implement share functionality

---

## License

MIT License - feel free to use this project for learning and development.

---

Built with ❤️ using Next.js, Tailwind CSS, and AI
