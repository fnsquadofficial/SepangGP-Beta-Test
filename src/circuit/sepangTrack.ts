import * as THREE from 'three';
import { CircuitWaypoint } from '../types/game';

/**
 * Sepang International Circuit Track Layout & 3D Environment Generator
 * Faithful recreation of Hermann Tilke's 5.543 km circuit in Malaysia.
 */

// 15 Key Circuit Turn Points (Scaled in meters with elevation changes)
export const SEPANG_CONTROL_POINTS: CircuitWaypoint[] = [
  // Start/Finish Straight (Mid-straight at x: 45, z: 0)
  { x: 45, y: 0, z: 0, turnName: 'Start / Finish Line', recommendedSpeed: 320, sector: 1, drsZone: true },
  { x: 45, y: 0, z: -220, recommendedSpeed: 335, sector: 1, drsZone: true },
  { x: 45, y: 0, z: -380, turnName: 'Turn 1 Braking Zone', recommendedSpeed: 140, sector: 1, drsZone: false },

  // Turn 1 & Turn 2: Downhill Hairpin & Chicane
  { x: 75, y: -2, z: -430, turnName: 'Turn 1 (Tight Right)', recommendedSpeed: 85, curbSide: 'right', sector: 1 },
  { x: 105, y: -4, z: -390, turnName: 'Turn 2 (Downhill Left)', recommendedSpeed: 95, curbSide: 'left', sector: 1 },

  // Turn 3: Sweeping Long Right Acceleration
  { x: 170, y: -3, z: -330, recommendedSpeed: 190, sector: 1 },
  { x: 230, y: -1, z: -240, turnName: 'Turn 3 (Long Right Sweep)', recommendedSpeed: 240, curbSide: 'right', sector: 1 },
  { x: 250, y: 0, z: -150, recommendedSpeed: 275, sector: 1 },

  // Turn 4: 90-Degree Right-Hander
  { x: 240, y: 0, z: -70, turnName: 'Turn 4 (90° Right)', recommendedSpeed: 125, curbSide: 'right', sector: 1 },

  // Turns 5 & 6: High-Speed Sweeping Esses (Sector 1 Exit / Sector 2 Start)
  { x: 200, y: 2, z: -10, recommendedSpeed: 210, sector: 1 },
  { x: 170, y: 4, z: 60, turnName: 'Turn 5 (High-Speed Left)', recommendedSpeed: 235, curbSide: 'left', sector: 1 },
  { x: 195, y: 5, z: 130, turnName: 'Turn 6 (Fast Right Switch)', recommendedSpeed: 220, curbSide: 'right', sector: 2 },

  // Turns 7 & 8: Double Right-Handers
  { x: 260, y: 6, z: 180, recommendedSpeed: 200, sector: 2 },
  { x: 290, y: 7, z: 230, turnName: 'Turn 7 (Right)', recommendedSpeed: 175, curbSide: 'right', sector: 2 },
  { x: 280, y: 8, z: 290, turnName: 'Turn 8 (Right Exit)', recommendedSpeed: 185, curbSide: 'right', sector: 2 },

  // Turn 9: Steep Uphill 1st/2nd Gear Left Hairpin
  { x: 220, y: 11, z: 320, recommendedSpeed: 140, sector: 2 },
  { x: 155, y: 14, z: 340, turnName: 'Turn 9 (Uphill Hairpin)', recommendedSpeed: 75, curbSide: 'left', sector: 2 },
  { x: 120, y: 12, z: 300, recommendedSpeed: 150, sector: 2 },

  // Turn 10: Crest & Fast Right
  { x: 95, y: 10, z: 240, turnName: 'Turn 10 (Fast Right)', recommendedSpeed: 200, curbSide: 'right', sector: 2 },

  // Turn 11: Fast Downhill Right
  { x: 75, y: 6, z: 160, recommendedSpeed: 220, sector: 2 },
  { x: 60, y: 3, z: 90, turnName: 'Turn 11 (Downhill Right)', recommendedSpeed: 155, curbSide: 'right', sector: 2 },

  // Turns 12 & 13: High-Speed Esses into Heavy Braking (Sector 3 Start)
  { x: 15, y: 1, z: 50, recommendedSpeed: 210, sector: 3 },
  { x: -25, y: 0, z: -10, turnName: 'Turn 12 (Left Sweeper)', recommendedSpeed: 245, curbSide: 'left', sector: 3 },
  { x: -55, y: 0, z: -80, turnName: 'Turn 13 (Right Flick)', recommendedSpeed: 215, curbSide: 'right', sector: 3 },

  // Turn 14: Sharp Right onto the 927m Back Straight
  { x: -80, y: 0, z: -150, recommendedSpeed: 130, sector: 3 },
  { x: -95, y: 0, z: -210, turnName: 'Turn 14 (Right onto Back Straight)', recommendedSpeed: 95, curbSide: 'right', sector: 3 },

  // The Massive Back Straight (Parallel to Main Straight)
  { x: -95, y: 0, z: -100, recommendedSpeed: 240, sector: 3, drsZone: true },
  { x: -95, y: 0, z: 50, recommendedSpeed: 290, sector: 3, drsZone: true },
  { x: -95, y: 0, z: 220, recommendedSpeed: 325, sector: 3, drsZone: true },
  { x: -95, y: 0, z: 380, turnName: 'Turn 15 Braking Zone', recommendedSpeed: 140, sector: 3, drsZone: false },

  // Turn 15: The Notorious Final Hairpin (180° Left wrapping onto Main Straight)
  { x: -70, y: 0, z: 440, turnName: 'Turn 15 (Final Hairpin)', recommendedSpeed: 80, curbSide: 'left', sector: 3 },
  { x: -10, y: 0, z: 460, recommendedSpeed: 110, curbSide: 'both', sector: 3 },
  { x: 30, y: 0, z: 420, turnName: 'Exit onto Main Straight', recommendedSpeed: 170, curbSide: 'left', sector: 3 },
  { x: 45, y: 0, z: 320, recommendedSpeed: 240, sector: 3, drsZone: true },
  { x: 45, y: 0, z: 150, recommendedSpeed: 280, sector: 3, drsZone: true },
];

