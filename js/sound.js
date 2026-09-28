/* ==========================================================================
   A SMARTER TOMORROW - Procedural Web Audio Synthesizer
   ========================================================================== */

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('sound_muted') === 'true';
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playHover() {
    this.playTone(520, 'sine', 0.04, 0.02);
  }

  playClick() {
    this.playTone(880, 'triangle', 0.08, 0.06);
  }

  playSwitch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    
    // Two-tone chime
    setTimeout(() => this.playTone(660, 'sine', 0.06, 0.04), 0);
    setTimeout(() => this.playTone(990, 'sine', 0.08, 0.04), 60);
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    
    setTimeout(() => this.playTone(523.25, 'sine', 0.1, 0.05), 0);
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.05), 80);
    setTimeout(() => this.playTone(783.99, 'sine', 0.15, 0.05), 160);
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('sound_muted', this.muted);
    return this.muted;
  }
}

window.soundFX = new SoundFX();
