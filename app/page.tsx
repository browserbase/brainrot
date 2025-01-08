"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";

interface Meme {
  index: number;
  imageUrl: string;
  templateName: string;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMemes([]); // Clear previous results
    setIsLoading(true);

    let firstResponseReceived = false;

    // Create three separate API calls
    const apiCalls = Array(3).fill(null).map(() => 
      fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
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
          setMemes(prevMemes => [...prevMemes, formattedResult]);
          
          // Remove loading state after first successful response
          if (!firstResponseReceived) {
            firstResponseReceived = true;
            setIsLoading(false);
          }
        } else {
          console.error('Error response from API:', data);
        }
      })
      .catch(error => {
        console.error("Error:", error);
      })
    );

    try {
      // Still wait for all calls to complete before clearing the message
      await Promise.all(apiCalls);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center max-w-md mx-auto">
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
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          )}

          {!isLoading && memes && memes.length > 0 && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {memes.map((meme, index) => (
                <div 
                  key={`${meme.index}-${index}`} 
                  className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm"
                >
                  <h3 className="text-sm font-medium mb-3">{meme.templateName}</h3>
                  <Image
                    src={meme.imageUrl}
                    alt={meme.templateName || 'Meme image'}
                    width={500}
                    height={500}
                    className="rounded-md w-full"
                    unoptimized={true}
                  />
                </div>
              ))}
              {isLoading && Array(3 - memes.length).fill(null).map((_, i) => (
                <div 
                  key={`loading-${i}`}
                  className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm animate-pulse"
                >
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
