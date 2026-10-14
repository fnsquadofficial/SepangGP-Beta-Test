import * as THREE from 'three';
import { AIDriverProfile, CircuitWaypoint, TelemetryData, VehicleClass, VehicleConfig } from '../types/game';
import { SEPANG_CONTROL_POINTS } from '../circuit/sepangTrack';
import { audioEngine } from '../audio/engineAudio';

export const VEHICLE_CONFIGS: Record<VehicleClass, VehicleConfig> = {
  f1: {
    id: 'f1',
    name: 'Apex F1-26',
    vehicleClass: 'f1',
    subtitle: 'Formula 1 Hybrid Turbo',
    description: '1000hp hybrid monster with active DRS, extreme aerodynamic downforce, and razor-sharp braking.',
    topSpeed: 345,
    acceleration: 98,
    braking: 96,
    downforce: 95,
    weight: 798,
    horsePower: 1025,
    primaryColor: '#00a19b', // Petronas turquoise
    secondaryColor: '#0f172a',
    accentColor: '#38bdf8',
    drsBoost: 26,
    enginePitchBase: 120,
  },
  gt3: {
    id: 'gt3',
    name: 'Sepang GT3 Thunder',
    vehicleClass: 'gt3',
    subtitle: 'Endurance Spec GT3 Supercar',
    description: 'V8 twin-turbo beast featuring high mechanical grip, balanced chassis roll, and progressive drift control.',
    topSpeed: 295,
    acceleration: 82,
    braking: 85,
    downforce: 78,
    weight: 1280,
    horsePower: 640,
    primaryColor: '#ef4444', // Racing Red
    secondaryColor: '#18181b',
    accentColor: '#f59e0b',
    drsBoost: 16,
    enginePitchBase: 65,
  },
};

export const DEFAULT_AI_DRIVERS: Omit<AIDriverProfile, 'trackProgress' | 'lateralOffset' | 'speed' | 'lap' | 'lastLapTime' | 'bestLapTime' | 'currentSector' | 'sectorTimes' | 'position' | 'gapToLeader'>[] = [
  { id: 'ai-1', name: 'Farhan Harith', number: 44, team: 'Petronas Sepang Racing', carClass: 'f1', color: '#00a19b', secondaryColor: '#000000', skillLevel: 1.03, aggression: 0.9 },
  { id: 'ai-2', name: 'Marcus Vance', number: 1, team: 'Apex Works GP', carClass: 'f1', color: '#1e3a8a', secondaryColor: '#dc2626', skillLevel: 1.05, aggression: 0.95 },
  { id: 'ai-3', name: 'Luca Rossi', number: 16, team: 'Maranello Corse', carClass: 'f1', color: '#dc2626', secondaryColor: '#ffffff', skillLevel: 1.01, aggression: 0.85 },
  { id: 'ai-4', name: 'Kenji Takahashi', number: 22, team: 'Suzuka Motorsport', carClass: 'gt3', color: '#ffffff', secondaryColor: '#dc2626', skillLevel: 0.98, aggression: 0.8 },
  { id: 'ai-5', name: 'Ethan Miller', number: 11, team: 'Bulls Racing Tech', carClass: 'f1', color: '#172554', secondaryColor: '#eab308', skillLevel: 0.99, aggression: 0.88 },
  { id: 'ai-6', name: 'Chloe Dubois', number: 10, team: 'Alpine Endurance', carClass: 'gt3', color: '#2563eb', secondaryColor: '#ec4899', skillLevel: 0.95, aggression: 0.75 },
  { id: 'ai-7', name: 'Devon Price', number: 4, team: 'Papaya GT Performance', carClass: 'gt3', color: '#f97316', secondaryColor: '#0f172a', skillLevel: 0.96, aggression: 0.82 },
];

export class RacingPhysicsEngine {
  public curve: THREE.CatmullRomCurve3;
  public trackLength: number;
  public vehicleClass: VehicleClass;
  public config: VehicleConfig;

  // Pre-sampled points for ultra-fast broadphase search
  private samplePoints: { position: THREE.Vector3; progress: number }[] = [];

  // Player state
  public position: THREE.Vector3 = new THREE.Vector3();
  public forward: THREE.Vector3 = new THREE.Vector3(0, 0, -1);
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public speedKmh: number = 0;
  public rpm: number = 1000;
  public gear: number = 1;
  public steeringAngle: number = 0; // -1 to 1
  public lateralSlip: number = 0; // 0 to 1
  public onCurb: boolean = false;
  public onGrass: boolean = false;
  public drsActive: boolean = false;
  public drsAvailable: boolean = false;
  public slipstreamActive: boolean = false;

