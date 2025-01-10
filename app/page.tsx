"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import MemeSkeleton from "./components/MemeSkeleton";
import ImageChecker from "./components/ImageChecker";

interface Meme {
  index: number;
  imageUrl: string;
  templateName: string;
}

interface LoadingState {
  index: number;
  steps: string[];
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([
    { index: 0, steps: [] },
    { index: 1, steps: [] },
    { index: 2, steps: [] },
    { index: 3, steps: [] },
    { index: 4, steps: [] },
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMemes([]);
    setIsLoading(true);
    setSubmittedQuery(message);

    let firstResponseReceived = false;

    const apiCalls = Array(5)
      .fill(null)
      .map((_, index) =>
        fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            sourceType: index,
            usedTemplates: memes.map((meme) => meme.templateName),
          }),
        })
          .then(async (res) => {
            const reader = res.body?.getReader();
            let steps: string[] = [];
            let jsonData = null;
            let completeResponse = "";

            if (!reader) {
              throw new Error("No reader available");
            }

            while (true) {
              const { done, value } = await reader.read();

              if (done) break;

              const chunk = new TextDecoder().decode(value);
              completeResponse += chunk;

              const lines = chunk.split("\n").filter((line) => line.trim());

              for (const line of lines) {
                if (line.startsWith("{") || line.startsWith("[")) {
                  try {
                    jsonData = JSON.parse(line);
                  } catch {
                    // Not valid JSON, might be incomplete
                  }
                } else if (line.includes("console.log")) {
                  const match = line.match(/console\.log\('([^']+)'/);
                  if (match) {
                    const step = match[1].trim();
                    steps = [...steps, step];
                    setLoadingStates((prev) =>
                      prev.map((state) =>
                        state.index === index ? { ...state, steps } : state
                      )
                    );
                  }
                }
              }
            }

            if (!jsonData) {
              try {
                // Try to parse the last line as JSON
                const lines = completeResponse.split("\n");
                const lastLine = lines[lines.length - 1];
                jsonData = JSON.parse(lastLine);
              } catch (error) {
                console.error("Failed to parse response JSON:", error);
                throw new Error("Failed to parse response JSON");
              }
            }

            return jsonData;
          })
          .then((data) => {
            if (data && !data.error) {
              const result = data[0];
              const formattedResult = {
                ...result,
                imageUrl: result.imageUrl.replace(
                  /^https?:\/\/imgflip\.com\/i\/([a-zA-Z0-9]+)$/,
                  "https://i.imgflip.com/$1.jpg"
                ),
              };

              if (!memes.some((m) => m.templateName === result.templateName)) {
                setMemes((prevMemes) => [...prevMemes, formattedResult]);
              }

              if (!firstResponseReceived) {
                firstResponseReceived = true;
                setIsLoading(false);
              }
            }
          })
          .catch((error: Error) => {
            console.error("Error processing request:", error);
            setIsLoading(false);
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
              className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
            >
              Send Message
            </button>
          </form>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-200">
            <p className="mb-2">ℹ️ Please note:</p>
            <p>
              Each meme generation request takes approximately 1-5 minutes to
              complete. Not all memes will be generated always. Here are some
              ideas to make the most of your time:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Take a coffee break ☕</li>
              <li>Relax and stretch 🧘‍♂️</li>
              <li>Maybe scroll through some TikToks 📱</li>
            </ul>
          </div>

          {isLoading && (
            <div className="mt-8 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingStates.map((state) => (
                  <MemeSkeleton
                    key={`loading-${state.index}`}
                    steps={state.steps}
                    index={state.index}
                  />
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
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-medium">
                        {meme.templateName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        Meme {index + 1}/5
                      </span>
                    </div>
                    <ImageChecker
                      src={meme.imageUrl}
                      alt={meme.templateName || "Meme image"}
                      width={800}
                      height={800}
                      className="rounded-lg w-full"
                    />
                  </div>
                ))}
                {Array(5 - memes.length)
                  .fill(null)
                  .map((_, i) => (
                    <MemeSkeleton
                      key={`remaining-${i}`}
                      steps={loadingStates[memes.length + i]?.steps || []}
                      index={memes.length + i}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
