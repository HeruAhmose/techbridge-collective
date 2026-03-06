/**
 * TechBridge Sound Engine — Rich, Warm Procedural Audio
 * 
 * Web Audio API synthesis with convolution reverb for the "Bridge" narrative.
 * Sounds are warm, inviting, and human — wooden bridge planks, golden chimes,
 * gentle water, warm tones. Volume is set to be clearly audible.
 * 
 * Uses oscillators + filters + gain envelopes + convolver reverb for depth.
 */

type SoundType =
  | 'bridge_plank'      // Wooden plank placed — warm knock
  | 'bridge_cable'      // Cable drawn — gentle metallic hum
  | 'bridge_complete'   // Bridge fully built — golden chime cascade
  | 'story_reveal'      // Story card opens — page turn + warm tone
  | 'story_close'       // Story card closes — soft close
  | 'section_enter'     // New section scrolled into view — ambient swell
  | 'nav_click'         // Navigation click — soft tap
  | 'form_focus'        // Form field focused — gentle ping
  | 'form_submit'       // Form submitted — success chime
  | 'hk_open'           // H.K. chat opens — bridge connection tone
  | 'hk_close'          // H.K. chat closes — gentle fade
  | 'hk_message'        // H.K. sends a message — soft notification
  | 'hk_typing'         // H.K. is typing — subtle pulse
  | 'pillar_hover'      // Pillar card hovered — resonant touch
  | 'counter_tick'      // Number counting up — soft tick
  | 'intro_advance'     // Intro phase advance — whoosh + chime
  | 'ambient_loop';     // Background ambient — very subtle

class TBSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private dryGain: GainNode | null = null;
  private enabled = false;
  private volume = 0.55; // Louder default — actually audible

  async init(): Promise<void> {
    if (this.ctx) {
      // Resume if suspended (browser autoplay policy)
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Create reverb chain for spatial depth
      this.convolver = this.ctx.createConvolver();
      this.convolver.buffer = this.createReverbIR(2.0, 3.0);

      this.reverbGain = this.ctx.createGain();
      this.reverbGain.gain.value = 0.25; // Wet signal

      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.value = 0.85; // Dry signal

      // Routing: masterGain → dry + reverb → destination
      this.dryGain.connect(this.ctx.destination);
      this.convolver.connect(this.reverbGain);
      this.reverbGain.connect(this.ctx.destination);

      this.masterGain.connect(this.dryGain);
      this.masterGain.connect(this.convolver);

      this.enabled = true;
    } catch {
      // Web Audio not supported
    }
  }

  // Generate impulse response for reverb
  private createReverbIR(duration: number, decay: number): AudioBuffer {
    const rate = this.ctx!.sampleRate;
    const length = rate * duration;
    const buffer = this.ctx!.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buffer;
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        val ? this.volume : 0,
        this.ctx.currentTime + 0.3
      );
    }
  }

  setMuted(muted: boolean) {
    this.setEnabled(!muted);
  }

  setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.enabled && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        this.volume,
        this.ctx.currentTime + 0.1
      );
    }
  }

  isEnabled() { return this.enabled; }
  getVolume() { return this.volume; }

  play(type: SoundType) {
    if (!this.ctx || !this.masterGain || !this.enabled) return;
    // Resume context if suspended (user gesture required)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const t = this.ctx.currentTime;

    try {
      switch (type) {
        case 'bridge_plank': this.playBridgePlank(t); break;
        case 'bridge_cable': this.playBridgeCable(t); break;
        case 'bridge_complete': this.playBridgeComplete(t); break;
        case 'story_reveal': this.playStoryReveal(t); break;
        case 'story_close': this.playStoryClose(t); break;
        case 'section_enter': this.playSectionEnter(t); break;
        case 'nav_click': this.playNavClick(t); break;
        case 'form_focus': this.playFormFocus(t); break;
        case 'form_submit': this.playFormSubmit(t); break;
        case 'hk_open': this.playHKOpen(t); break;
        case 'hk_close': this.playHKClose(t); break;
        case 'hk_message': this.playHKMessage(t); break;
        case 'hk_typing': this.playHKTyping(t); break;
        case 'pillar_hover': this.playPillarHover(t); break;
        case 'counter_tick': this.playCounterTick(t); break;
        case 'intro_advance': this.playIntroAdvance(t); break;
      }
    } catch {
      // Silently handle any audio errors
    }
  }

  // Helper: create oscillator → filter → gain → master
  private createVoice(freq: number, type: OscillatorType, filterFreq?: number, filterType?: BiquadFilterType) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    
    if (filterFreq && filterType) {
      const filter = this.ctx!.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = filterFreq;
      filter.Q.value = 2;
      osc.connect(filter).connect(gain).connect(this.masterGain!);
    } else {
      osc.connect(gain).connect(this.masterGain!);
    }
    return { osc, gain };
  }

  // ═══════════════════════════════════════════
  // BRIDGE SOUNDS — Rich and resonant
  // ═══════════════════════════════════════════

  // Warm wooden knock with body — like a bridge plank being placed
  private playBridgePlank(t: number) {
    // Low body thud
    const { osc: body, gain: bodyG } = this.createVoice(120, 'triangle');
    body.frequency.exponentialRampToValueAtTime(60, t + 0.2);
    bodyG.gain.setValueAtTime(0.4, t);
    bodyG.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    body.start(t);
    body.stop(t + 0.3);

    // High transient click
    const { osc: click, gain: clickG } = this.createVoice(800, 'square', 2000, 'lowpass');
    clickG.gain.setValueAtTime(0.2, t);
    clickG.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    click.start(t);
    click.stop(t + 0.06);

    // Warm resonance tail
    const { osc: res, gain: resG } = this.createVoice(196, 'sine'); // G3
    resG.gain.setValueAtTime(0, t + 0.02);
    resG.gain.linearRampToValueAtTime(0.15, t + 0.05);
    resG.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    res.start(t);
    res.stop(t + 0.5);
  }

  // Singing cable — metallic shimmer with harmonic overtones
  private playBridgeCable(t: number) {
    const fundamentals = [440, 554.37, 659.25]; // A4, C#5, E5 — A major
    fundamentals.forEach((freq, i) => {
      const { osc, gain } = this.createVoice(freq, 'sine');
      gain.gain.setValueAtTime(0, t + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.18 - i * 0.04, t + i * 0.05 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.start(t + i * 0.05);
      osc.stop(t + 0.8);
    });

    // Shimmer — high detuned sine
    const { osc: shim, gain: shimG } = this.createVoice(2200, 'sine');
    shim.frequency.linearRampToValueAtTime(3300, t + 0.6);
    shimG.gain.setValueAtTime(0, t);
    shimG.gain.linearRampToValueAtTime(0.04, t + 0.15);
    shimG.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    shim.start(t);
    shim.stop(t + 0.6);
  }

  // Golden chime cascade — triumphant bridge completion
  private playBridgeComplete(t: number) {
    const notes = [
      { freq: 523.25, delay: 0 },     // C5
      { freq: 659.25, delay: 0.12 },   // E5
      { freq: 783.99, delay: 0.24 },   // G5
      { freq: 1046.5, delay: 0.36 },   // C6
      { freq: 1318.5, delay: 0.48 },   // E6
    ];
    notes.forEach(({ freq, delay }) => {
      const { osc, gain } = this.createVoice(freq, 'sine');
      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.22, t + delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 1.2);
      osc.start(t + delay);
      osc.stop(t + delay + 1.2);

      // Harmonic overtone for richness
      const { osc: harm, gain: harmG } = this.createVoice(freq * 2, 'sine');
      harmG.gain.setValueAtTime(0, t + delay);
      harmG.gain.linearRampToValueAtTime(0.06, t + delay + 0.04);
      harmG.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.8);
      harm.start(t + delay);
      harm.stop(t + delay + 0.8);
    });

    // Sub bass swell underneath
    const { osc: sub, gain: subG } = this.createVoice(130.81, 'sine'); // C3
    subG.gain.setValueAtTime(0, t);
    subG.gain.linearRampToValueAtTime(0.15, t + 0.3);
    subG.gain.linearRampToValueAtTime(0, t + 1.5);
    sub.start(t);
    sub.stop(t + 1.5);
  }

  // Intro phase advance — whoosh + ascending chime
  private playIntroAdvance(t: number) {
    // Whoosh — filtered noise sweep
    const bufferSize = this.ctx!.sampleRate * 0.4;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(4000, t + 0.2);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.4);
    filter.Q.value = 3;
    const noiseGain = this.ctx!.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.15, t + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    noise.connect(filter).connect(noiseGain).connect(this.masterGain!);
    noise.start(t);

    // Ascending chime
    const { osc, gain } = this.createVoice(523.25, 'sine'); // C5
    osc.frequency.linearRampToValueAtTime(783.99, t + 0.15); // → G5
    gain.gain.setValueAtTime(0, t + 0.05);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.start(t + 0.05);
    osc.stop(t + 0.6);
  }

  // ═══════════════════════════════════════════
  // INTERACTION SOUNDS
  // ═══════════════════════════════════════════

  // Page turn + warm tone — story card opens
  private playStoryReveal(t: number) {
    // Noise burst (page turn)
    const bufferSize = this.ctx!.sampleRate * 0.1;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.4;
    }
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx!.createGain();
    noiseGain.gain.setValueAtTime(0.12, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    const hipass = this.ctx!.createBiquadFilter();
    hipass.type = 'highpass';
    hipass.frequency.value = 2000;
    noise.connect(hipass).connect(noiseGain).connect(this.masterGain!);
    noise.start(t);

    // Warm tone — G4 + B4 (major third)
    [392, 493.88].forEach((freq, i) => {
      const { osc, gain } = this.createVoice(freq, 'sine');
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.14 - i * 0.04, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  // Soft descending close
  private playStoryClose(t: number) {
    const { osc, gain } = this.createVoice(493.88, 'sine'); // B4
    osc.frequency.exponentialRampToValueAtTime(293.66, t + 0.25); // → D4
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Ambient swell — section enters viewport (warm fifth)
  private playSectionEnter(t: number) {
    const { osc: o1, gain: g1 } = this.createVoice(220, 'sine'); // A3
    const { osc: o2, gain: g2 } = this.createVoice(329.63, 'sine'); // E4
    [g1, g2].forEach(g => {
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.4);
      g.gain.linearRampToValueAtTime(0, t + 1.2);
    });
    o1.start(t); o2.start(t);
    o1.stop(t + 1.2); o2.stop(t + 1.2);
  }

  // Crisp tap with body
  private playNavClick(t: number) {
    const { osc, gain } = this.createVoice(900, 'triangle', 3000, 'lowpass');
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.start(t);
    osc.stop(t + 0.1);

    // Sub thud
    const { osc: sub, gain: subG } = this.createVoice(150, 'sine');
    subG.gain.setValueAtTime(0.1, t);
    subG.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    sub.start(t);
    sub.stop(t + 0.08);
  }

  // Clear ping — D5
  private playFormFocus(t: number) {
    const { osc, gain } = this.createVoice(587.33, 'sine');
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.4);

    // Harmonic
    const { osc: h, gain: hG } = this.createVoice(1174.66, 'sine');
    hG.gain.setValueAtTime(0, t);
    hG.gain.linearRampToValueAtTime(0.04, t + 0.02);
    hG.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    h.start(t);
    h.stop(t + 0.25);
  }

  // Triumphant success chime — C major arpeggio
  private playFormSubmit(t: number) {
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const { osc, gain } = this.createVoice(freq, 'sine');
      gain.gain.setValueAtTime(0, t + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.18, t + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.6);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.6);
    });
  }

  // ═══════════════════════════════════════════
  // H.K. SOUNDS — Warm and digital
  // ═══════════════════════════════════════════

  // Bridge connection — ascending harmony
  private playHKOpen(t: number) {
    const pairs: [number, number][] = [[330, 440], [440, 554.37], [554.37, 659.25]];
    pairs.forEach(([f1, f2], i) => {
      const { osc: o1, gain: g1 } = this.createVoice(f1, 'sine');
      o1.frequency.linearRampToValueAtTime(f2, t + 0.15 + i * 0.1);
      g1.gain.setValueAtTime(0, t + i * 0.1);
      g1.gain.linearRampToValueAtTime(0.14 - i * 0.03, t + i * 0.1 + 0.05);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      o1.start(t + i * 0.1);
      o1.stop(t + 0.6);
    });
  }

  // Descending fade
  private playHKClose(t: number) {
    const { osc, gain } = this.createVoice(554.37, 'sine');
    osc.frequency.exponentialRampToValueAtTime(330, t + 0.35);
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Two-tone notification
  private playHKMessage(t: number) {
    [523.25, 783.99].forEach((freq, i) => {
      const { osc, gain } = this.createVoice(freq, 'sine');
      gain.gain.setValueAtTime(0, t + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.16, t + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.3);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.3);
    });
  }

  // Subtle triple pulse
  private playHKTyping(t: number) {
    for (let i = 0; i < 3; i++) {
      const { osc, gain } = this.createVoice(440 + i * 30, 'sine');
      gain.gain.setValueAtTime(0, t + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.06, t + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.1);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.1);
    }
  }

  // Resonant touch — warm F4 with overtone
  private playPillarHover(t: number) {
    const { osc, gain } = this.createVoice(349.23, 'triangle');
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.4);

    // Octave overtone
    const { osc: h, gain: hG } = this.createVoice(698.46, 'sine');
    hG.gain.setValueAtTime(0, t);
    hG.gain.linearRampToValueAtTime(0.03, t + 0.04);
    hG.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    h.start(t);
    h.stop(t + 0.25);
  }

  // Soft tick with presence
  private playCounterTick(t: number) {
    const { osc, gain } = this.createVoice(1400, 'sine');
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  destroy() {
    this.ctx?.close();
    this.ctx = null;
    this.masterGain = null;
    this.reverbGain = null;
    this.convolver = null;
    this.dryGain = null;
  }
}

export const tbSoundEngine = new TBSoundEngine();
export type { SoundType };
