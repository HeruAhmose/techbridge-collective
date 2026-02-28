"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/*  ════════════════════════════════════════════════════════════════
    H.K. — HORACE KING · AI HELP DESK ARCHITECT
    TechBridge Collective · Production Widget System v3.0

    EXPORTS:
      default     → Full preview (artifact demo with all 3 modes)
      HKChat      → The core chat component (inline "Ask H.K." section)
      HKBubble    → Fixed bottom-right floating bubble + panel
      HKHero      → Compact hero-area entry point

    INTEGRATION (in your Next.js app):
      layout.tsx  → import { HKBubble } from "@/components/HKWidget"
      page.tsx    → import HKChat, { HKHero } from "@/components/HKWidget"
    ════════════════════════════════════════════════════════════════ */

// ── DESIGN TOKENS ──────────────────────────────────────────────
const C = {
  bg:       "#0b1120", bg1:      "#111827", bg2:      "#162033",
  sf:       "#1a2740", sfHi:     "#1e3050",
  cyan:     "#22d3ee", cyanDk:   "#0e7490",
  cyanA:    "rgba(34,211,238,0.08)", cyanB:  "rgba(34,211,238,0.16)",
  cyanG:    "rgba(34,211,238,0.35)",
  teal:     "#2dd4bf", green:    "#34d399",
  amber:    "#fbbf24", amberA:   "rgba(251,191,36,0.10)",
  red:      "#f87171", redA:     "rgba(248,113,113,0.12)",
  tx:       "#e2e8f0", tx2:      "#94a3b8", tx3:      "#475569",
  bd:       "#1e2d45", bdS:      "rgba(30,45,69,0.5)",
  wh:       "#f8fafc", bk:       "#020617",
};
const F  = `'DM Sans','Segoe UI',system-ui,sans-serif`;
const FM = `'JetBrains Mono','Fira Code',monospace`;
const AVATAR = "/images/hk/HK_avatar_80.jpg";
const BUBBLE_ICON = "/images/hk/HK_bubble_icon_112.png";

// ── QUICK STARTS ───────────────────────────────────────────────
const QS = [
  { e:"📧", l:"Recover my email",     k:"recover_email" },
  { e:"💼", l:"Apply for jobs online", k:"apply_jobs" },
  { e:"📱", l:"Set up my phone",       k:"setup_phone" },
  { e:"📁", l:"Upload documents",      k:"upload_docs" },
  { e:"🔑", l:"Reset a password",      k:"reset_password" },
  { e:"🏥", l:"Set up telehealth",     k:"setup_telehealth" },
];

// ── SCENARIO DATA ──────────────────────────────────────────────
const FLOWS = {
  recover_email: [
    { t:"Let's recover your email — this is very common and usually fixable in a few minutes.", m:{s:"FIX",c:"access/identity",v:"S4",p:0.88}},
    { t:"Here's what to do:", steps:["Go to your email sign-in page (Gmail, Outlook, Yahoo, etc.)","Look for \"Forgot password?\" or \"Can't sign in?\" and tap it","Choose a recovery method — text message, backup email, or security questions","Follow the prompts to create a new password","Make it 12+ characters — try a phrase like purple-bicycle-sunset"]},
    { t:"If none of the recovery options work, a Digital Navigator can help in person:\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm\n📍 Raleigh DIP — Mon 9am–12pm, Wed 1–4pm", m:{s:"RESOLVED"}},
  ],
  apply_jobs: [
    { t:"I'll walk you through applying for jobs online — this is one of the most common things our Navigators help with.", m:{s:"FIX",c:"digital literacy",v:"S4",p:0.91}},
    { t:"Here's the typical process:", steps:["Make sure you have an email account (Gmail or Outlook — both free)","Prepare a simple resume — Google Docs has free templates","Go to a job site: Indeed.com, LinkedIn.com, or jobs.nc.gov","Create an account on the job site","Search for jobs by title and location","Click 'Apply' and fill in your information"]},
    { t:"This is much easier with someone guiding you. I'd recommend visiting a hub — our Navigators help people with job applications every day.\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm\n📍 Raleigh DIP — Mon 9am–12pm, Wed 1–4pm", m:{s:"RESOLVED"}},
  ],
  setup_phone: [
    { t:"Happy to help with your phone setup! Quick question:", m:{s:"CLARIFY",c:"endpoint",v:"S4",p:0.72}},
    { t:"What kind of phone do you have?", opts:["iPhone (Apple)","Android (Samsung, Google, etc.)","I'm not sure"]},
  ],
  upload_docs: [
    { t:"Let's get your documents scanned and sent.", m:{s:"FIX",c:"digital literacy",v:"S4",p:0.86}},
    { t:"Easiest way — use your phone as a scanner:", steps:["Download a free app: Adobe Scan or Microsoft Lens","Open the app and point your camera at the document","The app auto-detects edges and straightens the image","Save as PDF","Tap Share to email it directly"]},
    { t:"Your library hub also has a physical scanner you can use for free during hub hours. A Navigator can help you scan, save, and email.\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm", m:{s:"RESOLVED"}},
  ],
  reset_password: [
    { t:"Password reset — let's get you back in.", m:{s:"FIX",c:"access/identity",v:"S4",p:0.92}},
    { t:"Steps:", steps:["Go to the website or app you need to access","Click \"Sign In\" then \"Forgot Password?\"","Enter your email address or username","Check your email or phone for a reset link or code","Create a new password — 12+ characters, don't reuse old ones"]},
    { t:"⚠️ Never reuse the same password on different websites. Ask a Navigator about free password managers if you need help keeping track.\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm\n📍 Raleigh DIP — Mon 9am–12pm, Wed 1–4pm", m:{s:"RESOLVED"}},
  ],
  setup_telehealth: [
    { t:"I'll help you get ready for your telehealth visit.", m:{s:"CLARIFY",c:"digital literacy",v:"S4",p:0.78}},
    { t:"Which of these matches your appointment?", opts:["MyChart (Duke Health, UNC, etc.)","Zoom video call","Another app or portal","I'm not sure yet"]},
  ],
};

