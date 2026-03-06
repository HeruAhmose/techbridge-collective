/**
 * TechBridge Collective — App Router
 * God-tier visual storytelling masterpiece
 * Bridge theme, warm brutalism, forest green + gold + cream
 * 
 * Features: Cinematic intro, H.K. chat bubble, bridge progress bar,
 * sound engine, scroll animations, SPAN content integration
 */
import { Switch, Route } from "wouter";
import { lazy, Suspense, useState, useCallback, useEffect } from "react";
import Navigation from "./components/Navigation";
import HKChatBubble from "./components/HKChatBubble";
import BridgeProgressBar from "./components/BridgeProgressBar";
import CinematicIntro from "./components/CinematicIntro";

const Home = lazy(() => import("./pages/Home"));
const GetHelp = lazy(() => import("./pages/GetHelp"));
const HostAHub = lazy(() => import("./pages/HostAHub"));
const Impact = lazy(() => import("./pages/Impact"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F2B1F' }}>
      <div className="text-center">
        <svg width="56" height="56" viewBox="0 0 32 32" fill="none" className="mx-auto mb-4">
          <path d="M4 22 Q16 8 28 22" stroke="#C9A227" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <animate attributeName="stroke-dasharray" values="0 60;60 0" dur="1.5s" repeatCount="indefinite" />
          </path>
          <line x1="4" y1="22" x2="28" y2="22" stroke="#C9A227" strokeWidth="2" />
          <line x1="10" y1="22" x2="10" y2="15" stroke="#C9A227" strokeWidth="1.5">
            <animate attributeName="opacity" values="0;1" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="16" y1="22" x2="16" y2="11" stroke="#C9A227" strokeWidth="1.5">
            <animate attributeName="opacity" values="0;1" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
          </line>
          <line x1="22" y1="22" x2="22" y2="15" stroke="#C9A227" strokeWidth="1.5">
            <animate attributeName="opacity" values="0;1" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
          </line>
        </svg>
        <p className="text-sm font-mono" style={{ color: '#C9A227' }}>Building the bridge...</p>
      </div>
    </div>
  );
}

function App() {
  // Intro shows every page refresh — always starts as false
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  // Safety: if intro hasn't completed after 30s, force it
  useEffect(() => {
    if (introComplete) return;
    const safety = setTimeout(() => {
      setIntroComplete(true);
    }, 30000);
    return () => clearTimeout(safety);
  }, [introComplete]);

  return (
    <div style={{ minHeight: '100vh', background: '#FDF8F0' }}>
      {/* Cinematic Bridge-Building Intro */}
      {!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}

      {/* Bridge Progress Bar (scroll-linked) */}
      <BridgeProgressBar />

      {/* Navigation */}
      <Navigation />

      {/* Page Routes */}
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/get-help" component={GetHelp} />
          <Route path="/host-a-hub" component={HostAHub} />
          <Route path="/impact" component={Impact} />
          <Route path="/about" component={About} />
          <Route path="/dashboard" component={Dashboard} />
          <Route>
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F2B1F' }}>
              <div className="text-center">
                <h1 className="font-display text-7xl font-bold mb-4" style={{ color: '#C9A227' }}>404</h1>
                <p className="text-base mb-6" style={{ color: 'rgba(253, 248, 240, 0.6)' }}>This bridge doesn't lead anywhere yet.</p>
                <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold transition-all hover:scale-105" style={{ background: '#C9A227', color: '#1B4332' }}>
                  Return Home
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </Suspense>

      {/* H.K. AI Floating Chat Bubble — Always visible */}
      <HKChatBubble />
    </div>
  );
}

export default App;
