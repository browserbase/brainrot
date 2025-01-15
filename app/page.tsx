"use client";
import { FormEvent, useState, useEffect } from "react";
import MemeSkeleton from "./components/MemeSkeleton";
import ImageChecker from "./components/ImageChecker";
import Logo from "./components/Logo";
import MemeProgress from "./components/MemeProgress";
import MemeCounter from "./components/MemeCounter";
import RecentlyGenerated from "./components/RecentlyGenerated";
import GenerationInfo from "./components/GenerationInfo";
import { MAX_CONCURRENT_MEMES } from "./config/constants";
import StickyFooter from "./components/StickyFooter";
import Image from "next/image";
import Link from "next/link";
import DebugUrlDisplay from './components/DebugUrlDisplay';
// import { motion } from "framer-motion";

interface Meme {
  index: number;
  imageUrl: string;
  templateName: string;
}

interface LoadingState {
  index: number;
  steps: string[];
  debugUrl?: string;
  sessionId?: string;
  isComplete?: boolean;
}


export default function Home() {
  const [message, setMessage] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>(
    Array(MAX_CONCURRENT_MEMES)
      .fill(null)
      .map((_, index) => ({
        index,
        steps: [],
      }))
  );
  const [recentMemes, setRecentMemes] = useState<
    (Meme & { query: string; timestamp: number })[]
  >([]);
  const [successfulMemes, setSuccessfulMemes] = useState(0);
  const [debugUrls, setDebugUrls] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentMemes");
    if (saved) {
      setRecentMemes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const urls = loadingStates
      .map(state => state.debugUrl)
      .filter((url): url is string => !!url);
    setDebugUrls(urls);
  }, [loadingStates]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMemes([]);
    setIsLoading(true);
    setSubmittedQuery(message);
    setSuccessfulMemes(0);

    let firstResponseReceived = false;

    // Create multiple sessions for concurrent meme generation
    const createSessions = async () => {
      const sessions = await Promise.all(
        Array(MAX_CONCURRENT_MEMES).fill(null).map(async () => {
          const response = await fetch("/api/session", {
            method: "POST",
            // mode: "no-cors",
            // headers: {
            //   "Access-Control-Allow-Origin": "*",
            // },
          });
          const data = await response.json();
          if (data.error) throw new Error(data.error);
          return data;
        })
      );
      return sessions;
    };

    const sessions = await createSessions();
    console.log("Sessions created:", sessions);

    // Initialize loading states with session IDs
    setLoadingStates(
      Array(MAX_CONCURRENT_MEMES).fill(null).map((_, index) => {
        console.log(`Setting loading state ${index} with debug URL:`, sessions[index].debugUrl);
        return {
          index,
          steps: [],
          sessionId: sessions[index].sessionId,
          debugUrl: sessions[index].debugUrl
        };
      })
    );

    console.log("Creating memes now...");
    const apiCalls = Array(MAX_CONCURRENT_MEMES)
      .fill(null)
      .map((_, index) =>
        fetch("/api/chat", {
          method: "POST",
          // mode: "no-cors",
          // headers: {
          //   "Content-Type": "application/json",
          //   "Access-Control-Allow-Origin": "*",
          // },
          body: JSON.stringify({
            message,
            sourceType: index,
            sessionId: sessions[index].sessionId,
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

              // Update loading state with debug URL
              setLoadingStates((prev) =>
                prev.map((state) => {
                  if (state.index === result.index) {
                    console.log("Setting debug URL for state:", result.debugUrl);
                    return { 
                      ...state, 
                      debugUrl: result.debugUrl
                    };
                  }
                  return state;
                })
              );

              if (!memes.some((m) => m.templateName === result.templateName)) {
                setMemes((prevMemes) => [...prevMemes, formattedResult]);
                setSuccessfulMemes((prev) =>
                  Math.min(prev + 1, MAX_CONCURRENT_MEMES)
                );

                // Save to localStorage
                const newMeme = {
                  ...formattedResult,
                  query: message,
                  timestamp: Date.now(),
                };

                const existingMemes = JSON.parse(
                  localStorage.getItem("recentMemes") || "[]"
                );
                const updatedMemes = [newMeme, ...existingMemes].slice(0, 12); // Keep last 12
                localStorage.setItem(
                  "recentMemes",
                  JSON.stringify(updatedMemes)
                );
                setRecentMemes(updatedMemes);
              }

              if (!firstResponseReceived) {
                firstResponseReceived = true;
                setIsLoading(false);
              }

              updateLoadingState(result.index);
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

  const updateLoadingState = (index: number) => {
    setLoadingStates(prev => 
      prev.map(state => 
        state.index === index 
          ? { ...state, isComplete: true }
          : state
      )
    );
  };

  return (
    <div className="p-8 pb-28 sm:p-20 sm:pb-28">
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          <div className="w-full lg:w-1/2 lg:sticky lg:top-20">
            <h1 className="text-4xl sm:text-6xl font-galindo font-bold tracking-wider text-[#1a1b1e] dark:text-white">
              WELCOME TO
              <br />
              <span className="flex flex-col items-start">
                <div className="flex flex-col items-start">
                  <div className="flex">
                    <Link href="https://www.browserbase.com">
                      <Logo className="h-7 sm:h-12 w-7 sm:w-12 mr-0.5 text-[#1a1b1e] dark:text-white mt-0.5" />
                    </Link>
                    RAINROT
                  </div>
                  <span className="flex flex-col items-start">GENERATOR</span>
                </div>
              </span>
            </h1>
            <MemeCounter />
            <div className="mt-4 w-full">
              <DebugUrlDisplay debugUrls={debugUrls} />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="mb-4">
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <div className="flex flex-col items-start mr-4">
                  Have something to say?
                  <br />
                  We&apos;ll make memes from it
                </div>
                <Image
                  src="/cat.gif"
                  alt="Cat animation"
                  width={48}
                  height={48}
                  className="inline-block rounded-lg border-1 border-[#ff6b6b] "
                  unoptimized
                />
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1 flex gap-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type anything..."
                    className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm sm:text-base h-10 sm:h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#EF3604] focus:border-transparent transition-shadow duration-200"
                    disabled={isLoading}
                  />
                  {/* Phone number input temporarily disabled
                  <input
                    type="tel"
                    value={notificationPhone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/^\+1/, '');
                      value = value.replace(/\D/g, '');
                      value = value.slice(0, 10);
                      if (value) {
                        value = '+1' + value;
                      }
                      setNotificationPhone(value);
                    }}
                    placeholder="Phone # (Optional)"
                    maxLength={12}
                    className="w-48 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 
                    text-sm sm:text-base h-10 sm:h-12 bg-white dark:bg-gray-800 
                    text-gray-900 dark:text-gray-100 
                    focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:border-[#ff6b6b] focus:ring-opacity-50
                    transition-all duration-200 ease-in-out
                    placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                  */}
                </div>
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="rounded-full border-2 border-[#ff6b6b] transition-all duration-200 
                  flex items-center justify-center bg-[#ff6b6b] text-white 
                  hover:bg-[#ff8787] hover:border-[#ff8787] hover:scale-105
                  dark:hover:bg-[#ff8787] text-sm sm:text-base h-10 sm:h-12 
                  px-6 sm:px-8 disabled:opacity-50 disabled:cursor-not-allowed 
                  disabled:hover:scale-100 whitespace-nowrap font-bold"
                >
                  Generate
                </button>
              </div>
            </form>
            <GenerationInfo
              isVisible={isLoading}
              // onPhoneNumberSubmit={(phone) => setNotificationPhone(phone)}
            />

            {/* Progress bar - Always visible */}
            <div className="mt-8 w-full">
              <MemeProgress
                current={successfulMemes}
                total={MAX_CONCURRENT_MEMES}
              />
            </div>

            {/* Debug URL Display */}
            {/* <div className="mt-6 w-full hidden sm:block">
              <DebugUrlDisplay debugUrls={debugUrls} />
            </div> */}

            {/* Loading skeletons - Only visible when loading */}
            {isLoading && (
              <div className="mt-6 w-full">
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
                  {loadingStates.map((state) => (
                    <MemeSkeleton
                      key={`loading-${state.index}`}
                      steps={state.steps}
                      index={state.index}
                      debugUrl={state.debugUrl}
                      sessionId={state.sessionId}
                      isSessionComplete={state.isComplete}
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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
                  {memes.map((meme, index) => (
                    <div
                      key={`${meme.index}-${index}`}
                      className="p-3 rounded-lg bg-[#F8E3C4] dark:bg-gray-800 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs sm:text-base font-medium">
                          {meme.templateName}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-500">
                          Meme {index + 1}/{MAX_CONCURRENT_MEMES}
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
                  {Array(MAX_CONCURRENT_MEMES - memes.length)
                    .fill(null)
                    .map((_, i) => (
                      <MemeSkeleton
                        key={`remaining-${i}`}
                        steps={loadingStates[memes.length + i]?.steps || []}
                        index={memes.length + i}
                        sessionId={loadingStates[memes.length + i]?.sessionId}
                        isSessionComplete={loadingStates[memes.length + i]?.isComplete}
                      />
                    ))}
                </div>
              </>
            )}

            <RecentlyGenerated recentMemes={recentMemes} />
          </div>
        </div>
      </main>
      <StickyFooter />
      {/* <DebugUrlDisplay debugUrls={debugUrls} /> */}
    </div>
  );
}