  // Track progress (0.0 to 1.0)
  public trackProgress: number = 0;
  public currentLap: number = 1;
  public totalLaps: number = 3;
  public lapStartTime: number = 0;
  public currentLapTime: number = 0;
  public bestLapTime: number = 0;
  public lastLapTime: number = 0;
  public currentSector: 1 | 2 | 3 = 1;
  public sectorTimes: { s1: number; s2: number; s3: number } = { s1: 0, s2: 0, s3: 0 };
  private sectorStartTimes: { s1: number; s2: number; s3: number } = { s1: 0, s2: 0, s3: 0 };

  // AI Drivers
  public aiDrivers: AIDriverProfile[] = [];

  constructor(
    curve: THREE.CatmullRomCurve3,
    trackLength: number,
    vehicleClass: VehicleClass = 'f1',
    totalLaps: number = 3,
    aiCount: number = 7
  ) {
    this.curve = curve;
    this.trackLength = trackLength;
    this.vehicleClass = vehicleClass;
    this.config = VEHICLE_CONFIGS[vehicleClass];
    this.totalLaps = totalLaps;

    // Cache 500 reference points along the track
    const SAMPLES = 500;
    for (let i = 0; i < SAMPLES; i++) {
      const t = i / SAMPLES;
      this.samplePoints.push({
        position: this.curve.getPointAt(t),
        progress: t,
      });
    }

    this.initAIDrivers(aiCount);
    this.resetToGrid(4); // Player starts in P5 (grid slot 4)
  }

  public initAIDrivers(count: number) {
    this.aiDrivers = DEFAULT_AI_DRIVERS.slice(0, count).map((d, index) => {
      const gridSlot = index >= 4 ? index + 1 : index;
      const progressOffset = (1.0 - (gridSlot * 14) / this.trackLength + 1) % 1;
      const lateral = gridSlot % 2 === 0 ? -2.6 : 2.6;

      return {
        ...d,
        trackProgress: progressOffset,
        lateralOffset: lateral,
        speed: 0,
        lap: 1,
        lastLapTime: 0,
        bestLapTime: 0,
        currentSector: 1,
        sectorTimes: { s1: 0, s2: 0, s3: 0 },
        position: gridSlot + 1,
        gapToLeader: '+0.0s',
      };
    });
  }

  public resetToGrid(gridSlot: number = 4) {
    // Player grid slot (4 = P5)
    this.trackProgress = (1.0 - (gridSlot * 14) / this.trackLength + 1) % 1;
    const pt = this.curve.getPointAt(this.trackProgress);
    const tan = this.curve.getTangentAt(this.trackProgress).normalize();
    const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

    const lateral = gridSlot % 2 === 0 ? -2.6 : 2.6;
    this.position.set(pt.x + norm.x * lateral, pt.y + 0.35, pt.z + norm.z * lateral);
    this.forward.copy(tan);
    this.velocity.set(0, 0, 0);
    this.speedKmh = 0;
    this.rpm = 1200;
    this.gear = 1;
    this.steeringAngle = 0;
    this.currentLap = 1;
    this.currentLapTime = 0;
    this.currentSector = 1;
    this.drsActive = false;
    this.drsAvailable = false;
  }

  public recoverToTrackCenter() {
    this.updateTrackProgress(true); // Force full global search to find exact nearest point
    const pt = this.curve.getPointAt(this.trackProgress);
    const tan = this.curve.getTangentAt(this.trackProgress).normalize();
    this.position.set(pt.x, pt.y + 0.35, pt.z);
    this.forward.copy(tan);
    this.speedKmh = Math.max(45, this.speedKmh);
    this.steeringAngle = 0;
    this.lateralSlip = 0;
  }

  public startRaceTimer() {
    this.lapStartTime = performance.now();
    this.sectorStartTimes.s1 = this.lapStartTime;
  }

