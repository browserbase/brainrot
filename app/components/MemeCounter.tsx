'use client';

import { useEffect, useState } from 'react';

export default function MemeCounter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Initial fetch
    fetch('/api/meme-count')
      .then(res => res.json())
      .then(data => setCount(data.count));

    // Set up polling every 10 seconds
    const interval = setInterval(() => {
      fetch('/api/meme-count')
        .then(res => res.json())
        .then(data => setCount(data.count));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
      Total Memes Generated: {count}
    </div>
  );
} 