import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useSound } from "@/contexts/SoundContext";
import type { TECH_CARDS } from "@/lib/data";

type TechCard = (typeof TECH_CARDS)[number];

interface Props {
  card: TechCard | null;
  onClose: () => void;
}

export default function TechModal({ card, onClose }: Props) {
  const { play } = useSound();

  useEffect(() => {
    if (card) {
      play("modal_open");
    }
  }, [card, play]);

  const handleClose = () => {
    play("modal_close");
    onClose();
  };

  if (!card) return null;

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(3,3,8,0.94)", backdropFilter: "blur(20px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-[860px] max-h-[85vh] overflow-y-auto"
            style={{
              background: "var(--gra)",
              border: "1px solid var(--bdh)",
              padding: "2.5rem",
            }}
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated top border */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-5 text-2xl border-0 bg-transparent transition-colors duration-200"
              style={{ color: "var(--t2)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--qu)"; play("hover"); }}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t2)")}
            >
              ✕
            </button>

            {/* Badges */}
            <div className="flex gap-2 mb-2">
              <motion.span
                className="text-[0.58rem] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 border inline-block"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: card.color,
                  borderColor: card.color + "40",
                  background: card.color + "0c",
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {card.claim}
              </motion.span>
              <motion.span
                className="text-[0.58rem] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 border inline-block"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "var(--t3)",
                  borderColor: "var(--bd)",
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                {card.vol}
              </motion.span>
            </div>

            {/* Title */}
            <motion.h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--qg)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {card.num}. {card.title}
            </motion.h2>

            {/* Overview */}
            <motion.p
              className="text-base leading-[1.85] mb-6"
              style={{ color: "var(--t2)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {card.overview}
            </motion.p>

            {/* Specs */}
            <motion.div
              className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase mb-3"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#45e8d8" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ── Technical Specifications
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-6">
              {card.specs.map(([key, val], i) => (
                <motion.div
                  key={i}
                  className="flex justify-between items-center px-3 py-2 group cursor-default"
                  style={{ background: "var(--lat)" }}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.04 }}
                  onMouseEnter={() => play("data_point")}
                  whileHover={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span
                    className="text-[0.62rem] font-semibold uppercase tracking-[0.05em]"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--t3)" }}
                  >
                    {key}
                  </span>
                  <span
                    className="text-[0.78rem] font-semibold"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--qu)" }}
                  >
                    {val}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Claims */}
            <motion.div
              className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase mb-3"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8c44a" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ── Patent Claims
            </motion.div>
            <div className="flex flex-col gap-1 mb-6">
              {card.claims.map((c, i) => (
                <motion.div
                  key={i}
                  className="px-3 py-2 text-sm leading-[1.65]"
                  style={{
                    borderLeft: "3px solid rgba(232,196,74,0.25)",
                    color: "var(--t2)",
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.05 }}
                >
                  {c}
                </motion.div>
              ))}
            </div>

            {/* Insight */}
            <motion.div
              className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase mb-3"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#a485ff" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              ── Key Insight
            </motion.div>
            <motion.div
              className="text-base leading-[1.85] p-4"
              style={{
                color: "var(--t1)",
                background: "rgba(164,133,255,0.05)",
                borderLeft: "3px solid rgba(164,133,255,0.25)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              {card.insight}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
