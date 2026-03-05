'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Sparkles } from 'lucide-react';
import SearchInput from './components/SearchInput';
import MovieCard from './components/MovieCard';
import CastList from './components/CastList';
import ReviewsSection from './components/ReviewsSection';
import InsightsCard from './components/InsightsCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { MovieData, AIInsights } from './types/movie';

export default function Home() {
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastSearchedId, setLastSearchedId] = useState<string>('');

  const fetchMovieData = async (imdbId: string) => {
    setIsLoading(true);
    setError(null);
    setMovie(null);
    setInsights(null);
    setLastSearchedId(imdbId);

    try {
      // Step 1: Fetch movie details
      setLoadingMessage('Fetching movie details from IMDb...');
      const movieResponse = await fetch(`/api/movie?id=${imdbId}`);
      
      if (!movieResponse.ok) {
        const errorData = await movieResponse.json();
        throw new Error(errorData.message || 'Failed to fetch movie data');
      }

      const movieData: MovieData = await movieResponse.json();
      setMovie(movieData);

      // Step 2: Generate AI insights
      setLoadingMessage('Analyzing reviews with AI...');
      const insightsResponse = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieTitle: movieData.title,
          reviews: movieData.reviews,
          plot: movieData.plot,
        }),
      });

      if (insightsResponse.ok) {
        const insightsData: AIInsights = await insightsResponse.json();
        setInsights(insightsData);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleRetry = () => {
    if (lastSearchedId) {
      fetchMovieData(lastSearchedId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-200/30 to-transparent dark:from-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-indigo-200/30 to-transparent dark:from-indigo-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8 px-4"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Movie Insight Builder
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 text-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              Enter an IMDb ID to discover AI-powered movie insights
              <Sparkles className="w-5 h-5 text-purple-500" />
            </motion.p>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Search Section */}
            <section className="mb-12">
              <SearchInput onSearch={fetchMovieData} isLoading={isLoading} />
            </section>

            {/* Loading State */}
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingSpinner message={loadingMessage} />
                </motion.div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ErrorDisplay error={error} onRetry={handleRetry} />
                </motion.div>
              )}

              {/* Results */}
              {movie && !isLoading && !error && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* Movie Details */}
                  <MovieCard movie={movie} />

                  {/* Two Column Layout for Cast and Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Cast */}
                    {movie.cast.length > 0 && (
                      <CastList cast={movie.cast} />
                    )}

                    {/* AI Insights */}
                    {insights && (
                      <InsightsCard insights={insights} />
                    )}
                  </div>

                  {/* Reviews */}
                  {movie.reviews.length > 0 && (
                    <ReviewsSection reviews={movie.reviews} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!movie && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-16"
              >
                <div className="inline-block p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-lg">
                  <Film className="w-16 h-16 text-purple-300 dark:text-purple-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Enter an IMDb ID above to get started
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Example: tt0133093 (The Matrix)
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Built with Next.js, Tailwind CSS, and AI</p>
        </footer>
      </div>
    </div>
  );
}