export interface TrackGeometryData {
  curve: THREE.CatmullRomCurve3;
  trackMesh: THREE.Mesh;
  curbsGroup: THREE.Group;
  decorationsGroup: THREE.Group;
  startGantry: THREE.Group;
  gantryLights: THREE.Mesh[];
  trackLength: number;
  samplePoints: { position: THREE.Vector3; tangent: THREE.Vector3; normal: THREE.Vector3; progress: number }[];
}

export function createSepangCircuit(weather: 'day' | 'sunset' | 'wet' = 'day'): TrackGeometryData {
  // 1. Build smooth 3D Catmull-Rom spline
  const points = SEPANG_CONTROL_POINTS.map(p => new THREE.Vector3(p.x, p.y, p.z));
  const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.25);
  const trackLength = curve.getLength();

  // Pre-sample 600 discrete points for ultra-fast distance projection & collision
  const SAMPLE_COUNT = 600;
  const samplePoints: TrackGeometryData['samplePoints'] = [];
  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const t = i / SAMPLE_COUNT;
    const pos = curve.getPointAt(t);
    const tan = curve.getTangentAt(t).normalize();
    const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
    samplePoints.push({ position: pos, tangent: tan, normal: norm, progress: t });
  }

  // 2. Procedural Track Surface Texture
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base dark asphalt
  ctx.fillStyle = weather === 'wet' ? '#11151c' : '#1e242b';
  ctx.fillRect(0, 0, 512, 512);

  // Surface aggregate noise
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const gray = Math.floor(25 + Math.random() * 45);
    ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // White track boundary lines
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(20, 0, 8, 512);
  ctx.fillRect(484, 0, 8, 512);

  // Dashed centerline
  ctx.fillStyle = '#ffffff';
  for (let y = 0; y < 512; y += 40) {
    ctx.fillRect(254, y, 4, 20);
  }

  const trackTexture = new THREE.CanvasTexture(canvas);
  trackTexture.wrapS = THREE.RepeatWrapping;
  trackTexture.wrapT = THREE.RepeatWrapping;
  trackTexture.repeat.set(1, 140);
  trackTexture.colorSpace = THREE.SRGBColorSpace;

  // 3. Extrude Track Ribbon Geometry (14m wide)
  const TRACK_WIDTH = 14;
  const segments = 1200;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = (i % segments) / segments;
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    // Left vertex
    const leftX = pos.x + normal.x * (TRACK_WIDTH / 2);
    const leftY = pos.y + 0.05;
    const leftZ = pos.z + normal.z * (TRACK_WIDTH / 2);

    // Right vertex
    const rightX = pos.x - normal.x * (TRACK_WIDTH / 2);
    const rightY = pos.y + 0.05;
    const rightZ = pos.z - normal.z * (TRACK_WIDTH / 2);

    positions.push(leftX, leftY, leftZ);
    normals.push(0, 1, 0);
    uvs.push(0, (i / segments) * 140);

    positions.push(rightX, rightY, rightZ);
    normals.push(0, 1, 0);
    uvs.push(1, (i / segments) * 140);

    if (i < segments) {
      const v0 = i * 2;
      const v1 = i * 2 + 1;
      const v2 = (i + 1) * 2;
      const v3 = (i + 1) * 2 + 1;

      indices.push(v0, v1, v2);
      indices.push(v1, v3, v2);
    }
  }

  const trackGeo = new THREE.BufferGeometry();
  trackGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  trackGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  trackGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  trackGeo.setIndex(indices);
  trackGeo.computeVertexNormals();

  const trackMat = new THREE.MeshStandardMaterial({
    map: trackTexture,
    roughness: weather === 'wet' ? 0.2 : 0.75,
    metalness: weather === 'wet' ? 0.35 : 0.08,
  });

  const trackMesh = new THREE.Mesh(trackGeo, trackMat);
  trackMesh.receiveShadow = true;

  // 4. Procedural Red & White Apex Kerbs
  const curbsGroup = new THREE.Group();
  const curbMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 });
  const curbMatWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });

  SEPANG_CONTROL_POINTS.forEach((pt) => {
    if (!pt.curbSide || pt.curbSide === 'none') return;

    // Find point on curve
    const approxT = points.findIndex(p => p.x === pt.x && p.z === pt.z) / points.length;
    const curbSegments = 24;

    for (let c = 0; c < curbSegments; c++) {
      const stepT = (approxT + (c - curbSegments / 2) * 0.001 + 1) % 1;
      const center = curve.getPointAt(stepT);
      const tangent = curve.getTangentAt(stepT).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const sides: ('left' | 'right')[] = pt.curbSide === 'both' ? ['left', 'right'] : [pt.curbSide];

      sides.forEach(side => {
        const sign = side === 'left' ? 1 : -1;
        const curbWidth = 1.6;
        const curbOffset = TRACK_WIDTH / 2 + curbWidth / 2 - 0.2;

        const curbPos = new THREE.Vector3(
          center.x + normal.x * curbOffset * sign,
          center.y + 0.12,
          center.z + normal.z * curbOffset * sign
        );

        const curbGeo = new THREE.BoxGeometry(curbWidth, 0.15, 2.5);
        const curbMesh = new THREE.Mesh(curbGeo, c % 2 === 0 ? curbMatRed : curbMatWhite);
        curbMesh.position.copy(curbPos);
        curbMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
        curbMesh.receiveShadow = true;
        curbMesh.castShadow = true;
        curbsGroup.add(curbMesh);
      });
    }
  });

  // 5. Trackside Decor: Grandstands, Palms, Distance Markers, Gantry
  const decorationsGroup = new THREE.Group();

  // A. Iconic Sepang Double-Sided Hibiscus Canopy Grandstand
  // Sits between the Main Straight (x: 45) and Back Straight (x: -95) at x: -25, spanning z: -250 to z: 250
  const grandstandGroup = createSepangCanopyGrandstand();
  grandstandGroup.position.set(-25, 0, 0);
  decorationsGroup.add(grandstandGroup);

  // B. Pit Lane & Garages along Main Straight (x: 65, z: -150 to z: 150)
  const pitBuilding = createPitBuilding();
  pitBuilding.position.set(65, 0, 0);
  decorationsGroup.add(pitBuilding);

  // C. Start / Finish Overhead Gantry with 5 Red Countdown Lights
  const { gantryGroup, lightMeshes } = createStartGantry();
  gantryGroup.position.set(45, 0, -20);
  decorationsGroup.add(gantryGroup);

  // D. Distance Boards (150m, 100m, 50m) before Turn 1 and Turn 15
  addDistanceMarkers(decorationsGroup, curve);

  // E. Tropical Palm Trees along the Malaysian circuit landscape
  addTropicalTrees(decorationsGroup);

  // F. Floodlight Pylons for night/sunset racing
  addFloodlightTowers(decorationsGroup);

  // G. Continuous FIA Armco Crash Barriers & Safety Walls
  addCircuitSafetyBarriers(decorationsGroup, curve);

  // H. Ground terrain / Run-off grass & gravel
  const terrainGeo = new THREE.PlaneGeometry(1600, 1600, 32, 32);
  const terrainMat = new THREE.MeshStandardMaterial({
    color: weather === 'wet' ? 0x1b3820 : 0x27592d,
    roughness: 0.95,
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.rotation.x = -Math.PI / 2;
  terrainMesh.position.y = -0.1;
  terrainMesh.receiveShadow = true;
  decorationsGroup.add(terrainMesh);

  return {
    curve,
    trackMesh,
    curbsGroup,
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

  // Tiered seating block (280m long, 35m wide, 16m high)
  const baseGeo = new THREE.BoxGeometry(36, 12, 280);
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.8 });
  const baseMesh = new THREE.Mesh(baseGeo, concreteMat);
  baseMesh.position.y = 6;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Seating tiers with colored seats (Malaysian red & yellow theme)
  const seatMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
  const seatMatYellow = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
  for (let s = 0; s < 28; s++) {
    const seatStripGeo = new THREE.BoxGeometry(16, 0.4, 8);
    const seatStrip = new THREE.Mesh(seatStripGeo, s % 2 === 0 ? seatMatRed : seatMatYellow);
    seatStrip.position.set(9, 12.2, -130 + s * 10);
    group.add(seatStrip);

    // Opposite side (Back Straight view)
    const seatStripBack = new THREE.Mesh(seatStripGeo, s % 2 === 0 ? seatMatYellow : seatMatRed);
    seatStripBack.position.set(-9, 12.2, -130 + s * 10);
    group.add(seatStripBack);
  }

  // Iconic Hibiscus Curved Palm Leaf Canopies (Winged tensile fabric roofs)
  const roofSegments = 14;
  const canopyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  for (let r = 0; r < roofSegments; r++) {
    // Flower petal curved tensile canopy
    const petalGeo = new THREE.CylinderGeometry(18, 14, 18, 16, 1, false, 0, Math.PI);
    const petalMesh = new THREE.Mesh(petalGeo, canopyMat);
    petalMesh.rotation.z = Math.PI / 2;
    petalMesh.rotation.y = Math.PI / 2;
    petalMesh.position.set(0, 24, -130 + r * 20);
    petalMesh.scale.set(1.2, 0.9, 0.4);
    petalMesh.castShadow = true;
    group.add(petalMesh);

    // Steel support pillars
    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, 16);
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
    const pillar = new THREE.Mesh(pillarGeo, steelMat);
    pillar.position.set(0, 16, -130 + r * 20);
    group.add(pillar);
  }

  return group;
}

