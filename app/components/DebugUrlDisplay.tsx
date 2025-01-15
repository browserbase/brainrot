import { useState, useEffect } from "react";

interface DebugUrlDisplayProps {
  debugUrls: string[];
}

export default function DebugUrlDisplay({ debugUrls }: DebugUrlDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= debugUrls.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, debugUrls.length, debugUrls]);

  if (!debugUrls.length) {
    return null;
  }

  return (
    <div className="w-full mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Live View ({currentIndex + 1}/{debugUrls.length})
        </h3>
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % debugUrls.length)
          }
          className="px-3 py-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors text-sm"
        >
          Next Live View
        </button>
      </div>
      <div className="w-full h-[400px] bg-[#F8E3C4] dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
        {}
        <iframe
          key={debugUrls[currentIndex]}
          src={debugUrls[currentIndex]}
          className="w-full h-full"
          style={{ pointerEvents: "none" }}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
    </div>
  );
}
