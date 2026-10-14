import * as THREE from 'three';
import { VehicleClass } from '../types/game';

/**
 * Procedural 3D Car Builder for Sepang Grand Prix
 * Generates Formula 1 Single-Seater and GT3 Endurance Supercar
 * 100% procedural Three.js geometry with steerable wheels, spinning tires, and DRS flap.
 */

export interface Car3DInstance {
  root: THREE.Group;
  bodyMesh: THREE.Mesh;
  frontLeftWheel: THREE.Group;
  frontRightWheel: THREE.Group;
  rearLeftWheel: THREE.Group;
  rearRightWheel: THREE.Group;
  drsFlap?: THREE.Mesh;
  cockpitCamAnchor: THREE.Object3D;
  chaseCamAnchor: THREE.Object3D;
  rearLight?: THREE.Mesh;
  setSteering: (angle: number) => void;
  spinWheels: (distanceDelta: number) => void;
  setDrsActive: (active: boolean) => void;
  setBraking: (braking: boolean) => void;
  updateLiveryColor: (primary: string, secondary?: string) => void;
}

export function build3DVehicle(
  vehicleClass: VehicleClass,
  primaryColor: string = '#06b6d4',
  secondaryColor: string = '#0f172a'
): Car3DInstance {
  if (vehicleClass === 'f1') {
    return buildF1Car(primaryColor, secondaryColor);
  } else {
    return buildGT3Car(primaryColor, secondaryColor);
  }
}

/**
 * Formula 1 Open-Wheel Single-Seater Builder
 */
