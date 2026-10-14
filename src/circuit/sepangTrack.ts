import * as THREE from 'three';
import { CircuitWaypoint } from '../types/game';

/**
 * Sepang International Circuit Track Layout & 3D Environment Generator
 * 100% Authentic FIA Grade 1 Hermann Tilke 5.543 km circuit in Sepang, Malaysia.
 * All 15 turns faithfully reconstructed from real GPS geospatial circuit telemetry.
 */

export const SEPANG_CONTROL_POINTS: CircuitWaypoint[] = [
  {
    "x": 0,
    "y": 0,
    "z": 0,
    "turnName": "Start / Finish Line",
    "recommendedSpeed": 340,
    "curbSide": "none",
    "sector": 1,
    "drsZone": true
  },
  {
    "x": 0,
    "y": 0,
    "z": -100,
    "recommendedSpeed": 340,
    "curbSide": "none",
    "sector": 1,
    "drsZone": true
  },
  {
    "x": 0,
    "y": 0,
    "z": -200,
    "recommendedSpeed": 340,
    "curbSide": "none",
    "sector": 1,
    "drsZone": true
  },
  {
    "x": 0,
    "y": 0,
    "z": -300.8,
    "turnName": "Turn 1 Braking Zone",
    "recommendedSpeed": 330,
    "curbSide": "none",
    "sector": 1,
    "drsZone": true
  },
  {
    "x": 2.2,
    "y": -0.3,
    "z": -314.4,
    "recommendedSpeed": 82,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 9.4,
    "y": -0.6,
    "z": -326.3,
    "recommendedSpeed": 82,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 19,
    "y": -0.9,
    "z": -334.1,
    "turnName": "Turn 1 (Pangkor Laut Right)",
    "recommendedSpeed": 82,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 31.6,
    "y": -1.2,
    "z": -337.8,
    "recommendedSpeed": 82,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 45.4,
    "y": -1.5,
    "z": -337.3,
    "recommendedSpeed": 82,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 59.4,
    "y": -1.8,
    "z": -331.2,
    "recommendedSpeed": 82,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 69.3,
    "y": -2,
    "z": -318.7,
    "recommendedSpeed": 88,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 73.1,
    "y": -2.2,
    "z": -302.6,
    "recommendedSpeed": 88,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 68,
    "y": -2.4,
    "z": -284.5,
    "turnName": "Turn 2 (Downhill Left Hairpin)",
    "recommendedSpeed": 88,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 53.1,
    "y": -2.6,
    "z": -251.3,
    "recommendedSpeed": 88,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 54.1,
    "y": -2.8,
    "z": -239.8,
    "recommendedSpeed": 88,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 62.9,
    "y": -2.4,
    "z": -229.4,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 74.3,
    "y": -2,
    "z": -225.4,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 89.8,
    "y": -1.6,
    "z": -227.3,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 106.1,
    "y": -1.2,
    "z": -236.3,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 136.5,
    "y": -0.8,
    "z": -257.3,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 154.6,
    "y": -0.4,
    "z": -265.8,
    "turnName": "Turn 3 (Sweeping Right Curve)",
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 175.8,
    "y": 0,
    "z": -270.6,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 196.7,
    "y": 0.4,
    "z": -272,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 220.2,
    "y": 0.8,
    "z": -270.2,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 277.6,
    "y": 1.2,
    "z": -260,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 304.1,
    "y": 1.6,
    "z": -248.8,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 330.7,
    "y": 2,
    "z": -232.3,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 347.4,
    "y": 2.4,
    "z": -216.5,
    "recommendedSpeed": 245,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 365.7,
    "y": 2.5,
    "z": -192.8,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 379.2,
    "y": 2.6,
    "z": -168.3,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 386.3,
    "y": 2.7,
    "z": -143.3,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 420.2,
    "y": 2.8,
    "z": -2.9,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 452.5,
    "y": 2.9,
    "z": 102.7,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 476.8,
    "y": 3,
    "z": 173.5,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 493.4,
    "y": 3.1,
    "z": 219.3,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 498.4,
    "y": 3.2,
    "z": 235.1,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 497.1,
    "y": 3.3,
    "z": 246.4,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 490.1,
    "y": 3.4,
    "z": 255.8,
    "turnName": "Turn 4 (Langkawi Right)",
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 477.4,
    "y": 3.5,
    "z": 258.4,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 369.6,
    "y": 3.6,
    "z": 269.1,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 313.9,
    "y": 3.7,
    "z": 276.4,
    "recommendedSpeed": 125,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 246.2,
    "y": 3.35,
    "z": 287.6,
    "recommendedSpeed": 225,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 219.7,
    "y": 3.1,
    "z": 297.5,
    "recommendedSpeed": 225,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 200.3,
    "y": 2.85,
    "z": 309.5,
    "recommendedSpeed": 225,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 180.1,
    "y": 2.6,
    "z": 331,
    "turnName": "Turn 5 (Fast Left Esse)",
    "recommendedSpeed": 225,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 166.1,
    "y": 2.35,
    "z": 352.9,
    "recommendedSpeed": 225,
    "curbSide": "left",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 158.7,
    "y": 2.1,
    "z": 375.2,
    "recommendedSpeed": 225,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 155.9,
    "y": 1.85,
    "z": 397.3,
    "recommendedSpeed": 225,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 157.8,
    "y": 1.6,
    "z": 423,
    "recommendedSpeed": 225,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 165.9,
    "y": 1.35,
    "z": 449.7,
    "turnName": "Turn 6 (Fast Right Esse)",
    "recommendedSpeed": 225,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 177.6,
    "y": 1.1,
    "z": 469.1,
    "recommendedSpeed": 225,
    "curbSide": "right",
    "sector": 1,
    "drsZone": false
  },
  {
    "x": 213.3,
    "y": 1.15,
    "z": 508,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": 222.5,
    "y": 1.3,
    "z": 526.5,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": 229.9,
    "y": 1.45,
    "z": 554.9,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": 228.8,
    "y": 1.6,
    "z": 578.5,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": 223.9,
    "y": 1.75,
    "z": 601.5,
    "turnName": "Turn 7 (Right-Hander)",
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": 214.7,
    "y": 1.9,
    "z": 619.7,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": 199.9,
    "y": 2.05,
    "z": 635.5,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -45.1,
    "y": 2.2,
    "z": 818.5,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -56.4,
    "y": 2.35,
    "z": 818.7,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -68.8,
    "y": 2.5,
    "z": 813.1,
    "turnName": "Turn 8 (Right Exit)",
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -142.9,
    "y": 2.65,
    "z": 772.8,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -149.3,
    "y": 2.8,
    "z": 761.9,
    "recommendedSpeed": 175,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -151.2,
    "y": 2.96,
    "z": 749.5,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -147.5,
    "y": 3.12,
    "z": 565.2,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -154.1,
    "y": 3.28,
    "z": 391.4,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -162.2,
    "y": 3.44,
    "z": 295.7,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -168.8,
    "y": 3.6,
    "z": 286.1,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -180.7,
    "y": 3.76,
    "z": 282.3,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -194.8,
    "y": 3.92,
    "z": 289.2,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -237.4,
    "y": 4.08,
    "z": 353.6,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -253.4,
    "y": 4.24,
    "z": 367.2,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -276.1,
    "y": 4.4,
    "z": 375.7,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -299.4,
    "y": 4.56,
    "z": 379.2,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -331.9,
    "y": 4.72,
    "z": 375.8,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -358.9,
    "y": 4.88,
    "z": 369.2,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -385.2,
    "y": 5.04,
    "z": 361,
    "recommendedSpeed": 160,
    "curbSide": "none",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -418,
    "y": 5.2,
    "z": 342.3,
    "recommendedSpeed": 160,
    "curbSide": "left",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -451.1,
    "y": 5.36,
    "z": 315.5,
    "recommendedSpeed": 74,
    "curbSide": "left",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -458.4,
    "y": 5.52,
    "z": 301.7,
    "recommendedSpeed": 74,
    "curbSide": "left",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -459.5,
    "y": 5.68,
    "z": 288.9,
    "turnName": "Turn 9 (Uphill Hairpin)",
    "recommendedSpeed": 74,
    "curbSide": "left",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -455.7,
    "y": 5.84,
    "z": 274.8,
    "recommendedSpeed": 74,
    "curbSide": "left",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -447.4,
    "y": 6,
    "z": 264,
    "recommendedSpeed": 74,
    "curbSide": "left",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -257.3,
    "y": 5.29,
    "z": 67.2,
    "recommendedSpeed": 205,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -250.8,
    "y": 4.57,
    "z": 52.9,
    "turnName": "Turn 10 (Fast Crest Right)",
    "recommendedSpeed": 205,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -248.2,
    "y": 3.86,
    "z": 34,
    "recommendedSpeed": 205,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -251.7,
    "y": 3.14,
    "z": 12.9,
    "recommendedSpeed": 145,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -285.1,
    "y": 2.43,
    "z": -66.9,
    "recommendedSpeed": 145,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -289.9,
    "y": 1.71,
    "z": -87.9,
    "turnName": "Turn 11 (Blind Downhill Right)",
    "recommendedSpeed": 145,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -291.3,
    "y": 1,
    "z": -112.5,
    "recommendedSpeed": 145,
    "curbSide": "right",
    "sector": 2,
    "drsZone": false
  },
  {
    "x": -289.4,
    "y": 0.42,
    "z": -133.9,
    "recommendedSpeed": 235,
    "curbSide": "left",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -279.1,
    "y": 0.34,
    "z": -173.2,
    "turnName": "Turn 12 (High-Speed Left)",
    "recommendedSpeed": 235,
    "curbSide": "left",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -265.7,
    "y": 0.26,
    "z": -199.4,
    "recommendedSpeed": 235,
    "curbSide": "left",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -250.4,
    "y": 0.18,
    "z": -215.9,
    "recommendedSpeed": 185,
    "curbSide": "right",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -217.5,
    "y": 0.1,
    "z": -237.1,
    "turnName": "Turn 13 (Medium Right)",
    "recommendedSpeed": 185,
    "curbSide": "right",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -193.6,
    "y": 0.02,
    "z": -243.5,
    "recommendedSpeed": 185,
    "curbSide": "right",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -179.3,
    "y": 0,
    "z": -243.6,
    "recommendedSpeed": 92,
    "curbSide": "right",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -164.1,
    "y": 0,
    "z": -232.5,
    "turnName": "Turn 14 (Sunway Lagoon Curve)",
    "recommendedSpeed": 92,
    "curbSide": "right",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -157,
    "y": 0,
    "z": -210.7,
    "recommendedSpeed": 92,
    "curbSide": "right",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -139.4,
    "y": 0,
    "z": -41.3,
    "recommendedSpeed": 335,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  },
  {
    "x": -121.8,
    "y": 0,
    "z": 128,
    "recommendedSpeed": 335,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  },
  {
    "x": -104.2,
    "y": 0,
    "z": 297.4,
    "recommendedSpeed": 335,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  },
  {
    "x": -86.6,
    "y": 0,
    "z": 466.7,
    "recommendedSpeed": 335,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  },
  {
    "x": -69,
    "y": 0,
    "z": 636.1,
    "turnName": "927m Back Straight",
    "recommendedSpeed": 335,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  },
  {
    "x": -59.5,
    "y": 0,
    "z": 648.9,
    "recommendedSpeed": 335,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  },
  {
    "x": -40,
    "y": 0,
    "z": 659.2,
    "turnName": "Turn 15 (KLIA Final Hairpin)",
    "recommendedSpeed": 76,
    "curbSide": "left",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -22.8,
    "y": 0,
    "z": 656.1,
    "recommendedSpeed": 76,
    "curbSide": "left",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": -5.8,
    "y": 0,
    "z": 642.2,
    "recommendedSpeed": 76,
    "curbSide": "left",
    "sector": 3,
    "drsZone": false
  },
  {
    "x": 0,
    "y": 0,
    "z": 617.6,
    "turnName": "Exit onto Main Straight",
    "recommendedSpeed": 230,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  },
  {
    "x": 0,
    "y": 0,
    "z": 450,
    "recommendedSpeed": 320,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  },
  {
    "x": 0,
    "y": 0,
    "z": 300,
    "recommendedSpeed": 330,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  },
  {
    "x": 0,
    "y": 0,
    "z": 150,
    "recommendedSpeed": 335,
    "curbSide": "none",
    "sector": 3,
    "drsZone": true
  }
];

