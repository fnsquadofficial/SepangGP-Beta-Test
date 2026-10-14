/**
 * Procedural Web Audio Engine Synthesizer for Sepang Grand Prix
 * Generates dynamic engine RPM tones, turbo spool, tire friction, curb rumble, and race FX
 * 100% zero external audio file dependencies.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Engine oscillators & gain
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineOsc3: OscillatorNode | null = null;
  private turboOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;

  // Tire squeal (Noise generator)
  private tireNoiseNode: AudioBufferSourceNode | null = null;
  private tireGain: GainNode | null = null;
  private tireFilter: BiquadFilterNode | null = null;

  // Curb rumble
  private curbOsc: OscillatorNode | null = null;
  private curbGain: GainNode | null = null;

  // Wind rush
  private windNoiseNode: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;

  private isRunning: boolean = false;
  private currentVehicleClass: 'f1' | 'gt3' = 'f1';

  private initContext() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;

    this.ctx = new AudioCtxClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public resume() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public start(vehicleClass: 'f1' | 'gt3' = 'f1') {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isRunning) return;
    this.currentVehicleClass = vehicleClass;

    const t = this.ctx.currentTime;

    // --- 1. ENGINE SYNTHESIZER ---
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.15, t);

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(vehicleClass === 'f1' ? 4500 : 2500, t);
    this.engineFilter.Q.setValueAtTime(1.5, t);

    // Multi-harmonic oscillators for rich combustion resonance
    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc3 = this.ctx.createOscillator();
    this.turboOsc = this.ctx.createOscillator();

    this.engineOsc1.type = vehicleClass === 'f1' ? 'sawtooth' : 'triangle';
    this.engineOsc2.type = 'sawtooth';
    this.engineOsc3.type = vehicleClass === 'f1' ? 'square' : 'sawtooth';
    this.turboOsc.type = 'sine';

    const basePitch = vehicleClass === 'f1' ? 120 : 65;
    this.engineOsc1.frequency.setValueAtTime(basePitch, t);
    this.engineOsc2.frequency.setValueAtTime(basePitch * 1.5, t);
    this.engineOsc3.frequency.setValueAtTime(basePitch * 2.0, t);
    this.turboOsc.frequency.setValueAtTime(800, t);

    const turboGain = this.ctx.createGain();
    turboGain.gain.setValueAtTime(vehicleClass === 'f1' ? 0.05 : 0.015, t);

    this.turboOsc.connect(turboGain);
    turboGain.connect(this.engineGain);

    this.engineOsc1.connect(this.engineGain);
    this.engineOsc2.connect(this.engineGain);
    this.engineOsc3.connect(this.engineGain);
    this.engineGain.connect(this.engineFilter);
    this.engineFilter.connect(this.masterGain);

    this.engineOsc1.start();
    this.engineOsc2.start();
    this.engineOsc3.start();
    this.turboOsc.start();

    // --- 2. TIRE SQUEAL (White noise buffer with bandpass filter) ---
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.tireNoiseNode = this.ctx.createBufferSource();
    this.tireNoiseNode.buffer = noiseBuffer;
    this.tireNoiseNode.loop = true;

    this.tireFilter = this.ctx.createBiquadFilter();
    this.tireFilter.type = 'bandpass';
    this.tireFilter.frequency.setValueAtTime(1400, t);
    this.tireFilter.Q.setValueAtTime(3.0, t);

    this.tireGain = this.ctx.createGain();
    this.tireGain.gain.setValueAtTime(0, t);

    this.tireNoiseNode.connect(this.tireFilter);
    this.tireFilter.connect(this.tireGain);
    this.tireGain.connect(this.masterGain);
    this.tireNoiseNode.start();

    // --- 3. CURB RUMBLE ---
    this.curbOsc = this.ctx.createOscillator();
    this.curbOsc.type = 'triangle';
    this.curbOsc.frequency.setValueAtTime(45, t);

    this.curbGain = this.ctx.createGain();
    this.curbGain.gain.setValueAtTime(0, t);

    this.curbOsc.connect(this.curbGain);
    this.curbGain.connect(this.masterGain);
    this.curbOsc.start();

    // --- 4. HIGH SPEED WIND RUSH ---
    this.windNoiseNode = this.ctx.createBufferSource();
    this.windNoiseNode.buffer = noiseBuffer;
    this.windNoiseNode.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'lowpass';
    this.windFilter.frequency.setValueAtTime(400, t);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0, t);

    this.windNoiseNode.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    this.windNoiseNode.start();

    this.isRunning = true;
  }

  public update(telemetry: {
    speed: number; // km/h
    rpm: number;
    maxRpm: number;
    gear: number;
    throttle: number;
    brake: number;
    onCurb: boolean;
    lateralSlip: number; // 0 to 1
  }) {
    if (!this.isRunning || !this.ctx) return;
    const t = this.ctx.currentTime;
    const isF1 = this.currentVehicleClass === 'f1';

    // Calculate RPM ratio
    const rpmRatio = Math.max(0.15, Math.min(1.0, telemetry.rpm / (telemetry.maxRpm || 14000)));

    // Pitch mapping
    if (this.engineOsc1 && this.engineOsc2 && this.engineOsc3) {
      const baseFreq = isF1 ? 90 + rpmRatio * 520 : 55 + rpmRatio * 280;
      this.engineOsc1.frequency.setTargetAtTime(baseFreq, t, 0.04);
      this.engineOsc2.frequency.setTargetAtTime(baseFreq * 1.5, t, 0.04);
      this.engineOsc3.frequency.setTargetAtTime(baseFreq * 2.01, t, 0.04);
    }

    if (this.turboOsc) {
      const turboPitch = 600 + (telemetry.speed / 350) * 2200 + telemetry.throttle * 400;
      this.turboOsc.frequency.setTargetAtTime(turboPitch, t, 0.08);
    }

    // Engine volume: louder on throttle, quieter on coasting/idle
    if (this.engineGain) {
      const throttleBonus = telemetry.throttle * 0.15;
      const speedVol = (telemetry.speed / 350) * 0.08;
      const targetVol = Math.max(0.08, 0.12 + throttleBonus + speedVol);
      this.engineGain.gain.setTargetAtTime(targetVol, t, 0.05);
    }

    if (this.engineFilter) {
      const cutoff = isF1 ? 2500 + rpmRatio * 6000 : 1500 + rpmRatio * 4000;
      this.engineFilter.frequency.setTargetAtTime(cutoff, t, 0.06);
    }

    // Tire squeal on drift / lockup
    if (this.tireGain) {
      let slipIntensity = telemetry.lateralSlip;
      if (telemetry.brake > 0.6 && telemetry.speed > 50) {
        slipIntensity = Math.max(slipIntensity, (telemetry.brake - 0.4) * 1.2);
      }
      const targetTireGain = Math.min(0.28, Math.max(0, slipIntensity * 0.28));
      this.tireGain.gain.setTargetAtTime(targetTireGain, t, 0.06);
    }

    // Curb vibration sound
    if (this.curbGain && this.curbOsc) {
      if (telemetry.onCurb && telemetry.speed > 30) {
        const curbFreq = 40 + (telemetry.speed / 300) * 60;
        this.curbOsc.frequency.setTargetAtTime(curbFreq, t, 0.03);
        const curbVol = Math.min(0.22, 0.08 + (telemetry.speed / 300) * 0.14);
        this.curbGain.gain.setTargetAtTime(curbVol, t, 0.04);
      } else {
        this.curbGain.gain.setTargetAtTime(0, t, 0.08);
      }
    }

    // Wind rush at high speeds
    if (this.windGain && this.windFilter) {
      const speedFactor = Math.max(0, (telemetry.speed - 120) / 230);
      const windVol = Math.min(0.18, speedFactor * 0.18);
      this.windGain.gain.setTargetAtTime(windVol, t, 0.1);
      this.windFilter.frequency.setTargetAtTime(300 + speedFactor * 1200, t, 0.1);
    }
  }

  /**
   * Sound effect: Gantry countdown red light beep (short crisp tone)
   */
  public playCountdownBeep(isFinal: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isFinal ? 880 : 440; // High A5 tone for lights out!
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isFinal ? 0.45 : 0.2));

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + (isFinal ? 0.45 : 0.22));
  }

  /**
   * Sound effect: DRS activate / flap open chirp
   */
  public playDrsChirp() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  /**
   * Sound effect: Lap completion chime
   */
  public playLapChime(isBest: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const notes = isBest ? [523.25, 659.25, 783.99, 1046.5] : [587.33, 739.99];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.36);
    });
  }

  public stop() {
    try {
      this.engineOsc1?.stop();
      this.engineOsc2?.stop();
      this.engineOsc3?.stop();
      this.turboOsc?.stop();
      this.tireNoiseNode?.stop();
      this.curbOsc?.stop();
      this.windNoiseNode?.stop();
    } catch {
      // Ignore if already stopped
    }

    this.engineOsc1?.disconnect();
    this.engineOsc2?.disconnect();
    this.engineOsc3?.disconnect();
    this.turboOsc?.disconnect();
    this.tireNoiseNode?.disconnect();
    this.curbOsc?.disconnect();
    this.windNoiseNode?.disconnect();

    this.isRunning = false;
  }
}

export const audioEngine = new AudioEngine();
