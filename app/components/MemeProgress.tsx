interface MemeProgressProps {
  current: number;
  total: number;
}

export default function MemeProgress({ current, total }: MemeProgressProps) {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>{current} / {total} memes generated</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-4 bg-[#F8E3C4] dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#ff6b6b] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
} 