  public update(
    delta: number,
    inputs: { throttle: number; brake: number; steer: number; drs: boolean; handbrake: boolean },
    isRacing: boolean
  ) {
    const dt = Math.min(delta, 0.05);

    if (isRacing && this.lapStartTime > 0) {
      this.currentLapTime = (performance.now() - this.lapStartTime) / 1000;
    }

    // --- 1. PLAYER VEHICLE HANDLING ---
    const isF1 = this.vehicleClass === 'f1';
    const maxSpeed = this.config.topSpeed + (this.drsActive ? this.config.drsBoost : 0) + (this.slipstreamActive ? 12 : 0);

    // Track position reference
    const trackPoint = this.curve.getPointAt(this.trackProgress);
    const trackTan = this.curve.getTangentAt(this.trackProgress).normalize();
    const trackNorm = new THREE.Vector3(-trackTan.z, 0, trackTan.x).normalize();

    // Check lateral distance from center of track
    const carOffsetVec = new THREE.Vector3().subVectors(this.position, trackPoint);
    const lateralDist = carOffsetVec.dot(trackNorm);

    // Track surface flags (Track width is 14m: ±7m from center. Shoulder/Curbs ±7 to ±8.8m)
    const absLat = Math.abs(lateralDist);
    this.onCurb = absLat >= 6.4 && absLat <= 8.2;
    this.onGrass = absLat > 8.2;

    let accelerationModifier = 1.0;
    let maxSpeedLimit = maxSpeed;
    if (this.onGrass) {
      accelerationModifier = 0.55;
      maxSpeedLimit = Math.min(maxSpeed, 110);
    } else if (this.onCurb) {
      accelerationModifier = 0.94;
    }

    if (!isRacing) {
      this.speedKmh = 0;
      this.rpm = 1500 + inputs.throttle * (isF1 ? 11500 : 6500);
      return;
    }

    // Acceleration & Engine Force
    const speedRatio = Math.max(0, this.speedKmh / maxSpeedLimit);
    let accelForce = 0;
    if (inputs.throttle > 0 && this.speedKmh < maxSpeedLimit) {
      const torqueCurve = Math.pow(1 - speedRatio * 0.92, 0.65);
      const powerMultiplier = isF1 ? 72 : 54;
      accelForce = inputs.throttle * powerMultiplier * torqueCurve * accelerationModifier;
    }

    // Braking Force
    let brakeForce = 0;
    if (inputs.brake > 0) {
      const brakePower = isF1 ? 92 : 76;
      brakeForce = inputs.brake * brakePower;
    }

    // Aero Drag & Rolling Resistance
    const aeroDrag = Math.pow(this.speedKmh / 100, 2) * (this.drsActive ? 0.9 : 1.35);
    const rollingResistance = 1.1;

    const netAccel = accelForce - brakeForce - aeroDrag - rollingResistance;
    this.speedKmh = Math.max(0, this.speedKmh + netAccel * dt * 3.6);

    // --- REFINED SPEED-SENSITIVE SMOOTH STEERING ---
    // At low speeds (e.g. 0-50 km/h for Turn 1, Turn 2, Turn 9, Turn 15):
    // Max steer angle allows agile hairpin negotiation (~0.24 rad / 13.8°).
    // At high speeds (200-340 km/h on straights/esses):
    // Smoothly tightens to ~0.045 rad (2.5°) for rock-solid high-speed tracking without twitch.
    const speedKmh = Math.max(1, this.speedKmh);
    const speedMs = speedKmh / 3.6;

    const highSpeedScale = 1.0 / (1.0 + Math.pow(speedKmh / 85, 1.4));
    const maxSteerAngle = isF1
      ? 0.04 + highSpeedScale * 0.20
      : 0.05 + highSpeedScale * 0.22;

    const targetSteerAngle = inputs.steer * maxSteerAngle;
    // Controlled damping rate: 5.5 when steering into turn, 8.0 when releasing (crisp return to center)
    const dampRate = Math.abs(inputs.steer) > 0.05 ? 5.5 : 8.0;
    this.steeringAngle = THREE.MathUtils.damp(this.steeringAngle, targetSteerAngle, dampRate, dt);

    // Kinematic Yaw Rate: omega = (v * tan(delta)) / L
    const wheelbase = 3.4;
    let rawYawRate = (speedMs * Math.tan(this.steeringAngle)) / wheelbase;

    // Lateral G-Force clamp (tires limit lateral acceleration gracefully)
    const maxG = isF1 ? 4.2 : 2.5;
    const maxLatAccel = maxG * 9.81;
    const currentLatAccel = Math.abs(speedMs * rawYawRate);

    if (currentLatAccel > maxLatAccel && speedMs > 6) {
      rawYawRate = Math.sign(rawYawRate) * (maxLatAccel / speedMs);
      this.lateralSlip = Math.min(1.0, (currentLatAccel - maxLatAccel) / 12);
      this.speedKmh -= this.lateralSlip * 14 * dt;
    } else {
      this.lateralSlip = THREE.MathUtils.lerp(this.lateralSlip, 0, 0.15);
    }

    const yawDelta = rawYawRate * dt;
    this.forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawDelta).normalize();

