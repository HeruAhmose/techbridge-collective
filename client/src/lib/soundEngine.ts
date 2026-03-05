/*
 * ═══════════════════════════════════════════════════════════════
 * TAMERIAN SOUND ENGINE — Web Audio API Cinematic Sound Design
 * All sounds procedurally generated — zero external files
 * ═══════════════════════════════════════════════════════════════
 */

type SoundType =
  | "intro_rumble"
  | "crystallize"
  | "whoosh"
  | "reveal"
  | "click"
  | "hover"
  | "modal_open"
  | "modal_close"
  | "step"
  | "accordion"
  | "section_enter"
  | "ambient"
  | "success"
  | "data_point";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private _muted = false;
  private _initialized = false;
  private _volume = 0.35;

  get muted() {
    return this._muted;
  }

  get initialized() {
    return this._initialized;
  }

  async init() {
    if (this._initialized) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._volume;
      this.masterGain.connect(this.ctx.destination);
      this._initialized = true;
    } catch {
      console.warn("Web Audio API not available");
    }
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this._muted ? 0 : this._volume, this.ctx!.currentTime, 0.05);
    }
  }

  toggleMute() {
    this._muted = !this._muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this._muted ? 0 : this._volume,
        this.ctx.currentTime,
        0.08
      );
    }
    return this._muted;
  }

  play(type: SoundType) {
    if (!this.ctx || !this.masterGain || this._muted) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    switch (type) {
      case "intro_rumble":
        this._introRumble();
        break;
      case "crystallize":
        this._crystallize();
        break;
      case "whoosh":
        this._whoosh();
        break;
      case "reveal":
        this._reveal();
        break;
      case "click":
        this._click();
        break;
      case "hover":
        this._hover();
        break;
      case "modal_open":
        this._modalOpen();
        break;
      case "modal_close":
        this._modalClose();
        break;
      case "step":
        this._step();
        break;
      case "accordion":
        this._accordion();
        break;
      case "section_enter":
        this._sectionEnter();
        break;
      case "ambient":
        this._startAmbient();
        break;
      case "success":
        this._success();
        break;
      case "data_point":
        this._dataPoint();
        break;
    }
  }

  stopAmbient() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
      } catch { /* already stopped */ }
      this.ambientOsc = null;
    }
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
  }

  // ─── Deep bass rumble for intro ───
  private _introRumble() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;

    // Sub-bass drone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(30, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 3);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.8);
    gain.gain.linearRampToValueAtTime(0.3, t + 2.5);
    gain.gain.linearRampToValueAtTime(0, t + 3.8);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 4);

    // Harmonic overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(60, t);
    osc2.frequency.exponentialRampToValueAtTime(110, t + 3);
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.15, t + 1);
    gain2.gain.linearRampToValueAtTime(0, t + 3.5);
    osc2.connect(gain2).connect(this.masterGain!);
    osc2.start(t);
    osc2.stop(t + 4);

    // Noise sweep
    this._noiseBurst(t + 0.2, 3, 0.06);
  }

  // ─── Crystal chime for crystallization effect ───
  private _crystallize() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const freqs = [1200, 1800, 2400, 3200, 4000];

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f + Math.random() * 100;
      gain.gain.setValueAtTime(0, t + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, t + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.8);
      osc.connect(gain).connect(this.masterGain!);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.9);
    });
  }

  // ─── Whoosh for transitions ───
  private _whoosh() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(4000, t + 0.15);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.4);
    filter.Q.value = 2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    source.connect(filter).connect(gain).connect(this.masterGain!);
    source.start(t);
    source.stop(t + 0.5);
  }

  // ─── Reveal sound for hero text ───
  private _reveal() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;

    // Rising tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.6);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.9);

    // Shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1600, t);
    osc2.frequency.exponentialRampToValueAtTime(2400, t + 0.5);
    gain2.gain.setValueAtTime(0, t + 0.1);
    gain2.gain.linearRampToValueAtTime(0.06, t + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    osc2.connect(gain2).connect(this.masterGain!);
    osc2.start(t);
    osc2.stop(t + 0.8);
  }

  // ─── UI Click ───
  private _click() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.06);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // ─── Hover tone ───
  private _hover() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 600 + Math.random() * 200;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // ─── Modal open — cinematic rise ───
  private _modalOpen() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;

    // Deep tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.3);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.6);

    // High shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 2000;
    gain2.gain.setValueAtTime(0, t + 0.05);
    gain2.gain.linearRampToValueAtTime(0.06, t + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc2.connect(gain2).connect(this.masterGain!);
    osc2.start(t);
    osc2.stop(t + 0.5);
  }

  // ─── Modal close — descending tone ───
  private _modalClose() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // ─── Manufacturing step progression ───
  private _step() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.1);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.2);

    // Subtle click
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 1200;
    gain2.gain.setValueAtTime(0.06, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc2.connect(gain2).connect(this.masterGain!);
    osc2.start(t);
    osc2.stop(t + 0.08);
  }

  // ─── Accordion expand ───
  private _accordion() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.12);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // ─── Section enter — subtle depth tone ───
  private _sectionEnter() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.4);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.7);

    // Subtle high shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 1800 + Math.random() * 400;
    gain2.gain.setValueAtTime(0, t + 0.05);
    gain2.gain.linearRampToValueAtTime(0.025, t + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc2.connect(gain2).connect(this.masterGain!);
    osc2.start(t);
    osc2.stop(t + 0.5);
  }

  // ─── Ambient atmospheric hum ───
  private _startAmbient() {
    if (this.ambientOsc) return;
    const ctx = this.ctx!;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0;
    this.ambientGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2);
    this.ambientGain.connect(this.masterGain!);

    // Deep drone
    this.ambientOsc = ctx.createOscillator();
    this.ambientOsc.type = "sine";
    this.ambientOsc.frequency.value = 55;
    this.ambientOsc.connect(this.ambientGain);
    this.ambientOsc.start();

    // Very subtle LFO modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain).connect(this.ambientOsc.frequency);
    lfo.start();

    // Second harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 82.5;
    gain2.gain.value = 0.015;
    osc2.connect(gain2).connect(this.ambientGain);
    osc2.start();
  }

  // ─── Success chime ───
  private _success() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, t + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, t + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.5);
      osc.connect(gain).connect(this.masterGain!);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.6);
    });
  }

  // ─── Data point hover ───
  private _dataPoint() {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1000 + Math.random() * 500;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // ─── Noise burst helper ───
  private _noiseBurst(startTime: number, duration: number, volume: number) {
    const ctx = this.ctx!;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 200;
    filter.Q.value = 1;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.3);
    gain.gain.linearRampToValueAtTime(volume * 0.5, startTime + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    source.connect(filter).connect(gain).connect(this.masterGain!);
    source.start(startTime);
    source.stop(startTime + duration);
  }

  destroy() {
    this.stopAmbient();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this._initialized = false;
  }
}

// Singleton
export const soundEngine = new SoundEngine();
export type { SoundType };