/**
 * Sepang Pit Building & Team Garages
 */
function createPitBuilding(): THREE.Group {
  const group = new THREE.Group();

  // Main 2-story building with VIP Paddock Club terrace
  const buildingGeo = new THREE.BoxGeometry(16, 10, 240);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
  const building = new THREE.Mesh(buildingGeo, wallMat);
  building.position.y = 5;
  building.castShadow = true;
  building.receiveShadow = true;
  group.add(building);

  // Team garage roll-up shutter doors
  const garageDoorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4 });
  for (let g = 0; g < 12; g++) {
    const doorGeo = new THREE.BoxGeometry(0.2, 4.5, 16);
    const door = new THREE.Mesh(doorGeo, garageDoorMat);
    door.position.set(-8.1, 2.25, -100 + g * 18);
    group.add(door);
  }

  // Pit wall railing
  const pitWallGeo = new THREE.BoxGeometry(0.8, 1.2, 220);
  const pitWallMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
  const pitWall = new THREE.Mesh(pitWallGeo, pitWallMat);
  pitWall.position.set(-14, 0.6, 0);
  group.add(pitWall);

  return group;
}

/**
 * Start/Finish Line Gantry with 5 Red F1 Countdown Lights
 */
function createStartGantry(): { gantryGroup: THREE.Group; lightMeshes: THREE.Mesh[] } {
  const gantryGroup = new THREE.Group();

  // Overhead bridge frame across the 14m main straight
  const bridgeWidth = 22;
  const bridgeHeight = 8;
  const trussMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });

  // Two vertical towers
  const towerGeo = new THREE.BoxGeometry(1.2, bridgeHeight, 1.2);
  const leftTower = new THREE.Mesh(towerGeo, trussMat);
  leftTower.position.set(-bridgeWidth / 2, bridgeHeight / 2, 0);
  const rightTower = new THREE.Mesh(towerGeo, trussMat);
  rightTower.position.set(bridgeWidth / 2, bridgeHeight / 2, 0);
  gantryGroup.add(leftTower, rightTower);

  // Horizontal overhead beam
  const beamGeo = new THREE.BoxGeometry(bridgeWidth, 1.6, 1.4);
  const beam = new THREE.Mesh(beamGeo, trussMat);
  beam.position.set(0, bridgeHeight, 0);
  gantryGroup.add(beam);

  // Sepang International Circuit banner
  const bannerCanvas = document.createElement('canvas');
  bannerCanvas.width = 512;
  bannerCanvas.height = 128;
  const ctx = bannerCanvas.getContext('2d')!;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(0, 0, 512, 12);
  ctx.fillRect(0, 116, 512, 12);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SEPANG INTERNATIONAL CIRCUIT', 256, 75);

  const bannerTex = new THREE.CanvasTexture(bannerCanvas);
  bannerTex.colorSpace = THREE.SRGBColorSpace;
  const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex });
  const bannerMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 1.4), bannerMat);
  bannerMesh.position.set(0, bridgeHeight, 0.75);
  gantryGroup.add(bannerMesh);

  // 5 Red Starting Lights Panel
  const lightHousingGeo = new THREE.BoxGeometry(10, 2.2, 0.4);
  const housingMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const lightHousing = new THREE.Mesh(lightHousingGeo, housingMat);
  lightHousing.position.set(0, bridgeHeight - 1.8, 0.6);
  gantryGroup.add(lightHousing);

  const lightMeshes: THREE.Mesh[] = [];
  const lightRadius = 0.65;
  for (let i = 0; i < 5; i++) {
    const lightGeo = new THREE.CircleGeometry(lightRadius, 24);
    // Unlit state (dark red)
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x330000 });
    const lightMesh = new THREE.Mesh(lightGeo, lightMat);
    lightMesh.position.set(-3.6 + i * 1.8, bridgeHeight - 1.8, 0.85);
    gantryGroup.add(lightMesh);
    lightMeshes.push(lightMesh);
  }

  return { gantryGroup, lightMeshes };
}

