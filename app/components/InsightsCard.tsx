'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, MessageSquare, Sparkles, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { AIInsights } from '@/app/types/movie';

interface InsightsCardProps {
  insights: AIInsights;
}

export default function InsightsCard({ insights }: InsightsCardProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'from-green-500 to-emerald-500';
      case 'negative':
        return 'from-red-500 to-rose-500';
      default:
        return 'from-yellow-500 to-amber-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-5 h-5" />;
      case 'negative':
        return <ThumbsDown className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
    }
  };

  const getSentimentBgColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'negative':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${getSentimentColor(insights.sentimentClassification)} p-6 lg:p-8`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">AI Insights</h3>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full"
          >
            {getSentimentIcon(insights.sentimentClassification)}
            <span className="text-white font-semibold capitalize">
              {insights.sentimentClassification}
            </span>
          </motion.div>
        </div>

        {/* Sentiment Score Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-white/80 text-sm mb-2">
            <span>Sentiment Score</span>
            <span className="font-bold text-white">{insights.sentimentScore}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${insights.sentimentScore}%` }}
              transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8 space-y-6">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Summary</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {insights.summary}
          </p>
        </motion.div>

        {/* Audience Reaction */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Audience Reaction</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {insights.audienceReaction}
          </p>
        </motion.div>

        {/* Key Themes */}
        {insights.keyThemes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Key Themes</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.keyThemes.map((theme, index) => (
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
                >
                  {theme}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`p-4 rounded-2xl ${getSentimentBgColor(insights.sentimentClassification)}`}
        >
          <p className="font-medium">
            💡 {insights.recommendation}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