// Keyword patterns → responses for free-text
const KW = [
  { k:["can't login","cant login","login","log in","sign in","locked out","password"],
    r:[{t:"Login trouble — let me help.", m:{s:"CLASSIFY",c:"access/identity",v:"S3",p:0.74}},
       {t:"What are you trying to log into?", opts:["Email (Gmail, Outlook, Yahoo)","A website or app","My computer itself","Something else"]}]},
  { k:["suspicious","phishing","scam","weird email","fake","hacked"],
    r:[{t:"⚠️ Potential security issue. Activating safety protocol.", m:{s:"ESCALATE",c:"security/phishing",v:"S1",p:0.91}, alert:true},
       {t:"Do these things immediately:\n\n🛑 Do NOT click any links in that email\n🛑 Do NOT reply to the sender\n🛑 Do NOT enter any personal information\n\nIf it claims to be from a bank or company, go to their official website directly — type the address yourself.\n\nI've flagged this for our security team. You did the right thing asking.\n\n📍 A Navigator can help you verify suspicious messages during hub hours."}]},
  { k:["internet","wifi","slow","connected","connection","network","can't load","buffering"],
    r:[{t:"Let's troubleshoot your connection.", m:{s:"FIX",c:"network",v:"S3",p:0.82}},
       {t:"Try these in order:", steps:["Turn Wi-Fi off, wait 10 seconds, turn it back on","Move closer to the router if you're far away","Open a browser and go to fast.com to check your speed","If speed is very low (<5 Mbps), restart your router: unplug it, wait 30 seconds, plug back in"]},
       {t:"Did any of those help?", opts:["Yes, it's working now!","Still not working","I need more help"]}]},
  { k:["printer","print","scan"],
    r:[{t:"Printer issue — let's check a few things.", m:{s:"FIX",c:"hardware/printer",v:"S4",p:0.87}},
       {t:"Quick checks:", steps:["Is the printer turned on? Look for a light.","Check for paper — open the tray.","Turn the printer off, wait 30 seconds, turn it back on.","Try printing one test page."]},
       {t:"If it still won't work, a Navigator can help reconnect it at your next hub visit.\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm", m:{s:"RESOLVED"}}]},
  { k:["telehealth","doctor","medical","appointment","mychart","video call"],
    r:[{t:"Telehealth setup — I'll help you get ready.", m:{s:"CLARIFY",c:"digital literacy",v:"S4",p:0.78}},
       {t:"Which matches your appointment?", opts:["MyChart (Duke, UNC, etc.)","Zoom video call","Another app/portal","Not sure yet"]}]},
  { k:["job","resume","apply","application","indeed","linkedin","employment","work"],
    r:[{t:"I can help with online job applications.", m:{s:"CLARIFY",c:"digital literacy",v:"S4",p:0.89}},
       {t:"What do you need help with?", opts:["Creating a resume","Searching for jobs","Filling out an application","All of the above"]}]},
];

const FALLBACK = [
  {t:"Thanks — I want to make sure I point you in the right direction.", m:{s:"CLARIFY",p:0.45}},
  {t:"What best describes what you need?", opts:["I can't log into something","My internet isn't working","I need help with an app or website","I got a suspicious message","I need help with my phone or computer","Something else"]},
];