    // Handbrake slide
    if (inputs.handbrake) {
      this.speedKmh = Math.max(0, this.speedKmh - 60 * dt);
      this.lateralSlip = 0.85;
    }

    // Move car position along forward vector
    const movement = this.forward.clone().multiplyScalar(speedMs * dt);
    this.position.add(movement);

    // --- BULLETPROOF TRACK PROGRESS & COLLISION BOUNDARIES ---
    this.updateTrackProgress(false);

    const currTrackPt = this.curve.getPointAt(this.trackProgress);
    const currTrackTan = this.curve.getTangentAt(this.trackProgress).normalize();
    const currTrackNorm = new THREE.Vector3(-currTrackTan.z, 0, currTrackTan.x).normalize();

    const carOffset = new THREE.Vector3().subVectors(this.position, currTrackPt);
    const currentLatDist = carOffset.dot(currTrackNorm);
    const absLatDist = Math.abs(currentLatDist);

    // Solid Armco barrier is at ±9.6m. HARD CLAMP at 8.9m to ensure car CAN NEVER EXIT CIRCUIT!
    const MAX_BARRIER_DISTANCE = 8.9;

    if (absLatDist > MAX_BARRIER_DISTANCE) {
      const barrierSide = Math.sign(currentLatDist);
      const clampedLat = barrierSide * (MAX_BARRIER_DISTANCE - 0.15);

      // Instantly clamp position safely inside track barrier
      this.position.x = currTrackPt.x + currTrackNorm.x * clampedLat;
      this.position.z = currTrackPt.z + currTrackNorm.z * clampedLat;

      // Deflect forward heading along track tangent (prevent nose pushing through barrier)
      this.forward.lerp(currTrackTan, 0.55).normalize();

      if (this.speedKmh > 25) {
        audioEngine.playBarrierThump();
      }
      this.speedKmh = Math.max(0, this.speedKmh * 0.72);
      this.lateralSlip = 0.7;
    }

    // Emergency failsafe: If position ever exceeds 13m from track, auto-recover to track center
    if (absLatDist > 13.0 || this.position.y < -0.8) {
      this.recoverToTrackCenter();
    } else {
      // Smooth vertical elevation following track surface
      this.position.y = THREE.MathUtils.lerp(this.position.y, currTrackPt.y + 0.35, 0.3);
    }

    // Gear & RPM simulation
    this.updateGearsAndRpm(inputs.throttle);

    // DRS Zone Checking
    this.checkDrsAvailability(inputs.drs);

    // Update AI competitors
    this.updateAIDrivers(dt);

