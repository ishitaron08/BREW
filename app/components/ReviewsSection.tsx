'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Star, ChevronDown, ChevronUp, ThumbsUp } from 'lucide-react';
import { Review } from '@/app/types/movie';

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);

  if (reviews.length === 0) {
    return null;
  }

  const displayedReviews = isExpanded ? reviews : reviews.slice(0, 3);

  const toggleReviewExpand = (index: number) => {
    setExpandedReviews((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reviews ({reviews.length})
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {displayedReviews.map((review, index) => {
            const isReviewExpanded = expandedReviews.includes(index);
            const shouldTruncate = review.content.length > 300;

            return (
              <motion.div
                key={`${review.author}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.title || 'No Title'}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        by {review.author}
                      </span>
                      {review.date && (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          {review.date}
                        </span>
                      )}
                    </div>
                  </div>
                  {review.rating && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                      <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                        {review.rating}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {shouldTruncate && !isReviewExpanded
                    ? `${review.content.slice(0, 300)}...`
                    : review.content}
                </p>

                <div className="flex items-center justify-between mt-3">
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleReviewExpand(index)}
                      className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
                    >
                      {isReviewExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                  {review.helpful && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpful}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {reviews.length > 3 && (
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-5 h-5" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              Show All {reviews.length} Reviews
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}