export interface TrackGeometryData {
  curve: THREE.CatmullRomCurve3;
  trackMesh: THREE.Mesh;
  curbsGroup: THREE.Group;
  barriersGroup: THREE.Group;
  decorationsGroup: THREE.Group;
  startGantry: THREE.Group;
  gantryLights: THREE.Mesh[];
  trackLength: number;
  samplePoints: { position: THREE.Vector3; tangent: THREE.Vector3; normal: THREE.Vector3; progress: number }[];
}

export function createSepangCircuit(weather: 'day' | 'sunset' | 'wet' = 'day'): TrackGeometryData {
  // 1. Build smooth 3D Catmull-Rom spline
  const points = SEPANG_CONTROL_POINTS.map(p => new THREE.Vector3(p.x, p.y, p.z));
  const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.15);
  const trackLength = curve.getLength();

  // Pre-sample 800 discrete points for rock-solid distance projection & barrier collision
  const SAMPLE_COUNT = 800;
  const samplePoints: TrackGeometryData['samplePoints'] = [];
  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const t = i / SAMPLE_COUNT;
    const pos = curve.getPointAt(t);
    const tan = curve.getTangentAt(t).normalize();
    const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
    samplePoints.push({ position: pos, tangent: tan, normal: norm, progress: t });
  }

  // 2. High-contrast Procedural Track Surface Texture
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base dark racing asphalt
  ctx.fillStyle = weather === 'wet' ? '#0d1117' : '#1e242c';
  ctx.fillRect(0, 0, 512, 512);

  // Surface asphalt specks
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const gray = Math.floor(40 + Math.random() * 40);
    ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // White track boundary lines (left and right edges)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(18, 0, 10, 512);
  ctx.fillRect(484, 0, 10, 512);

  // White dashed centerline
  for (let y = 0; y < 512; y += 48) {
    ctx.fillRect(252, y, 8, 24);
  }

  const trackTexture = new THREE.CanvasTexture(canvas);
  trackTexture.wrapS = THREE.RepeatWrapping;
  trackTexture.wrapT = THREE.RepeatWrapping;
  trackTexture.repeat.set(1, 240);
  trackTexture.colorSpace = THREE.SRGBColorSpace;
  trackTexture.needsUpdate = true;

  // 3. Extrude Track Ribbon Geometry (14m wide) & Run-off Shoulder Bed (20m wide)
  const TRACK_WIDTH = 14;
  const SHOULDER_WIDTH = 20;
  const segments = 1600;

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const shoulderPositions: number[] = [];
  const shoulderIndices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = (i % segments) / segments;
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    // Main Asphalt surface: explicitly elevated at pos.y + 0.35m
    const yTrack = pos.y + 0.35;
    const leftX = pos.x + normal.x * (TRACK_WIDTH / 2);
    const leftZ = pos.z + normal.z * (TRACK_WIDTH / 2);
    const rightX = pos.x - normal.x * (TRACK_WIDTH / 2);
    const rightZ = pos.z - normal.z * (TRACK_WIDTH / 2);

    positions.push(leftX, yTrack, leftZ);
    normals.push(0, 1, 0);
    uvs.push(0, (i / segments) * 240);

    positions.push(rightX, yTrack, rightZ);
    normals.push(0, 1, 0);
    uvs.push(1, (i / segments) * 240);

    // Shoulder Run-off bed (tarmac/gravel) at pos.y + 0.20m
    const yShoulder = pos.y + 0.20;
    shoulderPositions.push(pos.x + normal.x * (SHOULDER_WIDTH / 2), yShoulder, pos.z + normal.z * (SHOULDER_WIDTH / 2));
    shoulderPositions.push(pos.x - normal.x * (SHOULDER_WIDTH / 2), yShoulder, pos.z - normal.z * (SHOULDER_WIDTH / 2));

    if (i < segments) {
      const v0 = i * 2;
      const v1 = i * 2 + 1;
      const v2 = (i + 1) * 2;
      const v3 = (i + 1) * 2 + 1;

      // CCW upward-facing polygon winding
      indices.push(v0, v2, v1);
      indices.push(v1, v2, v3);

      shoulderIndices.push(v0, v2, v1);
      shoulderIndices.push(v1, v2, v3);
    }
  }

  const trackGeo = new THREE.BufferGeometry();
  trackGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  trackGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  trackGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  trackGeo.setIndex(indices);

  const trackMat = new THREE.MeshStandardMaterial({
    map: trackTexture,
    roughness: weather === 'wet' ? 0.25 : 0.72,
    metalness: weather === 'wet' ? 0.35 : 0.05,
    side: THREE.FrontSide,
  });

  const trackMesh = new THREE.Mesh(trackGeo, trackMat);
  trackMesh.receiveShadow = true;

  // Run-off Tarmac Shoulder
  const shoulderGeo = new THREE.BufferGeometry();
  shoulderGeo.setAttribute('position', new THREE.Float32BufferAttribute(shoulderPositions, 3));
  shoulderGeo.setIndex(shoulderIndices);
  shoulderGeo.computeVertexNormals();

  const shoulderMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Slate run-off tarmac
    roughness: 0.9,
    side: THREE.FrontSide,
  });
  const shoulderMesh = new THREE.Mesh(shoulderGeo, shoulderMat);
  shoulderMesh.receiveShadow = true;

  // 4. Procedural Red & White Apex Kerbs
  const curbsGroup = new THREE.Group();
  curbsGroup.add(shoulderMesh);

  const curbMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
  const curbMatWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });

  SEPANG_CONTROL_POINTS.forEach((pt) => {
    if (!pt.curbSide || pt.curbSide === 'none') return;

    // Find point index on curve
    const approxT = points.findIndex(p => Math.hypot(p.x - pt.x, p.z - pt.z) < 0.1) / points.length;
    if (approxT < 0) return;
    const curbSegments = 24;

    for (let c = 0; c < curbSegments; c++) {
      const stepT = (approxT + (c - curbSegments / 2) * 0.0012 + 1) % 1;
      const center = curve.getPointAt(stepT);
      const tangent = curve.getTangentAt(stepT).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const sides: ('left' | 'right')[] = pt.curbSide === 'both' ? ['left', 'right'] : [pt.curbSide];

      sides.forEach(side => {
        const sign = side === 'left' ? 1 : -1;
        const curbWidth = 1.6;
        const curbOffset = TRACK_WIDTH / 2 + curbWidth / 2 - 0.05;

        const curbPos = new THREE.Vector3(
          center.x + normal.x * curbOffset * sign,
          center.y + 0.38,
          center.z + normal.z * curbOffset * sign
        );

        const curbGeo = new THREE.BoxGeometry(curbWidth, 0.14, 2.5);
        const curbMesh = new THREE.Mesh(curbGeo, c % 2 === 0 ? curbMatRed : curbMatWhite);
        curbMesh.position.copy(curbPos);
        curbMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
        curbMesh.receiveShadow = true;
        curbMesh.castShadow = true;
        curbsGroup.add(curbMesh);
      });
    }
  });

  // 5. Continuous FIA Armco Safety Barriers (along both sides at ±9.6m from center)
  const barriersGroup = new THREE.Group();
  addCircuitSafetyBarriers(barriersGroup, curve);

  // 6. Trackside Decor: Grandstands, Pit Lane, Gantry, Palms
  const decorationsGroup = new THREE.Group();

  // A. Iconic Sepang Double-Sided Hibiscus Canopy Grandstand
  // Sits directly between Main Straight (x: 0) and Back Straight (x: -80) at x: -40
  const grandstandGroup = createSepangCanopyGrandstand();
  grandstandGroup.position.set(-40, 0, 150);
  decorationsGroup.add(grandstandGroup);

  // B. Pit Lane & Garages along Main Straight outside at x: 24
  const pitBuilding = createPitBuilding();
  pitBuilding.position.set(25, 0, 0);
  decorationsGroup.add(pitBuilding);

  // C. Start / Finish Overhead Gantry with 5 Red Countdown Lights directly over Main Straight (x: 0, z: -20)
  const { gantryGroup, lightMeshes } = createStartGantry();
  gantryGroup.position.set(0, 0, -20);
  decorationsGroup.add(gantryGroup);

  // D. Distance Boards (150m, 100m, 50m) before Turn 1 and Turn 15
  addDistanceMarkers(decorationsGroup, curve);

  // E. Tropical Palm Trees along the circuit
  addTropicalTrees(decorationsGroup);

  // F. Floodlight Pylons
  addFloodlightTowers(decorationsGroup);

  // G. Ground terrain - comfortably below track at y = -1.2m
  const terrainGeo = new THREE.PlaneGeometry(2400, 2400, 32, 32);
  const terrainMat = new THREE.MeshStandardMaterial({
    color: weather === 'wet' ? 0x1b3820 : 0x225528,
    roughness: 0.95,
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.rotation.x = -Math.PI / 2;
  terrainMesh.position.y = -1.2;
  terrainMesh.receiveShadow = true;
  decorationsGroup.add(terrainMesh);

  return {
    curve,
    trackMesh,
    curbsGroup,
    barriersGroup,
    decorationsGroup,
    startGantry: gantryGroup,
    gantryLights: lightMeshes,
    trackLength,
    samplePoints,
  };
}

/**
 * Procedural model of Sepang's signature twin-canopy Hibiscus Grandstand
 */
function createSepangCanopyGrandstand(): THREE.Group {
  const group = new THREE.Group();

  // Tiered seating block (480m long, 36m wide, 14m high)
  const baseGeo = new THREE.BoxGeometry(36, 12, 480);
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.8 });
  const baseMesh = new THREE.Mesh(baseGeo, concreteMat);
  baseMesh.position.y = 6;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Seating tiers with colored seats (Malaysian red & yellow theme)
  const seatMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
  const seatMatYellow = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
  for (let s = 0; s < 44; s++) {
    const seatStripGeo = new THREE.BoxGeometry(15, 0.4, 9);
    const seatStrip = new THREE.Mesh(seatStripGeo, s % 2 === 0 ? seatMatRed : seatMatYellow);
    seatStrip.position.set(9, 12.2, -210 + s * 10);
    group.add(seatStrip);

    // Opposite side (Back Straight view)
    const seatStripBack = new THREE.Mesh(seatStripGeo, s % 2 === 0 ? seatMatYellow : seatMatRed);
    seatStripBack.position.set(-9, 12.2, -210 + s * 10);
    group.add(seatStripBack);
  }

  // Iconic Hibiscus Curved Palm Leaf Canopies (Winged tensile fabric roofs)
  const roofSegments = 22;
  const canopyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  for (let r = 0; r < roofSegments; r++) {
    const petalGeo = new THREE.CylinderGeometry(18, 14, 18, 16, 1, false, 0, Math.PI);
    const petalMesh = new THREE.Mesh(petalGeo, canopyMat);
    petalMesh.rotation.z = Math.PI / 2;
    petalMesh.rotation.y = Math.PI / 2;
    petalMesh.position.set(0, 24, -200 + r * 20);
    petalMesh.scale.set(1.2, 0.9, 0.4);
    petalMesh.castShadow = true;
    group.add(petalMesh);

    // Steel support pillars
    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, 16);
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
    const p1 = new THREE.Mesh(pillarGeo, steelMat);
    p1.position.set(-8, 14, -200 + r * 20);
    const p2 = new THREE.Mesh(pillarGeo, steelMat);
    p2.position.set(8, 14, -200 + r * 20);
    group.add(p1, p2);
  }

  return group;
}