    // Check slipstream drafting
    this.checkSlipstream();
  }

  /**
   * Robust track projection: searches local window, but falls back to full global scan
   * if car is pushed or skids far, guaranteeing it NEVER gets lost.
   */
  private updateTrackProgress(forceGlobal: boolean = false) {
    const currentT = this.trackProgress;
    let bestT = currentT;
    let minDistSq = Infinity;

    if (!forceGlobal) {
      // Local search: 60 samples (-0.03 to +0.03)
      for (let i = -30; i <= 35; i++) {
        const testT = (currentT + (i / 1000) + 1) % 1;
        const pt = this.curve.getPointAt(testT);
        const distSq = pt.distanceToSquared(this.position);
        if (distSq < minDistSq) {
          minDistSq = distSq;
          bestT = testT;
        }
      }
    }

    // If local search found a point within 12 meters, accept it
    if (!forceGlobal && minDistSq < 144) {
      this.handleLapProgressTransition(bestT);
      return;
    }

    // Fallback: Global search across all 500 cached reference points
    let globalBestT = 0;
    let globalMinDistSq = Infinity;
    for (let k = 0; k < this.samplePoints.length; k++) {
      const distSq = this.samplePoints[k].position.distanceToSquared(this.position);
      if (distSq < globalMinDistSq) {
        globalMinDistSq = distSq;
        globalBestT = this.samplePoints[k].progress;
      }
    }

    // Fine-tune around global winner
    for (let j = -10; j <= 10; j++) {
      const fineT = (globalBestT + j * 0.001 + 1) % 1;
      const pt = this.curve.getPointAt(fineT);
      const distSq = pt.distanceToSquared(this.position);
      if (distSq < globalMinDistSq) {
        globalMinDistSq = distSq;
        globalBestT = fineT;
      }
    }

    this.handleLapProgressTransition(globalBestT);
  }

  private handleLapProgressTransition(newT: number) {
    const oldT = this.trackProgress;

    // Detect lap completion (crossing start/finish line from ~0.95 to ~0.05)
    if (oldT > 0.88 && newT < 0.12) {
      this.currentLap += 1;
      if (this.lapStartTime > 0) {
        const now = performance.now();
        this.lastLapTime = (now - this.lapStartTime) / 1000;
        if (this.bestLapTime === 0 || this.lastLapTime < this.bestLapTime) {
          this.bestLapTime = this.lastLapTime;
        }
        this.lapStartTime = now;
        this.sectorStartTimes.s1 = now;
      }
    }

    this.trackProgress = newT;

    // Sector timing update
    // S1: 0.0 to 0.43 (Start to Turn 5 exit)
    // S2: 0.43 to 0.78 (Turn 6 to Turn 11 exit)
    // S3: 0.78 to 1.0 (Turn 12 through Turn 15 to Finish line)
    const now = performance.now();
    if (newT < 0.43) {
      this.currentSector = 1;
    } else if (newT >= 0.43 && newT < 0.78) {
      if (this.currentSector === 1 && this.sectorStartTimes.s1 > 0) {
        this.sectorTimes.s1 = (now - this.sectorStartTimes.s1) / 1000;
        this.sectorStartTimes.s2 = now;
      }
      this.currentSector = 2;
    } else {
      if (this.currentSector === 2 && this.sectorStartTimes.s2 > 0) {
        this.sectorTimes.s2 = (now - this.sectorStartTimes.s2) / 1000;
        this.sectorStartTimes.s3 = now;
      }
      this.currentSector = 3;
    }
  }

  private updateGearsAndRpm(throttle: number) {
    const isF1 = this.vehicleClass === 'f1';
    const maxRpm = isF1 ? 14500 : 8500;
    const idleRpm = isF1 ? 2500 : 1200;

    // Gear speed ratios
    const gearRatios = isF1
      ? [0, 85, 130, 175, 220, 265, 305, 345] // 1..7 gears
      : [0, 75, 120, 165, 215, 260, 295]; // 1..6 gears

    const maxGears = gearRatios.length - 1;

    // Auto-shifting logic
    if (this.speedKmh < 5) {
      this.gear = 1;
    } else {
      for (let g = 1; g <= maxGears; g++) {
        if (this.speedKmh <= gearRatios[g] || g === maxGears) {
          this.gear = g;
          break;
        }
      }
    }

    // RPM based on speed within current gear
    const prevGearSpeed = this.gear === 1 ? 0 : gearRatios[this.gear - 1];
    const nextGearSpeed = gearRatios[this.gear];
    const gearSpan = Math.max(1, nextGearSpeed - prevGearSpeed);
    const gearProgress = Math.min(1.0, Math.max(0, (this.speedKmh - prevGearSpeed) / gearSpan));

    const targetRpm = idleRpm + gearProgress * (maxRpm - idleRpm) + (throttle > 0 ? 300 : -200);
    this.rpm = THREE.MathUtils.lerp(this.rpm, Math.min(maxRpm, Math.max(idleRpm, targetRpm)), 0.25);
  }

  private checkDrsAvailability(userDrsInput: boolean) {
    // DRS is active on Main Straight (t: 0.90 to 0.08) and Back Straight (t: 0.79 to 0.88)
    const inDrsZone =
      (this.trackProgress >= 0.90 || this.trackProgress <= 0.08) ||
      (this.trackProgress >= 0.79 && this.trackProgress <= 0.88);

    this.drsAvailable = inDrsZone && this.speedKmh > 120;
    this.drsActive = this.drsAvailable && userDrsInput;
  }

  private updateAIDrivers(dt: number) {
    this.aiDrivers.forEach((ai) => {
      // Find current waypoint recommendation for AI speed & braking
      const approxIdx = Math.floor(ai.trackProgress * SEPANG_CONTROL_POINTS.length);
      const wp = SEPANG_CONTROL_POINTS[approxIdx % SEPANG_CONTROL_POINTS.length];
      const targetSpeed = (wp.recommendedSpeed || 250) * ai.skillLevel;

      // Accelerate / Brake toward corner target speed
      if (ai.speed < targetSpeed) {
        ai.speed = Math.min(targetSpeed, ai.speed + 42 * dt * 3.6);
      } else {
        ai.speed = Math.max(targetSpeed, ai.speed - 75 * dt * 3.6);
      }

      // Progress along spline
      const speedMs = ai.speed / 3.6;
      const progressDelta = (speedMs * dt) / this.trackLength;
      ai.trackProgress = (ai.trackProgress + progressDelta) % 1;

      // Dynamic racing line: dive toward inside curb on corners
      if (wp.curbSide === 'left') {
        ai.lateralOffset = THREE.MathUtils.lerp(ai.lateralOffset, -2.4, 0.05);
      } else if (wp.curbSide === 'right') {
        ai.lateralOffset = THREE.MathUtils.lerp(ai.lateralOffset, 2.4, 0.05);
      } else {
        // Center of track
        ai.lateralOffset = THREE.MathUtils.lerp(ai.lateralOffset, 0, 0.03);
      }
    });

    // Update Live Leaderboard Positions
    const allRacers = [
      { id: 'player', progress: this.trackProgress + (this.currentLap - 1), speed: this.speedKmh },
      ...this.aiDrivers.map((a) => ({ id: a.id, progress: a.trackProgress + (a.lap - 1), speed: a.speed })),
    ];

    allRacers.sort((a, b) => b.progress - a.progress);

    this.aiDrivers.forEach((ai) => {
      ai.position = allRacers.findIndex((r) => r.id === ai.id) + 1;
    });
  }

  private checkSlipstream() {
    let drafting = false;
    for (const ai of this.aiDrivers) {
      const progressDiff = (ai.trackProgress - this.trackProgress + 1) % 1;
      const distanceAheadMeters = progressDiff * this.trackLength;

      // If trailing 8 to 45 meters behind an opponent with similar lateral position
      if (distanceAheadMeters > 8 && distanceAheadMeters < 45) {
        const lateralDiff = Math.abs(ai.lateralOffset - 0);
        if (lateralDiff < 3.2 && this.speedKmh > 180) {
          drafting = true;
          break;
        }
      }
    }
    this.slipstreamActive = drafting;
  }

  public getTelemetry(): TelemetryData {
    // Determine player position among all 8 racers
    const allRacers = [
      { id: 'player', progress: this.trackProgress + (this.currentLap - 1) },
      ...this.aiDrivers.map((a) => ({ id: a.id, progress: a.trackProgress + (a.lap - 1) })),
    ];
    allRacers.sort((a, b) => b.progress - a.progress);
    const playerPos = allRacers.findIndex((r) => r.id === 'player') + 1;
    const isF1 = this.vehicleClass === 'f1';

    return {
      speed: Math.round(this.speedKmh),
      rpm: Math.round(this.rpm),
      maxRpm: isF1 ? 14500 : 8500,
      gear: this.gear,
      lap: this.currentLap,
      currentLap: this.currentLap,
      totalLaps: this.totalLaps,
      lapTime: this.currentLapTime,
      currentLapTime: this.currentLapTime,
      bestLapTime: this.bestLapTime,
      lastLapTime: this.lastLapTime,
      currentSector: this.currentSector,
      sectorTimes: this.sectorTimes,
      position: playerPos,
      totalDrivers: this.aiDrivers.length + 1,
      totalRacers: this.aiDrivers.length + 1,
      gapToLeader: playerPos === 1 ? 'LEADER' : `+${((playerPos - 1) * 1.4).toFixed(1)}s`,
      drsAvailable: this.drsAvailable,
      drsActive: this.drsActive,
      onCurb: this.onCurb,
      onGrass: this.onGrass,
      gForceLat: Math.abs(this.steeringAngle * this.speedKmh * 0.02),
      deltaToBest: this.bestLapTime > 0 ? this.currentLapTime - this.bestLapTime : 0,
      slipstreamActive: this.slipstreamActive,
      trackProgress: this.trackProgress,
    };
  }
}
