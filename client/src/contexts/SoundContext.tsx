/*
 * Sound Context — Global sound management with mute toggle
 */
import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { soundEngine, type SoundType } from "@/lib/soundEngine";

interface SoundContextValue {
  play: (type: SoundType) => void;
  toggleMute: () => void;
  muted: boolean;
  initialized: boolean;
}

const SoundContext = createContext<SoundContextValue>({
  play: () => {},
  toggleMute: () => false,
  muted: false,
  initialized: false,
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const initRef = useRef(false);

  // Initialize on first user interaction
  useEffect(() => {
    const initSound = async () => {
      if (initRef.current) return;
      initRef.current = true;
      await soundEngine.init();
      setInitialized(true);
    };

    const events = ["click", "touchstart", "keydown"];
    events.forEach((e) => window.addEventListener(e, initSound, { once: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, initSound));
    };
  }, []);

  const play = useCallback((type: SoundType) => {
    soundEngine.play(type);
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = soundEngine.toggleMute();
    setMuted(newMuted);
  }, []);

  return (
    <SoundContext.Provider value={{ play, toggleMute, muted, initialized }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
