/**
 * TechBridge Collective — App Router
 * Bridge theme, warm brutalism, forest green + gold + cream
 */
import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import Navigation from "./components/Navigation";

const Home = lazy(() => import("./pages/Home"));
const GetHelp = lazy(() => import("./pages/GetHelp"));
const HostAHub = lazy(() => import("./pages/HostAHub"));
const Impact = lazy(() => import("./pages/Impact"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDF8F0' }}>
      <div className="text-center">
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none" className="mx-auto mb-4">
          <path d="M4 22 Q16 8 28 22" stroke="#C9A227" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <animate attributeName="stroke-dasharray" values="0 60;60 0" dur="1.5s" repeatCount="indefinite" />
          </path>
          <line x1="4" y1="22" x2="28" y2="22" stroke="#C9A227" strokeWidth="2" />
          <line x1="16" y1="22" x2="16" y2="11" stroke="#C9A227" strokeWidth="1.5" />
        </svg>
        <p className="text-sm font-mono" style={{ color: '#7C9A6E' }}>Building the bridge...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#FDF8F0' }}>
      <Navigation />
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/get-help" component={GetHelp} />
          <Route path="/host-a-hub" component={HostAHub} />
          <Route path="/impact" component={Impact} />
          <Route path="/about" component={About} />
          <Route path="/dashboard" component={Dashboard} />
          <Route>
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDF8F0' }}>
              <div className="text-center">
                <h1 className="font-display text-6xl font-bold mb-4" style={{ color: '#1B4332' }}>404</h1>
                <p className="text-base mb-6" style={{ color: '#2D3436' }}>This bridge doesn't lead anywhere yet.</p>
                <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold transition-all hover:scale-105" style={{ background: '#C9A227', color: '#1B4332' }}>
                  Return Home
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
