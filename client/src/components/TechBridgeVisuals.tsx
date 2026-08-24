import { motion } from "framer-motion";
import BridgeSVG from "./BridgeSVG";

function NetworkGrid({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage:
          "linear-gradient(rgba(0,212,170,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,.35) 1px, transparent 1px)",
        backgroundSize: "54px 54px",
        maskImage:
          "linear-gradient(to bottom, transparent 2%, black 28%, black 72%, transparent 98%)",
      }}
      aria-hidden="true"
    />
  );
}

export function HKIdentityMark({
  size = "md",
  showLabel = false,
}: {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const dimensions =
    size === "lg" ? "h-24 w-24" : size === "sm" ? "h-10 w-10" : "h-14 w-14";
  const labelSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-[10px]" : "text-sm";

  return (
    <div
      className="flex items-center gap-3"
      aria-label="H.K. Help Desk Architect"
    >
      <motion.div
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full ${dimensions}`}
        style={{
          background:
            "radial-gradient(circle at 32% 24%, rgba(232,185,49,.35), transparent 34%), radial-gradient(circle at 70% 72%, rgba(0,212,170,.18), transparent 42%), linear-gradient(145deg, #214f3c, #07110d)",
          border: "1.5px solid rgba(232,185,49,.82)",
          boxShadow:
            "inset 0 0 28px rgba(232,185,49,.08), 0 0 28px rgba(232,185,49,.14)",
        }}
        animate={{
          boxShadow: [
            "inset 0 0 28px rgba(232,185,49,.08), 0 0 20px rgba(232,185,49,.10)",
            "inset 0 0 28px rgba(232,185,49,.10), 0 0 34px rgba(0,212,170,.14)",
            "inset 0 0 28px rgba(232,185,49,.08), 0 0 20px rgba(232,185,49,.10)",
          ],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          className={`${labelSize} font-bold`}
          style={{ color: "#F0D36A", letterSpacing: "0.14em" }}
        >
          HK
        </span>
        <svg
          className="absolute bottom-[13%] left-1/2 -translate-x-1/2"
          width="72%"
          height="18%"
          viewBox="0 0 56 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 8h52M4 8C9 0 17 0 22 8M22 8C27 0 35 0 40 8M40 8c4-5 8-6 12-3"
            stroke="#D8B84A"
            strokeWidth="1.15"
            strokeLinecap="round"
            opacity=".9"
          />
        </svg>
        <span
          className="absolute right-[11%] top-[12%] h-2 w-2 rounded-full"
          style={{
            background: "#34D399",
            boxShadow: "0 0 10px rgba(52,211,153,.8)",
          }}
          aria-hidden="true"
        />
      </motion.div>
      {showLabel && (
        <div className="min-w-0 text-left">
          <p
            className="font-display text-sm font-bold"
            style={{ color: "var(--tb-cream)" }}
          >
            H.K.
          </p>
          <p
            className="text-[10px] font-mono uppercase tracking-[0.13em]"
            style={{ color: "rgba(0,212,170,.72)" }}
          >
            Help Desk Architect
          </p>
        </div>
      )}
    </div>
  );
}

export function HeroInfrastructureBackdrop() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 72% 34%, rgba(0,212,170,.16), transparent 25%), radial-gradient(circle at 28% 68%, rgba(232,185,49,.12), transparent 28%), linear-gradient(135deg, #07110d 0%, #0a1f14 48%, #102d21 100%)",
      }}
      aria-hidden="true"
    >
      <NetworkGrid opacity={0.22} />
      <div className="absolute inset-x-[-12%] bottom-[-4%] opacity-75 md:bottom-[1%]">
        <BridgeSVG progress={1} />
      </div>
      <motion.div
        className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full border"
        style={{ borderColor: "rgba(232,185,49,.13)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.45, 0.22] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[12%] top-[16%] h-56 w-56 rounded-full border"
        style={{ borderColor: "rgba(0,212,170,.12)" }}
        animate={{ scale: [1.08, 0.96, 1.08], opacity: [0.18, 0.38, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function NavigatorInfrastructureBackdrop() {
  const nodes = [
    [14, 66],
    [28, 44],
    [44, 58],
    [58, 30],
    [72, 52],
    [86, 34],
    [92, 68],
  ];
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 72% 48%, rgba(0,212,170,.18), transparent 26%), linear-gradient(110deg, #07110d, #123828 70%, #0a1f14)",
      }}
      aria-hidden="true"
    >
      <NetworkGrid opacity={0.16} />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M8 78 C24 50, 34 62, 47 42 S72 28, 95 58"
          fill="none"
          stroke="rgba(232,185,49,.48)"
          strokeWidth=".75"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M12 84 C34 78, 46 60, 61 68 S82 78, 96 50"
          fill="none"
          stroke="rgba(0,212,170,.36)"
          strokeWidth=".65"
          vectorEffect="non-scaling-stroke"
        />
        {nodes.map(([x, y], i) => (
          <g key={`${x}-${y}`}>
            <circle
              cx={x}
              cy={y}
              r="1.2"
              fill={i % 2 ? "#E8B931" : "#00D4AA"}
              opacity=".85"
            />
            <circle
              cx={x}
              cy={y}
              r="3.5"
              fill="none"
              stroke={i % 2 ? "rgba(232,185,49,.22)" : "rgba(0,212,170,.2)"}
              strokeWidth=".45"
            />
          </g>
        ))}
      </svg>
      <div
        className="absolute right-[9%] top-1/2 -translate-y-1/2 rounded-2xl p-5 backdrop-blur-sm"
        style={{
          background: "rgba(7,17,13,.48)",
          border: "1px solid rgba(0,212,170,.13)",
        }}
      >
        <div className="grid grid-cols-2 gap-2 opacity-65">
          {["LISTEN", "GUIDE", "VERIFY", "RETURN"].map(label => (
            <span
              key={label}
              className="rounded-md px-2 py-1 text-[9px] font-mono tracking-[.15em]"
              style={{
                color: "#8FE0C8",
                border: "1px solid rgba(0,212,170,.16)",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HubInfrastructureVisual({
  index,
  label,
}: {
  index: number;
  label: string;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      role="img"
      aria-label={`${label} pilot location concept visual`}
      style={{
        background:
          index % 2 === 0
            ? "radial-gradient(circle at 68% 25%, rgba(0,212,170,.18), transparent 28%), linear-gradient(145deg,#0a1f14,#173d2d)"
            : "radial-gradient(circle at 32% 25%, rgba(232,185,49,.15), transparent 28%), linear-gradient(145deg,#102d21,#07110d)",
      }}
    >
      <NetworkGrid opacity={0.12} />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 190"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d="M0 154H400" stroke="rgba(232,185,49,.30)" />
        <path
          d="M52 154V96h72v58M138 154V72h98v82M252 154V106h92v48"
          fill="none"
          stroke="rgba(253,248,240,.42)"
          strokeWidth="2"
        />
        <path
          d="M160 72l27-24 27 24M282 106l16-18 16 18"
          fill="none"
          stroke="rgba(232,185,49,.65)"
          strokeWidth="2"
        />
        {[72, 96, 160, 187, 214, 276, 304, 328].map((x, i) => (
          <rect
            key={x}
            x={x}
            y={i > 4 ? 120 : i > 1 ? 92 : 112}
            width="10"
            height="14"
            rx="2"
            fill={i % 2 ? "rgba(0,212,170,.55)" : "rgba(232,185,49,.48)"}
          />
        ))}
        <circle
          cx={index % 2 === 0 ? 187 : 298}
          cy="49"
          r="6"
          fill="#00D4AA"
          opacity=".85"
        />
        <circle
          cx={index % 2 === 0 ? 187 : 298}
          cy="49"
          r="18"
          fill="none"
          stroke="rgba(0,212,170,.24)"
        />
      </svg>
      <div
        className="absolute bottom-4 left-5 rounded-full px-3 py-1 text-[9px] font-mono uppercase tracking-[.16em]"
        style={{
          color: "rgba(253,248,240,.72)",
          background: "rgba(7,17,13,.58)",
          border: "1px solid rgba(232,185,49,.16)",
        }}
      >
        Pilot location · concept visual
      </div>
    </div>
  );
}

export function SpanInfrastructureBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <NetworkGrid opacity={0.08} />
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <path
          d="M40 480 C190 170 330 500 500 250 S800 120 960 350"
          fill="none"
          stroke="#E8B931"
          strokeWidth="2"
        />
        <path
          d="M60 180 C250 360 370 110 540 330 S810 480 950 210"
          fill="none"
          stroke="#00D4AA"
          strokeWidth="1.5"
        />
        {[120, 250, 390, 520, 650, 780, 900].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={i % 2 ? 325 : 275}
            r="6"
            fill={i % 2 ? "#00D4AA" : "#E8B931"}
          />
        ))}
      </svg>
    </div>
  );
}

export function SuccessInfrastructureBackdrop() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 22% 48%, rgba(232,185,49,.20), transparent 22%), radial-gradient(circle at 75% 44%, rgba(0,212,170,.14), transparent 28%), linear-gradient(120deg,#07110d,#143b2b 64%,#0a1f14)",
      }}
      aria-hidden="true"
    >
      <NetworkGrid opacity={0.12} />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M70 310 C250 210 340 330 510 220 S820 140 1120 220"
          fill="none"
          stroke="rgba(232,185,49,.52)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M70 330 C260 260 370 360 530 250 S830 175 1120 245"
          fill="none"
          stroke="rgba(0,212,170,.24)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="1090" cy="220" r="12" fill="#E8B931" />
        <circle
          cx="1090"
          cy="220"
          r="34"
          fill="none"
          stroke="rgba(232,185,49,.26)"
          strokeWidth="2"
        />
        <circle
          cx="1090"
          cy="220"
          r="58"
          fill="none"
          stroke="rgba(232,185,49,.12)"
        />
      </svg>
    </div>
  );
}