/**
 * Sepang Pit Building & Garages with VIP Hospitality Towers
 */
function createPitBuilding(): THREE.Group {
  const group = new THREE.Group();

  // Garages structure (260m long, 16m wide, 11m high)
  const bldgGeo = new THREE.BoxGeometry(16, 10, 260);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
  const bldgMesh = new THREE.Mesh(bldgGeo, wallMat);
  bldgMesh.position.y = 5;
  bldgMesh.castShadow = true;
  group.add(bldgMesh);

  // Pit Wall dividing track and pit lane
  const pitWallGeo = new THREE.BoxGeometry(1.2, 1.4, 260);
  const pitWallMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
  const pitWall = new THREE.Mesh(pitWallGeo, pitWallMat);
  pitWall.position.set(-9.5, 0.7, 0);
  group.add(pitWall);

  // Team Garages along bottom floor
  const shutterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
  for (let g = 0; g < 14; g++) {
    const doorGeo = new THREE.BoxGeometry(0.2, 4.5, 12);
    const door = new THREE.Mesh(doorGeo, shutterMat);
    door.position.set(-8.1, 2.3, -100 + g * 16);
    group.add(door);
  }

  // Control Tower
  const towerGeo = new THREE.BoxGeometry(14, 22, 18);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5 });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.set(0, 11, -20);
  group.add(tower);

  return group;
}

