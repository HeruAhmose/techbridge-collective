import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSound } from "@/contexts/SoundContext";
import { useRef, useEffect } from "react";
import type { ReactNode } from "react";

interface Props {
  id: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function Section({ id, eyebrow, title, subtitle, dark, children, className = "", noPadding }: Props) {
  const [ref, inView] = useInView({ threshold: 0.05 });
  const { play } = useSound();
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (inView && !hasPlayed.current) {
      hasPlayed.current = true;
      play("section_enter");
    }
  }, [inView, play]);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative z-10 ${noPadding ? "" : "py-24 md:py-32 px-[5vw] md:px-[7vw]"} ${className}`}
      style={{
        background: dark ? "var(--carbon)" : "transparent",
        borderTop: dark ? "1px solid var(--bd)" : "none",
      }}
    >
      {eyebrow && (
        <motion.div
          className={`flex items-center gap-2.5 mb-4 ${className?.includes('text-center') ? 'justify-center' : ''}`}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="w-6 h-[2px] inline-block" style={{ background: "var(--tmd)" }} />
          <span
            className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "#45e8d8" }}
          >
            {eyebrow}
          </span>
        </motion.div>
      )}
      {title && (
        <motion.h2
          className={`text-3xl md:text-4xl lg:text-[3.4rem] font-semibold leading-[1.15] mb-4 ${className?.includes('text-center') ? 'text-center mx-auto max-w-[600px]' : ''}`}
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--qg)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h2>
      )}
      {subtitle && (
        <motion.p
          className={`text-lg leading-[1.9] max-w-[600px] mb-2 ${className?.includes('text-center') ? 'text-center mx-auto' : ''}`}
          style={{ color: "var(--t2)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {subtitle}
        </motion.p>
      )}
      {children}
    </section>
  );
}
