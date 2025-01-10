import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageCheckerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function ImageChecker({ src, alt, width, height, className }: ImageCheckerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 30;

  useEffect(() => {
    const checkImage = () => {
      console.log('Checking image');
      fetch(src)
        .then(response => {
          if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
            console.log('Image loaded');
            setIsLoading(false);
            console.log('Interval cleared');
            clearInterval(interval);
            return;
          }
          throw new Error('Image not ready');
        })
        .catch(() => {
          setAttempts(prev => prev + 1);
        });
    };

    // Reset states when src changes
    setIsLoading(true);
    setError(false);
    setAttempts(0);

    // Keep checking until image is loaded
    const interval = setInterval(checkImage, 1000);
    return () => clearInterval(interval);
  }, [src]);

  if (error || attempts >= maxAttempts) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300">
        Failed to load image
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin mb-2">⟳</div>
              <div className="text-sm text-gray-500">Loading... ({attempts}s)</div>
            </div>
          </div>
        )}
        
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
          unoptimized={true}
        />
      </div>
    </div>
  );
} 