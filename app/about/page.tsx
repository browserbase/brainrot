"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const teams = [
  {
    name: "Browserbase Team 🅱️",
    description: "The cloud browser infrastructure behind the scenes",
    link: "https://twitter.com/browserbasehq",
    color: "bg-[#FFD7BA]"
  },
  {
    name: "Stagehand Team 🤟",
    description: "The automation framework that powers this meme generator",
    link: "https://github.com/browserbase/stagehand",
    color: "bg-[#FEFFA3]"
  },
  {
    name: "AP",
    description: "The developer who built this meme generator",
    link: "https://twitter.com/alexdphan",
    color: "bg-[#98FF98]"
  }
];

export default function About() {
  return (
    <div className="p-8 pb-28 sm:p-20 sm:pb-28">
      <main className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-galindo font-bold tracking-wider text-[#1a1b1e] dark:text-white mb-6">
            ABOUT BRAINROT
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Brainrot is an AI-powered meme generator that creates multiple memes based on your text input. 
            It uses advanced browser automation and AI to understand your message and generate relevant, humorous memes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={team.link} target="_blank" rel="noopener noreferrer">
                <div className={`${team.color} p-6 rounded-lg hover:scale-[1.02] transition-transform duration-200 border border-[#1a1b1e]/10`}>
                  <h2 className="text-2xl font-galindo text-[#1a1b1e] mb-3">
                    {team.name}
                  </h2>
                  <p className="text-gray-700">
                    {team.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-[#F8E3C4] dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/cat.gif"
              alt="Cat animation"
              width={48}
              height={48}
              className="rounded-lg border-1 border-[#ff6b6b]"
              unoptimized
            />
            <h2 className="text-2xl font-galindo text-[#1a1b1e] dark:text-white">
              Want to contribute?
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We&apos;re always looking for ways to improve 🅱️rainrot. If you have ideas or want to contribute, check out our GitHub repository!
          </p>
          <Link 
            href="https://github.com/browserbase/brainrot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block rounded-full border-2 border-[#ff6b6b] bg-[#ff6b6b] text-white hover:bg-[#ff8787] dark:hover:bg-[#ff8787] px-6 py-2 font-bold transition-colors"
          >
            View on GitHub
          </Link>
        </div>
      </main>
    </div>
  );
}
