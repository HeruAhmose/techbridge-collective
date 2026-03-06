import { useEffect, useRef, useState } from 'react';

/**
 * Animated SVG Bridge that builds progressively as the user scrolls.
 * Inspired by Horace King's bridge architecture — arched stone/iron bridge
 * with cables that draw themselves into existence.
 */
interface BridgeSVGProps {
  progress: number; // 0 to 1
  className?: string;
}

export default function BridgeSVG({ progress, className = '' }: BridgeSVGProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Bridge components appear at different scroll thresholds
  const foundationOpacity = Math.min(1, clampedProgress * 5); // 0-20%
  const archProgress = Math.max(0, Math.min(1, (clampedProgress - 0.1) * 3)); // 10-43%
  const deckOpacity = Math.max(0, Math.min(1, (clampedProgress - 0.3) * 4)); // 30-55%
  const cableProgress = Math.max(0, Math.min(1, (clampedProgress - 0.4) * 3)); // 40-73%
  const detailOpacity = Math.max(0, Math.min(1, (clampedProgress - 0.6) * 3)); // 60-93%
  const glowOpacity = Math.max(0, Math.min(1, (clampedProgress - 0.8) * 5)); // 80-100%

  return (
    <svg
      viewBox="0 0 1200 300"
      className={`w-full ${className}`}
      style={{ filter: `drop-shadow(0 4px 20px rgba(27, 67, 50, ${0.1 + glowOpacity * 0.15}))` }}
    >
      <defs>
        <linearGradient id="bridgeGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A227" />
          <stop offset="50%" stopColor="#E8C84A" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
        <linearGradient id="bridgeForest" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#1B4332" />
        </linearGradient>
        <linearGradient id="bridgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(201,162,39,0)" />
          <stop offset="50%" stopColor="rgba(201,162,39,0.6)" />
          <stop offset="100%" stopColor="rgba(201,162,39,0)" />
        </linearGradient>
        <filter id="warmGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Water / ground line */}
      <rect x="0" y="260" width="1200" height="40" fill="#1B4332" opacity={foundationOpacity * 0.15} rx="2" />

      {/* Left bank */}
      <g opacity={foundationOpacity}>
        <path d="M0 200 L0 260 L180 260 L180 220 Q180 200 160 200 Z" fill="url(#bridgeForest)" />
        <rect x="140" y="180" width="40" height="80" fill="#1B4332" rx="3" />
        <rect x="145" y="175" width="30" height="10" fill="url(#bridgeGold)" rx="2" />
      </g>

      {/* Right bank */}
      <g opacity={foundationOpacity}>
        <path d="M1200 200 L1200 260 L1020 260 L1020 220 Q1020 200 1040 200 Z" fill="url(#bridgeForest)" />
        <rect x="1020" y="180" width="40" height="80" fill="#1B4332" rx="3" />
        <rect x="1025" y="175" width="30" height="10" fill="url(#bridgeGold)" rx="2" />
      </g>

      {/* Main arch */}
      <g opacity={archProgress}>
        <path
          d={`M180 220 Q600 ${80 + (1 - archProgress) * 60} 1020 220`}
          fill="none"
          stroke="url(#bridgeForest)"
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: 1200 * (1 - archProgress),
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />
        {/* Secondary arch */}
        <path
          d={`M200 230 Q600 ${120 + (1 - archProgress) * 40} 1000 230`}
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="4"
          strokeLinecap="round"
          opacity={0.6}
          style={{
            strokeDasharray: 1100,
            strokeDashoffset: 1100 * (1 - archProgress),
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />
      </g>

      {/* Bridge deck */}
      <g opacity={deckOpacity}>
        <rect x="160" y="215" width={880 * deckOpacity} height="10" fill="url(#bridgeGold)" rx="2" />
        <rect x="160" y="228" width={880 * deckOpacity} height="3" fill="#C9A227" opacity="0.5" rx="1" />
      </g>

      {/* Vertical supports / cables */}
      <g opacity={cableProgress}>
        {[280, 380, 480, 580, 680, 780, 880].map((x, i) => {
          const archY = 220 - Math.sin(((x - 180) / 840) * Math.PI) * 100 * archProgress;
          const delay = i * 0.08;
          const individualProgress = Math.max(0, Math.min(1, (cableProgress - delay) * 3));
          return (
            <g key={x} opacity={individualProgress}>
              <line
                x1={x} y1={215}
                x2={x} y2={archY}
                stroke="#C9A227"
                strokeWidth="2"
                opacity={0.7}
              />
              <circle cx={x} cy={archY} r="3" fill="#C9A227" />
              <circle cx={x} cy={215} r="2" fill="#1B4332" />
            </g>
          );
        })}
      </g>

      {/* Decorative details — railing */}
      <g opacity={detailOpacity}>
        <line x1="180" y1="208" x2={180 + 840 * detailOpacity} y2="208" stroke="#2D6A4F" strokeWidth="2" />
        {[230, 330, 430, 530, 630, 730, 830, 930].map((x) => (
          <line key={x} x1={x} y1="208" x2={x} y2="215" stroke="#2D6A4F" strokeWidth="1.5" opacity={detailOpacity} />
        ))}
      </g>

      {/* Golden glow when bridge is complete */}
      <g opacity={glowOpacity} filter="url(#warmGlow)">
        <rect x="180" y="213" width="840" height="6" fill="url(#bridgeGlow)" rx="3" />
      </g>

      {/* Labels on each side */}
      <g opacity={foundationOpacity}>
        <text x="90" y="195" textAnchor="middle" fill="#1B4332" fontSize="11" fontWeight="600" fontFamily="var(--font-display)">
          The Gap
        </text>
      </g>
      <g opacity={glowOpacity}>
        <text x="1110" y="195" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="600" fontFamily="var(--font-display)">
          Connected
        </text>
      </g>
    </svg>
  );
}