/**
 * 150m, 100m, 50m distance boards before hairpins
 */
function addDistanceMarkers(group: THREE.Group, curve: THREE.CatmullRomCurve3) {
  const distances = ['150', '100', '50'];
  const targets = [
    { t: 0.985, offset: 9 }, // Approach to T1
    { t: 0.990, offset: 9 },
    { t: 0.995, offset: 9 },
    { t: 0.880, offset: -9 }, // Approach to T15 on Back Straight
    { t: 0.885, offset: -9 },
    { t: 0.890, offset: -9 },
  ];

  targets.forEach((target, idx) => {
    const pt = curve.getPointAt(target.t);
    const tan = curve.getTangentAt(target.t).normalize();
    const norm = new THREE.Vector3(-tan.z, 0, tan.x).normalize();

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 118, 118);
    ctx.font = 'bold 54px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(distances[idx % 3], 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const boardMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const board = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), boardMat);

    board.position.set(pt.x + norm.x * target.offset, pt.y + 1.2, pt.z + norm.z * target.offset);
    board.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
    group.add(board);
  });
}

/**
 * Procedural Malaysian tropical palm trees
 */
function addTropicalTrees(group: THREE.Group) {
  const trunkGeo = new THREE.CylinderGeometry(0.35, 0.55, 9, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x644117, roughness: 0.9 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7, side: THREE.DoubleSide });

  // Dispersed palm locations outside track run-off
  const treeCoords = [
    { x: 120, z: -250 }, { x: 140, z: -230 }, { x: 130, z: -200 },
    { x: 280, z: -180 }, { x: 300, z: -140 }, { x: 310, z: -100 },
    { x: 210, z: 20 }, { x: 220, z: 40 }, { x: 250, z: 80 },
    { x: 190, z: 280 }, { x: 180, z: 310 }, { x: 110, z: 370 },
    { x: 30, z: 120 }, { x: 20, z: 140 }, { x: -10, z: 80 },
    { x: -130, z: -180 }, { x: -140, z: -50 }, { x: -135, z: 120 },
    { x: -125, z: 280 }, { x: -130, z: 390 }, { x: 10, z: 520 },
  ];

  treeCoords.forEach((coord) => {
    const palm = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 4.5;
    trunk.rotation.z = (Math.random() - 0.5) * 0.15;
    palm.add(trunk);

    // 6 palm fronds
    for (let f = 0; f < 6; f++) {
      const angle = (f / 6) * Math.PI * 2;
      const frondGeo = new THREE.PlaneGeometry(1.8, 5.5);
      const frond = new THREE.Mesh(frondGeo, leafMat);
      frond.position.set(Math.cos(angle) * 1.5, 8.5, Math.sin(angle) * 1.5);
      frond.rotation.y = angle;
      frond.rotation.x = 0.7;
      palm.add(frond);
    }

    palm.position.set(coord.x, 0, coord.z);
    group.add(palm);
  });
}

