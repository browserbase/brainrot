'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MemeCounter() {
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/meme-count');
        if (!res.ok) throw new Error('Failed to fetch count');
        const data = await res.json();
        setCount(data.count);
        setError(false);
      } catch (err) {
        console.error('Error fetching count:', err);
        setError(true);
      }
    };

    // Initial fetch
    fetchCount();

    // Set up polling every 10 seconds
    const interval = setInterval(fetchCount, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 sm:mt-12 flex items-center gap-2">
      <div className="flex items-center bg-[#F8E3C4] dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="pl-4 pr-2 sm:py-8 py-6 text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
          <span className="sm:hidden">Total Memes<br />Generated:</span>
          <span className="hidden sm:inline">Total Memes Generated:</span>
          {' '}{error ? '...' : count}
        </div>
        <motion.div 
          className="px-4 py-2 sm:px-4"
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Image
            src="/parrot.gif"
            alt="Party Parrot"
            width={64}
            height={64}
            className="min-w-[64px]"
            unoptimized
          />
        </motion.div>
      </div>
    </div>
  );
} 