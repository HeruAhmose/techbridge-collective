/**
 * SoundToggle — Animated sound mute/unmute button
 * Shows animated waveform bars when sound is on, flat lines when muted.
 */
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { tbSoundEngine } from "../lib/TBSoundEngine";

export default function SoundToggle() {
  const [muted, setMuted] = useState(false);

  const toggle = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (!newMuted) {
      tbSoundEngine.init();
      tbSoundEngine.setMuted(false);
      tbSoundEngine.play("nav_click");
    } else {
      tbSoundEngine.setMuted(true);
    }
  }, [muted]);

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all hover:scale-105"
      style={{
        background: "rgba(201, 162, 39, 0.1)",
        border: "1px solid rgba(201, 162, 39, 0.2)",
      }}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      title={muted ? "Turn on sounds" : "Turn off sounds"}
    >
      {/* Waveform bars */}
      <div className="flex items-end gap-[2px] h-4">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full"
            style={{
              background: muted ? "rgba(253, 248, 240, 0.2)" : "#C9A227",
            }}
            animate={
              muted
                ? { height: 4 }
                : {
                    height:
                      [6, 14, 8, 12][i % 4] +
                      Math.sin(Date.now() / 200 + i) * 2,
                  }
            }
            transition={
              muted
                ? { duration: 0.2 }
                : {
                    duration: 0.4 + i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </div>
    </button>
  );
}