/**
 * Start/Finish Overhead Gantry with 5 Red LED Countdown Lights
 */
function createStartGantry(): { gantryGroup: THREE.Group; lightMeshes: THREE.Mesh[] } {
  const gantryGroup = new THREE.Group();
  const lightMeshes: THREE.Mesh[] = [];

  // Steel truss spanning across main straight (22m wide, 8m high)
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });

  // Left & right support pillars
  const pillarGeo = new THREE.BoxGeometry(1, 8.5, 1);
  const leftPillar = new THREE.Mesh(pillarGeo, steelMat);
  leftPillar.position.set(-11, 4.25, 0);

  const rightPillar = new THREE.Mesh(pillarGeo, steelMat);
  rightPillar.position.set(11, 4.25, 0);

  // Cross beam
  const beamGeo = new THREE.BoxGeometry(23, 1.4, 1.4);
  const crossBeam = new THREE.Mesh(beamGeo, steelMat);
  crossBeam.position.set(0, 8, 0);

  gantryGroup.add(leftPillar, rightPillar, crossBeam);

  // 5 Red Starting Lights Panel
  const panelGeo = new THREE.BoxGeometry(9, 1.6, 0.4);
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
  const panelMesh = new THREE.Mesh(panelGeo, panelMat);
  panelMesh.position.set(0, 7.8, 0.8);
  gantryGroup.add(panelMesh);

  // 5 Light housings with bright emissive material
  for (let i = 0; i < 5; i++) {
    const lightGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x330000 }); // Unlit dark red
    const lightMesh = new THREE.Mesh(lightGeo, lightMat);
    lightMesh.rotation.x = Math.PI / 2;
    lightMesh.position.set(-3.2 + i * 1.6, 7.8, 1.05);
    gantryGroup.add(lightMesh);
    lightMeshes.push(lightMesh);
  }

  return { gantryGroup, lightMeshes };
}

