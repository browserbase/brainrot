// import { motion, AnimatePresence } from 'framer-motion';

// interface DebugModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
//   debugUrl: string;
// }

// export default function DebugModal({ isOpen, closeModal, debugUrl }: DebugModalProps) {
//   const openDebugger = () => {
//     window.open(debugUrl, '_blank', 'noopener,noreferrer');
//     closeModal();
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.3 }}
//             exit={{ opacity: 0 }}
//             onClick={closeModal}
//             className="absolute inset-0 bg-black"
//           />
          
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0 }}
//             transition={{
//               type: "spring",
//               stiffness: 300,
//               damping: 25,
//               mass: 0.5
//             }}
//             className="relative w-[95vw] max-w-md bg-[#FFF5E1] dark:bg-[#1a1b1e] rounded-2xl shadow-2xl border border-[#1a1b1e]/10 p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <motion.button
//               onClick={closeModal}
//               className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </motion.button>

//             <h2 className="text-xl font-medium mb-4">Debug View</h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
//               Click below to open the debug view in a new window
//             </p>
            
//             <motion.button
//               onClick={openDebugger}
//               className="w-full px-4 py-3 rounded-lg font-medium bg-[#FFD7BA] dark:bg-[#FFD7BA] text-[#1a1b1e] hover:opacity-90"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               🔍 Open Debug View
//             </motion.button>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// } 