// Follow-up responses when user picks an option in a CLARIFY state
const FOLLOWUPS = {
  "iPhone (Apple)": [{t:"For iPhone setup:", steps:["Turn on your new iPhone and follow the Setup Assistant","When prompted, choose 'Transfer from iPhone' if you have your old phone nearby","Hold the old phone near the new one — a pattern will appear","Follow the on-screen prompts to transfer your data","This can take 15–60 minutes depending on how much data you have"]},{t:"If you don't have your old phone, you can restore from iCloud backup during setup. A Navigator can walk you through either method in person.\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm", m:{s:"RESOLVED"}}],
  "Android (Samsung, Google, etc.)": [{t:"For Android setup:", steps:["Turn on your new phone and follow the setup wizard","When asked, tap 'Copy apps & data'","Connect to Wi-Fi when prompted","Use a cable or tap 'No cable?' to transfer wirelessly","Follow the on-screen steps — your old phone will guide you"]},{t:"A Navigator can help if you get stuck or don't have a cable.\n\n📍 Raleigh DIP — Mon 9am–12pm, Wed 1–4pm", m:{s:"RESOLVED"}}],
  "I'm not sure": [{t:"No problem! The easiest way to find out:", steps:["Look at the back of your phone for an Apple logo (🍎) — that's an iPhone","If there's no Apple logo, it's most likely an Android","You can also check: Settings → About Phone"]},{t:"A Navigator can identify your phone and help set it up in person.\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm\n📍 Raleigh DIP — Mon 9am–12pm, Wed 1–4pm", m:{s:"RESOLVED"}}],
  "MyChart (Duke Health, UNC, etc.)": [{t:"For MyChart telehealth:", steps:["Download the MyChart app from the App Store or Google Play","Open it and search for your healthcare provider (Duke, UNC, etc.)","Log in or create an account — you'll need your activation code from your doctor's office","Go to 'Visits' → find your upcoming appointment","Tap 'Begin Visit' when it's time — test your camera and microphone first"]},{t:"If you don't have an activation code, call your doctor's office and ask for one. A Navigator can also help you set this up.\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm", m:{s:"RESOLVED"}}],
  "Zoom video call": [{t:"For a Zoom telehealth visit:", steps:["Download Zoom from the App Store or Google Play (or zoom.us on a computer)","Check your email for the meeting link from your doctor's office","Click/tap the link at appointment time","Allow camera and microphone access when prompted","You're in! The doctor will join shortly."]},{t:"Test your setup beforehand at zoom.us/test. A Navigator can help if you need it.\n\n📍 Raleigh DIP — Mon 9am–12pm, Wed 1–4pm", m:{s:"RESOLVED"}}],
  "Yes, it's working now!": [{t:"Great, glad that fixed it! If it happens again, those same steps usually help. Your issue has been logged.\n\n🌉 H.K. — happy to help anytime.", m:{s:"RESOLVED"}}],
  "Still not working": [{t:"Let's try one more thing:", steps:["Restart your device completely (power off, wait 30 seconds, power on)","After it restarts, try connecting to Wi-Fi again","If still no luck, try connecting to a different Wi-Fi network if available"]},{t:"If none of that works, this may need hands-on help. I'd recommend visiting a hub:\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm\n📍 Raleigh DIP — Mon 9am–12pm, Wed 1–4pm", m:{s:"RESOLVED"}}],
  "I need more help": [{t:"I'm connecting you to our next available hub session. A Digital Navigator can troubleshoot this in person with you.\n\n📍 Durham Library — Tue 10am–1pm, Thu 2–5pm\n📍 Raleigh DIP — Mon 9am–12pm, Wed 1–4pm\n\nYou can also call ahead to schedule: techbridge-collective.vercel.app/get-help", m:{s:"ESCALATE"}}],
};

