import { spawn } from "node:child_process";
import fs from "node:fs/promises";

const PORT = 4187;
const BASE = `http://127.0.0.1:${PORT}`;
const CDP_HTTP = "http://127.0.0.1:9237";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitFor(url, attempts = 80) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {}
    await sleep(250);
  }
  throw new Error(`timeout waiting for ${url}`);
}

class CDP {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
  }
  async open() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", event => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const pending = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error
          ? pending.reject(new Error(JSON.stringify(msg.error)))
          : pending.resolve(msg.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(
        result.exceptionDetails.text || "Runtime.evaluate failed"
      );
    }
    return result.result.value;
  }
  close() {
    this.ws?.close();
  }
}

const server = spawn(process.execPath, ["dist/index.js"], {
  env: { ...process.env, NODE_ENV: "production", PORT: String(PORT) },
  stdio: "ignore",
});
let cdp;

try {
  await waitFor(`${BASE}/`);
  await waitFor(`${CDP_HTTP}/json/version`);
  const targets = await (await fetch(`${CDP_HTTP}/json/list`)).json();
  const target = targets.find(item => item.type === "page");
  if (!target?.webSocketDebuggerUrl) throw new Error("no Chrome page target");

  cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      const Native = window.AudioContext || window.webkitAudioContext;
      window.__tbAudioProbe = { contexts: 0, oscillators: 0 };
      if (!Native) return;
      const Wrapped = new Proxy(Native, {
        construct(Target, args) {
          const ctx = new Target(...args);
          window.__tbAudioProbe.contexts += 1;
          const createOscillator = ctx.createOscillator.bind(ctx);
          ctx.createOscillator = (...oscArgs) => {
            window.__tbAudioProbe.oscillators += 1;
            return createOscillator(...oscArgs);
          };
          return ctx;
        }
      });
      window.AudioContext = Wrapped;
      if (window.webkitAudioContext) window.webkitAudioContext = Wrapped;
    })();`,
  });

  await cdp.send("Page.navigate", { url: `${BASE}/` });
  await sleep(1200);
  await cdp.eval(
    `sessionStorage.setItem("techbridge:intro-seen:v2", "1"); location.reload(); true`
  );
  await sleep(1500);

  const initial = await cdp.eval(`(() => {
    const button = document.querySelector('[data-techbridge-sound]');
    return {
      state: button?.dataset.techbridgeSound,
      pressed: button?.getAttribute('aria-pressed'),
      probe: window.__tbAudioProbe,
      favicon: document.querySelector('link[rel~="icon"]')?.href || null
    };
  })()`);
  if (initial.state !== "off" || initial.pressed !== "false") {
    throw new Error(
      `sound control not truthfully off: ${JSON.stringify(initial)}`
    );
  }
  if (initial.probe.contexts !== 0 || initial.probe.oscillators !== 0) {
    throw new Error(
      `audio initialized before opt-in: ${JSON.stringify(initial.probe)}`
    );
  }
  if (!initial.favicon || !initial.favicon.endsWith("/favicon.svg")) {
    throw new Error(`favicon binding missing: ${initial.favicon}`);
  }

  await cdp.eval(
    `document.querySelector('[data-techbridge-sound]')?.click(); true`
  );
  await sleep(160);
  const waveformBefore = await cdp.eval(
    `getComputedStyle(document.querySelector('[data-techbridge-sound] > div > div')).height`
  );
  await sleep(230);
  const waveformAfter = await cdp.eval(
    `getComputedStyle(document.querySelector('[data-techbridge-sound] > div > div')).height`
  );
  const enabled = await cdp.eval(`(() => ({
    state: document.querySelector('[data-techbridge-sound]')?.dataset.techbridgeSound,
    probe: window.__tbAudioProbe
  }))()`);
  if (
    enabled.state !== "on" ||
    enabled.probe.contexts < 1 ||
    enabled.probe.oscillators < 1
  ) {
    throw new Error(
      `explicit opt-in did not activate audible Web Audio: ${JSON.stringify(enabled)}`
    );
  }
  if (waveformBefore === waveformAfter) {
    throw new Error(
      `enabled waveform did not visibly animate: ${waveformBefore} -> ${waveformAfter}`
    );
  }

  const beforeHK = enabled.probe.oscillators;
  await cdp.eval(
    `document.querySelector('[data-hk-launcher="true"]')?.click(); true`
  );
  await sleep(350);
  const afterHK = await cdp.eval(`window.__tbAudioProbe.oscillators`);
  if (afterHK <= beforeHK) {
    throw new Error(
      `H.K. interaction did not schedule SFX: ${beforeHK} -> ${afterHK}`
    );
  }

  await cdp.eval(
    `document.querySelector('[data-techbridge-sound]')?.click(); true`
  );
  await sleep(350);
  const mutedBefore = await cdp.eval(`window.__tbAudioProbe.oscillators`);
  await cdp.eval(
    `document.querySelector('[data-hk-launcher="true"]')?.click(); true`
  );
  await sleep(300);
  const mutedAfter = await cdp.eval(`window.__tbAudioProbe.oscillators`);
  if (mutedAfter !== mutedBefore) {
    throw new Error(
      `mute failed to suppress SFX: ${mutedBefore} -> ${mutedAfter}`
    );
  }

  const imageState = await cdp.eval(`(() => ({
    broken: [...document.images]
      .filter(image => image.complete && image.naturalWidth === 0)
      .map(image => image.src),
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
  }))()`);
  if (imageState.broken.length) {
    throw new Error(`broken images: ${imageState.broken.join(", ")}`);
  }
  if (imageState.overflow > 1) {
    throw new Error(`horizontal overflow: ${imageState.overflow}px`);
  }

  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await cdp.eval(
    `sessionStorage.removeItem("techbridge:intro-seen:v2"); location.reload(); true`
  );
  await sleep(1400);
  const reduced = await cdp.eval(`(() => ({
    media: matchMedia('(prefers-reduced-motion: reduce)').matches,
    remembered: sessionStorage.getItem('techbridge:intro-seen:v2'),
    soundState: document.querySelector('[data-techbridge-sound]')?.dataset.techbridgeSound,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
  }))()`);
  if (
    !reduced.media ||
    reduced.remembered !== "1" ||
    reduced.soundState !== "off" ||
    reduced.overflow > 1
  ) {
    throw new Error(
      `reduced-motion contract failed: ${JSON.stringify(reduced)}`
    );
  }

  const report = {
    initial,
    enabled,
    waveform: { before: waveformBefore, after: waveformAfter },
    hkSfx: { before: beforeHK, after: afterHK },
    mutedSfx: { before: mutedBefore, after: mutedAfter },
    imageState,
    reduced,
    failures: 0,
  };
  await fs.writeFile(
    "techbridge-experience-audit.json",
    JSON.stringify(report, null, 2)
  );
  console.log("TECHBRIDGE_EXPERIENCE_RUNTIME=PASS");
  console.log(JSON.stringify(report));
} finally {
  cdp?.close();
  if (!server.killed) server.kill("SIGTERM");
}
