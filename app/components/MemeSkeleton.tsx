import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MAX_CONCURRENT_MEMES } from '../config/constants';

interface MemeSkeletonProps {
  steps: string[];
  index: number;
  debugUrl?: string;
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

export default function MemeSkeleton({ steps, index, debugUrl }: MemeSkeletonProps) {
  const [caption, setCaption] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setCaption(LOADING_CAPTIONS[Math.floor(Math.random() * LOADING_CAPTIONS.length)]);
    const interval = setInterval(() => {
      setCaption(LOADING_CAPTIONS[Math.floor(Math.random() * LOADING_CAPTIONS.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(`MemeSkeleton ${index} debug URL:`, debugUrl);
  }, [debugUrl, index]);

  useEffect(() => {
    if (debugUrl) {
      try {
        // Create a hidden iframe to preload the content
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = debugUrl;
        iframe.allow = "fullscreen *"; // Add permissions
        
        iframe.onload = () => {
          setIframeLoaded(true);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        };
        
        iframe.onerror = (e) => {
          console.error('Failed to load debug iframe:', e);
          setIframeLoaded(false);
        };

        document.body.appendChild(iframe);

        return () => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        };
      } catch (error) {
        console.error('Error in iframe preload:', error);
        setIframeLoaded(false);
      }
    }
  }, [debugUrl]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isExpanded ? 0 : 1, 
          y: 0,
          zIndex: 0
        }}
        transition={{ 
          duration: 0.4, 
          delay: index * 0.1
        }}
        className="relative preserve-3d w-full aspect-square"
      >
        <motion.div 
          className="p-4 rounded-lg bg-[#F8E3C4] dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700
              relative w-full h-full"
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        >
          {/* Front of card (loading content) */}
          <motion.div 
            className={`${isFlipped ? 'backface-hidden opacity-0' : ''} h-full`}
            animate={{ opacity: isFlipped ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
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
              
              {/* Minimal button with absolute positioning */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <motion.button
                  onClick={() => setIsFlipped(true)}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-galindo 
                    bg-[#FEFFA3] dark:bg-[#FEFFA3] 
                    text-[#1a1b1e] hover:opacity-90
                    border-2 border-[#1a1b1e]/20 dark:border-[#1a1b1e]/20
                    text-[9px] sm:text-xs
                    shadow-[2px_2px_0px_rgba(0,0,0,0.1)]
                    transition-all duration-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔍 Peek behind the scenes!
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Back of card (debug view) */}
          <motion.div 
            className={`absolute inset-0 w-full h-full ${!isFlipped ? 'backface-hidden' : ''}`}
            style={{ rotateY: '180deg' }}
          >
            <div className="relative h-full">
              {!isExpanded && debugUrl && (
                <div className="w-full h-[calc(100%-60px)] rounded-lg bg-gray-100 dark:bg-gray-900">
                  <iframe
                    key={debugUrl}
                    src={debugUrl}
                    className={`w-full h-full rounded-lg transition-opacity duration-300 ${
                      iframeLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    title="Debug View"
                    allow="fullscreen *"
                    onError={(e) => {
                      console.error('Iframe error:', e);
                      setIframeLoaded(false);
                    }}
                    onLoad={() => setIframeLoaded(true)}
                  />
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-2">
                        <span className="animate-spin text-2xl">⟳</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Loading debug view...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-[60px] flex items-center justify-end px-6 bg-gradient-to-t from-[#F8E3C4] dark:from-gray-800">
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-galindo 
                    bg-[#FFD7BA] dark:bg-[#FFD7BA] 
                    text-[#1a1b1e] hover:opacity-90
                    border-2 border-[#1a1b1e]/20 dark:border-[#1a1b1e]/20
                    text-[9px] sm:text-xs
                    shadow-[2px_2px_0px_rgba(0,0,0,0.1)]
                    transition-all duration-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isExpanded ? '🔍 Minimize' : '🔎 Expand'}
                </motion.button>
                
                <AnimatePresence mode="wait">
                  {isFlipped && (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => {
                        setIsFlipped(false);
                        setIsExpanded(false);
                      }}
                      className="ml-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-galindo 
                        bg-[#98FF98] dark:bg-[#98FF98] 
                        text-[#1a1b1e] hover:opacity-90
                        border-2 border-[#1a1b1e]/20 dark:border-[#1a1b1e]/20
                        text-[9px] sm:text-xs
                        shadow-[2px_2px_0px_rgba(0,0,0,0.1)]
                        transition-all duration-100"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ↩️ Back
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Expanded view */}
      <AnimatePresence>
        {isExpanded && debugUrl && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsExpanded(false);
              setIsFlipped(false);
            }}
          >
            <motion.div 
              className="w-[95vw] h-[45vh] sm:h-[75vh] max-w-6xl bg-[#F8E3C4] dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {debugUrl && (
                <iframe
                  src={debugUrl}
                  className="w-full h-full rounded-lg"
                  title="Debug View"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 