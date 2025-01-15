import { motion, AnimatePresence } from 'framer-motion';

interface DebugModalProps {
  isOpen: boolean;
  closeModal: () => void;
  debugUrl: string;
}

export default function DebugModal({ isOpen, closeModal, debugUrl }: DebugModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black"
          />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.5
            }}
            className="relative w-[95vw] h-[90vh] max-w-6xl bg-[#FFF5E1] dark:bg-[#1a1b1e] rounded-2xl shadow-2xl border border-[#1a1b1e]/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <div className="h-full w-full">
              <iframe
                src={debugUrl}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 