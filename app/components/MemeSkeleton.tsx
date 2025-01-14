import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MAX_CONCURRENT_MEMES } from '../config/constants';

interface MemeSkeletonProps {
  steps: string[];
  index: number;
}

const LOADING_CAPTIONS = [
  "Searching for the perfect template...",
  "Brewing meme magic ✨",
  "Consulting the meme lords 👑",
  "Channeling internet culture 🌐",
  "Calculating meme potential 📊",
  "Stirring the creativity pot 🍯",
  "Mining for gold in meme mountain ⛏️",
  "Scanning the memeverse 🔭",
  "Preparing something special 🎁",
  "Loading maximum humor 😄",
  "Generating dankness 🌟",
  "Crafting internet gold 🏆"
];

export default function MemeSkeleton({ steps, index }: MemeSkeletonProps) {
  const [caption, setCaption] = useState('');

  useEffect(() => {
    setCaption(LOADING_CAPTIONS[Math.floor(Math.random() * LOADING_CAPTIONS.length)]);
    const interval = setInterval(() => {
      setCaption(LOADING_CAPTIONS[Math.floor(Math.random() * LOADING_CAPTIONS.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1
      }}
      className="relative w-full aspect-square"
    >
      <div className="p-4 rounded-lg bg-[#F8E3C4] dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 relative w-full h-full">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] sm:text-xs dark:text-gray-300">
                {new Date().toLocaleDateString()}
              </span>
              <span className="text-[10px] sm:text-xs dark:text-gray-300">
                Template {index + 1}/{MAX_CONCURRENT_MEMES}
              </span>
            </div>
            
            <div className="relative aspect-[4/3] bg-transparent rounded-lg overflow-hidden">
              <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative w-full h-32 sm:h-48 mb-1 sm:mb-2">
                  <Image
                    src="/wait.png"
                    alt="Loading"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
                <motion.p 
                  key={caption}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-[10px] sm:text-sm font-medium text-gray-600 dark:text-gray-300 text-center"
                >
                  {caption}
                </motion.p>
              </motion.div>
            </div>
            
            <div className="mt-2 space-y-1 font-mono text-[8px] sm:text-xs">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-400"
                >
                  <span className="text-green-500">✓</span>
                  <span>{step}</span>
                </motion.div>
              ))}
              {steps.length > 0 && (
                <motion.div 
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="inline-block animate-spin">⟳</span>
                  <span>Processing...</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 