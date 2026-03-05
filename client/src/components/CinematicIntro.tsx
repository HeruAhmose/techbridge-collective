import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { soundEngine } from "@/lib/soundEngine";

function IntroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const w = c.width = window.innerWidth;
    const h = c.height = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    const hues = [174, 268, 43, 330, 0];
    const particles = Array.from({ length: 80 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 400 + 120;
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        tx: cx + (Math.random() - 0.5) * 80,
        ty: cy + (Math.random() - 0.5) * 80,
        s: Math.random() * 2.5 + 0.5,
        hu: hues[i % 5],
        progress: 0,
        speed: Math.random() * 0.008 + 0.004,
        delay: Math.random() * 0.4,
        pulse: Math.random() * Math.PI * 2,
      };
    });

    let frame = 0;
    let animId: number;

    function draw() {
      frame++;
      ctx!.clearRect(0, 0, w, h);
      const t = frame / 60;

      for (const p of particles) {
        if (t > p.delay) {
          p.progress = Math.min(p.progress + p.speed, 1);
        }
        p.pulse += 0.05;
        const ease = 1 - Math.pow(1 - p.progress, 3);
        const px = p.x + (p.tx - p.x) * ease;
        const py = p.y + (p.ty - p.y) * ease;
        const pulseScale = 1 + Math.sin(p.pulse) * 0.3;

        // Trail
        if (p.progress > 0 && p.progress < 0.95) {
          ctx!.beginPath();
          ctx!.moveTo(p.x + (p.tx - p.x) * Math.max(0, ease - 0.25), p.y + (p.ty - p.y) * Math.max(0, ease - 0.25));
          ctx!.lineTo(px, py);
          ctx!.strokeStyle = `hsla(${p.hu},60%,65%,${0.2 * (1 - p.progress)})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }

        // Outer glow
        ctx!.beginPath();
        ctx!.arc(px, py, p.s * 4 * pulseScale, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hu},60%,65%,${0.04 * ease})`;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(px, py, p.s * ease * pulseScale, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hu},60%,70%,${0.6 * ease + 0.1})`;
        ctx!.fill();
      }

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const eA = 1 - Math.pow(1 - a.progress, 3);
          const eB = 1 - Math.pow(1 - b.progress, 3);
          const ax = a.x + (a.tx - a.x) * eA;
          const ay = a.y + (a.ty - a.y) * eA;
          const bx = b.x + (b.tx - b.x) * eB;
          const by = b.y + (b.ty - b.y) * eB;
          const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
          if (d < 90 && a.progress > 0.5 && b.progress > 0.5) {
            ctx!.beginPath();
            ctx!.moveTo(ax, ay);
            ctx!.lineTo(bx, by);
            ctx!.strokeStyle = `hsla(174,50%,60%,${(1 - d / 90) * 0.15})`;
            ctx!.lineWidth = 0.4;
            ctx!.stroke();
          }
        }
      }

      if (frame < 280) {
        animId = requestAnimationFrame(draw);
      }
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [show, setShow] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Initialize sound on first interaction during intro
    const initAndPlay = async () => {
      await soundEngine.init();
      soundEngine.play("intro_rumble");
    };

    // Try to init sound immediately (may need user gesture)
    const handleInteraction = () => {
      initAndPlay();
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    // Also try immediately
    initAndPlay().catch(() => {});

    const t1 = setTimeout(() => {
      setPhase(1);
    }, 500);
    const t2 = setTimeout(() => {
      setPhase(2);
      // Crystallize sound when text appears
      if (soundEngine.initialized) soundEngine.play("crystallize");
    }, 1800);
    const t3 = setTimeout(() => {
      setPhase(3);
    }, 3000);
    const t4 = setTimeout(() => {
      // Whoosh + reveal sound on exit
      if (soundEngine.initialized) {
        soundEngine.play("whoosh");
        soundEngine.play("reveal");
        // Start ambient after intro
        setTimeout(() => soundEngine.play("ambient"), 800);
      }
      setShow(false);
      onCompleteRef.current();
    }, 3800);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 9999, background: "#030308" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <IntroParticles />

          <div className="relative flex flex-col items-center gap-6 z-10">
            {/* Hexagonal logo with orbital dots */}
            <motion.svg
              viewBox="0 0 120 120"
              className="w-28 h-28"
              initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.path
                d="M60 8L108 32v48L60 112 12 88V32z"
                fill="none"
                stroke="#45e8d8"
                strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                filter="url(#glow)"
              />
              <motion.path
                d="M60 28L88 44v24L60 92 32 76V44z"
                fill="none"
                stroke="#a485ff"
                strokeWidth="0.6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
              />
              <motion.path
                d="M60 42L74 50v12L60 70 46 62V50z"
                fill="none"
                stroke="#e8c44a"
                strokeWidth="0.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1.2, delay: 0.7, ease: "easeInOut" }}
              />
              {/* Pulsing center */}
              <motion.circle
                cx="60" cy="60" r="8"
                fill="none"
                stroke="#45e8d8"
                strokeWidth="0.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 2, delay: 0.9, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx="60" cy="60" r="5"
                fill="#45e8d8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 200 }}
              />
              {/* Orbital dots */}
              {[0, 72, 144, 216, 288].map((angle, i) => {
                const r = 38;
                const rad = (angle * Math.PI) / 180;
                const dotCx = 60 + Math.cos(rad) * r;
                const dotCy = 60 + Math.sin(rad) * r;
                const colors = ["#45e8d8", "#a485ff", "#e8c44a", "#ff7eb6", "#f0e8d8"];
                return (
                  <motion.circle
                    key={i}
                    cx={dotCx}
                    cy={dotCy}
                    r="2.5"
                    fill={colors[i]}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ duration: 0.5, delay: 1.1 + i * 0.12, type: "spring", stiffness: 300 }}
                  />
                );
              })}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </motion.svg>

            {/* Text reveals */}
            <div className="text-center">
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={phase >= 1 ? { height: "auto" } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="block text-3xl font-semibold tracking-[0.15em]"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#faf3e3" }}
                >
                  TAMERIAN
                </span>
              </motion.div>
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={phase >= 2 ? { height: "auto" } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="block text-xs tracking-[0.35em] mt-3 uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#45e8d8" }}
                >
                  Where Carbon Meets Crystal
                </span>
              </motion.div>
            </div>

            {/* Loading bar */}
            <motion.div
              className="w-52 h-[2px] mt-5 overflow-hidden relative"
              style={{ background: "rgba(240,232,216,0.06)" }}
            >
              <motion.div
                className="h-full absolute inset-0"
                style={{ background: "linear-gradient(90deg, #45e8d8, #a485ff, #e8c44a, #ff7eb6)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.3, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="absolute top-0 h-full w-12"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                animate={{ left: ["-20%", "120%"] }}
                transition={{ duration: 1.5, repeat: 3, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
