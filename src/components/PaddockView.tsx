import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Play, Flag, Sun, CloudRain, Sunset, Shield, Gauge, Zap } from 'lucide-react';
import { VehicleClass, WeatherType } from '../types/game';
import { VEHICLE_CONFIGS } from '../physics/racingEngine';
import { build3DVehicle } from '../vehicles/carBuilder';
import { audioEngine } from '../audio/engineAudio';

interface PaddockViewProps {
  selectedClass: VehicleClass;
  weather: WeatherType;
  totalLaps: number;
  onSelectVehicle: (vClass: VehicleClass) => void;
  onSelectWeather: (w: WeatherType) => void;
  onSelectLaps: (laps: number) => void;
  onStartRace: () => void;
}

const LIVERY_PRESETS = [
  { name: 'Petronas Emerald', primary: '#00a19b', secondary: '#0f172a' },
  { name: 'Maranello Scarlet', primary: '#dc2626', secondary: '#18181b' },
  { name: 'Papaya Velocity', primary: '#f97316', secondary: '#0f172a' },
  { name: 'Silverstone Blue', primary: '#2563eb', secondary: '#ffffff' },
  { name: 'Sultan Gold', primary: '#eab308', secondary: '#18181b' },
];

export const PaddockView: React.FC<PaddockViewProps> = ({
  selectedClass,
  weather,
  totalLaps,
  onSelectVehicle,
  onSelectWeather,
  onSelectLaps,
  onStartRace,
}) => {
  const [selectedLivery, setSelectedLivery] = useState(LIVERY_PRESETS[0]);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const vehicle = VEHICLE_CONFIGS[selectedClass];

  // 3D Showroom Turntable Preview
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.5, 2.0, 5.0);
    camera.lookAt(0, 0.5, 0);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: !isHeadless, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio lighting rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x334155, 1.2);
    scene.add(ambientLight);

    // Ground reflective showroom podium
    const podiumGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.25, 48);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.85,
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -0.12;
    scene.add(podium);

    // Car Model
    const car = build3DVehicle(selectedClass, selectedLivery.primary, selectedLivery.secondary);
    scene.add(car.root);

    let animId: number;
    let rotationAngle = 0;

    const animate = () => {
      rotationAngle += 0.007;
      car.root.rotation.y = rotationAngle;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [selectedClass, selectedLivery]);

  const handleStart = () => {
    audioEngine.resume();
    onStartRace();
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto overflow-x-hidden p-6 md:p-12">
      {/* Circuit Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">
            <span>Sepang International Circuit</span>
            <span>·</span>
            <span>Selangor, Malaysia</span>
            <span>·</span>
            <span>5.543 KM · 15 Turns</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-telemetry tracking-tight text-white uppercase">
            Malaysian Grand Prix
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 glass-panel rounded-lg text-xs font-medium text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            FIA Grade 1 Circuit
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Vehicle Showcase (Left) + Race Engineering Configuration (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8">
        {/* Left: 3D Turntable Showcase */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px] md:min-h-[460px] glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden">
          {/* Subtle backdrop circle */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-3xl -z-10 pointer-events-none" />

          {/* 3D WebGL Canvas */}
          <div ref={previewContainerRef} className="w-full h-full min-h-[340px] flex items-center justify-center" />

          {/* Vehicle Title Overlay */}
          <div className="absolute top-6 left-6 flex flex-col">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              {vehicle.subtitle}
            </span>
            <span className="text-2xl font-black font-telemetry text-white">
              {vehicle.name}
            </span>
          </div>

          {/* Livery Swatches */}
          <div className="absolute bottom-6 flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">LIVERY:</span>
            {LIVERY_PRESETS.map((liv) => (
              <button
                key={liv.name}
                onClick={() => setSelectedLivery(liv)}
                title={liv.name}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  selectedLivery.name === liv.name ? 'scale-125 border-white shadow-md' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: liv.primary }}
              />
            ))}
          </div>
        </div>

        {/* Right: Setup & Race Parameters */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* 1. Vehicle Class Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Choose Machine Class
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSelectVehicle('f1')}
                className={`p-4 rounded-2xl border flex flex-col text-left transition-all ${
                  selectedClass === 'f1'
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'glass-panel border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white font-telemetry">Formula 1</span>
                  <Zap className={`w-4 h-4 ${selectedClass === 'f1' ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <span className="text-xs text-slate-400 leading-snug">
                  Active DRS, razor downforce, 345 km/h top speed
                </span>
              </button>

              <button
                onClick={() => onSelectVehicle('gt3')}
                className={`p-4 rounded-2xl border flex flex-col text-left transition-all ${
                  selectedClass === 'gt3'
                    ? 'bg-red-950/60 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                    : 'glass-panel border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white font-telemetry">GT3 Endurance</span>
                  <Gauge className={`w-4 h-4 ${selectedClass === 'gt3' ? 'text-red-400' : 'text-slate-500'}`} />
                </div>
                <span className="text-xs text-slate-400 leading-snug">
                  V8 mechanical grip, controlled drift slip angles
                </span>
              </button>
            </div>
          </div>

          {/* 2. Machine Specs Breakdown */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Top Speed</span>
              <span className="font-bold font-telemetry text-white">{vehicle.topSpeed} KM/H</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${(vehicle.topSpeed / 350) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Power Output</span>
              <span className="font-bold font-telemetry text-white">{vehicle.horsePower} HP</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${(vehicle.horsePower / 1050) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Aerodynamic Downforce</span>
              <span className="font-bold font-telemetry text-white">{vehicle.downforce} / 100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${vehicle.downforce}%` }}
              />
            </div>
          </div>

          {/* 3. Malaysian Weather & Track Conditions */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Session Atmosphere & Weather
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onSelectWeather('day')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                  weather === 'day'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                    : 'glass-panel border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold font-telemetry">Tropical Day</span>
              </button>

              <button
                onClick={() => onSelectWeather('sunset')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                  weather === 'sunset'
                    ? 'bg-orange-500/20 border-orange-400 text-orange-200'
                    : 'glass-panel border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Sunset className="w-5 h-5 text-orange-400" />
                <span className="text-xs font-bold font-telemetry">Golden Sunset</span>
              </button>

              <button
                onClick={() => onSelectWeather('wet')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                  weather === 'wet'
                    ? 'bg-blue-500/20 border-blue-400 text-blue-200'
                    : 'glass-panel border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <CloudRain className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-bold font-telemetry">Monsoon Wet</span>
              </button>
            </div>
          </div>

          {/* 4. Race Distance (Laps) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Championship Distance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 5].map((laps) => (
                <button
                  key={laps}
                  onClick={() => onSelectLaps(laps)}
                  className={`py-2.5 rounded-xl border font-telemetry font-bold text-sm transition-colors ${
                    totalLaps === laps
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                      : 'glass-panel border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {laps} {laps === 1 ? 'Lap (Sprint)' : `${laps} Laps`}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Start Race CTA */}
          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black font-telemetry text-lg tracking-wider rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            ENTER STARTING GRID
          </button>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-4 gap-2">
        <span>Sepang Grand Prix Simulation · Three.js WebGL & Procedural Audio Engine</span>
        <div className="flex items-center gap-3">
          <span>7 Grid AI Competitors</span>
          <span>·</span>
          <span>15 Tilke Turns</span>
          <span>·</span>
          <span>Dynamic DRS Zones</span>
        </div>
      </div>
    </div>
  );
};
