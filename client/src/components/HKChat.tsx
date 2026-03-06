import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tbSoundEngine } from '../lib/TBSoundEngine';

/**
 * H.K. Interactive Chat Widget
 * Named for Horace King — TechBridge's 24/7 AI guide.
 * 
 * States: idle → listening → thinking → responding
 * Warm, inviting personality. Never cold or robotic.
 */

type HKState = 'idle' | 'listening' | 'thinking' | 'responding';

interface Message {
  id: string;
  role: 'user' | 'hk';
  text: string;
  timestamp: Date;
}

// H.K.'s knowledge base — drawn from SPAN document
const HK_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Welcome! I'm H.K., named after Horace King — a master bridge builder. I'm here to help you navigate digital services. What do you need help with today?",
    "Hi there! I'm H.K., your TechBridge guide. Whether it's a school portal, job application, or telehealth setup — I can walk you through it. What's on your mind?",
  ],
  school: [
    "School portals can be tricky! Let me help. First — which portal are you trying to access? Common ones include PowerSchool, Infinite Campus, and Canvas. I can walk you through the login process step by step.",
    "I hear you — school technology is a common challenge. 42% of our help desk visits involve education-related tech. Let's start with the basics: do you have your login credentials, or do we need to help you recover them?",
  ],
  job: [
    "Great — let's get that application moving! I can help with online job applications, resume uploads, and navigating hiring portals. Which platform are you applying through? (Indeed, LinkedIn, a company website?)",
    "Job applications are one of our top support areas. I can guide you through the process right now, or if it's complex, I'll flag it for your next in-person session with a Digital Navigator. What's the situation?",
  ],
  health: [
    "Telehealth setup is something we help with regularly. I can walk you through downloading the app, creating an account, and joining your first virtual visit. Which provider are you trying to connect with?",
    "Healthcare access is critical. Let me help you get connected. Do you need help with a patient portal login, scheduling a telehealth visit, or finding a provider that offers virtual care?",
  ],
  housing: [
    "Housing documents and portals — I can definitely help with that. Common needs include rental applications, housing authority portals, and utility assistance forms. What specifically do you need?",
    "Housing-related tech is one of our four core issue categories. Whether it's an online application, document upload, or portal access — I'll walk you through it. What are you working on?",
  ],
  benefits: [
    "Benefits applications can be complex, but we'll take it step by step. Are you applying for SNAP, Medicaid, unemployment, or another program? I can guide you through the online portal.",
    "I can help you navigate benefits portals. Many of our community members need help with these — you're not alone. Let's start: which benefit are you trying to access?",
  ],
  navigator: [
    "A Digital Navigator is a trained, paid staff member who provides hands-on tech help at community sites. They're available during weekly hub hours — typically 8 hours per week. They handle everything from device setup to complex form completion.",
    "Digital Navigators are the heart of TechBridge. They provide free, in-person tech assistance at community hubs. No appointment needed during hub hours. They track every interaction through TechMinutes® so we can measure real impact.",
  ],
  techminutes: [
    "TechMinutes® is our proprietary impact measurement system. Every help session is logged with: duration, issue category (Education, Workforce, Health, Housing), resolution status, and follow-up needs. This data generates monthly reports that show funders exactly what's happening.",
    "TechMinutes® tracks the real impact of every interaction. It captures what people need help with, how long it takes, and whether the issue was resolved. This gives our partner sites data-backed proof of community need.",
  ],
  about: [
    "TechBridge Collective bridges the digital divide through three pillars: 1) In-Person Help Desks staffed by Digital Navigators, 2) H.K. (that's me!) providing 24/7 AI guidance between visits, and 3) TechMinutes® impact tracking. We're built on the legacy of Horace King.",
    "We're a community-first digital inclusion program. Our model is intentionally low-lift for partner sites — they provide space, we provide everything else: staffing, training, technology, and reporting. One visit can unlock a job application, unstick housing, recover a school account, or set up telehealth.",
  ],
  default: [
    "I want to make sure I help you with the right thing. Could you tell me more about what you're trying to do? Common areas I help with: school portals, job applications, telehealth, housing documents, and benefits applications.",
    "I'm here to help! I work best with specific questions. For example: 'How do I log into my child's school portal?' or 'I need help applying for a job online.' What would you like help with?",
  ],
};

function getHKResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.match(/\b(hi|hello|hey|sup|what's up|greetings)\b/)) {
    return pickRandom(HK_RESPONSES.greeting);
  }
  if (lower.match(/\b(school|portal|homework|teacher|class|grade|student|canvas|powerschool)\b/)) {
    return pickRandom(HK_RESPONSES.school);
  }
  if (lower.match(/\b(job|work|employ|resume|apply|application|career|hire|indeed|linkedin)\b/)) {
    return pickRandom(HK_RESPONSES.job);
  }
  if (lower.match(/\b(health|doctor|telehealth|medical|hospital|clinic|prescription|patient)\b/)) {
    return pickRandom(HK_RESPONSES.health);
  }
  if (lower.match(/\b(hous|rent|apartment|landlord|utility|section 8|voucher)\b/)) {
    return pickRandom(HK_RESPONSES.housing);
  }
  if (lower.match(/\b(benefit|snap|medicaid|unemployment|ebt|food stamp|assistance)\b/)) {
    return pickRandom(HK_RESPONSES.benefits);
  }
  if (lower.match(/\b(navigator|help desk|in.person|visit|hub)\b/)) {
    return pickRandom(HK_RESPONSES.navigator);
  }
  if (lower.match(/\b(techminute|metric|impact|data|report|measure)\b/)) {
    return pickRandom(HK_RESPONSES.techminutes);
  }
  if (lower.match(/\b(techbridge|about|what is|who are|mission|horace)\b/)) {
    return pickRandom(HK_RESPONSES.about);
  }
  return pickRandom(HK_RESPONSES.default);
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// H.K. state colors
const STATE_COLORS: Record<HKState, string> = {
  idle: '#1B4332',
  listening: '#2D6A4F',
  thinking: '#C9A227',
  responding: '#1B4332',
};

const STATE_LABELS: Record<HKState, string> = {
  idle: 'Ready to help',
  listening: 'Listening...',
  thinking: 'Thinking...',
  responding: 'H.K. is speaking',
};

export default function HKChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<HKState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    tbSoundEngine.play(next ? 'hk_open' : 'hk_close');

    if (next && !hasGreeted) {
      setHasGreeted(true);
      setState('thinking');
      tbSoundEngine.play('hk_typing');
      setTimeout(() => {
        setMessages([{
          id: 'greeting',
          role: 'hk',
          text: pickRandom(HK_RESPONSES.greeting),
          timestamp: new Date(),
        }]);
        setState('idle');
        tbSoundEngine.play('hk_message');
      }, 1200);
    }
  }, [isOpen, hasGreeted]);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setState('thinking');
    tbSoundEngine.play('hk_typing');

    // Simulate H.K. thinking (1-2.5 seconds)
    const thinkTime = 1000 + Math.random() * 1500;
    setTimeout(() => {
      const response = getHKResponse(userMsg.text);
      setState('responding');
      
      const hkMsg: Message = {
        id: `hk-${Date.now()}`,
        role: 'hk',
        text: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, hkMsg]);
      tbSoundEngine.play('hk_message');

      setTimeout(() => setState('idle'), 500);
    }, thinkTime);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'How do I get help?',
    'What is a Digital Navigator?',
    'Help with school portal',
    'Job application help',
  ];

  return (
    <>
      {/* Floating H.K. Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-2xl"
        style={{
          width: 64,
          height: 64,
          background: isOpen ? '#C9A227' : '#1B4332',
          border: `3px solid ${isOpen ? '#1B4332' : '#C9A227'}`,
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: state === 'thinking'
            ? '0 0 30px rgba(201, 162, 39, 0.6)'
            : '0 8px 30px rgba(27, 67, 50, 0.3)',
        }}
        transition={{ duration: 0.3 }}
        aria-label={isOpen ? 'Close H.K. chat' : 'Open H.K. chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <path d="M18 6L6 18M6 6l12 12" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round" />
            </motion.svg>
          ) : (
            <motion.div
              key="hk"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Bridge icon */}
              <svg width="28" height="20" viewBox="0 0 32 20" fill="none">
                <path d="M2 16 Q16 2 30 16" stroke="#C9A227" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <line x1="2" y1="16" x2="30" y2="16" stroke="#C9A227" strokeWidth="2" />
                <line x1="8" y1="16" x2="8" y2="10" stroke="#C9A227" strokeWidth="1.5" />
                <line x1="16" y1="16" x2="16" y2="5" stroke="#C9A227" strokeWidth="1.5" />
                <line x1="24" y1="16" x2="24" y2="10" stroke="#C9A227" strokeWidth="1.5" />
              </svg>
              <span style={{ fontSize: 8, color: '#C9A227', fontWeight: 700, letterSpacing: 1 }}>H.K.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification pulse when idle */}
        {!isOpen && !hasGreeted && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
            style={{ background: '#C9A227' }}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{
              width: 'min(400px, calc(100vw - 48px))',
              height: 'min(560px, calc(100vh - 140px))',
              background: '#FDF8F0',
              border: '2px solid rgba(27, 67, 50, 0.15)',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4 shrink-0"
              style={{
                background: '#1B4332',
                borderBottom: '2px solid #C9A227',
              }}
            >
              {/* H.K. Avatar */}
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(201, 162, 39, 0.2)',
                    border: '2px solid #C9A227',
                  }}
                >
                  <svg width="20" height="14" viewBox="0 0 32 20" fill="none">
                    <path d="M2 16 Q16 2 30 16" stroke="#C9A227" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <line x1="2" y1="16" x2="30" y2="16" stroke="#C9A227" strokeWidth="2" />
                    <line x1="16" y1="16" x2="16" y2="5" stroke="#C9A227" strokeWidth="1.5" />
                  </svg>
                </div>
                {/* State indicator */}
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                  style={{
                    borderColor: '#1B4332',
                    background: STATE_COLORS[state],
                  }}
                  animate={state === 'thinking' ? {
                    scale: [1, 1.3, 1],
                    background: ['#C9A227', '#E8C84A', '#C9A227'],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: '#FDF8F0', fontFamily: 'var(--font-display)' }}>
                  H.K. — Digital Guide
                </div>
                <div className="text-xs" style={{ color: '#C9A227' }}>
                  {STATE_LABELS[state]}
                </div>
              </div>

              {/* Sound toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const next = !tbSoundEngine.isEnabled();
                  tbSoundEngine.setEnabled(next);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(253, 248, 240, 0.1)' }}
                title="Toggle sound"
              >
                <span style={{ fontSize: 14 }}>🔊</span>
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.length === 0 && state !== 'thinking' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'rgba(27, 67, 50, 0.08)' }}
                  >
                    <svg width="32" height="24" viewBox="0 0 32 20" fill="none">
                      <path d="M2 16 Q16 2 30 16" stroke="#1B4332" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <line x1="2" y1="16" x2="30" y2="16" stroke="#1B4332" strokeWidth="1.5" />
                      <line x1="8" y1="16" x2="8" y2="10" stroke="#C9A227" strokeWidth="1.5" />
                      <line x1="16" y1="16" x2="16" y2="5" stroke="#C9A227" strokeWidth="1.5" />
                      <line x1="24" y1="16" x2="24" y2="10" stroke="#C9A227" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#1B4332', fontFamily: 'var(--font-display)' }}>
                    H.K. is ready to help
                  </p>
                  <p className="text-xs mb-6" style={{ color: '#7C9A6E' }}>
                    Named for Horace King, master bridge builder
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={msg.role === 'hk' ? {
                      background: '#1B4332',
                      color: '#FDF8F0',
                      borderBottomLeftRadius: 4,
                    } : {
                      background: 'rgba(201, 162, 39, 0.15)',
                      color: '#1B4332',
                      borderBottomRightRadius: 4,
                      border: '1px solid rgba(201, 162, 39, 0.3)',
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {state === 'thinking' && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="px-4 py-3 rounded-2xl flex gap-1.5 items-center"
                    style={{ background: '#1B4332', borderBottomLeftRadius: 4 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#C9A227' }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions (show when no messages) */}
            {messages.length <= 1 && state === 'idle' && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => {
                        const userMsg: Message = {
                          id: `user-${Date.now()}`,
                          role: 'user',
                          text: q,
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, userMsg]);
                        setState('thinking');
                        tbSoundEngine.play('hk_typing');
                        const thinkTime = 1000 + Math.random() * 1500;
                        setTimeout(() => {
                          const response = getHKResponse(q);
                          setState('responding');
                          setMessages(prev => [...prev, {
                            id: `hk-${Date.now()}`,
                            role: 'hk',
                            text: response,
                            timestamp: new Date(),
                          }]);
                          tbSoundEngine.play('hk_message');
                          setTimeout(() => setState('idle'), 500);
                        }, thinkTime);
                        setInput('');
                      }, 50);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                    style={{
                      background: 'rgba(27, 67, 50, 0.06)',
                      color: '#1B4332',
                      border: '1px solid rgba(27, 67, 50, 0.15)',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="flex items-center gap-2 px-4 py-3 shrink-0"
              style={{
                borderTop: '1px solid rgba(27, 67, 50, 0.1)',
                background: 'rgba(27, 67, 50, 0.02)',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => tbSoundEngine.play('form_focus')}
                placeholder="Ask H.K. anything..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'white',
                  border: '1.5px solid rgba(27, 67, 50, 0.15)',
                  color: '#2D3436',
                  fontFamily: 'var(--font-body)',
                }}
                disabled={state === 'thinking'}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || state === 'thinking'}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                style={{
                  background: input.trim() ? '#1B4332' : 'rgba(27, 67, 50, 0.1)',
                  cursor: input.trim() ? 'pointer' : 'default',
                }}
                whileHover={input.trim() ? { scale: 1.05 } : {}}
                whileTap={input.trim() ? { scale: 0.95 } : {}}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    stroke={input.trim() ? '#C9A227' : '#7C9A6E'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
