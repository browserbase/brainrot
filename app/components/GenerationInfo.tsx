import { AnimatePresence, motion } from "framer-motion";

interface GenerationInfoProps {
  isVisible: boolean;
  // onPhoneNumberSubmit: (phoneNumber: string) => void;
}

export default function GenerationInfo({ isVisible }: GenerationInfoProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="generation-info mt-4 p-4 bg-[#ff6b6b]/10 dark:bg-[#ff6b6b]/10 rounded-lg text-sm text-[#1a1b1e] dark:text-white border border-[#ff6b6b]/20"
          initial={{ opacity: 0, y: -50, transformOrigin: "top" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{
            type: "spring",
            stiffness: 300,
            mass: 0.7,
            duration: 0.5
          }}
        >
          <p className="mb-2">ℹ️ Please note:</p>
          <p>
            Each meme generation request takes approximately 1-3 minutes to
            complete. Not all memes will always be generated.
          </p>
          
          <p>Here are some ideas to make the most of your time:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Take a coffee break ☕</li>
            <li>Touch some grass 🌿</li>
            <li>Look through the weather app 🌤️</li>
            <li>Maybe scroll through some TikToks 📱</li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 