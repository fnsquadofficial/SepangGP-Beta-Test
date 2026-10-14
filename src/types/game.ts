export type VehicleClass = 'f1' | 'gt3';

export type WeatherType = 'day' | 'sunset' | 'wet';

export type CameraMode = 'chase' | 'cockpit' | 'helicopter';

export type GamePhase = 'paddock' | 'countdown' | 'racing' | 'finished';

export interface VehicleConfig {
  id: string;
  name: string;
  vehicleClass: VehicleClass;
  subtitle: string;
  description: string;
  topSpeed: number; // km/h
  acceleration: number; // 0-100 rating
  braking: number;
  downforce: number;
  weight: number; // kg
  horsePower: number; // hp
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  drsBoost: number; // km/h boost on straights
  enginePitchBase: number;
}

export interface SetupSettings {
  aeroDownforce: number; // 0 (low drag/high speed) to 100 (high downforce/fast cornering)
  brakeBias: number; // 50-65% front
  tractionControl: boolean;
  steeringAssist: boolean;
}

export interface SectorSplit {
  s1: number;
  s2: number;
  s3: number;
}

export interface LapRecord {
  lapNumber: number;
  lapTime: number; // seconds
  sectors: SectorSplit;
  isBest: boolean;
}

export interface AIDriverProfile {
  id: string;
  name: string;
  number: number;
  team: string;
  carClass: VehicleClass;
  color: string;
  secondaryColor: string;
  skillLevel: number; // 0.85 to 1.15 multiplier
  aggression: number;
  // Dynamic state during race
  trackProgress: number; // normalized 0 to 1 along circuit
  lateralOffset: number; // deviation from racing line (-5 to +5 meters)
  speed: number; // km/h
  lap: number;
  lastLapTime: number;
  bestLapTime: number;
  currentSector: 1 | 2 | 3;
  sectorTimes: { s1: number; s2: number; s3: number };
  position: number;
  gapToLeader: string;
}

export interface TelemetryData {
  speed: number; // km/h
  rpm: number; // 0 to 15000
  maxRpm: number;
  gear: number; // 1-8, 0 = N, -1 = R
  throttle: number; // 0 to 1
  brake: number; // 0 to 1
  steering: number; // -1 to 1
  slipstreamActive: boolean;
  drsAvailable: boolean;
  drsActive: boolean;
  onCurb: boolean;
  onGrass: boolean;
  gForceLat: number;
  gForceLong: number;
  currentLap: number;
  totalLaps: number;
  currentLapTime: number;
  bestLapTime: number;
  lastLapTime: number;
  sectorTimes: { s1: number; s2: number; s3: number };
  currentSector: 1 | 2 | 3;
  deltaToBest: number;
  position: number;
  totalDrivers: number;
}

export interface CircuitWaypoint {
  x: number;
  y: number;
  z: number;
  turnName?: string;
  recommendedSpeed: number; // km/h
  curbSide?: 'left' | 'right' | 'both' | 'none';
  drsZone?: boolean;
  sector: 1 | 2 | 3;
}
