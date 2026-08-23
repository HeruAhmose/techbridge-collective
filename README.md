# TechBridge Collective

[![CI](https://github.com/HeruAhmose/techbridge-collective/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/HeruAhmose/techbridge-collective/actions/workflows/ci.yml)

**Proprietary:** This repository is not open source. See [`LICENSE`](LICENSE) and [`PROPRIETARY.md`](PROPRIETARY.md).

**Security:** [`SECURITY.md`](SECURITY.md) — report vulnerabilities privately (GitHub Security tab or maintainer contact).

Copyright (c) 2026 Tamerian Materials and Jonathan Peoples. All rights reserved.

---

## What this is

TechBridge Collective is a three-pillar model for closing the digital divide
at community sites: a **Weekly Help Desk** staffed by paid Digital
Navigators for free, walk-in 1:1 tech help; **H.K.**, a male Help Desk
Architect inspired by Horace King, the 19th-century bridge builder, that uses
deterministic triage to stabilize risk, classify an issue, recommend a safe
next step, and flag cases that need a person; and **TechMinutes®**, a
proprietary non-PII measurement unit that logs every session's duration,
issue category, and resolution status into monthly impact reports for hosting
partners.

H.K. is a product persona inspired by Horace King's bridge-building legacy;
it is not an impersonation of the historical Horace King. The current H.K.
triage runtime is deterministic and runs in the site interface. It does not
send chat text to Claude or another external language-model endpoint.

The site is honest about where the venture actually stands: no hub is
staffed yet. The "Get Help" form's post-submit copy says so directly — it
saves nothing to a live intake system, because `server/index.ts` only serves
static files with an SPA fallback and has no backend. The named-visitor
stories used to illustrate the model (Maria, James, Dorothy, Carlos, Keisha)
are labeled as illustrative scenarios, not real accounts.

---

## Part of TRAI

TechBridge Collective is organ **06 — Hands, community reach** — of TRAI,
the Tamerian Renaissance Alliance Initiative: seven ventures framed as
organs of one organism. A visitor typically arrives through the gate
(`peoples-portfolio`), which links here at `/community`.

| #      | Organ · role                    | Venture                   | Status                           | Where it lives                                                                                                                                                                            |
| ------ | ------------------------------- | ------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01     | Skeleton — material sovereignty | Tamerian Materials        | U.S. provisional filed           | own repo: [tamerian-materials](https://github.com/HeruAhmose/tamerian-materials) → [tamerian-materials.com](https://tamerian-materials.com/)                                              |
| 02     | Heart — biological sovereignty  | True Mélange Φ            | Formulation set · entity pending | own repo: [blue-gold-daily](https://github.com/HeruAhmose/blue-gold-daily) → [heruahmose.github.io/blue-gold-daily/layers.html](https://heruahmose.github.io/blue-gold-daily/layers.html) |
| 03     | Brain — cognitive sovereignty   | Queen Califia             | Demo standing                    | own repo: [QueenCalifia-CyberAI](https://github.com/HeruAhmose/QueenCalifia-CyberAI) → [queencalifia-cyberai.web.app](https://queencalifia-cyberai.web.app/)                              |
| 04     | Vessels — mobility sovereignty  | Mela Nation               | EIN filed · early development    | a page inside [`trai-portfolio`](https://github.com/HeruAhmose/trai-portfolio) (the estate) — no separate repo                                                                            |
| 05     | Skin — identity sovereignty     | MeLaNiNa                  | EIN filed · early development    | a page inside [`trai-portfolio`](https://github.com/HeruAhmose/trai-portfolio) (the estate) — no separate repo                                                                            |
| **06** | **Hands — community reach**     | **TechBridge Collective** | **Designed · not yet operating** | **you are here** · also linked from the gate: [`peoples-portfolio`](https://github.com/HeruAhmose/peoples-portfolio) at `/community`                                                      |
| 07     | Lymphatic — regenerative return | The Peoples Foundation    | EIN obtained · exemption pending | a page inside [`trai-portfolio`](https://github.com/HeruAhmose/trai-portfolio) (the estate) — no separate repo                                                                            |

---

## Tech stack

- **React 19** (`react` / `react-dom` `^19.2.8`) + **Vite 7** (`vite` `7.3.6`, `@vitejs/plugin-react`)
- **wouter** `^3.10.0` for client-side routing
- **Tailwind CSS 4** (`tailwindcss` `^4.3.3`, `@tailwindcss/vite`) with Radix UI primitives, `framer-motion`, `gsap`
- **Express** `^5.2.1` server (`server/index.ts`) — serves the built static site and an SPA fallback only; no database, no real backend routes
- **TypeScript** `5.6.3`, **Vitest** `4.1.10`, **Prettier** `^3.9.6`
- **pnpm** `10.34.5` as package manager

H.K. is implemented in `client/src/components/HKChatBubble.tsx`, backed by the
deterministic state/routing logic in `client/src/lib/hkTriage.ts`. Security
or scam signals are stabilized and escalated before ordinary troubleshooting;
known issue classes are routed to bounded safe-fix guidance; ambiguous issues
ask for one clarifying category. `client/src/lib/hkTriage.test.ts` contains
the regression suite for these guarantees.

A future generative-AI augmentation must add a real authenticated server-side
route, secret management, rate limiting, safety tests, and truthful runtime
status before the interface can claim an external model is powering H.K.

---

## Setup

```bash
pnpm install
```

## Scripts

| Script              | Purpose                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `pnpm dev`          | Start the Vite dev server (`vite --host`)                              |
| `pnpm build`        | Build the client with Vite, then bundle `server/index.ts` with esbuild |
| `pnpm start`        | Run the production build (`NODE_ENV=production node dist/index.js`)    |
| `pnpm preview`      | Preview the built client (`vite preview --host`)                       |
| `pnpm check`        | Type-check with `tsc --noEmit`                                         |
| `pnpm format`       | Format the repo with Prettier                                          |
| `pnpm format:check` | Check formatting without writing                                       |
| `pnpm ci`           | `pnpm check && pnpm format:check && pnpm build`                        |