// ── CHAT ENGINE ────────────────────────────────────────────────
function useChat() {
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [st, setSt] = useState("IDLE");
  const [meta, setMeta] = useState({});
  const [answered, setAnswered] = useState(new Set());
  const q = useRef([]);
  const busy = useRef(false);

  const drain = useCallback(async () => {
    if (busy.current || !q.current.length) return;
    busy.current = true; setTyping(true);
    while (q.current.length) {
      const m = q.current.shift();
      await new Promise(r => setTimeout(r, m.steps ? 900 : 550));
      if (m.m) { if (m.m.s) setSt(m.m.s); setMeta(p=>({...p,...m.m})); }
      const id = `${Date.now()}-${Math.random()}`;
      setMsgs(p => [...p, {...m, id}]);
    }
    setTyping(false); busy.current = false;
  }, []);

  const push = useCallback((arr) => { q.current.push(...arr); drain(); }, [drain]);

  const send = useCallback((text) => {
    const id = `u-${Date.now()}`;
    setMsgs(p => [...p, {role:"user",t:text,id}]);
    if (st === "IDLE") setSt("INTAKE");

    // Check for follow-up match first
    const followup = FOLLOWUPS[text];
    if (followup) { setTimeout(()=>push(followup), 400); return; }

    // Try Claude API, fallback to keywords
    const go = async () => {
      try {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            model:"claude-sonnet-4-20250514", max_tokens:1000,
            system:`You are H.K. (Horace King), the Help Desk Architect for TechBridge Collective — a nonprofit providing free tech support at community hubs in Durham and Raleigh, NC.\n\nRULES:\n- Be concise, warm, patient. Users may have limited tech experience.\n- Give clear, numbered step-by-step guidance when possible.\n- NEVER ask for passwords, SSNs, credit cards, or sensitive data.\n- If you detect a security issue (phishing, hacking), warn immediately and escalate.\n- Suggest visiting a hub: Durham Library (Tue 10am-1pm, Thu 2-5pm), Raleigh DIP (Mon 9am-12pm, Wed 1-4pm).\n- Keep responses under 120 words. Use plain language. No jargon.\n- If unsure, ask ONE clarifying question.\n- End with hub hours if the issue might need in-person help.\n- You are named after Horace King, the 19th-century bridge builder.`,
            messages:[{role:"user",content:text}],
          }),
        });
        if (!r.ok) throw new Error();
        const d = await r.json();
        const reply = d.content?.find(b=>b.type==="text")?.text;
        if (reply) { setSt("FIX"); setMeta(p=>({...p,p:0.85})); push([{t:reply}]); return; }
        throw new Error();
      } catch {
        const lc = text.toLowerCase();
        const match = KW.find(km => km.k.some(k => lc.includes(k)));
        push(match ? match.r : FALLBACK);
      }
    };
    setTimeout(go, 350);
  }, [push, st]);

  const quick = useCallback((key) => {
    const qs = QS.find(q=>q.k===key);
    if (!qs) return;
    const id = `u-${Date.now()}`;
    setMsgs([{role:"user",t:`${qs.e} ${qs.l}`,id}]);
    setSt("INTAKE"); setMeta({}); setAnswered(new Set());
    const flow = FLOWS[key];
    if (flow) setTimeout(()=>push(flow), 400);
  }, [push]);

  const pick = useCallback((opt, msgId) => {
    setAnswered(p => new Set([...p, msgId]));
    send(opt);
  }, [send]);

  const reset = useCallback(() => {
    setMsgs([]); setSt("IDLE"); setMeta({}); setAnswered(new Set());
    q.current = []; busy.current = false; setTyping(false);
  }, []);

  const needHelp = useCallback(() => {
    send("I still need help — can I talk to a person?");
  }, [send]);

  return { msgs, typing, st, meta, send, quick, pick, reset, needHelp, answered };
}

