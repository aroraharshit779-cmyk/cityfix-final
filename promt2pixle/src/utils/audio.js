// Web Audio API Sound Synthesizer for high-tech civic feedback
// Operates natively with zero external audio assets

class SoundFx {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playBeep(freq = 440, type = 'sine', duration = 0.1, gainVal = 0.05) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // AudioContext might be blocked before first gesture
    }
  }

  click() {
    this.playBeep(800, 'triangle', 0.05, 0.04);
  }

  success() {
    if (!this.enabled) return;
    setTimeout(() => this.playBeep(523.25, 'sine', 0.12, 0.06), 0); // C5
    setTimeout(() => this.playBeep(659.25, 'sine', 0.12, 0.06), 100); // E5
    setTimeout(() => this.playBeep(783.99, 'sine', 0.25, 0.06), 200); // G5
  }

  alert() {
    if (!this.enabled) return;
    this.playBeep(320, 'sawtooth', 0.15, 0.08);
    setTimeout(() => this.playBeep(280, 'sawtooth', 0.2, 0.08), 120);
  }

  radarPulse() {
    if (!this.enabled) return;
    this.playBeep(1200, 'sine', 0.08, 0.02);
  }
}

export const sounds = new SoundFx();
