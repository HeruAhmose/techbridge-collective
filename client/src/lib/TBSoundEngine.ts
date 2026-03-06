/**
 * TechBridge Sound Engine — Warm, Organic Procedural Audio
 * 
 * Web Audio API synthesis for the "Bridge" narrative experience.
 * Sounds are warm, inviting, and human — not cold or techy.
 * Think: wooden bridge planks, golden chimes, gentle water, warm tones.
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
  | 'ambient_loop';     // Background ambient — very subtle

class TBSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled = false;
  private volume = 0.3;

  async init(): Promise<void> {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.ctx.destination);
    this.enabled = true;
  }

  setEnabled(val: boolean) {
    this.enabled = val;
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(
        val ? this.volume : 0,
        (this.ctx?.currentTime || 0) + 0.3
      );
    }
  }

  setMuted(muted: boolean) {
    this.setEnabled(!muted);
  }

  setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.enabled) {
      this.masterGain.gain.linearRampToValueAtTime(
        this.volume,
        (this.ctx?.currentTime || 0) + 0.1
      );
    }
  }

  isEnabled() { return this.enabled; }
  getVolume() { return this.volume; }

  play(type: SoundType) {
    if (!this.ctx || !this.masterGain || !this.enabled) return;
    const t = this.ctx.currentTime;

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
    }
  }

  // Warm wooden knock — like a bridge plank being placed
  private playBridgePlank(t: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.15);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Gentle metallic hum — cable being drawn
  private playBridgeCable(t: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.linearRampToValueAtTime(660, t + 0.5);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.1);
    gain.gain.linearRampToValueAtTime(0, t + 0.5);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // Golden chime cascade — bridge complete
  private playBridgeComplete(t: number) {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.15, t + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.8);
      osc.connect(gain).connect(this.masterGain!);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.8);
    });
  }

  // Page turn + warm tone — story card opens
  private playStoryReveal(t: number) {
    // Noise burst (page turn)
    const bufferSize = this.ctx!.sampleRate * 0.08;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.3;
    }
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx!.createGain();
    noiseGain.gain.setValueAtTime(0.08, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    const hipass = this.ctx!.createBiquadFilter();
    hipass.type = 'highpass';
    hipass.frequency.value = 2000;
    noise.connect(hipass).connect(noiseGain).connect(this.masterGain!);
    noise.start(t);

    // Warm tone
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.value = 392; // G4
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  // Soft close
  private playStoryClose(t: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(392, t);
    osc.frequency.exponentialRampToValueAtTime(262, t + 0.2);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Ambient swell — section enters viewport
  private playSectionEnter(t: number) {
    const osc = this.ctx!.createOscillator();
    const osc2 = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.value = 220;
    osc2.type = 'sine';
    osc2.frequency.value = 330;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.3);
    gain.gain.linearRampToValueAtTime(0, t + 1.0);
    osc.connect(gain).connect(this.masterGain!);
    osc2.connect(gain);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 1.0);
    osc2.stop(t + 1.0);
  }

  // Soft tap
  private playNavClick(t: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Gentle ping — form field focus
  private playFormFocus(t: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.value = 587.33; // D5
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Success chime — form submitted
  private playFormSubmit(t: number) {
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.12, t + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.5);
      osc.connect(gain).connect(this.masterGain!);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.5);
    });
  }

  // Bridge connection tone — H.K. opens
  private playHKOpen(t: number) {
    const osc = this.ctx!.createOscillator();
    const osc2 = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.linearRampToValueAtTime(440, t + 0.3);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(440, t);
    osc2.frequency.linearRampToValueAtTime(554.37, t + 0.3);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.1);
    gain.gain.linearRampToValueAtTime(0, t + 0.6);
    osc.connect(gain).connect(this.masterGain!);
    osc2.connect(gain);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.6);
    osc2.stop(t + 0.6);
  }

  // Gentle fade — H.K. closes
  private playHKClose(t: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.linearRampToValueAtTime(330, t + 0.3);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Soft notification — H.K. message
  private playHKMessage(t: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t);
    osc.frequency.setValueAtTime(659.25, t + 0.08);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Subtle pulse — H.K. typing
  private playHKTyping(t: number) {
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = 400 + i * 20;
      gain.gain.setValueAtTime(0, t + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.04, t + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.08);
      osc.connect(gain).connect(this.masterGain!);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.08);
    }
  }

  // Resonant touch — pillar hover
  private playPillarHover(t: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 349.23; // F4
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Soft tick — counter
  private playCounterTick(t: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.03, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  destroy() {
    this.ctx?.close();
    this.ctx = null;
    this.masterGain = null;
  }
}

export const tbSoundEngine = new TBSoundEngine();
export type { SoundType };
