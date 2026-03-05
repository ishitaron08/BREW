'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Film, AlertCircle } from 'lucide-react';

interface SearchInputProps {
  onSearch: (imdbId: string) => void;
  isLoading: boolean;
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const validateImdbId = (id: string): boolean => {
    const trimmed = id.trim();
    return /^tt\d+$/.test(trimmed);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError('Please enter an IMDb ID');
      return;
    }

    if (!validateImdbId(trimmedValue)) {
      setError('Invalid IMDb ID format. It should start with "tt" followed by numbers (e.g., tt0133093)');
      return;
    }

    onSearch(trimmedValue);
  };

  const exampleIds = [
    { id: 'tt0133093', name: 'The Matrix' },
    { id: 'tt1375666', name: 'Inception' },
    { id: 'tt0468569', name: 'The Dark Knight' },
    { id: 'tt0111161', name: 'The Shawshank Redemption' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-400">
            <Film size={20} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            placeholder="Enter IMDb ID (e.g., tt0133093)"
            className="w-full pl-12 pr-32 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-lg shadow-lg"
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <Search size={18} />
            <span className="hidden sm:inline">{isLoading ? 'Searching...' : 'Search'}</span>
          </motion.button>
        </div>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-3 text-red-500 text-sm"
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleIds.map((example) => (
            <motion.button
              key={example.id}
              type="button"
              onClick={() => {
                setInputValue(example.id);
                setError('');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
            >
              {example.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