function buildF1Car(primaryColor: string, secondaryColor: string): Car3DInstance {
  const root = new THREE.Group();

  // Materials
  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(primaryColor),
    metalness: 0.65,
    roughness: 0.25,
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(secondaryColor),
    metalness: 0.4,
    roughness: 0.3,
  });

  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.5,
    metalness: 0.3,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.8,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    metalness: 0.85,
    roughness: 0.2,
  });

  // 1. Monocoque Chassis & Nosecone
  const chassisGeo = new THREE.BoxGeometry(0.85, 0.45, 3.2);
  const chassis = new THREE.Mesh(chassisGeo, bodyMat);
  chassis.position.set(0, 0.42, 0);
  chassis.castShadow = true;
  root.add(chassis);

  // Tapered Nose
  const noseGeo = new THREE.ConeGeometry(0.38, 1.6, 4);
  const nose = new THREE.Mesh(noseGeo, bodyMat);
  nose.rotation.x = Math.PI / 2;
  nose.rotation.y = Math.PI / 4;
  nose.position.set(0, 0.32, -2.1);
  nose.castShadow = true;
  root.add(nose);

  // 2. Front Wing with Cascade & Endplates
  const frontWingGeo = new THREE.BoxGeometry(1.9, 0.08, 0.48);
  const frontWing = new THREE.Mesh(frontWingGeo, secondaryMat);
  frontWing.position.set(0, 0.16, -2.55);
  frontWing.castShadow = true;
  root.add(frontWing);

  // Front Wing Endplates
  const endplateGeo = new THREE.BoxGeometry(0.04, 0.28, 0.52);
  const leftEndplate = new THREE.Mesh(endplateGeo, carbonMat);
  leftEndplate.position.set(-0.95, 0.22, -2.55);
  const rightEndplate = new THREE.Mesh(endplateGeo, carbonMat);
  rightEndplate.position.set(0.95, 0.22, -2.55);
  root.add(leftEndplate, rightEndplate);

  // 3. Sidepods & Radiator Inlets
  const sidepodGeo = new THREE.BoxGeometry(0.42, 0.38, 1.6);
  const leftSidepod = new THREE.Mesh(sidepodGeo, bodyMat);
  leftSidepod.position.set(-0.55, 0.38, 0.1);
  leftSidepod.castShadow = true;

  const rightSidepod = new THREE.Mesh(sidepodGeo, bodyMat);
  rightSidepod.position.set(0.55, 0.38, 0.1);
  rightSidepod.castShadow = true;
  root.add(leftSidepod, rightSidepod);

  // 4. Cockpit, Driver Helmet & Halo Safety Hoop
  const cockpitHoleGeo = new THREE.BoxGeometry(0.45, 0.22, 0.9);
  const cockpitHoleMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const cockpitHole = new THREE.Mesh(cockpitHoleGeo, cockpitHoleMat);
  cockpitHole.position.set(0, 0.55, -0.2);
  root.add(cockpitHole);

  // Driver Helmet
  const helmetGeo = new THREE.SphereGeometry(0.16, 16, 16);
  const helmetMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.5, roughness: 0.3 });
  const helmet = new THREE.Mesh(helmetGeo, helmetMat);
  helmet.position.set(0, 0.65, -0.2);
  helmet.castShadow = true;
  root.add(helmet);

  // Halo Safety Hoop
  const haloCurve = new THREE.TorusGeometry(0.24, 0.035, 8, 16, Math.PI);
  const halo = new THREE.Mesh(haloCurve, carbonMat);
  halo.rotation.x = -Math.PI / 2;
  halo.position.set(0, 0.72, -0.32);
  root.add(halo);

  // Halo center pillar
  const haloPillarGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.22);
  const haloPillar = new THREE.Mesh(haloPillarGeo, carbonMat);
  haloPillar.position.set(0, 0.62, -0.56);
  root.add(haloPillar);

  // Engine Airbox Intake (above driver's head)
  const airboxGeo = new THREE.ConeGeometry(0.24, 0.8, 4);
  const airbox = new THREE.Mesh(airboxGeo, secondaryMat);
  airbox.rotation.x = -Math.PI / 2;
  airbox.rotation.y = Math.PI / 4;
  airbox.position.set(0, 0.82, 0.3);
  airbox.castShadow = true;
  root.add(airbox);

  // 5. Rear Wing Assembly & Movable DRS Flap
  const rearWingPillarsGeo = new THREE.BoxGeometry(0.04, 0.65, 0.12);
  const leftRWSupport = new THREE.Mesh(rearWingPillarsGeo, carbonMat);
  leftRWSupport.position.set(-0.25, 0.68, 1.7);
  const rightRWSupport = new THREE.Mesh(rearWingPillarsGeo, carbonMat);
  rightRWSupport.position.set(0.25, 0.68, 1.7);
  root.add(leftRWSupport, rightRWSupport);

  // Fixed lower mainplane
  const mainplaneGeo = new THREE.BoxGeometry(1.6, 0.06, 0.4);
  const mainplane = new THREE.Mesh(mainplaneGeo, carbonMat);
  mainplane.position.set(0, 0.92, 1.7);
  mainplane.castShadow = true;
  root.add(mainplane);

  // Movable DRS Flap
  const drsFlapGeo = new THREE.BoxGeometry(1.6, 0.04, 0.28);
  const drsFlap = new THREE.Mesh(drsFlapGeo, secondaryMat);
  drsFlap.position.set(0, 1.05, 1.66);
  drsFlap.rotation.x = 0.25; // Default closed high downforce angle
  drsFlap.castShadow = true;
  root.add(drsFlap);

  // Rear Wing Endplates
  const rearEndplateGeo = new THREE.BoxGeometry(0.04, 0.5, 0.55);
  const leftRearEndplate = new THREE.Mesh(rearEndplateGeo, secondaryMat);
  leftRearEndplate.position.set(-0.8, 0.92, 1.7);
  const rightRearEndplate = new THREE.Mesh(rearEndplateGeo, secondaryMat);
  rightRearEndplate.position.set(0.8, 0.92, 1.7);
  root.add(leftRearEndplate, rightRearEndplate);

  // Rear Safety/Rain Light
  const rearLightGeo = new THREE.BoxGeometry(0.18, 0.08, 0.05);
  const rearLightMat = new THREE.MeshBasicMaterial({ color: 0x450a0a });
  const rearLight = new THREE.Mesh(rearLightGeo, rearLightMat);
  rearLight.position.set(0, 0.32, 1.62);
  root.add(rearLight);

  // 6. 4 Wheels (Open-Wheel Configuration with Visible Wishbone Suspension)
  const createWheel = (isFront: boolean) => {
    const wheelGroup = new THREE.Group();
    const radius = isFront ? 0.33 : 0.36;
    const width = isFront ? 0.34 : 0.44;

    const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
    tireGeo.rotateZ(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    wheelGroup.add(tire);

    const rimGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, width + 0.02, 12);
    rimGeo.rotateZ(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    wheelGroup.add(rim);

    return wheelGroup;
  };

  // Suspension wishbone bars
  const suspensionMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
  const addWishbones = (x: number, z: number, wheelX: number) => {
    const armGeo = new THREE.CylinderGeometry(0.02, 0.02, Math.abs(wheelX - x));
    const arm = new THREE.Mesh(armGeo, suspensionMat);
    arm.rotation.z = Math.PI / 2;
    arm.position.set((x + wheelX) / 2, 0.35, z);
    root.add(arm);
  };

  // Front Wheels (Steerable)
  const frontLeftWheel = createWheel(true);
  frontLeftWheel.position.set(-0.95, 0.33, -1.35);
  addWishbones(-0.4, -1.35, -0.95);
  root.add(frontLeftWheel);

  const frontRightWheel = createWheel(true);
  frontRightWheel.position.set(0.95, 0.33, -1.35);
  addWishbones(0.4, -1.35, 0.95);
  root.add(frontRightWheel);

  // Rear Wheels
  const rearLeftWheel = createWheel(false);
  rearLeftWheel.position.set(-0.98, 0.36, 1.25);
  addWishbones(-0.4, 1.25, -0.98);
  root.add(rearLeftWheel);

  const rearRightWheel = createWheel(false);
  rearRightWheel.position.set(0.98, 0.36, 1.25);
  addWishbones(0.4, 1.25, 0.98);
  root.add(rearRightWheel);

  // Camera Anchors
  const cockpitCamAnchor = new THREE.Object3D();
  cockpitCamAnchor.position.set(0, 0.72, -0.15); // Just in front of helmet
  root.add(cockpitCamAnchor);

  const chaseCamAnchor = new THREE.Object3D();
  chaseCamAnchor.position.set(0, 2.1, 5.5);
  root.add(chaseCamAnchor);

  return {
    root,
    bodyMesh: chassis,
    frontLeftWheel,
    frontRightWheel,
    rearLeftWheel,
    rearRightWheel,
    drsFlap,
    cockpitCamAnchor,
    chaseCamAnchor,
    rearLight,
    setSteering: (angle: number) => {
      frontLeftWheel.rotation.y = angle;
      frontRightWheel.rotation.y = angle;
    },
    spinWheels: (distanceDelta: number) => {
      const rot = distanceDelta / 0.35;
      frontLeftWheel.children[0].rotation.x += rot;
      frontRightWheel.children[0].rotation.x += rot;
      rearLeftWheel.children[0].rotation.x += rot;
      rearRightWheel.children[0].rotation.x += rot;
    },
    setDrsActive: (active: boolean) => {
      if (drsFlap) {
        drsFlap.rotation.x = active ? -0.05 : 0.25; // Flattens out for lower drag
      }
    },
    setBraking: (braking: boolean) => {
      if (rearLight) {
        (rearLight.material as THREE.MeshBasicMaterial).color.setHex(braking ? 0xff0000 : 0x450a0a);
      }
    },
    updateLiveryColor: (primary: string, secondary?: string) => {
      bodyMat.color.set(primary);
      if (secondary) secondaryMat.color.set(secondary);
    },
  };
}

