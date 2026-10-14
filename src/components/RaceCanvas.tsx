import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CameraMode, TelemetryData, VehicleClass, WeatherType } from '../types/game';
import { createSepangCircuit, TrackGeometryData } from '../circuit/sepangTrack';
import { build3DVehicle, Car3DInstance } from '../vehicles/carBuilder';
import { RacingPhysicsEngine } from '../physics/racingEngine';
import { audioEngine } from '../audio/engineAudio';

interface RaceCanvasProps {
  vehicleClass: VehicleClass;
  weather: WeatherType;
  cameraMode: CameraMode;
  totalLaps: number;
  isRacing: boolean;
  countdownStep: number; // 0: idle, 1..5: red lights, 6: lights out!
  onTelemetryUpdate: (telemetry: TelemetryData) => void;
  onLapCompleted: (lap: number, totalLaps: number, lapTime: number) => void;
  onRaceFinished: () => void;
  inputState: {
    throttle: number;
    brake: number;
    steer: number;
    drs: boolean;
    handbrake: boolean;
  };
  resetTrigger?: number;
}

export const RaceCanvas: React.FC<RaceCanvasProps> = ({
  vehicleClass,
  weather,
  cameraMode,
  totalLaps,
  isRacing,
  countdownStep,
  onTelemetryUpdate,
  onLapCompleted,
  onRaceFinished,
  inputState,
  resetTrigger,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to keep across re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const engineRef = useRef<RacingPhysicsEngine | null>(null);
  const playerCarRef = useRef<Car3DInstance | null>(null);
  const aiCarMeshesRef = useRef<Car3DInstance[]>([]);
  const circuitDataRef = useRef<TrackGeometryData | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Camera damping state
  const camHeadingRef = useRef<number>(0);
  const smoothedLookAt = useRef(new THREE.Vector3());
  const smoothedCamPos = useRef(new THREE.Vector3());
  const isCamInitialized = useRef(false);

  // Live input & racing refs to avoid re-triggering main useEffect
  const inputsRef = useRef(inputState);
  useEffect(() => {
    inputsRef.current = inputState;
  }, [inputState]);

  const isRacingRef = useRef(isRacing);
  useEffect(() => {
    isRacingRef.current = isRacing;
  }, [isRacing]);

  const cameraModeRef = useRef(cameraMode);
  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  const finishedFiredRef = useRef(false);

  // Handle countdown starting lights on 3D gantry
  useEffect(() => {
    if (!circuitDataRef.current) return;
    const lights = circuitDataRef.current.gantryLights;
    if (!lights || lights.length < 5) return;

    if (countdownStep >= 1 && countdownStep <= 5) {
      lights.forEach((mesh, index) => {
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (index < countdownStep) {
          mat.color.setHex(0xff0000); // Bright glowing red
        } else {
          mat.color.setHex(0x330000); // Unlit dark red
        }
      });
      audioEngine.playCountdownBeep(false);
    } else if (countdownStep === 6) {
      // LIGHTS OUT!
      lights.forEach((mesh) => {
        (mesh.material as THREE.MeshBasicMaterial).color.setHex(0x330000);
      });
      audioEngine.playCountdownBeep(true);
      engineRef.current?.startRaceTimer();
    } else {
      lights.forEach((mesh) => {
        (mesh.material as THREE.MeshBasicMaterial).color.setHex(0x330000);
      });
    }
  }, [countdownStep]);

  // Handle player vehicle recovery to track centerline
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0 && engineRef.current) {
      engineRef.current.recoverToTrackCenter();
      isCamInitialized.current = false;
    }
  }, [resetTrigger]);

  // Main Scene Setup (Only re-runs if vehicle class, weather, or laps change)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 2500);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: !isHeadless, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = weather === 'sunset' ? 1.3 : 1.1;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Reflection environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting & Sky
    if (weather === 'sunset') {
      scene.background = new THREE.Color(0xfdba74);
      scene.fog = new THREE.FogExp2(0xfdba74, 0.0016);

      const sunLight = new THREE.DirectionalLight(0xff7733, 2.8);
      sunLight.position.set(200, 50, -300);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 1000;
      scene.add(sunLight);

      const ambientLight = new THREE.AmbientLight(0xc2410c, 1.2);
      scene.add(ambientLight);
    } else if (weather === 'wet') {
      scene.background = new THREE.Color(0x334155);
      scene.fog = new THREE.FogExp2(0x334155, 0.0026);

      const sunLight = new THREE.DirectionalLight(0x94a3b8, 1.6);
      sunLight.position.set(100, 150, 100);
      sunLight.castShadow = true;
      scene.add(sunLight);

      const ambientLight = new THREE.AmbientLight(0x475569, 1.4);
      scene.add(ambientLight);
    } else {
      scene.background = new THREE.Color(0x38bdf8);
      scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0012);

      const sunLight = new THREE.DirectionalLight(0xfffaed, 3.2);
      sunLight.position.set(150, 300, 150);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 1200;
      scene.add(sunLight);

      const ambientLight = new THREE.AmbientLight(0xe0f2fe, 1.1);
      scene.add(ambientLight);
    }

    // 5. Build Sepang International Circuit Track & Environment
    const circuitData = createSepangCircuit(weather);
    circuitDataRef.current = circuitData;
    scene.add(circuitData.trackMesh);
    scene.add(circuitData.curbsGroup);
    scene.add(circuitData.barriersGroup);
    scene.add(circuitData.decorationsGroup);

    // 6. Build Physics Engine
    const engine = new RacingPhysicsEngine(
      circuitData.curve,
      circuitData.trackLength,
      vehicleClass,
      totalLaps,
      7
    );
    engineRef.current = engine;

    // 7. Build Player Car
    const playerLivery = vehicleClass === 'f1' ? '#00a19b' : '#ef4444';
    const playerCar = build3DVehicle(vehicleClass, playerLivery, '#0f172a');
    playerCarRef.current = playerCar;
    scene.add(playerCar.root);

    // Initial position on starting grid
    playerCar.root.position.copy(engine.position);
    playerCar.root.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), engine.forward);
    camHeadingRef.current = Math.atan2(engine.forward.x, engine.forward.z);

    // 8. Build AI Rival Cars
    const aiMeshes: Car3DInstance[] = [];
    engine.aiDrivers.forEach((ai) => {
      const aiCar = build3DVehicle(ai.carClass, ai.color, ai.secondaryColor);
      scene.add(aiCar.root);
      aiMeshes.push(aiCar);
    });
    aiCarMeshesRef.current = aiMeshes;

    // Start Procedural Audio
    audioEngine.start(vehicleClass);

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Simulation & Render Loop
    finishedFiredRef.current = false;
    let lastLapChecked = 1;

    const tick = () => {
      const delta = clockRef.current.getDelta();

      // Read current inputs and active racing status from refs
      const currentInputs = inputsRef.current;
      const racingActive = isRacingRef.current;

      // Update simulation physics
      engine.update(delta, currentInputs, racingActive);

      // Check lap transitions
      if (engine.currentLap > lastLapChecked) {
        lastLapChecked = engine.currentLap;
        onLapCompleted(lastLapChecked - 1, totalLaps, engine.lastLapTime);
        audioEngine.playLapChime(engine.lastLapTime === engine.bestLapTime);
      }

      // Check race finish condition
      if (engine.currentLap > totalLaps && !finishedFiredRef.current) {
        finishedFiredRef.current = true;
        onRaceFinished();
      }

      // Sync 3D player car position and orientation
      playerCar.root.position.copy(engine.position);

      // Smooth vehicle body tilt and bank with roll angle
      const targetQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), engine.forward);
      const rollAmount = -engine.steeringAngle * Math.min(1.0, engine.speedKmh / 220) * 0.08;
      const rollQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rollAmount);
      targetQuat.multiply(rollQuat);
      playerCar.root.quaternion.slerp(targetQuat, 0.35);

      // Steer front wheels & spin tires
      playerCar.setSteering(engine.steeringAngle * 0.6);
      const distanceDelta = (engine.speedKmh / 3.6) * delta;
      playerCar.spinWheels(distanceDelta);
      playerCar.setDrsActive(engine.drsActive);
      playerCar.setBraking(currentInputs.brake > 0.1);

      // Sync AI cars along Sepang circuit
      engine.aiDrivers.forEach((ai, idx) => {
        const mesh = aiMeshes[idx];
        if (!mesh) return;

        const aiPoint = circuitData.curve.getPointAt(ai.trackProgress);
        const aiTan = circuitData.curve.getTangentAt(ai.trackProgress).normalize();
        const aiNorm = new THREE.Vector3(-aiTan.z, 0, aiTan.x).normalize();

        mesh.root.position.set(
          aiPoint.x + aiNorm.x * ai.lateralOffset,
          aiPoint.y + 0.35,
          aiPoint.z + aiNorm.z * ai.lateralOffset
        );

        mesh.root.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), aiTan);
        mesh.spinWheels((ai.speed / 3.6) * delta);
      });

      // --- BUTTERY SMOOTH CINEMATIC CAMERA (ZERO JITTER / ZERO SNAP) ---
      const activeCameraMode = cameraModeRef.current;

      if (activeCameraMode === 'cockpit') {
        // Cockpit Helmet Cam
        const eyeOffset = vehicleClass === 'f1'
          ? new THREE.Vector3(0, 0.72, -0.15)
          : new THREE.Vector3(-0.35, 0.88, 0.1);
        const worldEye = eyeOffset.clone().applyQuaternion(playerCar.root.quaternion).add(playerCar.root.position);
        camera.position.copy(worldEye);

        const lookTarget = worldEye.clone().add(engine.forward.clone().multiplyScalar(15)).add(new THREE.Vector3(0, 0.25, 0));
        smoothedLookAt.current.lerp(lookTarget, 0.25);
        camera.lookAt(smoothedLookAt.current);

        camera.fov = 72;
        camera.updateProjectionMatrix();
      } else if (activeCameraMode === 'helicopter') {
        // Helicopter aerial broadcast
        const heliTarget = new THREE.Vector3(engine.position.x - 35, engine.position.y + 70, engine.position.z + 55);
        camera.position.lerp(heliTarget, 0.05);
        camera.lookAt(engine.position);
      } else {
        // Broadcast Chase Camera:
        // Interpolate camera heading angle smoothly, avoiding yaw snapping or wobbling
        const carHeading = Math.atan2(engine.forward.x, engine.forward.z);

        if (!isCamInitialized.current) {
          camHeadingRef.current = carHeading;
          smoothedLookAt.current.copy(engine.position).add(new THREE.Vector3(0, 1.2, 0));
          isCamInitialized.current = true;
        }

        // Angular difference with wrap-around
        let angleDiff = carHeading - camHeadingRef.current;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        camHeadingRef.current += angleDiff * Math.min(1.0, 4.2 * delta);

        const chaseDist = vehicleClass === 'f1' ? 7.6 : 7.2;
        const chaseHeight = 2.45;

        const targetCamX = engine.position.x - Math.sin(camHeadingRef.current) * chaseDist;
        const targetCamZ = engine.position.z - Math.cos(camHeadingRef.current) * chaseDist;
        const targetCamY = engine.position.y + chaseHeight;

        smoothedCamPos.current.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.35);

        // Subtle curb rumble
        if (engine.onCurb) {
          smoothedCamPos.current.x += (Math.random() - 0.5) * 0.05;
          smoothedCamPos.current.y += (Math.random() - 0.5) * 0.05;
        }

        camera.position.copy(smoothedCamPos.current);

        // Look at point: 4 meters ahead of the car (stable horizon)
        const lookTarget = engine.position.clone()
          .add(new THREE.Vector3(0, 1.2, 0))
          .add(engine.forward.clone().multiplyScalar(4.0));
        smoothedLookAt.current.lerp(lookTarget, 0.35);
        camera.lookAt(smoothedLookAt.current);

        // Dynamic FOV widening at high speeds
        const speedFovBonus = Math.max(0, (engine.speedKmh - 180) / 165) * 12;
        camera.fov = THREE.MathUtils.lerp(camera.fov, 65 + speedFovBonus, 0.1);
        camera.updateProjectionMatrix();
      }

      // Procedural Audio update
      audioEngine.update({
        speed: engine.speedKmh,
        rpm: engine.rpm,
        maxRpm: engine.config.vehicleClass === 'f1' ? 14500 : 8500,
        gear: engine.gear,
        throttle: currentInputs.throttle,
        brake: currentInputs.brake,
        onCurb: engine.onCurb,
        lateralSlip: engine.lateralSlip,
      });

      // Telemetry update to HUD
      onTelemetryUpdate(engine.getTelemetry());

      // Render Scene
      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      audioEngine.stop();

      renderer.dispose();
      circuitData.trackMesh.geometry.dispose();
      (circuitData.trackMesh.material as THREE.Material).dispose();
      scene.clear();
    };
  }, [vehicleClass, weather, totalLaps]); // Notice isRacing removed: scene stays intact on start!

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-slate-950 cursor-grab active:cursor-grabbing"
      tabIndex={0}
    />
  );
};
