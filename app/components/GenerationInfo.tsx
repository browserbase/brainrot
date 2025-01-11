import { motion, AnimatePresence } from "framer-motion";

interface GenerationInfoProps {
  isVisible: boolean;
}

export default function GenerationInfo({ isVisible }: GenerationInfoProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, transformOrigin: "top" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{
            type: "spring",
            stiffness: 300,
            mass: 0.7,
            duration: 0.5
          }}
          className="mt-4 p-4 bg-[#ff6b6b]/10 dark:bg-[#ff6b6b]/10 rounded-lg text-sm text-[#1a1b1e] dark:text-white border border-[#ff6b6b]/20"
        >
          <p className="mb-2">ℹ️ Please note:</p>
          <p>
            Each meme generation request takes approximately 1-3 minutes to
            complete. Not all memes will be generated always. Here are some
            ideas to make the most of your time:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Take a coffee break ☕</li>
            <li>Relax and stretch 🧘‍♂️</li>
            <li>Look through the weather app 🌤️</li>
            <li>Maybe scroll through some TikToks 📱</li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 