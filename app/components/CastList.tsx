'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, User } from 'lucide-react';
import { CastMember } from '@/app/types/movie';

interface CastListProps {
  cast: CastMember[];
}

export default function CastList({ cast }: CastListProps) {
  if (cast.length === 0) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 lg:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
          <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Cast</h3>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {cast.map((member, index) => (
          <motion.div
            key={`${member.name}-${index}`}
            variants={item}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative w-20 h-20 mb-3 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg group-hover:scale-105 transition-transform duration-300">
              {member.image && !member.image.includes('nopicture') ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white/80" />
                </div>
              )}
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
              {member.name}
            </h4>
            {member.character && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                {member.character}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
