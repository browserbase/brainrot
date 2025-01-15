import { useState, useEffect } from "react";

interface DebugUrlDisplayProps {
  debugUrls: string[];
  activeSessions: number;
}

export default function DebugUrlDisplay({ debugUrls, activeSessions }: DebugUrlDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= activeSessions || !debugUrls[currentIndex]) {
      setCurrentIndex(0);
    }
  }, [currentIndex, activeSessions, debugUrls]);

  if (!debugUrls.length || activeSessions === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Live View ({currentIndex + 1}/{activeSessions})
        </h3>
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % debugUrls.length)
          }
          className={`
            bg-white px-3 py-1 rounded-lg 
            font-galindo text-[#1a1b1e] text-sm
            hover:opacity-90 transition-all duration-200
            border-2 border-[#1a1b1e]/20
            shadow-[2px_2px_0px_#1a1b1e]
            hover:shadow-none
            active:translate-x-1 active:translate-y-1
            hover:bg-gray-100
          `}
        >
          Next Live View
        </button>
      </div>
      <div className="w-full h-[400px] bg-[#F8E3C4] dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
        <iframe
          key={debugUrls[currentIndex]}
          src={debugUrls[currentIndex]}
          className="w-full h-full pointer-events-none"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
          referrerPolicy="no-referrer"
          style={{ pointerEvents: "none" }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
