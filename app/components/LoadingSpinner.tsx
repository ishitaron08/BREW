'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 dark:border-t-purple-400" />
      </motion.div>
      <motion.p
        className="mt-4 text-gray-600 dark:text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
}