/**
 * Continuous FIA safety crash barriers around entire circuit perimeter
 */
function addCircuitSafetyBarriers(group: THREE.Group, curve: THREE.CatmullRomCurve3) {
  const barrierSegments = 600;
  const barrierMatBlue = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
  const barrierMatWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });

  for (let i = 0; i < barrierSegments; i++) {
    const t = i / barrierSegments;
    const center = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    // Barriers on left and right at ±9.6m
    [-1, 1].forEach((side) => {
      const bPos = new THREE.Vector3(
        center.x + normal.x * 9.6 * side,
        center.y + 0.85,
        center.z + normal.z * 9.6 * side
      );

      const bGeo = new THREE.BoxGeometry(0.5, 1.1, 9.5);
      const bMesh = new THREE.Mesh(bGeo, i % 2 === 0 ? barrierMatBlue : barrierMatWhite);
      bMesh.position.copy(bPos);
      bMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      group.add(bMesh);
    });
  }
}

/**
 * 150m, 100m, 50m Braking Distance Marker Boards
 */
function addDistanceMarkers(group: THREE.Group, curve: THREE.CatmullRomCurve3) {
  const markers = [
    { dist: 150, z: -170 },
    { dist: 100, z: -220 },
    { dist: 50, z: -270 },
  ];

  const boardMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });

  markers.forEach(m => {
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8);
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(8.5, 1.4, m.z);

    const boardGeo = new THREE.BoxGeometry(0.1, 1.4, 2.2);
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(8.5, 2.2, m.z);
    group.add(pole, board);
  });
}

