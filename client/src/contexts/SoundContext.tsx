import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { playSound, setMasterVolume, startAmbient, stopAmbient } from "@/lib/SoundEngine";

interface SoundContextType {
  enabled: boolean;
  toggle: () => void;
  play: typeof playSound;
}

const SoundContext = createContext<SoundContextType>({
  enabled: false,
  toggle: () => {},
  play: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      if (next) {
        setMasterVolume(0.3);
        startAmbient();
      } else {
        setMasterVolume(0);
        stopAmbient();
      }
      return next;
    });
  }, []);

  const play = useCallback(
    (type: Parameters<typeof playSound>[0]) => {
      if (enabled) playSound(type);
    },
    [enabled]
  );

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
