/**
 * CinematicIntro — Interactive Bridge-Building Opening Sequence
 * 
 * A cinematic intro where the user CLICKS to advance each phase.
 * Each phase is slower, more dramatic, with real weight.
 * Phases: Darkness → Pillars Rise → Cables Draw → Deck Builds → Name Reveals → Enter
 * 
 * The user controls the pace. Each click triggers the next phase with
 * sound and animation. The bridge builds as the user engages.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

const PHASE_TEXT = [
  { title: '', subtitle: '', hint: 'Click anywhere to begin' },
  { title: 'The Pillars Rise', subtitle: 'Every bridge begins with a foundation', hint: 'Click to draw the cables' },
  { title: 'The Cables Draw Taut', subtitle: 'Connecting what was once divided', hint: 'Click to build the deck' },
  { title: 'The Deck Takes Shape', subtitle: 'Plank by plank, a path emerges', hint: 'Click to reveal the name' },
  { title: 'TechBridge Collective', subtitle: 'Building bridges of access, dignity, and opportunity', hint: 'Click to enter' },
];

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('tb-intro-seen') === '1';
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Array<{x:number;y:number;vx:number;vy:number;life:number;maxLife:number;size:number;color:string}>>([]);
  const completedRef = useRef(false);
  const soundInitRef = useRef(false);

  // If already dismissed, call onComplete immediately
  useEffect(() => {
    if (dismissed && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [dismissed, onComplete]);

  // Particle system
  useEffect(() => {
    if (dismissed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try { ctx = canvas.getContext('2d'); } catch { return; }
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const addParticle = (x: number, y: number, color: string, count = 3) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x, y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          life: 0,
          maxLife: 80 + Math.random() * 60,
          size: 1 + Math.random() * 2.5,
          color,
        });
      }
    };

    const interval = setInterval(() => {
      const w = canvas.width;
      const h = canvas.height;
      if (phase >= 1) {
        addParticle(Math.random() * w, h * 0.5 + Math.random() * h * 0.3, 'rgba(201, 162, 39, 0.6)', 2);
      }
      if (phase >= 2) {
        addParticle(Math.random() * w, h * 0.3 + Math.random() * h * 0.2, 'rgba(45, 106, 79, 0.5)', 2);
      }
      if (phase >= 4) {
        addParticle(w * 0.3 + Math.random() * w * 0.4, h * 0.4 + Math.random() * h * 0.2, 'rgba(253, 248, 240, 0.4)', 1);
      }
    }, 100);

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        if (p.life > p.maxLife) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.008;
        const alpha = 1 - p.life / p.maxLife;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx!.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.7})`);
        ctx!.fill();
        return true;
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(interval);
      cancelAnimationFrame(animRef.current);
    };
  }, [dismissed, phase]);

  // Safety timer — force complete after 60 seconds (generous for interactive)
  useEffect(() => {
    if (dismissed) return;
    const safetyTimer = setTimeout(() => {
      if (!completedRef.current) {
        sessionStorage.setItem('tb-intro-seen', '1');
        completedRef.current = true;
        setDismissed(true);
        onComplete();
      }
    }, 60000);
    return () => clearTimeout(safetyTimer);
  }, [dismissed, onComplete]);

  // Handle click to advance phase
  const handleAdvance = useCallback(() => {
    // Init sound on first interaction
    if (!soundInitRef.current) {
      tbSoundEngine.init();
      soundInitRef.current = true;
    }

    if (phase < 4) {
      const nextPhase = phase + 1;
      setPhase(nextPhase);

      // Play appropriate sound for each phase
      switch (nextPhase) {
        case 1: tbSoundEngine.play('bridge_plank'); break;
        case 2: tbSoundEngine.play('bridge_cable'); break;
        case 3: tbSoundEngine.play('intro_advance'); break;
        case 4: tbSoundEngine.play('bridge_complete'); break;
      }
    } else {
      // Phase 4 → complete
      sessionStorage.setItem('tb-intro-seen', '1');
      completedRef.current = true;
      tbSoundEngine.play('section_enter');
      setDismissed(true);
      onComplete();
    }
  }, [phase, onComplete]);

  const skip = useCallback(() => {
    if (completedRef.current) return;
    sessionStorage.setItem('tb-intro-seen', '1');
    completedRef.current = true;
    setDismissed(true);
    tbSoundEngine.init();
    onComplete();
  }, [onComplete]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
        style={{ background: '#0a1f14' }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        onClick={handleAdvance}
      >
        {/* Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }} />

        {/* Radial glow — grows with each phase */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center 60%, rgba(201, 162, 39, 0.1) 0%, transparent 70%)',
          }}
          animate={{ opacity: phase >= 1 ? 0.3 + phase * 0.15 : 0 }}
          transition={{ duration: 2 }}
        />

        {/* Bridge SVG Animation — Slower, more dramatic */}
        <div className="relative z-10 w-full max-w-3xl px-8">
          <svg viewBox="0 0 800 300" className="w-full" style={{ filter: `drop-shadow(0 0 ${10 + phase * 8}px rgba(201, 162, 39, ${0.15 + phase * 0.08}))` }}>
            {/* Water reflection */}
            <motion.rect
              x="0" y="240" width="800" height="60"
              fill="url(#waterGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 0.4 : 0 }}
              transition={{ duration: 2 }}
            />

            {/* Left pillar — rises slowly */}
            <motion.rect
              x="120" y="100" width="30" height="140" rx="4"
              fill="#C9A227"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '135px 240px' }}
            />
            
            {/* Right pillar */}
            <motion.rect
              x="650" y="100" width="30" height="140" rx="4"
              fill="#C9A227"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '665px 240px' }}
            />

            {/* Tower tops — emerge after pillars */}
            <motion.rect
              x="115" y="85" width="40" height="20" rx="3"
              fill="#2D6A4F"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 15 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            />
            <motion.rect
              x="645" y="85" width="40" height="20" rx="3"
              fill="#2D6A4F"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 15 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            />

            {/* Main cables — draw slowly */}
            <motion.path
              d="M135 90 Q 400 20 665 90"
              stroke="#C9A227" strokeWidth="3" fill="none" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M135 95 Q 400 30 665 95"
              stroke="rgba(201, 162, 39, 0.4)" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Vertical suspender cables — appear one by one */}
            {[200, 270, 340, 400, 460, 530, 600].map((x, i) => {
              const cableY = 90 - Math.sin(((x - 135) / 530) * Math.PI) * 55;
              return (
                <motion.line
                  key={x}
                  x1={x} y1={cableY + 5} x2={x} y2={200}
                  stroke="rgba(201, 162, 39, 0.5)" strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: phase >= 2 ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.15 }}
                />
              );
            })}

            {/* Bridge deck — extends slowly from left to right */}
            <motion.rect
              x="135" y="195" width="530" height="12" rx="2"
              fill="#2D6A4F"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 3 ? 1 : 0 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '135px 201px' }}
            />

            {/* Deck planks — appear one by one */}
            {Array.from({ length: 20 }, (_, i) => (
              <motion.rect
                key={i}
                x={145 + i * 26} y="197" width="3" height="8" rx="1"
                fill="rgba(201, 162, 39, 0.3)"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 3 ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
              />
            ))}

            {/* Railing */}
            <motion.line
              x1="135" y1="190" x2="665" y2="190"
              stroke="rgba(201, 162, 39, 0.3)" strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase >= 3 ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            />

            {/* Walking figures on completed bridge */}
            {phase >= 4 && (
              <>
                <motion.circle
                  cx="250" cy="188" r="4" fill="#FDF8F0"
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.8, x: 0 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
                <motion.circle
                  cx="400" cy="188" r="4" fill="#FDF8F0"
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.6, x: 0 }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                />
                <motion.circle
                  cx="550" cy="188" r="4" fill="#FDF8F0"
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.7, x: 0 }}
                  transition={{ duration: 1.5, delay: 0.9 }}
                />
              </>
            )}

            {/* Glow effect on bridge when complete */}
            {phase >= 4 && (
              <motion.rect
                x="135" y="192" width="530" height="18" rx="4"
                fill="url(#bridgeGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}

            <defs>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B4332" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0a1f14" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="bridgeGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C9A227" stopOpacity="0" />
                <stop offset="50%" stopColor="#C9A227" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Phase text — title + subtitle */}
          <motion.div
            className="text-center mt-8"
            key={`text-${phase}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {phase === 4 ? (
              <>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: '#C9A227' }}>
                  {PHASE_TEXT[phase].title}
                </h1>
                <p className="text-sm md:text-base mt-3 font-display italic" style={{ color: 'rgba(253, 248, 240, 0.7)' }}>
                  {PHASE_TEXT[phase].subtitle}
                </p>
              </>
            ) : (
              <>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#FDF8F0' }}>
                  {PHASE_TEXT[phase].title}
                </h2>
                {PHASE_TEXT[phase].subtitle && (
                  <p className="text-sm md:text-base mt-2 font-display italic" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>
                    {PHASE_TEXT[phase].subtitle}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>

        {/* Click hint — pulsing at bottom center */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          key={`hint-${phase}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: phase === 0 ? 0.5 : 1.5, duration: 0.8 }}
        >
          <motion.p
            className="text-sm font-mono tracking-wider"
            style={{ color: 'rgba(201, 162, 39, 0.7)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {PHASE_TEXT[phase].hint}
          </motion.p>
          <motion.svg
            width="24" height="24" viewBox="0 0 24 24" fill="none"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <circle cx="12" cy="12" r="10" stroke="rgba(201, 162, 39, 0.3)" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="3" fill="rgba(201, 162, 39, 0.6)" />
          </motion.svg>
        </motion.div>

        {/* Skip button */}
        <motion.button
          className="absolute top-6 right-6 px-4 py-2 rounded-lg text-xs font-mono transition-all hover:scale-105 z-20"
          style={{ color: 'rgba(253, 248, 240, 0.3)', border: '1px solid rgba(253, 248, 240, 0.1)' }}
          onClick={(e) => { e.stopPropagation(); skip(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ color: 'rgba(253, 248, 240, 0.8)', borderColor: 'rgba(201, 162, 39, 0.4)' }}
        >
          Skip intro →
        </motion.button>

        {/* Phase indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {[0, 1, 2, 3, 4].map((p) => (
            <motion.div
              key={p}
              className="rounded-full"
              style={{
                width: phase === p ? 24 : 8,
                height: 8,
                background: phase >= p ? '#C9A227' : 'rgba(253, 248, 240, 0.12)',
                borderRadius: 4,
              }}
              animate={{
                width: phase === p ? 24 : 8,
                background: phase >= p ? '#C9A227' : 'rgba(253, 248, 240, 0.12)',
              }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