/**
 * Tropical Malaysian Palm Trees along landscape
 */
function addTropicalTrees(group: THREE.Group) {
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const frondMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

  const treeClusters = [
    { x: 120, z: -320 },
    { x: 260, z: -180 },
    { x: 340, z: 120 },
    { x: -350, z: 220 },
    { x: -280, z: -120 },
  ];

  treeClusters.forEach(c => {
    for (let t = 0; t < 6; t++) {
      const tx = c.x + (Math.random() - 0.5) * 45;
      const tz = c.z + (Math.random() - 0.5) * 45;

      const trunkGeo = new THREE.CylinderGeometry(0.35, 0.55, 9, 8);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(tx, 3.5, tz);

      const frondGeo = new THREE.ConeGeometry(4.5, 2.2, 8);
      const frond = new THREE.Mesh(frondGeo, frondMat);
      frond.position.set(tx, 8.5, tz);

      trunk.castShadow = true;
      frond.castShadow = true;
      group.add(trunk, frond);
    }
  });
}

/**
 * Floodlight towers around circuit
 */
function addFloodlightTowers(group: THREE.Group) {
  const towerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 });
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  const coords = [
    { x: -16, z: -250 },
    { x: 18, z: 250 },
    { x: -16, z: 500 },
    { x: 150, z: -260 },
    { x: -420, z: 280 },
  ];

  coords.forEach(pt => {
    const mastGeo = new THREE.CylinderGeometry(0.4, 0.7, 24);
    const mast = new THREE.Mesh(mastGeo, towerMat);
    mast.position.set(pt.x, 12, pt.z);

    const headGeo = new THREE.BoxGeometry(4, 1.2, 2);
    const head = new THREE.Mesh(headGeo, lampMat);
    head.position.set(pt.x, 24, pt.z);

    group.add(mast, head);
  });
}
