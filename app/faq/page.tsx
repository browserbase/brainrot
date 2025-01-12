"use client";

import React from "react";
import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "What is Rainrot Generator?",
    answer: <>
      Rainrot Generator is an AI-powered meme generation tool that creates multiple memes based on your text input. 
      <br />
      <br />
      It uses{' '}
      <a href="https://www.browserbase.com" className="text-red-600 dark:text-red-400 hover:underline">Browserbase</a> and{' '}
      <a href="https://github.com/rainrotation/stagehand" className="text-red-600 dark:text-red-400 hover:underline">Stagehand</a>
      {' '}(our open source browser automation framework powered by AI) to understand your message and generate relevant, humorous memes.
    </>
  },
  {
    question: "How many memes can I generate at once?",
    answer: <>
      You can generate up to 4 memes simultaneously with each request. This helps provide variety and different interpretations of your input.
      <br />
      <br />
      If the meme generator isn&apos;t working, it&apos;s likely because I got rate limited by the API 🤷‍♂️. 
      <br />
      <br />
      Please try again later :)
    </>
  },
  {
    question: "How long does it take to generate memes?",
    answer: <>
      Each meme generation request typically takes 1-3 minutes to complete. 
      <br />
      <br />
      Not all memes will always be generated successfully, but you&apos;ll get multiple options to choose from.
    </>
  },
  {
    question: "Are the generated memes saved?",
    answer: <>
      Your 12 most recently generated memes are saved locally in your browser. 
      <br />
      <br />
      You can find them in the &apos;Recently Generated&apos; section below the generator.
    </>
  },
  {
    question: "Is this service free?",
    answer: <>
      Yes, for now.
      {/* <br />
      <br /> */}
      {/* I&apos;m working on a paid plan that will allow you to generate unlimited memes. */}
    </>
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen p-8 pb-28 sm:p-20 sm:pb-28">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-galindo font-bold tracking-wider text-[#1a1b1e] dark:text-white mb-12">
          FAQ
        </h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-[#F8E3C4] dark:bg-gray-800/50 shadow-sm"
            >
              <h2 className="text-xl font-galindo mb-4 text-[#1a1b1e] dark:text-white">
                {faq.question}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 