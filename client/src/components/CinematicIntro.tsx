/**
 * CinematicIntro — Bridge-Building Opening Sequence
 * 
 * A cinematic 5-second intro where a bridge builds itself plank by plank,
 * cables draw taut, and the TechBridge name reveals with golden light.
 * Procedural 4K sound accompanies each visual beat.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0); // 0=dark, 1=pillars, 2=cables, 3=deck, 4=name, 5=done
  const [dismissed, setDismissed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Array<{x:number;y:number;vx:number;vy:number;life:number;maxLife:number;size:number;color:string}>>([]);

  // Check if user has seen intro before (session only)
  useEffect(() => {
    const seen = sessionStorage.getItem('tb-intro-seen');
    if (seen) {
      setDismissed(true);
      onComplete();
      return;
    }
  }, [onComplete]);

  // Particle system
  useEffect(() => {
    if (dismissed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const addParticle = (x: number, y: number, color: string) => {
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x, y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 0,
          maxLife: 60 + Math.random() * 40,
          size: 1 + Math.random() * 2,
          color,
        });
      }
    };

    // Ambient particles
    const interval = setInterval(() => {
      if (phase >= 1) {
        const w = canvas.width;
        const h = canvas.height;
        addParticle(Math.random() * w, h * 0.5 + Math.random() * h * 0.3, 'rgba(201, 162, 39, 0.6)');
        if (phase >= 2) {
          addParticle(Math.random() * w, h * 0.3 + Math.random() * h * 0.2, 'rgba(45, 106, 79, 0.5)');
        }
      }
    }, 80);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        if (p.life > p.maxLife) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.01;
        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.8})`);
        ctx.fill();
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

  // Phase progression
  useEffect(() => {
    if (dismissed) return;
    
    // Init sound on first interaction or auto
    tbSoundEngine.init();

    const timers = [
      setTimeout(() => { setPhase(1); tbSoundEngine.play('bridge_plank'); }, 400),
      setTimeout(() => { setPhase(2); tbSoundEngine.play('bridge_cable'); }, 1400),
      setTimeout(() => { setPhase(3); tbSoundEngine.play('bridge_plank'); }, 2400),
      setTimeout(() => { setPhase(4); tbSoundEngine.play('bridge_complete'); }, 3400),
      setTimeout(() => { setPhase(5); }, 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [dismissed]);

  // Auto-complete after phase 5
  useEffect(() => {
    if (phase === 5) {
      sessionStorage.setItem('tb-intro-seen', '1');
      const t = setTimeout(() => {
        setDismissed(true);
        onComplete();
      }, 600);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const skip = useCallback(() => {
    sessionStorage.setItem('tb-intro-seen', '1');
    setDismissed(true);
    tbSoundEngine.init();
    onComplete();
  }, [onComplete]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: '#0a1f14' }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.7 }} />

        {/* Radial glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center 60%, rgba(201, 162, 39, 0.08) 0%, transparent 70%)',
          }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        />

        {/* Bridge SVG Animation */}
        <div className="relative z-10 w-full max-w-3xl px-8">
          <svg viewBox="0 0 800 300" className="w-full" style={{ filter: 'drop-shadow(0 0 20px rgba(201, 162, 39, 0.3))' }}>
            {/* Water reflection */}
            <motion.rect
              x="0" y="240" width="800" height="60"
              fill="url(#waterGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 0.3 : 0 }}
              transition={{ duration: 1 }}
            />

            {/* Left pillar */}
            <motion.rect
              x="120" y="100" width="30" height="140" rx="4"
              fill="#C9A227"
              initial={{ scaleY: 0, originY: '100%' }}
              animate={{ scaleY: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '135px 240px' }}
            />
            
            {/* Right pillar */}
            <motion.rect
              x="650" y="100" width="30" height="140" rx="4"
              fill="#C9A227"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '665px 240px' }}
            />

            {/* Tower tops */}
            <motion.rect
              x="115" y="85" width="40" height="20" rx="3"
              fill="#2D6A4F"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 10 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
            <motion.rect
              x="645" y="85" width="40" height="20" rx="3"
              fill="#2D6A4F"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 10 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />

            {/* Main cables */}
            <motion.path
              d="M135 90 Q 400 20 665 90"
              stroke="#C9A227" strokeWidth="3" fill="none" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M135 95 Q 400 30 665 95"
              stroke="rgba(201, 162, 39, 0.4)" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Vertical suspender cables */}
            {[200, 270, 340, 400, 460, 530, 600].map((x, i) => {
              const cableY = 90 - Math.sin(((x - 135) / 530) * Math.PI) * 55;
              return (
                <motion.line
                  key={x}
                  x1={x} y1={cableY + 5} x2={x} y2={200}
                  stroke="rgba(201, 162, 39, 0.5)" strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: phase >= 2 ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                />
              );
            })}

            {/* Bridge deck */}
            <motion.rect
              x="135" y="195" width="530" height="12" rx="2"
              fill="#2D6A4F"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 3 ? 1 : 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: '135px 201px' }}
            />

            {/* Deck planks */}
            {Array.from({ length: 20 }, (_, i) => (
              <motion.rect
                key={i}
                x={145 + i * 26} y="197" width="3" height="8" rx="1"
                fill="rgba(201, 162, 39, 0.3)"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 3 ? 1 : 0 }}
                transition={{ duration: 0.2, delay: 0.3 + i * 0.04 }}
              />
            ))}

            {/* Railing */}
            <motion.line
              x1="135" y1="190" x2="665" y2="190"
              stroke="rgba(201, 162, 39, 0.3)" strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: phase >= 3 ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />

            {/* Walking figures on completed bridge */}
            {phase >= 4 && (
              <>
                <motion.circle
                  cx="300" cy="188" r="4" fill="#FDF8F0"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.circle
                  cx="420" cy="188" r="4" fill="#FDF8F0"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <motion.circle
                  cx="520" cy="188" r="4" fill="#FDF8F0"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
              </>
            )}

            <defs>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B4332" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0a1f14" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Title reveal */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: '#C9A227' }}>
              TechBridge Collective
            </h1>
            <motion.p
              className="text-sm md:text-base mt-3 font-display italic"
              style={{ color: 'rgba(253, 248, 240, 0.6)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 4 ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Building bridges of access, dignity, and opportunity
            </motion.p>
          </motion.div>
        </div>

        {/* Skip button */}
        <motion.button
          className="absolute bottom-8 right-8 px-4 py-2 rounded-lg text-xs font-mono transition-all hover:scale-105"
          style={{ color: 'rgba(253, 248, 240, 0.4)', border: '1px solid rgba(253, 248, 240, 0.15)' }}
          onClick={skip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ color: 'rgba(253, 248, 240, 0.8)', borderColor: 'rgba(201, 162, 39, 0.4)' }}
        >
          Skip intro
        </motion.button>

        {/* Phase indicator dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3, 4].map((p) => (
            <motion.div
              key={p}
              className="w-2 h-2 rounded-full"
              style={{ background: phase >= p ? '#C9A227' : 'rgba(253, 248, 240, 0.15)' }}
              animate={{ scale: phase === p ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
