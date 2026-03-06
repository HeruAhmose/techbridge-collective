import { useState } from "react";
import CinematicIntro from "./components/CinematicIntro";
import QueenCalifiaCommand from "./pages/QueenCalifiaCommand";
import { SoundProvider } from "./contexts/SoundContext";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <SoundProvider>
      {!introComplete ? (
        <CinematicIntro onComplete={() => setIntroComplete(true)} />
      ) : (
        <QueenCalifiaCommand />
      )}
    </SoundProvider>
  );
}
