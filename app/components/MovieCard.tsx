'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Clock, Calendar, User, Film } from 'lucide-react';
import { MovieData } from '@/app/types/movie';

interface MovieCardProps {
  movie: MovieData;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Poster Section */}
        <div className="lg:w-1/3 relative">
          <div className="aspect-[2/3] relative bg-gradient-to-br from-purple-900 to-indigo-900">
            {movie.poster && movie.poster !== '/placeholder-poster.png' ? (
              <Image
                src={movie.poster}
                alt={`${movie.title} poster`}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Film size={80} className="text-purple-300/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:w-2/3 p-6 lg:p-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {movie.title}
          </motion.h2>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-6"
          >
            {movie.rating && movie.rating !== 'N/A' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                  {movie.rating}
                </span>
              </div>
            )}
            {movie.year && movie.year !== 'N/A' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {movie.year}
                </span>
              </div>
            )}
            {movie.runtime && movie.runtime !== 'N/A' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {movie.runtime}
                </span>
              </div>
            )}
          </motion.div>

          {/* Genres */}
          {movie.genres.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                >
                  {genre}
                </span>
              ))}
            </motion.div>
          )}

          {/* Director */}
          {movie.director && movie.director !== 'N/A' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">
                Directed by <span className="font-semibold text-gray-900 dark:text-white">{movie.director}</span>
              </span>
            </motion.div>
          )}

          {/* Plot */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Plot</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {movie.plot}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
