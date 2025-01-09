interface MemeSkeletonProps {
  steps: string[];
  index: number;
}

export default function MemeSkeleton({ steps, index }: MemeSkeletonProps) {
  return (
    <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <span className="text-xs text-gray-500">Template {index + 1}/5</span>
      </div>
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      
      {/* Loading steps */}
      <div className="mt-4 space-y-2 font-mono text-xs">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <span className="text-green-500">✓</span>
            <span>{step}</span>
          </div>
        ))}
        {steps.length > 0 && (
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <span className="inline-block animate-spin">⟳</span>
            <span>Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
} 