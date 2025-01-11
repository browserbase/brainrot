import ImageChecker from "./ImageChecker";

interface Meme {
  index: number;
  imageUrl: string;
  templateName: string;
  query: string;
  timestamp: number;
}

interface RecentlyGeneratedProps {
  recentMemes: Meme[];
}

export default function RecentlyGenerated({ recentMemes }: RecentlyGeneratedProps) {
  return (
    <>
      <div className="mt-16 mb-6">
        <h2 className="text-2xl font-galindo">Recently Generated</h2>
      </div>
      {recentMemes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
          {recentMemes.map((meme, index) => (
            <div
              key={`recent-${meme.timestamp}-${index}`}
              className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm"
            >
              <div className="flex flex-col mb-4">
                <h3 className="text-base font-medium">
                  {meme.templateName}
                </h3>
                <span className="text-xs text-gray-500 mt-1">
                  &quot;{meme.query}&quot;
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(meme.timestamp).toLocaleDateString()}
                </span>
              </div>
              <ImageChecker
                src={meme.imageUrl}
                alt={meme.templateName}
                width={800}
                height={800}
                className="rounded-lg w-full"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No memes generated yet. Try generating some memes above!
          </p>
        </div>
      )}
    </>
  );
} 