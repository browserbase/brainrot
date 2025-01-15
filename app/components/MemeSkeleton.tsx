import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MAX_CONCURRENT_MEMES } from '../config/constants';
import DebugModal from './DebugModal';

interface MemeSkeletonProps {
  steps: string[];
  index: number;
  debugUrl?: string;
  sessionId?: string;
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

export default function MemeSkeleton({ steps, index, debugUrl, sessionId }: MemeSkeletonProps) {
  const [caption, setCaption] = useState('');
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);

  const openDebugUrl = () => {
    if (debugUrl) {
      window.open(debugUrl, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    console.log(`MemeSkeleton ${index} received debug URL:`, debugUrl);
  }, [debugUrl, index]);

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
      <div className="p-3 rounded-lg bg-[#F8E3C4] dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 relative w-full h-full">
        <div className="flex flex-col h-full space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] sm:text-xs dark:text-gray-300">
              {new Date().toLocaleDateString()}
            </span>
            <span className="text-[10px] sm:text-xs dark:text-gray-300">
              Template {index + 1}/{MAX_CONCURRENT_MEMES}
            </span>
          </div>
          
          <div className="flex-1 relative aspect-[4/3] bg-transparent rounded-lg overflow-hidden">
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center p-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="relative w-full h-32 sm:h-48 mb-3">
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
          
          <div className="space-y-2 font-mono text-[8px] sm:text-xs">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
              >
                <span className="text-green-500">✓</span>
                <span>{step}</span>
              </motion.div>
            ))}
            {steps.length > 0 && (
              <motion.div 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="inline-block animate-spin">⟳</span>
                <span>Processing...</span>
              </motion.div>
            )}
          </div>

          {debugUrl && (
            <div className="border-gray-200 dark:border-gray-700 flex justify-center">
              <motion.button
                onClick={openDebugUrl}
                className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-galindo 
                  bg-[#FEFFA3] dark:bg-[#FEFFA3] 
                  text-[#1a1b1e] hover:opacity-90
                  border-2 border-[#1a1b1e]/20 dark:border-[#1a1b1e]/20
                  text-[9px] sm:text-xs
                  shadow-[2px_2px_0px_rgba(0,0,0,0.1)]
                  transition-all duration-100
                  flex items-center justify-center gap-1 sm:gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="inline-block group-hover:rotate-12 transition-transform">🔍</span>
                <span>Peek behind the scenes!</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 