import { motion } from "framer-motion";
import Link from "next/link";

export default function StickyFooter() {
  const text = "BUILT WITH STAGEHAND 🤟  ".repeat(20);
  
  return (
    <Link href="https://stagehand.dev" target="_blank" rel="noopener noreferrer">
      <motion.div 
        className="fixed bottom-0 left-0 right-0 mx-auto w-[95%] lg:w-full lg:max-w-7xl bg-[#ffd43b] h-12 overflow-hidden z-50 cursor-pointer rounded-xl mb-2 lg:mb-4 shadow-[0_0_25px_10px_rgba(255,212,59,0.5)] lg:shadow-none"
        animate={{
          y: [0, -8, 0],
        }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 25px 10px rgba(255,212,59,0.5)",
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        <div className="relative w-full h-full flex items-center">
          <motion.div
            className="absolute whitespace-nowrap text-black font-bold text-sm tracking-wider px-8"
            animate={{
              x: ["0%", "-50%"]
            }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity
            }}
          >
            {text + text}
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
} 