// ── INLINE STYLES HELPER ───────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;600;700&display=swap');
@keyframes hkPulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes hkDot{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
@keyframes hkIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes hkPop{from{opacity:0;transform:scale(.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes hkRing{0%{box-shadow:0 0 0 0 rgba(34,211,238,.4)}70%{box-shadow:0 0 0 14px rgba(34,211,238,0)}100%{box-shadow:0 0 0 0 rgba(34,211,238,0)}}
.hk-in{animation:hkIn .3s ease forwards}
.hk-pop{animation:hkPop .35s cubic-bezier(.16,1,.3,1) forwards}
.hk-pulse{animation:hkPulse 2s infinite}
.hk-dot{animation:hkDot 1.2s infinite}
.hk-input:focus{outline:none;border-color:${C.cyan}!important;box-shadow:0 0 0 3px ${C.cyanA}}
.hk-btn:hover:not(:disabled){background:${C.cyan}!important;color:${C.bk}!important;border-color:${C.cyan}!important}
.hk-opt:hover:not(:disabled){background:${C.cyanB}!important;border-color:${C.cyan}!important;transform:translateY(-1px)}
.hk-opt:active:not(:disabled){transform:translateY(0)}
.hk-qs:hover{background:${C.sfHi}!important;border-color:${C.cyan}!important}
.hk-r:hover{border-color:${C.tx2}!important;color:${C.tx}!important}
.hk-scroll::-webkit-scrollbar{width:4px}.hk-scroll::-webkit-scrollbar-thumb{background:${C.bd};border-radius:2px}
.hk-need:hover{background:${C.cyanB}!important;color:${C.cyan}!important}
`;

// ── SUB-COMPONENTS ─────────────────────────────────────────────
const Dot = ({c=C.cyan,s=7}) => <span className="hk-pulse" style={{display:"inline-block",width:s,height:s,borderRadius:"50%",background:c,boxShadow:`0 0 ${s+2}px ${c}`,flexShrink:0}}/>;

const Typing = () => (
  <div style={{display:"flex",alignItems:"center",gap:5,padding:"10px 14px"}}>
    <img src={AVATAR} alt="" style={{width:20,height:20,borderRadius:6,marginRight:4}} onError={e=>{e.target.style.display="none"}}/>
    <span style={{fontSize:9.5,color:C.cyan,fontWeight:700,letterSpacing:1,fontFamily:FM}}>H.K.</span>
    {[0,1,2].map(i=><span key={i} className="hk-dot" style={{width:4,height:4,borderRadius:"50%",background:C.cyan,animationDelay:`${i*.15}s`}}/>)}
  </div>
);

const Badge = ({s}) => {
  const clr = {IDLE:C.tx3,INTAKE:C.amber,CLASSIFY:C.amber,CLARIFY:C.cyan,FIX:C.green,VERIFY:C.green,ESCALATE:C.red,RESOLVED:C.teal}[s]||C.tx3;
  return <span style={{fontFamily:FM,fontSize:9.5,fontWeight:600,color:clr,background:`${clr}18`,padding:"1px 7px",borderRadius:3,letterSpacing:.5}}>{s}</span>;
};

const Steps = ({items}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:8}}>
    {items.map((s,i)=>(
      <div key={i} style={{display:"flex",gap:7,alignItems:"flex-start"}}>
        <span style={{fontFamily:FM,fontSize:10,fontWeight:700,color:C.cyan,background:C.cyanA,width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{i+1}</span>
        <span style={{fontSize:13,lineHeight:1.55,color:C.tx}}>{s}</span>
      </div>
    ))}
  </div>
);

const Options = ({opts, onPick, msgId, disabled}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:9}}>
    {opts.map((o,i)=>(
      <button key={i} className="hk-opt" disabled={disabled}
        onClick={()=>onPick(o, msgId)}
        style={{background:C.cyanA,color:C.cyan,border:`1px solid ${C.cyanB}`,borderRadius:20,padding:"6px 13px",fontSize:12,fontWeight:500,cursor:disabled?"default":"pointer",fontFamily:F,transition:"all .15s",opacity:disabled?.4:1}}>
        {o}
      </button>
    ))}
  </div>
);

const Msg = ({m, onPick, answered, isLast, typing}) => {
  const isU = m.role === "user";
  const optDisabled = answered.has(m.id) || (m.opts && !isLast) || typing;
  return (
    <div className="hk-in" style={{alignSelf:isU?"flex-end":"flex-start",maxWidth:"90%"}}>
      {!isU && (
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3,marginLeft:2}}>
          <img src={AVATAR} alt="" style={{width:16,height:16,borderRadius:4}} onError={e=>{e.target.style.display="none"}}/>
          <span style={{fontSize:9.5,color:C.cyanDk,fontWeight:700,letterSpacing:1,fontFamily:FM}}>H.K.</span>
          {m.m && <span style={{fontSize:8.5,color:C.tx3,fontFamily:FM}}>
            {[m.m.c, m.m.v, m.m.p && `${(m.m.p*100)|0}%`].filter(Boolean).join(" · ")}
          </span>}
        </div>
      )}
      <div style={{
        background: isU ? `linear-gradient(135deg,${C.cyan},${C.teal})` : m.alert ? C.redA : C.sf,
        color: isU ? C.bk : C.tx,
        padding:"10px 14px", borderRadius: isU?"15px 15px 3px 15px":"15px 15px 15px 3px",
        fontSize:13.5, lineHeight:1.6, fontFamily:F, whiteSpace:"pre-wrap", wordBreak:"break-word",
        border: isU?"none":`1px solid ${m.alert?"rgba(248,113,113,.2)":C.bd}`,
      }}>
        {m.alert && <span style={{fontWeight:600}}>⚠️ </span>}
        {m.t}
        {m.steps && <Steps items={m.steps}/>}
      </div>
      {m.opts && <Options opts={m.opts} onPick={onPick} msgId={m.id} disabled={optDisabled}/>}
    </div>
  );
};

const Safety = () => (
  <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:C.amberA,borderRadius:7,fontSize:10.5,color:C.tx2,lineHeight:1.3,border:`1px solid rgba(251,191,36,.08)`}}>
    <span style={{fontSize:12,flexShrink:0}}>🔒</span>
    <span><b style={{color:C.amber}}>Safety:</b> Never share passwords, SSNs, bank info, or 2FA codes.</span>
  </div>
);

// ── CHAT PANEL ─────────────────────────────────────────────────
function Panel({ engine, compact=false, showHead=true }) {
  const { msgs, typing, st, meta, send, quick, pick, reset, needHelp, answered } = engine;
  const [inp, setInp] = useState("");
  const ref = useRef(null);
  const iRef = useRef(null);

  useEffect(()=>{
    if(ref.current) requestAnimationFrame(()=>ref.current.scrollTop=ref.current.scrollHeight);
  },[msgs,typing]);

  const go = () => {
    const t = inp.trim(); if(!t||typing) return;
    setInp(""); send(t); iRef.current?.focus();
  };

  const has = msgs.length > 0;
  const lastHk = [...msgs].reverse().find(m=>m.role!=="user");

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",fontFamily:F}}>
      {showHead && (
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${C.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:`linear-gradient(135deg,${C.cyanA},transparent)`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <img src={AVATAR} alt="H.K." style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.bd}`}} onError={e=>{e.target.style.display="none"}}/>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.wh}}>H.K. <span style={{fontWeight:400,color:C.tx2,fontSize:11}}>Help Desk Architect</span></div>
              {st!=="IDLE"&&<div style={{display:"flex",alignItems:"center",gap:5,marginTop:1}}><Dot c={st==="ESCALATE"?C.red:st==="RESOLVED"?C.teal:st==="FIX"?C.green:C.cyan} s={5}/><Badge s={st}/>{meta.p&&<span style={{fontSize:9.5,color:C.tx3,fontFamily:FM}}>{(meta.p*100)|0}%</span>}</div>}
            </div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            {has&&<button onClick={reset} className="hk-r" style={{background:"transparent",border:`1px solid ${C.bd}`,borderRadius:5,padding:"3px 9px",fontSize:10,color:C.tx2,cursor:"pointer",fontFamily:F,transition:"all .15s"}}>New</button>}
            <Dot c={typing?C.amber:C.green} s={5}/>
          </div>
        </div>
      )}

      <div ref={ref} className="hk-scroll" style={{flex:1,overflowY:"auto",padding:compact?"11px":"14px",display:"flex",flexDirection:"column",gap:10}}>
        {!has ? (
          <div className="hk-in">
            <div style={{textAlign:"center",marginBottom:compact?10:16}}>
              <img src={AVATAR} alt="H.K." style={{width:compact?40:52,height:compact?40:52,borderRadius:12,border:`2px solid ${C.bd}`,margin:"0 auto 8px"}} onError={e=>{e.target.style.display="none"}}/>
              <div style={{fontSize:compact?13.5:15,fontWeight:600,color:C.wh,marginBottom:3}}>Ask H.K. — get help now</div>
              {!compact&&<div style={{fontSize:12.5,color:C.tx2,lineHeight:1.5,maxWidth:340,margin:"0 auto"}}>Describe your issue or choose a quick start below.</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:compact?"1fr":"1fr 1fr",gap:5,marginBottom:10}}>
              {QS.map(q=>(
                <button key={q.k} className="hk-qs" onClick={()=>quick(q.k)}
                  style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:9,padding:compact?"7px 9px":"9px 11px",textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:7,fontSize:compact?11.5:12.5,color:C.tx,fontFamily:F,transition:"all .15s"}}>
                  <span style={{fontSize:compact?13:15,flexShrink:0}}>{q.e}</span><span>{q.l}</span>
                </button>
              ))}
            </div>
            <Safety/>
          </div>
        ) : (
          <>
            {msgs.map((m,i)=>(
              <Msg key={m.id||i} m={m} onPick={pick} answered={answered} isLast={m===lastHk} typing={typing}/>
            ))}
            {typing && <Typing/>}
          </>
        )}
      </div>

      {/* Input */}
      <div style={{padding:"9px 12px",borderTop:`1px solid ${C.bd}`,display:"flex",gap:7,flexShrink:0,background:C.bg1}}>
        <input ref={iRef} value={inp} onChange={e=>setInp(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&go()}
          placeholder="Describe your issue..." aria-label="Type your message"
          className="hk-input"
          style={{flex:1,background:C.sf,border:`1px solid ${C.bd}`,borderRadius:9,padding:"8px 12px",color:C.tx,fontSize:13,fontFamily:F,transition:"all .2s"}}/>
        <button onClick={go} disabled={typing||!inp.trim()} className="hk-btn" aria-label="Send"
          style={{background:"transparent",color:typing||!inp.trim()?C.tx3:C.cyan,border:`1px solid ${typing||!inp.trim()?C.bd:C.cyan}`,borderRadius:9,padding:"8px 15px",fontWeight:700,fontSize:12.5,cursor:typing?"not-allowed":"pointer",fontFamily:F,transition:"all .2s"}}>
          Send
        </button>
      </div>

      {/* "I still need help" — FUNCTIONAL button */}
      <div style={{padding:"6px 12px",borderTop:`1px solid ${C.bdS}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <span style={{fontSize:9,color:C.tx3}}>Named for Horace King, bridge builder</span>
        <button onClick={needHelp} className="hk-need"
          style={{fontSize:11,color:C.cyanDk,background:"transparent",border:`1px solid ${C.bdS}`,borderRadius:6,padding:"3px 10px",cursor:"pointer",fontFamily:F,fontWeight:600,transition:"all .15s"}}>
          I still need help →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT: HKChat — Inline widget (replaces "Ask H.K." section)
// ═══════════════════════════════════════════════════════════════
export function HKChat({ height = 520 }) {
  const engine = useChat();
  return (
    <>
      <style>{css}</style>
      <div style={{background:C.bg1,borderRadius:14,border:`1px solid ${C.bd}`,overflow:"hidden",height,display:"flex",flexDirection:"column",boxShadow:"0 4px 24px rgba(0,0,0,.3)"}}>
        <Panel engine={engine}/>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT: HKBubble — Floating bottom-right chat bubble
// ═══════════════════════════════════════════════════════════════
export function HKBubble() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [tip, setTip] = useState(false);
  const engine = useChat();

  useEffect(()=>{const t=setTimeout(()=>{if(!open)setTip(true)},3500);return()=>clearTimeout(t)},[open]);
  useEffect(()=>{if(open){setTip(false);setOpened(true)}},[open]);

  const unread = !open && engine.msgs.filter(m=>m.role!=="user").length;

  return (
    <>
      <style>{css}</style>
      <div style={{position:"fixed",bottom:20,right:20,zIndex:9999,fontFamily:F}}>
        {/* Panel */}
        <div style={{
          position:"absolute",bottom:68,right:0,width:370,
          height:open?520:0,opacity:open?1:0,
          transform:open?"scale(1) translateY(0)":"scale(.92) translateY(14px)",
          transformOrigin:"bottom right",transition:"all .3s cubic-bezier(.16,1,.3,1)",
          pointerEvents:open?"auto":"none",background:C.bg1,borderRadius:14,
          border:`1px solid ${C.bd}`,boxShadow:"0 20px 60px rgba(0,0,0,.55)",
          overflow:"hidden",display:"flex",flexDirection:"column",
        }}>
          {(open||opened) && <Panel engine={engine} compact={true}/>}
        </div>

        {/* Tooltip */}
        {tip&&!open&&(
          <div className="hk-in" onClick={()=>setOpen(true)} style={{
            position:"absolute",bottom:68,right:0,background:C.sf,
            border:`1px solid ${C.bd}`,borderRadius:11,padding:"9px 13px",
            boxShadow:"0 8px 32px rgba(0,0,0,.45)",maxWidth:210,cursor:"pointer",
          }}>
            <div style={{fontSize:12.5,color:C.tx,lineHeight:1.4}}>Need tech help? <span style={{color:C.cyan,fontWeight:600}}>Ask H.K.</span></div>
            <div style={{position:"absolute",bottom:-6,right:22,width:12,height:12,background:C.sf,border:`1px solid ${C.bd}`,borderTop:"none",borderLeft:"none",transform:"rotate(45deg)"}}/>
          </div>
        )}

        {/* Bubble */}
        <button onClick={()=>setOpen(o=>!o)} aria-label={open?"Close H.K.":"Ask H.K."}
          style={{
            width:56,height:56,borderRadius:"50%",cursor:"pointer",border:"none",
            background:open?C.sf:`linear-gradient(135deg,${C.cyan},${C.teal})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:open?"0 8px 32px rgba(0,0,0,.45)":`0 4px 20px ${C.cyanG}`,
            transition:"all .3s",overflow:"hidden",
            animation:!open&&!opened?"hkRing 2s infinite":"none",
          }}>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.tx2} strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          ) : (
            <img src={BUBBLE_ICON} alt="H.K." style={{width:56,height:56,borderRadius:"50%",objectFit:"cover"}}
              onError={e=>{e.target.style.display="none"; e.target.parentElement.innerHTML=`<span style="font-family:${FM};font-weight:800;font-size:14px;color:${C.bk}">H.K.</span>`}}/>
          )}
        </button>

        {/* Unread badge */}
        {unread>0&&(
          <div style={{position:"absolute",top:-3,right:-3,width:18,height:18,borderRadius:"50%",background:C.red,border:`2px solid ${C.bg}`,fontSize:9,fontWeight:700,color:C.wh,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</div>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT: HKHero — Compact hero entry point
// ═══════════════════════════════════════════════════════════════
export function HKHero() {
  const engine = useChat();
  const [open, setOpen] = useState(false);
  return (
    <>
      <style>{css}</style>
      {!open ? (
        <button onClick={()=>setOpen(true)} className="hk-qs"
          style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:13,padding:"12px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:11,width:"100%",maxWidth:380,fontFamily:F,transition:"all .2s"}}>
          <img src={AVATAR} alt="H.K." style={{width:36,height:36,borderRadius:9,border:`1px solid ${C.bd}`}} onError={e=>{e.target.style.display="none"}}/>
          <div style={{textAlign:"left",flex:1}}>
            <div style={{fontSize:13.5,fontWeight:600,color:C.wh}}>Ask H.K. — get help now</div>
            <div style={{fontSize:11.5,color:C.tx2}}>Free AI tech support · 24/7</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      ) : (
        <div className="hk-pop" style={{background:C.bg1,borderRadius:14,border:`1px solid ${C.bd}`,overflow:"hidden",height:440,display:"flex",flexDirection:"column",boxShadow:"0 8px 32px rgba(0,0,0,.45)",width:"100%",maxWidth:420}}>
          <Panel engine={engine} compact={true}/>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT: Full demo (artifact preview)
// ═══════════════════════════════════════════════════════════════
export default function HKDemo() {
  const [tab, setTab] = useState("bubble");
  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.tx,fontFamily:F,display:"flex",flexDirection:"column"}}>
      <style>{css}</style>
      <header style={{padding:"14px 20px",borderBottom:`1px solid ${C.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg1}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <img src={AVATAR} alt="" style={{width:28,height:28,borderRadius:7}} onError={e=>{e.target.style.display="none"}}/>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:C.wh}}>H.K. Widget System <span style={{color:C.cyan}}>v3</span></div>
            <div style={{fontSize:10.5,color:C.tx2}}>TechBridge Collective · Push-Ready Package</div>
          </div>
        </div>
        <div style={{display:"flex",gap:3,background:C.sf,borderRadius:9,padding:2,border:`1px solid ${C.bd}`}}>
          {[{id:"bubble",l:"💬 Floating Bubble"},{id:"inline",l:"📋 Inline Chat"},{id:"hero",l:"🌉 Hero Entry"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?C.cyan:"transparent",color:tab===t.id?C.bk:C.tx2,border:"none",borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F,transition:"all .2s"}}>{t.l}</button>
          ))}
        </div>
      </header>

      <main style={{flex:1,padding:28,display:"flex",justifyContent:"center",alignItems:"flex-start"}}>
        {tab==="bubble"&&(
          <div style={{textAlign:"center",maxWidth:460,paddingTop:60}}>
            <div style={{fontSize:48,marginBottom:12}}>🌉</div>
            <h2 style={{fontSize:22,fontWeight:700,color:C.wh,margin:"0 0 8px"}}>Floating Chat Bubble</h2>
            <p style={{color:C.tx2,lineHeight:1.6,fontSize:13.5}}>
              Bottom-right corner → click the H.K. bubble to open.<br/>
              Shows tooltip after 3.5s · Unread badge · Avatar icon.<br/>
              "I still need help" triggers live escalation flow.
            </p>
            <div style={{marginTop:20,padding:14,background:C.sf,borderRadius:10,border:`1px solid ${C.bd}`,textAlign:"left"}}>
              <div style={{fontSize:11,color:C.tx3,fontFamily:FM,marginBottom:6}}>// layout.tsx</div>
              <code style={{fontSize:12,color:C.cyan,fontFamily:FM}}>{'import { HKBubble } from "@/components/HKWidget"'}</code><br/>
              <code style={{fontSize:12,color:C.tx,fontFamily:FM}}>{'<HKBubble />'}</code>
            </div>
          </div>
        )}
        {tab==="inline"&&(
          <div style={{width:"100%",maxWidth:460}}>
            <p style={{color:C.tx2,fontSize:12.5,marginBottom:10,textAlign:"center"}}>Replaces "H.K. loading…" in the Ask H.K. section</p>
            <HKChat height={500}/>
          </div>
        )}
        {tab==="hero"&&(
          <div style={{width:"100%",maxWidth:400,paddingTop:40}}>
            <p style={{color:C.tx2,fontSize:12.5,marginBottom:10,textAlign:"center"}}>Hero section entry — click to expand</p>
            <HKHero/>
          </div>
        )}
      </main>

      <HKBubble/>
    </div>
  );
}
