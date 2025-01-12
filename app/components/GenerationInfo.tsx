import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface GenerationInfoProps {
  isVisible: boolean;
  onPhoneNumberSubmit: (phoneNumber: string) => void;
}

export default function GenerationInfo({ isVisible, onPhoneNumberSubmit }: GenerationInfoProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add phone validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Please enter a valid phone number in international format (e.g., +1234567890)");
      return;
    }
    
    // Add this debug log
    console.log('Submitting phone number:', phoneNumber);
    onPhoneNumberSubmit(phoneNumber);
    setIsSubmitted(true);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Add +1 prefix if user starts typing without it
    if (value && !phoneNumber.startsWith('+')) {
      value = '1' + value;
    }
    
    // Format with + prefix
    if (value) {
      value = '+' + value;
    }
    
    setPhoneNumber(value);
  };

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
            <li>Relax and stretch 🧘‍♂️</li>
            <li>Look through the weather app 🌤️</li>
            <li>Maybe scroll through some TikToks 📱</li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 