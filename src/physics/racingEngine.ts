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
  { id: 'ai-1', name: 'Farhan Harith', number: 44, team: 'Petronas Sepang Racing', carClass: 'f1', color: '#00a19b', secondaryColor: '#000000', skillLevel: 1.05, aggression: 0.9 },
  { id: 'ai-2', name: 'Marcus Vance', number: 1, team: 'Apex Works GP', carClass: 'f1', color: '#1e3a8a', secondaryColor: '#dc2626', skillLevel: 1.08, aggression: 0.95 },
  { id: 'ai-3', name: 'Luca Rossi', number: 16, team: 'Maranello Corse', carClass: 'f1', color: '#dc2626', secondaryColor: '#ffffff', skillLevel: 1.02, aggression: 0.85 },
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

    this.initAIDrivers(aiCount);
    this.resetToGrid(4); // Player starts in P5 (grid slot 4)
  }

  public initAIDrivers(count: number) {
    this.aiDrivers = DEFAULT_AI_DRIVERS.slice(0, count).map((d, index) => {
      // Grid slots: alternate left and right along main straight behind start line
      // Slot 0 is P1 (pole), slot 1 is P2, etc. Player is at slot 4 (P5).
      const gridSlot = index >= 4 ? index + 1 : index;
      const progressOffset = 1.0 - (gridSlot * 16) / this.trackLength;
      const lateral = (gridSlot % 2 === 0 ? -3.5 : 3.5);

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
    // Player grid position
    this.trackProgress = (1.0 - (gridSlot * 16) / this.trackLength + 1) % 1;
    const pt = this.curve.getPointAt(this.trackProgress);
    const tan = this.curve.getTangentAt(this.trackProgress).normalize();
    const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

    const lateral = gridSlot % 2 === 0 ? -3.5 : 3.5;
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
    const pt = this.curve.getPointAt(this.trackProgress);
    const tan = this.curve.getTangentAt(this.trackProgress).normalize();
    this.position.set(pt.x, pt.y + 0.35, pt.z);
    this.forward.copy(tan);
    this.speedKmh = Math.max(35, this.speedKmh);
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
    // Clamp delta to avoid huge physics steps on lag spikes
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

    // Track surface flags (Track is 14m wide = ±7m, Curbs are ±7 to ±8.6m)
    const absLat = Math.abs(lateralDist);
    this.onCurb = absLat >= 6.8 && absLat <= 8.8;
    this.onGrass = absLat > 8.8;

    // Surface modifiers
    let accelerationModifier = 1.0;
    let maxSpeedLimit = maxSpeed;
    if (this.onGrass) {
      accelerationModifier = 0.45;
      maxSpeedLimit = Math.min(maxSpeed, 95); // Dragged heavily by gravel/grass
    } else if (this.onCurb) {
      accelerationModifier = 0.92;
    }

    if (!isRacing) {
      // Countdown revving at starting line
      this.speedKmh = 0;
      this.rpm = 1500 + inputs.throttle * (isF1 ? 11500 : 6500);
      return;
    }

    // Acceleration & Engine Force
    const speedRatio = Math.max(0, this.speedKmh / maxSpeedLimit);
    let accelForce = 0;
    if (inputs.throttle > 0 && this.speedKmh < maxSpeedLimit) {
      // High initial torque, tapering off with aerodynamic drag
      const torqueCurve = Math.pow(1 - speedRatio, 0.7);
      const powerMultiplier = isF1 ? 75 : 55;
      accelForce = inputs.throttle * powerMultiplier * torqueCurve * accelerationModifier;
    }

    // Braking Force
    let brakeForce = 0;
    if (inputs.brake > 0) {
      const brakePower = isF1 ? 95 : 78;
      brakeForce = inputs.brake * brakePower;
    }

    // Natural drag & rolling resistance
    const aeroDrag = Math.pow(this.speedKmh / 100, 2) * (this.drsActive ? 0.9 : 1.4);
    const rollingResistance = 1.2;

    // Net acceleration in km/h/s
    const netAccel = accelForce - brakeForce - aeroDrag - rollingResistance;
    this.speedKmh = Math.max(0, this.speedKmh + netAccel * dt * 3.6);

    // Steering & Angular velocity
    // Downforce increases high-speed grip on F1 cars, while GT3 has higher mechanical low-speed slip
    const downforceFactor = isF1 ? Math.min(1.4, 0.9 + Math.pow(this.speedKmh / 220, 2)) : 1.0;
    const steerSensitivity = (isF1 ? 2.4 : 1.9) * (1 / (1 + this.speedKmh * 0.003)) * downforceFactor;
    this.steeringAngle = THREE.MathUtils.lerp(this.steeringAngle, inputs.steer * steerSensitivity, 0.25);

    // Lateral grip and drift calculation with smooth low-speed to high-speed kinematics
    const speedMs = this.speedKmh / 3.6;
    const effectiveTurnSpeed = Math.max(8, Math.min(65, speedMs));
    const turnRate = (this.steeringAngle * (effectiveTurnSpeed / 3.2)) * dt;
    this.forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), turnRate).normalize();

    const corneringForce = Math.abs(inputs.steer) * Math.pow(this.speedKmh / 100, 2);
    const gripThreshold = isF1 ? 4.2 : 2.8;
    if (corneringForce > gripThreshold) {
      this.lateralSlip = Math.min(1.0, (corneringForce - gripThreshold) / 2.5);
      // Scrub speed when sliding
      this.speedKmh -= this.lateralSlip * 18 * dt;
    } else {
      this.lateralSlip = THREE.MathUtils.lerp(this.lateralSlip, 0, 0.15);
    }

    // Move car position
    const movement = this.forward.clone().multiplyScalar(speedMs * dt);

    // Handbrake slide
    if (inputs.handbrake) {
      this.speedKmh = Math.max(0, this.speedKmh - 65 * dt);
      this.lateralSlip = 0.9;
    }

    this.position.add(movement);

    // Calculate nearest track progress (projecting position along spline)
    this.updateTrackProgress();

    // --- RIGID TRACK BOUNDARIES & BARRIER COLLISION PROTECTION ---
    const currTrackPt = this.curve.getPointAt(this.trackProgress);
    const currTrackTan = this.curve.getTangentAt(this.trackProgress).normalize();
    const currTrackNorm = new THREE.Vector3(-currTrackTan.z, 0, currTrackTan.x).normalize();

    const carOffset = new THREE.Vector3().subVectors(this.position, currTrackPt);
    const currentLatDist = carOffset.dot(currTrackNorm);
    const absLatDist = Math.abs(currentLatDist);

    // Barriers are at ±13m. Clamp strictly at 12.6m so the car can NEVER drive off the circuit
    const MAX_BARRIER_DISTANCE = 12.6;

    if (absLatDist > MAX_BARRIER_DISTANCE) {
      const barrierSide = Math.sign(currentLatDist);
      const clampedLat = barrierSide * (MAX_BARRIER_DISTANCE - 0.2);

      // Clamp position safely inside track
      this.position.x = currTrackPt.x + currTrackNorm.x * clampedLat;
      this.position.z = currTrackPt.z + currTrackNorm.z * clampedLat;

      // Deflect forward heading along track tangent (prevent pushing through barrier)
      this.forward.lerp(currTrackTan, 0.5).normalize();

      // Scrub impact speed
      if (this.speedKmh > 30) {
        audioEngine.playBarrierThump();
      }
      this.speedKmh = Math.max(0, this.speedKmh * 0.65);
      this.lateralSlip = 0.85;
    }

    // Safety emergency recovery if car is somehow dislodged > 18 meters
    if (absLatDist > 18.0) {
      this.position.copy(currTrackPt).add(new THREE.Vector3(0, 0.35, 0));
      this.forward.copy(currTrackTan);
      this.speedKmh = 35;
    }

    // Altitude tracking (match elevation of the track spline)
    const currentElevation = currTrackPt.y;
    this.position.y = THREE.MathUtils.lerp(this.position.y, currentElevation + 0.35, 0.25);

    // Gear & RPM simulation
    this.updateGearsAndRpm(inputs.throttle);

    // DRS Zone Checking (Available in Sector 1 main straight & Sector 3 back straight)
    this.checkDrsAvailability(inputs.drs);

    // Update AI competitors
    this.updateAIDrivers(dt);

    // Check slipstream drafting behind leading cars
    this.checkSlipstream();
  }

  private updateTrackProgress() {
    // Project position forward along curve
    const currentT = this.trackProgress;
    let bestT = currentT;
    let minDistSq = Infinity;

    // Search localized neighborhood (-0.02 to +0.04 of progress)
    for (let i = -20; i <= 35; i++) {
      const testT = (currentT + (i / 1000) + 1) % 1;
      const pt = this.curve.getPointAt(testT);
      const distSq = pt.distanceToSquared(this.position);
      if (distSq < minDistSq) {
        minDistSq = distSq;
        bestT = testT;
      }
    }

    // Failsafe: If somehow desynced (>30m from track), global search to find true closest track point
    if (minDistSq > 900) {
      for (let s = 0; s < 100; s++) {
        const testT = s / 100;
        const pt = this.curve.getPointAt(testT);
        const distSq = pt.distanceToSquared(this.position);
        if (distSq < minDistSq) {
          minDistSq = distSq;
          bestT = testT;
        }
      }
    }

    // Detect lap completion crossing start/finish line (t: 0.88 -> 0.12)
    if (this.trackProgress > 0.88 && bestT < 0.12) {
      this.onLapCompleted();
    }

    this.trackProgress = bestT;

    // Sector timing detection
    if (this.trackProgress < 0.32) {
      this.currentSector = 1;
    } else if (this.trackProgress < 0.68) {
      if (this.currentSector === 1) {
        this.sectorTimes.s1 = (performance.now() - this.sectorStartTimes.s1) / 1000;
        this.sectorStartTimes.s2 = performance.now();
      }
      this.currentSector = 2;
    } else {
      if (this.currentSector === 2) {
        this.sectorTimes.s2 = (performance.now() - this.sectorStartTimes.s2) / 1000;
        this.sectorStartTimes.s3 = performance.now();
      }
      this.currentSector = 3;
    }
  }

  private onLapCompleted() {
    this.lastLapTime = this.currentLapTime;
    this.sectorTimes.s3 = (performance.now() - this.sectorStartTimes.s3) / 1000;

    if (this.bestLapTime === 0 || this.lastLapTime < this.bestLapTime) {
      this.bestLapTime = this.lastLapTime;
    }

    this.currentLap++;
    this.lapStartTime = performance.now();
    this.sectorStartTimes.s1 = this.lapStartTime;
    this.sectorStartTimes.s2 = 0;
    this.sectorStartTimes.s3 = 0;
  }

  private updateGearsAndRpm(throttle: number) {
    const isF1 = this.vehicleClass === 'f1';
    const gearRatios = isF1
      ? [0, 85, 135, 185, 230, 275, 315, 345] // 8-speed F1 gearbox
      : [0, 75, 115, 160, 210, 255, 295]; // 6-speed GT3 gearbox

    const maxRpm = isF1 ? 14500 : 8500;
    const idleRpm = isF1 ? 3800 : 1800;

    // Auto gear selection
    let chosenGear = 1;
    for (let g = 1; g < gearRatios.length; g++) {
      if (this.speedKmh > gearRatios[g] * 0.92) {
        chosenGear = g + 1;
      }
    }
    this.gear = Math.min(gearRatios.length - 1, chosenGear);

    // Compute RPM within current gear band
    const prevGearSpeed = this.gear === 1 ? 0 : gearRatios[this.gear - 1] * 0.8;
    const currGearMaxSpeed = gearRatios[this.gear];
    const gearProgress = Math.max(0, Math.min(1, (this.speedKmh - prevGearSpeed) / (currGearMaxSpeed - prevGearSpeed)));

    const targetRpm = idleRpm + gearProgress * (maxRpm - idleRpm) + throttle * 600;
    this.rpm = THREE.MathUtils.lerp(this.rpm, Math.min(maxRpm, targetRpm), 0.2);
  }

  private checkDrsAvailability(requestedDrs: boolean) {
    // Sepang DRS Zones:
    // Zone 1: Main Straight (progress 0.94 to 0.99)
    // Zone 2: Back Straight (progress 0.76 to 0.88)
    const inDrsZone =
      (this.trackProgress >= 0.94 && this.trackProgress <= 0.995) ||
      (this.trackProgress >= 0.76 && this.trackProgress <= 0.885);

    this.drsAvailable = inDrsZone && this.speedKmh > 120;
    this.drsActive = this.drsAvailable && requestedDrs;
  }

  private checkSlipstream() {
    this.slipstreamActive = false;
    if (this.speedKmh < 180) return;

    // Find if an AI car is within 25 meters ahead of player
    for (const ai of this.aiDrivers) {
      if (ai.lap === this.currentLap) {
        const progressDiff = (ai.trackProgress - this.trackProgress + 1) % 1;
        const distMeters = progressDiff * this.trackLength;
        if (distMeters > 4 && distMeters < 32 && Math.abs(ai.lateralOffset) < 3.5) {
          this.slipstreamActive = true;
          break;
        }
      }
    }
  }

  private updateAIDrivers(dt: number) {
    this.aiDrivers.forEach((ai, idx) => {
      // Find recommended speed on circuit at AI's current progress
      const waypoint = this.getNearestWaypoint(ai.trackProgress);
      const targetSpeed = (waypoint.recommendedSpeed * ai.skillLevel) + (ai.aggression * 15);

      // Smooth acceleration & braking toward target speed
      if (ai.speed < targetSpeed) {
        ai.speed += 28 * dt * ai.skillLevel;
      } else {
        ai.speed -= 42 * dt;
      }

      // Progress along circuit spline
      const speedMs = ai.speed / 3.6;
      const progressDelta = (speedMs * dt) / this.trackLength;
      const prevProgress = ai.trackProgress;
      ai.trackProgress = (ai.trackProgress + progressDelta) % 1;

      // Check lap count for AI
      if (prevProgress > 0.9 && ai.trackProgress < 0.1) {
        ai.lap++;
      }

      // Dynamic racing line & overtaking lane oscillation
      const laneOscillation = Math.sin(performance.now() * 0.001 + idx) * 1.5;
      ai.lateralOffset = THREE.MathUtils.lerp(ai.lateralOffset, (idx % 2 === 0 ? -1.8 : 1.8) + laneOscillation, 0.05);
    });

    // Compute live positions (1 to 8) based on total distance traveled
    const allRacers = [
      { id: 'player', totalDist: (this.currentLap - 1) * this.trackLength + this.trackProgress * this.trackLength },
      ...this.aiDrivers.map(ai => ({
        id: ai.id,
        totalDist: (ai.lap - 1) * this.trackLength + ai.trackProgress * this.trackLength,
      })),
    ].sort((a, b) => b.totalDist - a.totalDist);

    // Update positions
    allRacers.forEach((racer, rank) => {
      if (racer.id === 'player') {
        // Player rank
      } else {
        const ai = this.aiDrivers.find(d => d.id === racer.id);
        if (ai) {
          ai.position = rank + 1;
          const leaderDist = allRacers[0].totalDist;
          const gapMeters = Math.max(0, leaderDist - racer.totalDist);
          ai.gapToLeader = rank === 0 ? 'LEADER' : `+${(gapMeters / 70).toFixed(1)}s`;
        }
      }
    });
  }

  public getPlayerPosition(): number {
    const playerTotal = (this.currentLap - 1) * this.trackLength + this.trackProgress * this.trackLength;
    let rank = 1;
    for (const ai of this.aiDrivers) {
      const aiTotal = (ai.lap - 1) * this.trackLength + ai.trackProgress * this.trackLength;
      if (aiTotal > playerTotal) {
        rank++;
      }
    }
    return rank;
  }

  private getNearestWaypoint(progress: number): CircuitWaypoint {
    const index = Math.floor(progress * SEPANG_CONTROL_POINTS.length) % SEPANG_CONTROL_POINTS.length;
    return SEPANG_CONTROL_POINTS[index];
  }

  public getTelemetry(): TelemetryData {
    return {
      speed: Math.round(this.speedKmh),
      rpm: Math.round(this.rpm),
      maxRpm: this.vehicleClass === 'f1' ? 14500 : 8500,
      gear: this.gear,
      throttle: this.speedKmh > 0 ? 0.9 : 0,
      brake: 0,
      steering: this.steeringAngle,
      slipstreamActive: this.slipstreamActive,
      drsAvailable: this.drsAvailable,
      drsActive: this.drsActive,
      onCurb: this.onCurb,
      onGrass: this.onGrass,
      gForceLat: (this.lateralSlip * 3.5),
      gForceLong: 0,
      currentLap: Math.min(this.totalLaps, this.currentLap),
      totalLaps: this.totalLaps,
      currentLapTime: this.currentLapTime,
      bestLapTime: this.bestLapTime,
      lastLapTime: this.lastLapTime,
      sectorTimes: this.sectorTimes,
      currentSector: this.currentSector,
      deltaToBest: this.bestLapTime > 0 ? this.currentLapTime - this.bestLapTime : 0,
      position: this.getPlayerPosition(),
      totalDrivers: this.aiDrivers.length + 1,
    };
  }
}
