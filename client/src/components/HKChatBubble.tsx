/**
 * H.K. AI Chat Bubble — Floating Interactive Assistant
 * 
 * Named for Horace King (1807–1885), the bridge builder.
 * Features:
 * - Floating bubble with animated avatar in bottom-right
 * - Expandable chat interface with typing indicators
 * - Quick action buttons for common tasks
 * - Conversational AI responses based on SPAN document
 * - Sound effects on open/close/message
 * - Pulse animation when idle, breathing when active
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

const HK_AVATAR = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/HK_avatar_80_9e8213b6.jpg';
const HK_BUBBLE_ICON = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/6A6PRiSc2SBdMKdQGVopRa/HK_bubble_icon_112_0a24fc22.png';

interface Message {
  id: string;
  role: 'hk' | 'user';
  text: string;
  timestamp: number;
}

const QUICK_ACTIONS = [
  { emoji: '📧', label: 'Recover my email', query: 'I need help recovering my email account' },
  { emoji: '💼', label: 'Apply for jobs', query: 'I need help applying for jobs online' },
  { emoji: '📱', label: 'Set up my phone', query: 'I need help setting up my phone' },
  { emoji: '📁', label: 'Upload documents', query: 'I need help uploading documents online' },
  { emoji: '🔑', label: 'Reset a password', query: 'I need help resetting a password safely' },
  { emoji: '🏥', label: 'Set up telehealth', query: 'I need help setting up a telehealth appointment' },
];

// H.K. response knowledge base from SPAN document
const HK_RESPONSES: Record<string, string> = {
  email: `Here's how to recover your email, step by step:\n\n1. Go to your email provider's sign-in page (Gmail, Yahoo, Outlook)\n2. Click "Forgot password" or "Can't sign in"\n3. Follow the recovery steps — you'll need your phone number or backup email\n4. Create a new strong password and write it down somewhere safe\n\nIf you're stuck, visit a TechBridge hub and a Digital Navigator will walk you through it on your device. Durham Library Hub: Tue & Thu 10am–2pm. Raleigh Hub: Mon & Wed 11am–3pm.\n\nI never ask for your password or personal info. Your privacy is protected.`,
  
  jobs: `Let me help you with online job applications:\n\n1. First, make sure you have an email account set up\n2. Create accounts on job sites like Indeed, LinkedIn, or NCWorks\n3. Have your resume ready — or we can help you build one\n4. Save your work frequently using "Draft" or "Save" buttons\n5. Take screenshots of confirmation pages\n\nFor veterans: Bring your DD-214 for upload. Our Navigators at NCWorks referral sites can help with the full process.\n\nWant in-person help? Visit during hub hours — no appointment needed.`,
  
  phone: `Setting up your phone doesn't have to be stressful:\n\n1. Make sure your phone is charged and connected to Wi-Fi\n2. If it's new, follow the on-screen setup wizard\n3. Sign in with your Apple ID (iPhone) or Google account (Android)\n4. If you forgot your Apple ID, go to iforgot.apple.com\n5. Download essential apps: your email, your bank, your health portal\n\nA Digital Navigator can sit with you and walk through every step. Bring your phone to any hub during open hours.`,
  
  documents: `Uploading documents from your phone is easier than you think:\n\n1. Open your phone's camera app\n2. Hold it steady over the document — most phones auto-detect documents\n3. Tap to capture, then crop if needed\n4. Save as PDF if the option is available\n5. Go to the website where you need to upload\n6. Tap "Upload" or "Choose file" and select your saved document\n7. Take a screenshot of the confirmation page\n\nFor housing applications, benefits portals, or school forms — our Navigators handle these daily.`,
  
  password: `Let's reset your password safely:\n\n1. Go to the website or app where you need to sign in\n2. Click "Forgot password" — don't guess repeatedly\n3. Check your email or phone for a reset link or code\n4. Create a new password: at least 12 characters, mix of letters, numbers, symbols\n5. Write it down in a safe place (not on a sticky note on your screen)\n\n⚠️ Important: I will NEVER ask for your password, SSN, bank info, or 2FA codes. If anyone does, that's a red flag.\n\nNeed hands-on help? Walk into any hub during open hours.`,
  
  telehealth: `Setting up telehealth so you can see your doctor from home:\n\n1. Ask your doctor's office which app or portal they use\n2. Download it from the App Store or Google Play\n3. Create an account — you'll need your name, date of birth, and insurance info\n4. If they use MyChart, search for your hospital system\n5. Schedule a video visit and test your camera/microphone beforehand\n\nDorothy came to our Durham hub needing exactly this. In 40 minutes, our Navigator helped her reset her Apple ID, download the portal app, create her account, and book her first appointment.\n\nYou can do this. And we're here to help.`,
  
  default: `I'm H.K. — named for Horace King, the master bridge builder who connected communities across the American South.\n\nI can help you with:\n• Email and account recovery\n• Job applications and resumes\n• Phone setup and troubleshooting\n• Document uploads for housing, benefits, school\n• Password resets (safely!)\n• Telehealth and health portal setup\n\nFor complex issues, I'll connect you with a paid Digital Navigator at one of our hubs:\n📍 Durham Library Hub — Tue & Thu, 10am–2pm\n📍 Raleigh Digital Impact Hub — Mon & Wed, 11am–3pm\n\nWhat do you need help with today?`,
};

function getHKResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('email') || q.includes('recover') || q.includes('gmail') || q.includes('yahoo')) return HK_RESPONSES.email;
  if (q.includes('job') || q.includes('apply') || q.includes('resume') || q.includes('work') || q.includes('ncworks')) return HK_RESPONSES.jobs;
  if (q.includes('phone') || q.includes('setup') || q.includes('apple') || q.includes('android')) return HK_RESPONSES.phone;
  if (q.includes('document') || q.includes('upload') || q.includes('scan') || q.includes('housing')) return HK_RESPONSES.documents;
  if (q.includes('password') || q.includes('reset') || q.includes('forgot') || q.includes('sign in') || q.includes('login')) return HK_RESPONSES.password;
  if (q.includes('telehealth') || q.includes('doctor') || q.includes('health') || q.includes('mychart') || q.includes('medical')) return HK_RESPONSES.telehealth;
  return HK_RESPONSES.default;
}

export default function HKChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show tooltip after 3 seconds if not interacted
  useEffect(() => {
    if (hasInteracted) return;
    const t = setTimeout(() => setShowTooltip(true), 3000);
    const t2 = setTimeout(() => setShowTooltip(false), 8000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [hasInteracted]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setHasInteracted(true);
    setShowTooltip(false);
    if (!isOpen) {
      tbSoundEngine.init();
      tbSoundEngine.play('hk_open');
      setIsOpen(true);
      // Add welcome message if first open
      if (messages.length === 0) {
        setMessages([{
          id: 'welcome',
          role: 'hk',
          text: "Hi! I'm H.K. — your 24/7 digital guide, named for Horace King, the bridge builder who connected communities across the South.\n\nI can help with email recovery, job applications, phone setup, document uploads, password resets, and telehealth.\n\nWhat do you need help with? Choose a quick start below, or type your question.",
          timestamp: Date.now(),
        }]);
      }
    } else {
      tbSoundEngine.play('hk_close');
      setIsOpen(false);
    }
  }, [isOpen, messages.length]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    tbSoundEngine.play('hk_typing');

    // Simulate H.K. thinking + typing
    const responseDelay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response = getHKResponse(text);
      const hkMsg: Message = {
        id: `hk-${Date.now()}`,
        role: 'hk',
        text: response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, hkMsg]);
      setIsTyping(false);
      tbSoundEngine.play('hk_message');
    }, responseDelay);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (query: string) => {
    tbSoundEngine.play('nav_click');
    sendMessage(query);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="px-4 py-2.5 rounded-xl shadow-lg max-w-[200px]"
              style={{
                background: '#1B4332',
                color: '#FDF8F0',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              }}
            >
              <p className="text-sm font-medium">Need tech help?</p>
              <p className="text-xs mt-0.5" style={{ color: '#C9A227' }}>Ask H.K. — free, 24/7</p>
              <div
                className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderLeft: '8px solid #1B4332',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Bubble Button */}
        <motion.button
          onClick={toggleChat}
          className="relative w-16 h-16 rounded-full overflow-hidden shadow-2xl"
          style={{
            background: '#1B4332',
            border: '3px solid #C9A227',
            boxShadow: '0 8px 30px rgba(27, 67, 50, 0.4), 0 0 20px rgba(201, 162, 39, 0.2)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={isOpen ? {} : {
            boxShadow: [
              '0 8px 30px rgba(27, 67, 50, 0.4), 0 0 20px rgba(201, 162, 39, 0.2)',
              '0 8px 30px rgba(27, 67, 50, 0.4), 0 0 35px rgba(201, 162, 39, 0.4)',
              '0 8px 30px rgba(27, 67, 50, 0.4), 0 0 20px rgba(201, 162, 39, 0.2)',
            ],
          }}
          transition={isOpen ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Ask H.K. AI"
        >
          {isOpen ? (
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="flex items-center justify-center w-full h-full"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          ) : (
            <motion.img
              src={HK_BUBBLE_ICON}
              alt="H.K. AI"
              className="w-full h-full object-cover"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            />
          )}

          {/* Online indicator */}
          <div
            className="absolute top-0 right-0 w-4 h-4 rounded-full border-2"
            style={{ background: '#22c55e', borderColor: '#1B4332' }}
          >
            <div className="w-full h-full rounded-full animate-ping" style={{ background: '#22c55e', opacity: 0.4 }} />
          </div>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              background: '#0F2B1F',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(201, 162, 39, 0.1)',
              maxHeight: 'min(600px, calc(100vh - 10rem))',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ background: 'rgba(27, 67, 50, 0.5)', borderBottom: '1px solid rgba(201, 162, 39, 0.15)' }}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden" style={{ border: '2px solid #C9A227' }}>
                <img src={HK_AVATAR} alt="H.K." className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full" style={{ background: '#22c55e', border: '2px solid #0F2B1F' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-sm font-bold" style={{ color: '#FDF8F0' }}>
                  H.K. <span className="font-normal text-xs" style={{ color: 'rgba(253, 248, 240, 0.5)' }}>Help Desk Architect</span>
                </h3>
                <p className="text-xs" style={{ color: '#22c55e' }}>Online · 24/7</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-3 rounded-full animate-pulse" style={{ background: '#C9A227' }} />
                <div className="w-1.5 h-4 rounded-full animate-pulse" style={{ background: '#C9A227', animationDelay: '0.2s' }} />
                <div className="w-1.5 h-2.5 rounded-full animate-pulse" style={{ background: '#C9A227', animationDelay: '0.4s' }} />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: '200px', maxHeight: '350px' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'hk' && (
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mr-2 mt-1" style={{ border: '1.5px solid rgba(201, 162, 39, 0.4)' }}>
                      <img src={HK_AVATAR} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className="max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line"
                    style={msg.role === 'hk' ? {
                      background: 'rgba(45, 106, 79, 0.2)',
                      color: '#FDF8F0',
                      borderBottomLeftRadius: '4px',
                      border: '1px solid rgba(45, 106, 79, 0.3)',
                    } : {
                      background: 'rgba(201, 162, 39, 0.2)',
                      color: '#FDF8F0',
                      borderBottomRightRadius: '4px',
                      border: '1px solid rgba(201, 162, 39, 0.3)',
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0" style={{ border: '1.5px solid rgba(201, 162, 39, 0.4)' }}>
                    <img src={HK_AVATAR} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-1 px-4 py-3 rounded-2xl" style={{ background: 'rgba(45, 106, 79, 0.2)' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#C9A227' }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (show when few messages) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs font-mono mb-2" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>Quick starts</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.query)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                      style={{
                        background: 'rgba(201, 162, 39, 0.1)',
                        color: '#C9A227',
                        border: '1px solid rgba(201, 162, 39, 0.2)',
                      }}
                    >
                      {action.emoji} {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Safety notice */}
            <div className="px-4 py-2" style={{ background: 'rgba(45, 106, 79, 0.1)' }}>
              <p className="text-xs" style={{ color: 'rgba(253, 248, 240, 0.4)' }}>
                🔒 <strong>Safety:</strong> H.K. never asks for passwords, SSNs, bank info, or 2FA codes.
              </p>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3" style={{ borderTop: '1px solid rgba(201, 162, 39, 0.15)' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => tbSoundEngine.play('form_focus')}
                placeholder="Describe your issue..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(253, 248, 240, 0.06)',
                  color: '#FDF8F0',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30"
                style={{ background: '#C9A227', color: '#1B4332' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            {/* Footer */}
            <div className="px-4 py-2 flex items-center justify-between" style={{ borderTop: '1px solid rgba(201, 162, 39, 0.08)' }}>
              <p className="text-xs italic" style={{ color: 'rgba(253, 248, 240, 0.3)' }}>
                Named for Horace King, bridge builder
              </p>
              <a
                href="/get-help"
                className="text-xs font-medium transition-colors hover:underline"
                style={{ color: '#C9A227' }}
              >
                I need in-person help →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
