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
  aeroDownforce: number;
  brakeBias: number;
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
  skillLevel: number;
  aggression: number;
  trackProgress: number;
  lateralOffset: number;
  speed: number;
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
  rpm: number;
  maxRpm: number;
  gear: number; // 1-8, 0 = N
  throttle?: number;
  brake?: number;
  steering?: number;
  lap: number;
  currentLap: number;
  totalLaps: number;
  lapTime: number;
  currentLapTime: number;
  bestLapTime: number;
  lastLapTime: number;
  sectorTimes: { s1: number; s2: number; s3: number };
  currentSector: 1 | 2 | 3;
  position: number;
  totalDrivers: number;
  totalRacers: number;
  gapToLeader: string;
  drsAvailable: boolean;
  drsActive: boolean;
  onCurb: boolean;
  onGrass: boolean;
  gForceLat?: number;
  gForceLong?: number;
  deltaToBest?: number;
  slipstreamActive: boolean;
  trackProgress: number;
  worldPosition?: { x: number; y: number; z: number };
  headingAngle?: number;
  competitors?: {
    id: string;
    name: string;
    number: number;
    position: number;
    progress: number;
    color: string;
    x: number;
    z: number;
  }[];
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
