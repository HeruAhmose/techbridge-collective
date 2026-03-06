/**
 * Queen Califia CyberAI — Cinematic Intro
 * Sovereign Circuitry Design | Afrofuturist Cyber-Throne
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { playSound, setMasterVolume, startAmbient } from "@/lib/SoundEngine";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; color: string;
  life: number; maxLife: number;
}

function createParticle(w: number, h: number): Particle {
  const colors = ["#D4AF37", "#FFE178", "#00DCFA", "#A78BFA", "#D4AF37"];
  return {
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8 - 0.3,
    size: Math.random() * 2.5 + 0.5, alpha: 0,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 0, maxLife: 200 + Math.random() * 300,
  };
}

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"waiting" | "awakening" | "revealing" | "ready">("waiting");
  const [textVisible, setTextVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const { toggle, enabled } = useSound();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 120; i++) {
      particlesRef.current.push(createParticle(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) p.alpha = lifeRatio * 10;
        else if (lifeRatio > 0.8) p.alpha = (1 - lifeRatio) * 5;
        else p.alpha = 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.6;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.globalAlpha = p.alpha * 0.15;
        ctx.fill();

        if (p.life >= p.maxLife || p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
          particlesRef.current[i] = createParticle(canvas.width, canvas.height);
        }
      });
      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animFrameRef.current); };
  }, []);

  useEffect(() => {
    if (phase === "awakening") {
      const t1 = setTimeout(() => setTextVisible(true), 800);
      const t2 = setTimeout(() => setSubtitleVisible(true), 1800);
      const t3 = setTimeout(() => { setPhase("revealing"); setButtonVisible(true); }, 2800);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [phase]);

  const handleEnter = useCallback(() => {
    if (!enabled) {
      toggle();
      setMasterVolume(0.3);
      startAmbient();
    }
    playSound("sovereign_awaken");

    if (phase === "waiting") {
      setPhase("awakening");
    } else if (phase === "revealing") {
      setPhase("ready");
      setTimeout(onComplete, 600);
    }
  }, [phase, onComplete, enabled, toggle]);

  const title = "QUEEN CALIFIA";
  const subtitle = "CYBERAI — SOVEREIGN CYBERSECURITY INTELLIGENCE";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      style={{ background: "radial-gradient(ellipse at center, #0a0f1e 0%, #020409 70%)" }}
      onClick={handleEnter}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{ backgroundImage: `url("${CDN}/qc-hex-grid-bg-Ckjfegc53A383DCfoyh5Xe.webp")`, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      <div className="absolute inset-0 z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, #020409 100%)" }}
      />

      <AnimatePresence>
        {phase === "waiting" && (
          <motion.div key="waiting" className="relative z-20 flex flex-col items-center gap-8"
            exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}>
            <motion.div className="relative" animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37] opacity-40"
                  style={{ animation: "qc-pulse 2.5s ease-in-out infinite" }} />
                <div className="absolute -inset-4 rounded-full border border-dashed border-[#D4AF37] opacity-20"
                  style={{ animation: "qc-rotate 12s linear infinite" }} />
                <img src={`${CDN}/idle_avatar_sm_6294a66d.png`} alt="Queen Califia"
                  className="w-20 h-20 rounded-full object-cover"
                  style={{ border: "2px solid #D4AF37", boxShadow: "0 0 30px rgba(212,175,55,0.3), 0 0 60px rgba(212,175,55,0.1)" }} />
              </div>
            </motion.div>

            <motion.div className="flex flex-col items-center gap-3"
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <span className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Orbitron', sans-serif" }}>Initialize Sovereign Protocol</span>
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/40 flex items-center justify-center
                hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2L12 8L4 14V2Z" fill="#D4AF37" />
                </svg>
              </div>
              <span className="text-[#4a6080] text-[10px] tracking-[0.2em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>CLICK TO AWAKEN</span>
            </motion.div>
          </motion.div>
        )}

        {(phase === "awakening" || phase === "revealing") && (
          <motion.div key="awakening" className="relative z-20 flex flex-col items-center gap-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="relative">
              <div className="absolute -inset-8 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)", animation: "qc-pulse 2s ease-in-out infinite" }} />
              <div className="absolute -inset-4 rounded-full border-2 border-[#D4AF37] opacity-40"
                style={{ boxShadow: "0 0 20px rgba(212,175,55,0.4), inset 0 0 20px rgba(212,175,55,0.15)", animation: "qc-pulse 2.5s ease-in-out infinite" }} />
              <div className="absolute -inset-8 rounded-full border border-dashed border-[#D4AF37] opacity-30"
                style={{ animation: "qc-rotate 8s linear infinite" }} />
              <img src={`${CDN}/idle_avatar_lg_d2e3a5df.png`} alt="Queen Califia — Sovereign"
                className="w-40 h-40 rounded-2xl object-cover relative z-10"
                style={{ border: "2px solid #D4AF37", boxShadow: "0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.15)" }} />
              {["top-1 left-1 border-t-2 border-l-2", "top-1 right-1 border-t-2 border-r-2",
                "bottom-1 left-1 border-b-2 border-l-2", "bottom-1 right-1 border-b-2 border-r-2"].map((cls, i) => (
                <div key={i} className={`absolute w-4 h-4 border-[#D4AF37] z-20 ${cls}`} />
              ))}
              <div className="absolute left-0 right-0 h-[2px] z-20"
                style={{ background: "linear-gradient(transparent, rgba(212,175,55,0.5), transparent)", animation: "qc-scanline 3s linear infinite" }} />
            </motion.div>

            {textVisible && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center">
                <h1 className="text-3xl md:text-5xl font-bold tracking-[0.15em] text-[#D4AF37]"
                  style={{ fontFamily: "'Orbitron', sans-serif", textShadow: "0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)" }}>
                  {title.split("").map((char, i) => (
                    <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}>{char}</motion.span>
                  ))}
                </h1>
              </motion.div>
            )}

            {subtitleVisible && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
                className="text-[10px] md:text-xs tracking-[0.25em] text-[#4a6080] text-center"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>{subtitle}</motion.div>
            )}

            {buttonVisible && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }} className="mt-4">
                <button onClick={(e) => { e.stopPropagation(); handleEnter(); }}
                  className="px-8 py-3 border border-[#D4AF37]/40 rounded-lg text-[#D4AF37] text-sm tracking-[0.2em]
                    hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}>ENTER COMMAND</button>
                <div className="text-center mt-2 text-[9px] text-[#4a6080] tracking-[0.15em]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>DEFENSE-GRADE CYBERSECURITY INTELLIGENCE</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-[2] opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: `url("${CDN}/qc-circuit-texture-crouTXBwBSsyVGQspVekAy.webp")`, backgroundSize: "cover", backgroundPosition: "center" }} />
    </div>
  );
}
