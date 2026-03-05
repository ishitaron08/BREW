export interface MovieData {
  id: string;
  title: string;
  year: string;
  rating: string;
  runtime: string;
  genres: string[];
  plot: string;
  poster: string;
  cast: CastMember[];
  director: string;
  reviews: Review[];
}

export interface CastMember {
  name: string;
  character: string;
  image?: string;
}

export interface Review {
  author: string;
  rating?: string;
  title: string;
  content: string;
  date: string;
  helpful?: string;
}

export interface AIInsights {
  summary: string;
  sentimentClassification: 'positive' | 'mixed' | 'negative';
  sentimentScore: number;
  keyThemes: string[];
  audienceReaction: string;
  recommendation: string;
}

export interface MovieInsightResponse {
  movie: MovieData;
  insights: AIInsights;
}

export interface ApiError {
  error: string;
  message: string;
}
