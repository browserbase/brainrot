"use client";

import React from "react";
import { motion } from "framer-motion";

const docs = [
  {
    title: "Browserbase Documentation 🅱️",
    description: "Learn how to use Browserbase, our cloud browser infrastructure.",
    link: "https://docs.browserbase.com",
    color: "bg-[#FFD7BA]"
  },
  {
    title: "Stagehand Documentation 🤟",
    description: "Explore Stagehand's open-source browser automation framework documentation.",
    link: "https://docs.stagehand.dev",
    color: "bg-[#FEFFA3]"
  },
  {
    title: "Need Help? 🆘",
    description: (
      <span>
        Contact us through{' '}
        <a 
          href="mailto:alex@browserbase.com" 
          className="text-red-600 dark:text-red-400 hover:underline"
        >
          alex@browserbase.com
        </a>
        {' '}or{' '}
        <a 
          href="mailto:support@browserbase.com"
          className="text-red-600 dark:text-red-400 hover:underline"
        >
          support@browserbase.com
        </a>
      </span>
    ),
    color: "bg-[#98FF98]",
    isContact: true
  }
];

export default function Docs() {
  return (
    <div className="min-h-screen p-8 pb-28 sm:p-20 sm:pb-28">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-galindo font-bold tracking-wider text-[#1a1b1e] dark:text-white mb-12">
          DOCUMENTATION
        </h1>
        
        <div className="space-y-6">
          {docs.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {doc.isContact ? (
                <div className={`${doc.color} p-6 rounded-lg shadow-sm border border-[#1a1b1e]/10`}>
                  <h2 className="text-xl font-galindo mb-4 text-[#1a1b1e]">
                    {doc.title}
                  </h2>
                  <p className="text-gray-700">
                    {doc.description}
                  </p>
                </div>
              ) : (
                <a 
                  href={doc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className={`${doc.color} p-6 rounded-lg shadow-sm hover:scale-[1.02] transition-transform duration-200 border border-[#1a1b1e]/10`}>
                    <h2 className="text-xl font-galindo mb-4 text-[#1a1b1e]">
                      {doc.title}
                    </h2>
                    <p className="text-gray-700">
                      {doc.description}
                    </p>
                  </div>
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 