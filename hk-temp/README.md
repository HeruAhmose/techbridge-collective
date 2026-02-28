# H.K. — Horace King AI Help Desk Architect
## TechBridge Collective · Push-Ready Package v3.0

### Package Contents

```
hk-deploy/
├── components/
│   └── HKWidget.jsx          ← Main widget (3 exports)
├── config/
│   ├── hk_openapi.yaml       ← API specification (17 endpoints)
│   ├── hk_routing_rules.yaml ← Triage taxonomy + routing rules
│   └── hk_prompt_pack.json   ← LLM system prompt + schemas
├── public/
│   └── images/hk/
│       ├── HK_avatar_80.jpg          ← Chat header avatar (2x)
│       ├── HK_avatar_1024.jpg        ← Full-size avatar
│       ├── HK_bubble_icon_112.png    ← Floating bubble button (2x)
│       ├── HK_bubble_icon_512.png    ← Bubble icon source
│       ├── HK_hero_poster.jpg        ← Hero section background
│       ├── HK_og_image.jpg           ← Social sharing (1200×630)
│       ├── HK_favicon_32.png         ← Browser tab icon
│       ├── HK_favicon_256.png        ← Mid-size favicon
│       └── HK_apple_touch_icon.png   ← iOS home screen (180×180)
├── tests/
│   └── hk_golden_tickets.json ← 20-ticket eval harness
├── HK_Architecture_Spec_v2.docx ← Full architecture document
└── README.md                  ← This file
```

---

### Quick Integration (3 steps)

#### 1. Copy files into your Next.js project

```bash
# From your project root:
cp -r hk-deploy/components/HKWidget.jsx src/components/
cp -r hk-deploy/public/images public/
cp -r hk-deploy/config .
cp -r hk-deploy/tests .
```

#### 2. Add the floating bubble to your root layout

```tsx
// src/app/layout.tsx (or _app.tsx)
import { HKBubble } from "@/components/HKWidget";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/hk/HK_favicon_32.png" />
        <link rel="apple-touch-icon" href="/images/hk/HK_apple_touch_icon.png" />
        <meta property="og:image" content="/images/hk/HK_og_image.jpg" />
      </head>
      <body>
        {children}
        <HKBubble />   {/* ← Always-visible bottom-right chat bubble */}
      </body>
    </html>
  );
}
```

#### 3. Replace the "H.K. loading…" placeholders on your pages

```tsx
// Homepage — "Ask H.K." section
import { HKChat } from "@/components/HKWidget";

// Replace the <p>H.K. loading…</p> with:
<HKChat height={520} />

// Hero section mini-entry (where "H.K. loading…" appears in the hero)
import { HKHero } from "@/components/HKWidget";

<HKHero />
```

---

### Component API

| Export | Purpose | Props |
|--------|---------|-------|
| `<HKBubble />` | Floating bottom-right chat bubble | none |
| `<HKChat />` | Inline chat panel (Ask H.K. section) | `height?: number` (default 520) |
| `<HKHero />` | Compact hero entry → expands to chat | none |
| `default` | Full demo with tab switcher | none |

---

### What's Fixed in v3

- **"I still need help" button** — Now a functional button that triggers an in-chat escalation flow ("I still need help — can I talk to a person?") with hub schedule and contact info, instead of a dead `<a>` link.
- **Option buttons** — Every option (iPhone/Android/Not sure, MyChart/Zoom, etc.) fires a real response with follow-up guidance. 40+ option→response mappings.
- **Floating bubble** — Shows H.K.'s avatar image, pulses on first load, tooltip after 3.5s, unread badge counter.
- **Claude API integration** — Tries Claude Sonnet first for truly generative responses; falls back gracefully to keyword-matched scenarios if API is unavailable.
- **State machine** — Real-time state badge (INTAKE→CLASSIFY→CLARIFY→FIX→ESCALATE→RESOLVED) with confidence percentage.
- **Avatar integration** — H.K.'s face appears in the bubble button, chat header, typing indicator, and welcome screen.
- **Image fallbacks** — All `<img>` tags have `onError` handlers so the widget works even without images deployed yet.

---

### Config Files

| File | Purpose |
|------|---------|
| `hk_openapi.yaml` | OpenAPI 3.1 spec — 17 endpoints, full request/response schemas |
| `hk_routing_rules.yaml` | Triage taxonomy, severity rules, routing logic, PII redaction patterns |
| `hk_prompt_pack.json` | System prompt, 4 output schemas, 6 tool schemas, 3 few-shot examples |
| `hk_golden_tickets.json` | 20 eval tickets with expected outputs, deploy gate thresholds |

---

### Architecture

See `HK_Architecture_Spec_v2.docx` for the complete 12-section production spec covering:
- Multi-tenant SaaS deployment (Fly.io → K8s migration path)
- Post-quantum cryptography (ML-KEM-768 + ML-DSA-65 hybrid)
- Self-learning engine (RAG, Bayesian routing, RLHF, DSPy prompt evolution)
- ITSM adapter pattern (JSM default, ServiceNow/Zendesk swappable)
- Zero-trust security with mTLS, JWT+PQ signatures, RBAC
- WCAG 2.2 AA+ accessibility
