"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import MemeSkeleton from "./components/MemeSkeleton";

interface Meme {
  index: number;
  imageUrl: string;
  templateName: string;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [response, setResponse] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usedTemplates, setUsedTemplates] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMemes([]);
    setIsLoading(true);
    setSubmittedQuery(message);
    setUsedTemplates([]);

    let firstResponseReceived = false;

    const apiCalls = Array(3).fill(null).map((_, index) => 
      fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message,
          sourceType: index,
          usedTemplates: memes.map(meme => meme.templateName)
        }),
      }).then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          const result = data[0];
          const formattedResult = {
            ...result,
            imageUrl: result.imageUrl.replace(
              /^https?:\/\/imgflip\.com\/i\/([a-zA-Z0-9]+)$/,
              'https://i.imgflip.com/$1.jpg'
            )
          };
          
          if (!memes.some(m => m.templateName === result.templateName)) {
            setMemes(prevMemes => [...prevMemes, formattedResult]);
            setUsedTemplates(prev => [...prev, result.templateName]);
          }
          
          if (!firstResponseReceived) {
            firstResponseReceived = true;
            setIsLoading(false);
          }
        }
      })
      .catch(error => {
        console.error("Error:", error);
      })
    );

    try {
      await Promise.all(apiCalls);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="flex flex-col items-center max-w-6xl mx-auto">
        <div className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
            <button
              type="submit"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Send Message
            </button>
          </form>

          {/* <Image src="https://i.imgflip.com/9g290y.jpg" alt="Meme" width={500} height={500} /> */}

          {isLoading && (
            <div className="mt-8 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(null).map((_, i) => (
                  <MemeSkeleton key={`loading-${i}`} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && memes && memes.length > 0 && (
            <>
              <div className="mt-8 mb-6 text-center">
                <span className="text-base text-gray-600 dark:text-gray-400">
                  Results for: &quot;{submittedQuery}&quot;
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {memes.map((meme, index) => (
                  <div 
                    key={`${meme.index}-${index}`} 
                    className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm"
                  >
                    <h3 className="text-base font-medium mb-4">{meme.templateName}</h3>
                    <Image
                      src={meme.imageUrl}
                      alt={meme.templateName || 'Meme image'}
                      width={800}
                      height={800}
                      className="rounded-lg w-full"
                      unoptimized={true}
                    />
                  </div>
                ))}
                {isLoading && Array(3 - memes.length).fill(null).map((_, i) => (
                  <MemeSkeleton key={`loading-${i}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
