import React from 'react';
import { Camera, Volume2, VolumeX, Zap, RefreshCw, Eye } from 'lucide-react';
import { CameraMode, TelemetryData, WeatherType } from '../types/game';

interface BroadcastHUDProps {
  telemetry: TelemetryData | null;
  cameraMode: CameraMode;
  countdownStep: number;
  isMuted: boolean;
  weather: WeatherType;
  onToggleCamera: () => void;
  onToggleMute: () => void;
  onResetCar: () => void;
  onSelectCamera: (mode: CameraMode) => void;
  // Touch controls input callbacks
  onTouchThrottle: (active: boolean) => void;
  onTouchBrake: (active: boolean) => void;
  onTouchSteer: (dir: number) => void;
  onTouchDrs: (active: boolean) => void;
}

export const BroadcastHUD: React.FC<BroadcastHUDProps> = ({
  telemetry,
  cameraMode,
  countdownStep,
  isMuted,
  weather,
  onToggleCamera,
  onToggleMute,
  onResetCar,
  onSelectCamera,
  onTouchThrottle,
  onTouchBrake,
  onTouchSteer,
  onTouchDrs,
}) => {
  if (!telemetry) return null;

  // Format lap time in MM:SS.mmm
  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return '--:--.---';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
  };

  // Rev LED calculation (15 LEDs: 5 Green, 5 Yellow, 4 Red, 1 Blue/Purple shift point)
  const rpmRatio = Math.max(0, Math.min(1, telemetry.rpm / telemetry.maxRpm));
  const activeLeds = Math.round(rpmRatio * 15);
  const isShiftWarning = rpmRatio >= 0.95;

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* 1. TOP BAR: Race Position, Lap Counter, Weather & Top Controls */}
      <div className="flex items-start justify-between gap-4 w-full">
        {/* Left: Position Tower & Lap Count */}
        <div className="flex items-center gap-3 glass-panel px-4 py-2.5 rounded-xl border border-white/10 pointer-events-auto">
          <div className="flex flex-col items-center justify-center bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 rounded-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">POS</span>
            <span className="text-2xl font-bold font-telemetry text-white leading-none">
              P{telemetry.position}
            </span>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>LAP</span>
              <span className="font-bold text-white font-telemetry">
                {telemetry.currentLap} / {telemetry.totalLaps}
              </span>
              <span>·</span>
              <span className="capitalize">{weather} Session</span>
            </div>
            <div className="text-lg font-bold font-telemetry text-white tracking-wider">
              {formatTime(telemetry.currentLapTime)}
            </div>
          </div>
        </div>

        {/* Center: 5-Red-Light Starting Countdown Overlay (When active) */}
        {countdownStep > 0 && countdownStep <= 6 && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none">
            <div className="glass-panel px-6 py-4 rounded-2xl border border-red-500/30 flex flex-col items-center shadow-2xl backdrop-blur-xl">
              <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold mb-3">
                {countdownStep === 6 ? 'LIGHTS OUT & AWAY WE GO!' : 'STARTING GRID'}
              </span>

              {/* 5 Gantry Light Pillars */}
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((lightIdx) => {
                  const isLit = countdownStep >= lightIdx && countdownStep <= 5;
                  return (
                    <div
                      key={lightIdx}
                      className="flex flex-col gap-2 p-2 bg-slate-900 rounded-lg border border-slate-700"
                    >
                      <div
                        className={`w-7 h-7 rounded-full border transition-all duration-100 ${
                          isLit
                            ? 'bg-red-500 border-red-300 shadow-[0_0_20px_#ef4444]'
                            : 'bg-red-950 border-red-900/50'
                        }`}
                      />
                      <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right: Quick Action Bar (Audio, Camera Mode, Reset) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Camera Selector Pills */}
          <div className="hidden sm:flex items-center p-1 glass-panel rounded-lg border border-white/10">
            {(['chase', 'cockpit', 'helicopter'] as CameraMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onSelectCamera(mode)}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors ${
                  cameraMode === mode
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'chase' ? 'Chase' : mode === 'cockpit' ? 'Cockpit' : 'Heli'}
              </button>
            ))}
          </div>

          {/* Camera Toggle Button (Mobile & Desktop) */}
          <button
            onClick={onToggleCamera}
            title="Cycle Camera View (Press C)"
            className="p-2.5 glass-panel rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            title="Toggle Sound"
            className="p-2.5 glass-panel rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Reset / Recover Car Button */}
          <button
            onClick={onResetCar}
            title="Reset to Track Center (Press R)"
            className="p-2.5 glass-panel rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. MID SECTION: Mini-Map (Top Right) & Sector Split Times (Top Left) */}
      <div className="flex items-start justify-between w-full pointer-events-none">
        {/* Sector Delta Box */}
        <div className="glass-panel p-3 rounded-xl border border-white/10 flex flex-col gap-1 pointer-events-auto">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">SECTOR TIMES</div>
          <div className="flex items-center gap-2 text-xs font-telemetry">
            <span className={telemetry.currentSector === 1 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
              S1: {telemetry.sectorTimes.s1 > 0 ? telemetry.sectorTimes.s1.toFixed(3) : '--.---'}
            </span>
            <span className="text-slate-600">·</span>
            <span className={telemetry.currentSector === 2 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
              S2: {telemetry.sectorTimes.s2 > 0 ? telemetry.sectorTimes.s2.toFixed(3) : '--.---'}
            </span>
            <span className="text-slate-600">·</span>
            <span className={telemetry.currentSector === 3 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
              S3: {telemetry.sectorTimes.s3 > 0 ? telemetry.sectorTimes.s3.toFixed(3) : '--.---'}
            </span>
          </div>

          {telemetry.bestLapTime > 0 && (
            <div className="text-[11px] text-purple-400 font-telemetry mt-0.5">
              BEST: {formatTime(telemetry.bestLapTime)}
            </div>
          )}
        </div>

        {/* Real-time Sepang 2D Track Mini-Map */}
        <div className="glass-panel p-2.5 rounded-xl border border-white/10 flex flex-col items-center pointer-events-auto">
          <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 mb-1">
            SEPANG · 5.543 KM
          </div>
          <svg className="w-32 h-32 md:w-44 md:h-44" viewBox="-520 -390 1080 1270">
            {/* Authentic Sepang Track Silhouette */}
            <path
              d="M 0 0 L 0 -100 L 0 -200 L 0 -301 L 2 -314 L 9 -326 L 19 -334 L 32 -338 L 45 -337 L 59 -331 L 69 -319 L 73 -303 L 68 -284 L 53 -251 L 54 -240 L 63 -229 L 74 -225 L 90 -227 L 106 -236 L 137 -257 L 155 -266 L 176 -271 L 197 -272 L 220 -270 L 278 -260 L 304 -249 L 331 -232 L 347 -216 L 366 -193 L 379 -168 L 386 -143 L 420 -3 L 453 103 L 477 174 L 493 219 L 498 235 L 497 246 L 490 256 L 477 258 L 370 269 L 314 276 L 246 288 L 220 298 L 200 310 L 180 331 L 166 353 L 159 375 L 156 397 L 158 423 L 166 450 L 178 469 L 213 508 L 223 527 L 230 555 L 229 579 L 224 602 L 215 620 L 200 636 L -45 819 L -56 819 L -69 813 L -143 773 L -149 762 L -151 750 L -147 565 L -154 391 L -162 296 L -169 286 L -181 282 L -195 289 L -237 354 L -253 367 L -276 376 L -299 379 L -332 376 L -359 369 L -385 361 L -418 342 L -451 316 L -458 302 L -459 289 L -456 275 L -447 264 L -257 67 L -251 53 L -248 34 L -252 13 L -285 -67 L -290 -88 L -291 -112 L -289 -134 L -279 -173 L -266 -199 L -250 -216 L -217 -237 L -194 -243 L -179 -244 L -164 -232 L -157 -211 L -139 -41 L -122 128 L -104 297 L -87 467 L -69 636 L -59 649 L -40 659 L -23 656 L -6 642 L 0 618 L 0 450 L 0 300 L 0 150 Z"
              fill="none"
              stroke="#1e293b"
              strokeWidth="48"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Active Track Centerline */}
            <path
              d="M 0 0 L 0 -100 L 0 -200 L 0 -301 L 2 -314 L 9 -326 L 19 -334 L 32 -338 L 45 -337 L 59 -331 L 69 -319 L 73 -303 L 68 -284 L 53 -251 L 54 -240 L 63 -229 L 74 -225 L 90 -227 L 106 -236 L 137 -257 L 155 -266 L 176 -271 L 197 -272 L 220 -270 L 278 -260 L 304 -249 L 331 -232 L 347 -216 L 366 -193 L 379 -168 L 386 -143 L 420 -3 L 453 103 L 477 174 L 493 219 L 498 235 L 497 246 L 490 256 L 477 258 L 370 269 L 314 276 L 246 288 L 220 298 L 200 310 L 180 331 L 166 353 L 159 375 L 156 397 L 158 423 L 166 450 L 178 469 L 213 508 L 223 527 L 230 555 L 229 579 L 224 602 L 215 620 L 200 636 L -45 819 L -56 819 L -69 813 L -143 773 L -149 762 L -151 750 L -147 565 L -154 391 L -162 296 L -169 286 L -181 282 L -195 289 L -237 354 L -253 367 L -276 376 L -299 379 L -332 376 L -359 369 L -385 361 L -418 342 L -451 316 L -458 302 L -459 289 L -456 275 L -447 264 L -257 67 L -251 53 L -248 34 L -252 13 L -285 -67 L -290 -88 L -291 -112 L -289 -134 L -279 -173 L -266 -199 L -250 -216 L -217 -237 L -194 -243 L -179 -244 L -164 -232 L -157 -211 L -139 -41 L -122 128 L -104 297 L -87 467 L -69 636 L -59 649 L -40 659 L -23 656 L -6 642 L 0 618 L 0 450 L 0 300 L 0 150 Z"
              fill="none"
              stroke="#64748b"
              strokeWidth="20"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Start/Finish Line marker */}
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#f8fafc" strokeWidth="12" />

            {/* Turn Labels */}
            <text x="35" y="-355" fill="#38bdf8" fontSize="36" fontWeight="bold">T1</text>
            <text x="75" y="-270" fill="#38bdf8" fontSize="36" fontWeight="bold">T2</text>
            <text x="495" y="275" fill="#38bdf8" fontSize="36" fontWeight="bold">T4</text>
            <text x="195" y="340" fill="#94a3b8" fontSize="32" fontWeight="bold">T5/6</text>
            <text x="-485" y="310" fill="#38bdf8" fontSize="36" fontWeight="bold">T9</text>
            <text x="-315" y="-95" fill="#94a3b8" fontSize="32" fontWeight="bold">T11</text>
            <text x="-195" y="-245" fill="#38bdf8" fontSize="36" fontWeight="bold">T14</text>
            <text x="-40" y="700" fill="#ef4444" fontSize="36" fontWeight="bold">T15</text>
            <text x="-75" y="10" fill="#f8fafc" fontSize="28" fontWeight="bold">S/F</text>
          </svg>
        </div>
      </div>

      {/* 3. BOTTOM COCKPIT TELEMETRY & CONTROLS */}
      <div className="flex flex-col items-center w-full gap-3">
        {/* On-Track Warnings / Status Banners */}
        {telemetry.slipstreamActive && (
          <div className="glass-panel px-4 py-1.5 rounded-full border border-cyan-400/50 text-cyan-300 text-xs font-bold font-telemetry tracking-wider animate-bounce pointer-events-auto">
            DRAFTING / SLIPSTREAM ACTIVE (+12 KM/H)
          </div>
        )}

        {telemetry.onCurb && (
          <div className="glass-panel px-3 py-1 rounded-full border border-amber-400/50 text-amber-300 text-xs font-bold font-telemetry tracking-wider pointer-events-auto">
            RUMBLE CURB
          </div>
        )}

        {telemetry.onGrass && (
          <div className="glass-panel px-3 py-1 rounded-full border border-red-500/50 text-red-400 text-xs font-bold font-telemetry tracking-wider pointer-events-auto">
            OFF TRACK · REDUCED TRACTION
          </div>
        )}

        {/* Main Digital Cockpit Cluster */}
        <div className="glass-panel px-6 py-4 rounded-2xl border border-white/10 flex flex-col items-center max-w-xl w-full pointer-events-auto shadow-2xl">
          {/* LED Shift Light Tachometer Bar */}
          <div className="flex items-center gap-1.5 w-full justify-center mb-3">
            {Array.from({ length: 15 }).map((_, i) => {
              const isLit = i < activeLeds;
              let ledColor = 'bg-slate-800';
              if (isLit) {
                if (i < 5) ledColor = 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
                else if (i < 10) ledColor = 'bg-yellow-400 shadow-[0_0_8px_#facc15]';
                else if (i < 14) ledColor = 'bg-red-500 shadow-[0_0_8px_#ef4444]';
                else ledColor = 'bg-purple-500 shadow-[0_0_12px_#a855f7]';
              }
              return (
                <div
                  key={i}
                  className={`h-2.5 flex-1 rounded-sm transition-colors duration-75 ${ledColor} ${
                    isShiftWarning && isLit ? 'animate-pulse' : ''
                  }`}
                />
              );
            })}
          </div>

          {/* Central Speedometer, Gear & DRS Display */}
          <div className="flex items-center justify-between w-full px-2">
            {/* DRS Status */}
            <div className="flex flex-col items-start min-w-[70px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">DRS</span>
              <div
                className={`px-2.5 py-1 rounded text-xs font-bold font-telemetry transition-all ${
                  telemetry.drsActive
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_#06b6d4]'
                    : telemetry.drsAvailable
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {telemetry.drsActive ? 'ACTIVE' : telemetry.drsAvailable ? 'AVAIL' : 'OFF'}
              </div>
            </div>

            {/* Main Speed Readout */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl md:text-5xl font-black font-telemetry text-white tracking-tight">
                  {telemetry.speed}
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">KM/H</span>
              </div>
              <span className="text-[11px] text-slate-400 font-telemetry">
                {telemetry.rpm.toLocaleString()} RPM
              </span>
            </div>

            {/* Gear Indicator */}
            <div className="flex flex-col items-end min-w-[70px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">GEAR</span>
              <div className="text-3xl font-black font-telemetry text-cyan-400 leading-none">
                {telemetry.gear === 0 ? 'N' : telemetry.gear}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Touch Racing Controls (Visible on mobile & touch displays) */}
        <div className="flex items-center justify-between w-full max-w-2xl px-2 py-1 pointer-events-auto md:hidden">
          {/* Steer Left / Right Buttons */}
          <div className="flex items-center gap-3">
            <button
              onPointerDown={() => onTouchSteer(1)}
              onPointerUp={() => onTouchSteer(0)}
              onPointerLeave={() => onTouchSteer(0)}
              className="w-16 h-16 rounded-2xl glass-panel active:bg-cyan-500/40 border border-white/20 text-white font-bold text-xl flex items-center justify-center touch-none select-none shadow-lg active:scale-95"
            >
              ◀
            </button>
            <button
              onPointerDown={() => onTouchSteer(-1)}
              onPointerUp={() => onTouchSteer(0)}
              onPointerLeave={() => onTouchSteer(0)}
              className="w-16 h-16 rounded-2xl glass-panel active:bg-cyan-500/40 border border-white/20 text-white font-bold text-xl flex items-center justify-center touch-none select-none shadow-lg active:scale-95"
            >
              ▶
            </button>
          </div>

          {/* DRS Button */}
          {telemetry.drsAvailable && (
            <button
              onPointerDown={() => onTouchDrs(true)}
              onPointerUp={() => onTouchDrs(false)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border font-bold text-xs uppercase ${
                telemetry.drsActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_#06b6d4]'
                  : 'glass-panel text-cyan-400 border-cyan-500/50'
              }`}
            >
              <Zap className="w-6 h-6" />
            </button>
          )}

          {/* Brake & Gas Pedals */}
          <div className="flex items-center gap-3">
            <button
              onPointerDown={() => onTouchBrake(true)}
              onPointerUp={() => onTouchBrake(false)}
              onPointerLeave={() => onTouchBrake(false)}
              className="w-16 h-16 rounded-2xl bg-red-950/80 active:bg-red-600 border border-red-500/40 text-red-200 font-bold text-xs uppercase flex items-center justify-center touch-none select-none shadow-lg active:scale-95"
            >
              BRAKE
            </button>
            <button
              onPointerDown={() => onTouchThrottle(true)}
              onPointerUp={() => onTouchThrottle(false)}
              onPointerLeave={() => onTouchThrottle(false)}
              className="w-16 h-16 rounded-2xl bg-emerald-950/80 active:bg-emerald-500 border border-emerald-500/40 text-emerald-200 font-bold text-xs uppercase flex items-center justify-center touch-none select-none shadow-lg active:scale-95"
            >
              GAS
            </button>
          </div>
        </div>

        {/* Keyboard Helper Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-400 glass-panel px-4 py-1.5 rounded-full border border-white/10">
          <span><strong className="text-white">W / ↑</strong> Gas</span>
          <span>·</span>
          <span><strong className="text-white">S / ↓</strong> Brake</span>
          <span>·</span>
          <span><strong className="text-white">A / D / ← →</strong> Steer</span>
          <span>·</span>
          <span><strong className="text-white">Space</strong> Handbrake</span>
          <span>·</span>
          <span><strong className="text-white">Shift / B</strong> DRS</span>
          <span>·</span>
          <span><strong className="text-white">C</strong> Camera</span>
          <span>·</span>
          <span><strong className="text-white">R</strong> Reset</span>
        </div>
      </div>
    </div>
  );
};