/**
 * GT3 Endurance Supercar Builder
 */
function buildGT3Car(primaryColor: string, secondaryColor: string): Car3DInstance {
  const root = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(primaryColor),
    metalness: 0.7,
    roughness: 0.2,
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(secondaryColor),
    metalness: 0.5,
    roughness: 0.3,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.1,
    metalness: 0.9,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.8,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    metalness: 0.8,
    roughness: 0.3,
  });

  // 1. Aerodynamic Main Body Shell
  const bodyGeo = new THREE.BoxGeometry(1.85, 0.55, 4.4);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0.48, 0);
  body.castShadow = true;
  root.add(body);

  // Sloping Hood
  const hoodGeo = new THREE.BoxGeometry(1.7, 0.25, 1.4);
  const hood = new THREE.Mesh(hoodGeo, bodyMat);
  hood.position.set(0, 0.52, -1.2);
  hood.rotation.x = 0.08;
  hood.castShadow = true;
  root.add(hood);

  // Front Splitter
  const splitterGeo = new THREE.BoxGeometry(1.95, 0.06, 0.5);
  const carbonMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });
  const splitter = new THREE.Mesh(splitterGeo, carbonMat);
  splitter.position.set(0, 0.12, -2.25);
  root.add(splitter);

  // 2. Cockpit Greenhouse (Cabin + Windshield)
  const cabinGeo = new THREE.BoxGeometry(1.4, 0.48, 1.8);
  const cabin = new THREE.Mesh(cabinGeo, glassMat);
  cabin.position.set(0, 0.92, 0.1);
  cabin.castShadow = true;
  root.add(cabin);

  // Roof Scoop
  const roofScoopGeo = new THREE.BoxGeometry(0.35, 0.15, 0.8);
  const roofScoop = new THREE.Mesh(roofScoopGeo, secondaryMat);
  roofScoop.position.set(0, 1.2, 0.1);
  root.add(roofScoop);

  // 3. Swan-Neck GT3 Rear Wing
  const wingPostGeo = new THREE.BoxGeometry(0.04, 0.45, 0.15);
  const leftPost = new THREE.Mesh(wingPostGeo, carbonMat);
  leftPost.position.set(-0.45, 0.92, 2.0);
  const rightPost = new THREE.Mesh(wingPostGeo, carbonMat);
  rightPost.position.set(0.45, 0.92, 2.0);
  root.add(leftPost, rightPost);

  const wingGeo = new THREE.BoxGeometry(1.9, 0.06, 0.42);
  const wing = new THREE.Mesh(wingGeo, secondaryMat);
  wing.position.set(0, 1.15, 2.05);
  wing.castShadow = true;
  root.add(wing);

  // Rear Diffuser
  const diffuserGeo = new THREE.BoxGeometry(1.75, 0.25, 0.4);
  const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
  diffuser.position.set(0, 0.25, 2.15);
  root.add(diffuser);

  // LED Tail Lights & Braking Bar
  const tailLightGeo = new THREE.BoxGeometry(1.6, 0.08, 0.05);
  const tailLightMat = new THREE.MeshBasicMaterial({ color: 0x450a0a });
  const tailLight = new THREE.Mesh(tailLightGeo, tailLightMat);
  tailLight.position.set(0, 0.65, 2.21);
  root.add(tailLight);

  // 4. Wheels & Flares
  const createWheel = () => {
    const wheelGroup = new THREE.Group();
    const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.38, 24);
    tireGeo.rotateZ(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    wheelGroup.add(tire);

    const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.4, 12);
    rimGeo.rotateZ(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    wheelGroup.add(rim);

    return wheelGroup;
  };

  const frontLeftWheel = createWheel();
  frontLeftWheel.position.set(-0.95, 0.36, -1.35);
  root.add(frontLeftWheel);

  const frontRightWheel = createWheel();
  frontRightWheel.position.set(0.95, 0.36, -1.35);
  root.add(frontRightWheel);

  const rearLeftWheel = createWheel();
  rearLeftWheel.position.set(-0.96, 0.36, 1.35);
  root.add(rearLeftWheel);

  const rearRightWheel = createWheel();
  rearRightWheel.position.set(0.96, 0.36, 1.35);
  root.add(rearRightWheel);

  // Camera Anchors
  const cockpitCamAnchor = new THREE.Object3D();
  cockpitCamAnchor.position.set(-0.35, 0.88, 0.1); // Driver side interior
  root.add(cockpitCamAnchor);

  const chaseCamAnchor = new THREE.Object3D();
  chaseCamAnchor.position.set(0, 2.2, 5.8);
  root.add(chaseCamAnchor);

  return {
    root,
    bodyMesh: body,
    frontLeftWheel,
    frontRightWheel,
    rearLeftWheel,
    rearRightWheel,
    cockpitCamAnchor,
    chaseCamAnchor,
    rearLight: tailLight,
    setSteering: (angle: number) => {
      frontLeftWheel.rotation.y = angle;
      frontRightWheel.rotation.y = angle;
    },
    spinWheels: (distanceDelta: number) => {
      const rot = distanceDelta / 0.36;
      frontLeftWheel.children[0].rotation.x += rot;
      frontRightWheel.children[0].rotation.x += rot;
      rearLeftWheel.children[0].rotation.x += rot;
      rearRightWheel.children[0].rotation.x += rot;
    },
    setDrsActive: () => {
      // GT3 does not have F1 active DRS wing flap, but boost still applies
    },
    setBraking: (braking: boolean) => {
      (tailLight.material as THREE.MeshBasicMaterial).color.setHex(braking ? 0xff0000 : 0x450a0a);
    },
    updateLiveryColor: (primary: string, secondary?: string) => {
      bodyMat.color.set(primary);
      if (secondary) secondaryMat.color.set(secondary);
    },
  };
}
