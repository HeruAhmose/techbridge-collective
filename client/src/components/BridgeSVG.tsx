import { useId } from "react";

/**
 * TechBridge's visual thesis: community infrastructure becomes visible as a
 * bridge that is built, activated, and then carries practical capability.
 */
interface BridgeSVGProps {
  progress: number;
  className?: string;
}

const FLOW_LABELS = ["ACCESS", "NAVIGATION", "SKILLS", "TRUST", "OPPORTUNITY"] as const;

export default function BridgeSVG({ progress, className = "" }: BridgeSVGProps) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    gold: `${uid}-bridge-gold`,
    forest: `${uid}-bridge-forest`,
    glow: `${uid}-bridge-glow`,
    haze: `${uid}-bridge-haze`,
    warmGlow: `${uid}-warm-glow`,
  };

  const p = Math.max(0, Math.min(1, progress));
  const foundation = Math.min(1, p * 5);
  const arch = Math.max(0, Math.min(1, (p - 0.08) * 3.2));
  const deck = Math.max(0, Math.min(1, (p - 0.28) * 4));
  const cables = Math.max(0, Math.min(1, (p - 0.4) * 3));
  const network = Math.max(0, Math.min(1, (p - 0.55) * 3));
  const flow = Math.max(0, Math.min(1, (p - 0.7) * 3.4));

  return (
    <svg
      viewBox="0 0 1200 360"
      className={`w-full ${className}`}
      role="img"
      aria-labelledby={`${uid}-title ${uid}-desc`}
      style={{
        filter: `drop-shadow(0 18px 46px rgba(27, 67, 50, ${0.12 + flow * 0.16}))`,
      }}
    >
      <title id={`${uid}-title`}>TechBridge community infrastructure bridge</title>
      <desc id={`${uid}-desc`}>
        An animated bridge turns digital access, navigation, skills, trust, and opportunity into visible flows between community need and practical capability.
      </desc>

      <defs>
        <linearGradient id={ids.gold} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9E7B18" />
          <stop offset="48%" stopColor="#F0D36A" />
          <stop offset="100%" stopColor="#B89320" />
        </linearGradient>
        <linearGradient id={ids.forest} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#40916C" />
          <stop offset="100%" stopColor="#163B2D" />
        </linearGradient>
        <linearGradient id={ids.glow} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0" />
          <stop offset="50%" stopColor="#F5DD7C" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={ids.haze} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8C84A" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#E8C84A" stopOpacity="0" />
        </radialGradient>
        <filter id={ids.warmGlow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="600" cy="226" rx="470" ry="118" fill={`url(#${ids.haze})`} opacity={flow * 0.9} />

      <g opacity={foundation}>
        <path d="M0 236 L0 332 L185 332 L185 270 Q185 244 158 238 Z" fill={`url(#${ids.forest})`} />
        <path d="M1200 236 L1200 332 L1015 332 L1015 270 Q1015 244 1042 238 Z" fill={`url(#${ids.forest})`} />
        {[154, 1026].map(x => (
          <g key={x}>
            <rect x={x - 22} y="210" width="44" height="122" rx="8" fill="#163B2D" />
            <rect x={x - 17} y="202" width="34" height="12" rx="4" fill={`url(#${ids.gold})`} />
          </g>
        ))}
      </g>

      <path
        d={`M176 272 Q600 ${96 + (1 - arch) * 72} 1024 272`}
        fill="none"
        stroke={`url(#${ids.forest})`}
        strokeWidth="10"
        strokeLinecap="round"
        opacity={arch}
        style={{ strokeDasharray: 1200, strokeDashoffset: 1200 * (1 - arch) }}
      />
      <path
        d={`M200 286 Q600 ${142 + (1 - arch) * 46} 1000 286`}
        fill="none"
        stroke="#52A37E"
        strokeWidth="3"
        strokeLinecap="round"
        opacity={arch * 0.58}
        style={{ strokeDasharray: 1100, strokeDashoffset: 1100 * (1 - arch) }}
      />

      <g opacity={deck}>
        <rect x="164" y="263" width={872 * deck} height="12" rx="5" fill={`url(#${ids.gold})`} />
        <rect x="164" y="279" width={872 * deck} height="3" rx="2" fill="#E8C84A" opacity="0.36" />
      </g>

      <g opacity={cables}>
        {[264, 348, 432, 516, 600, 684, 768, 852, 936].map((x, i) => {
          const archY = 272 - Math.sin(((x - 176) / 848) * Math.PI) * 124 * arch;
          const individual = Math.max(0, Math.min(1, (cables - i * 0.045) * 2.4));
          return (
            <g key={x} opacity={individual}>
              <line x1={x} y1="263" x2={x} y2={archY} stroke="#D7B945" strokeWidth="1.6" opacity="0.72" />
              <circle cx={x} cy={archY} r="3" fill="#E8C84A" />
              <circle cx={x} cy="263" r="2.2" fill="#245641" />
            </g>
          );
        })}
      </g>

      <g opacity={network}>
        {FLOW_LABELS.map((label, i) => {
          const x = 300 + i * 150;
          return (
            <g key={label}>
              <circle cx={x} cy="244" r="10" fill="#07110D" stroke="#D4B542" strokeWidth="1.5" />
              <circle cx={x} cy="244" r="3" fill="#E8C84A" />
              <text x={x} y="318" textAnchor="middle" fill="#5D7569" fontSize="9" fontWeight="700" letterSpacing="1.7" fontFamily="var(--font-mono, ui-monospace)">
                {label}
              </text>
            </g>
          );
        })}
      </g>

      <g opacity={flow}>
        <path d="M190 257 C360 230 470 292 600 253 C730 214 846 283 1010 252" fill="none" stroke={`url(#${ids.glow})`} strokeWidth="3" filter={`url(#${ids.warmGlow})`} />
        {[0, 1, 2, 3].map(i => (
          <circle key={i} r="5" fill="#F5DD7C" filter={`url(#${ids.warmGlow})`}>
            <animateMotion
              dur={`${5.2 + i * 0.55}s`}
              begin={`${i * -1.15}s`}
              repeatCount="indefinite"
              path="M190 257 C360 230 470 292 600 253 C730 214 846 283 1010 252"
            />
          </circle>
        ))}
      </g>

      <g opacity={foundation}>
        <text x="90" y="215" textAnchor="middle" fill="#224E3B" fontSize="10" fontWeight="700" letterSpacing="1.4" fontFamily="var(--font-mono, ui-monospace)">
          COMMUNITY NEED
        </text>
        <text x="90" y="231" textAnchor="middle" fill="#60796C" fontSize="9" fontFamily="var(--font-display)">
          devices · access · confidence
        </text>
      </g>
      <g opacity={flow}>
        <text x="1110" y="215" textAnchor="middle" fill="#B89320" fontSize="10" fontWeight="700" letterSpacing="1.4" fontFamily="var(--font-mono, ui-monospace)">
          PRACTICAL CAPABILITY
        </text>
        <text x="1110" y="231" textAnchor="middle" fill="#8A7332" fontSize="9" fontFamily="var(--font-display)">
          agency · work · services
        </text>
      </g>

      <g opacity={flow * 0.8}>
        <text x="600" y="66" textAnchor="middle" fill="#183E2E" fontSize="10" fontWeight="800" letterSpacing="2.5" fontFamily="var(--font-mono, ui-monospace)">
          DIGITAL EQUITY AS INFRASTRUCTURE
        </text>
        <text x="600" y="86" textAnchor="middle" fill="#6F735D" fontSize="10" fontFamily="var(--font-display)">
          Human support is the span. Measurable outcomes are the load path.
        </text>
      </g>
    </svg>
  );
}