/**
 * Floodlight Pylons around the circuit
 */
function addFloodlightTowers(group: THREE.Group) {
  const pylonGeo = new THREE.CylinderGeometry(0.4, 0.8, 22, 8);
  const pylonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
  const headGeo = new THREE.BoxGeometry(4, 2, 1);
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const pylonCoords = [
    { x: 60, z: -300 }, { x: 60, z: -100 }, { x: 60, z: 100 }, { x: 60, z: 300 },
    { x: -115, z: -300 }, { x: -115, z: -100 }, { x: -115, z: 100 }, { x: -115, z: 300 },
    { x: 260, z: -30 }, { x: 310, z: 220 }, { x: 140, z: 360 },
  ];

  pylonCoords.forEach((coord) => {
    const pylon = new THREE.Group();
    const pole = new THREE.Mesh(pylonGeo, pylonMat);
    pole.position.y = 11;
    pylon.add(pole);

    const head = new THREE.Mesh(headGeo, lampMat);
    head.position.set(0, 21.5, 0);
    pylon.add(head);

    pylon.position.set(coord.x, 0, coord.z);
    group.add(pylon);
  });
}

/**
 * Continuous FIA Armco Metal Crash Barriers & Tire Walls along Track Perimeter
 */
function addCircuitSafetyBarriers(group: THREE.Group, curve: THREE.CatmullRomCurve3) {
  const barrierSegments = 260;
  const BARRIER_OFFSET = 13.0; // Distance from track centerline in meters

  const armcoMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.25,
  });

  const postMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.9,
    roughness: 0.3,
  });

  const tireMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.8 });
  const tireMatWhite = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 });

  for (let i = 0; i < barrierSegments; i++) {
    const t0 = i / barrierSegments;
    const t1 = ((i + 1) % barrierSegments) / barrierSegments;

    const p0 = curve.getPointAt(t0);
    const p1 = curve.getPointAt(t1);

    const tan0 = curve.getTangentAt(t0).normalize();
    const tan1 = curve.getTangentAt(t1).normalize();

    const norm0 = new THREE.Vector3(-tan0.z, 0, tan0.x).normalize();
    const norm1 = new THREE.Vector3(-tan1.z, 0, tan1.x).normalize();

    // Both left (+1) and right (-1) sides
    [-1, 1].forEach((sign) => {
      const pos0 = new THREE.Vector3(
        p0.x + norm0.x * BARRIER_OFFSET * sign,
        p0.y + 0.6,
        p0.z + norm0.z * BARRIER_OFFSET * sign
      );
      const pos1 = new THREE.Vector3(
        p1.x + norm1.x * BARRIER_OFFSET * sign,
        p1.y + 0.6,
        p1.z + norm1.z * BARRIER_OFFSET * sign
      );

      const segmentLen = pos0.distanceTo(pos1);
      const midPoint = new THREE.Vector3().addVectors(pos0, pos1).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(pos1, pos0).normalize();

      // Armco Double Rail Guardrail
      const railGeo = new THREE.BoxGeometry(0.18, 0.75, segmentLen + 0.1);
      const railMesh = new THREE.Mesh(railGeo, armcoMat);
      railMesh.position.copy(midPoint);
      railMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
      railMesh.castShadow = true;
      railMesh.receiveShadow = true;
      group.add(railMesh);

      // Support Post
      const postGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
      const postMesh = new THREE.Mesh(postGeo, postMat);
      postMesh.position.set(pos0.x, pos0.y - 0.1, pos0.z);
      group.add(postMesh);

      // Safety Tire stacks every 8th segment
      if (i % 8 === 0) {
        const tireGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.75, 12);
        tireGeo.rotateZ(Math.PI / 2);
        const tireMesh = new THREE.Mesh(tireGeo, i % 16 === 0 ? tireMatRed : tireMatWhite);
        tireMesh.position.set(
          pos0.x - norm0.x * 0.5 * sign,
          pos0.y - 0.2,
          pos0.z - norm0.z * 0.5 * sign
        );
        group.add(tireMesh);
      }
    });
  }
}

