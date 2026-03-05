/*
 * Sound Toggle — Floating mute/unmute button with waveform animation
 */
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";

export default function SoundToggle() {
  const { toggleMute, muted, initialized } = useSound();

  if (!initialized) return null;

  return (
    <motion.button
      className="fixed bottom-6 left-6 z-50 w-10 h-10 flex items-center justify-center group"
      style={{
        background: "rgba(10,10,18,0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(69,232,216,0.15)",
      }}
      onClick={toggleMute}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      whileHover={{
        borderColor: "rgba(69,232,216,0.4)",
        boxShadow: "0 0 20px rgba(69,232,216,0.15)",
      }}
      title={muted ? "Unmute sounds" : "Mute sounds"}
    >
      <AnimatePresence mode="wait">
        {muted ? (
          <motion.svg
            key="muted"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#706888"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </motion.svg>
        ) : (
          <motion.div
            key="unmuted"
            className="flex items-end gap-[2px] h-[14px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-[2px] rounded-full"
                style={{ background: "#45e8d8" }}
                animate={{
                  height: ["4px", `${8 + Math.random() * 6}px`, "4px"],
                }}
                transition={{
                  duration: 0.6 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
