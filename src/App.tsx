import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CameraMode, GamePhase, TelemetryData, VehicleClass, WeatherType } from './types/game';
import { RaceCanvas } from './components/RaceCanvas';
import { BroadcastHUD } from './components/BroadcastHUD';
import { PaddockView } from './components/PaddockView';
import { RaceResultsModal } from './components/RaceResultsModal';
import { audioEngine } from './audio/engineAudio';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('paddock');
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>('f1');
  const [weather, setWeather] = useState<WeatherType>('day');
  const [totalLaps, setTotalLaps] = useState<number>(3);
  const [cameraMode, setCameraMode] = useState<CameraMode>('chase');
  const [countdownStep, setCountdownStep] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  // Keyboard input state
  const [inputState, setInputState] = useState({
    throttle: 0,
    brake: 0,
    steer: 0,
    drs: false,
    handbrake: false,
  });

  // Key tracking map
  const keysDownRef = useRef<Record<string, boolean>>({});

  // Countdown timer reference
  const countdownTimerRef = useRef<NodeJS.Timeout[]>([]);

  // Update inputs from held keys
  const updateInputs = useCallback(() => {
    const keys = keysDownRef.current;

    let throttle = 0;
    if (keys['KeyW'] || keys['ArrowUp']) throttle = 1;

    let brake = 0;
    if (keys['KeyS'] || keys['ArrowDown']) brake = 1;

    let steer = 0;
    if (keys['KeyA'] || keys['ArrowLeft']) steer += 1; // Left
    if (keys['KeyD'] || keys['ArrowRight']) steer -= 1; // Right

    const drs = Boolean(keys['ShiftLeft'] || keys['ShiftRight'] || keys['KeyB']);
    const handbrake = Boolean(keys['Space']);

    setInputState({
      throttle,
      brake,
      steer,
      drs,
      handbrake,
    });
  }, []);

  // Global Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser scrolling on space/arrows during race
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      keysDownRef.current[e.code] = true;

      // Camera toggle shortcut
      if (e.code === 'KeyC') {
        setCameraMode((prev) => (prev === 'chase' ? 'cockpit' : prev === 'cockpit' ? 'helicopter' : 'chase'));
      }

      // Audio mute shortcut
      if (e.code === 'KeyM') {
        const muted = audioEngine.toggleMute();
        setIsMuted(muted);
      }

      // Quick track recover shortcut
      if (e.code === 'KeyR') {
        handleResetCar();
      }

      updateInputs();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.code] = false;
      updateInputs();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [updateInputs]);

  // Start 5-red-light sequence
  const startRaceCountdown = useCallback(() => {
    setPhase('countdown');
    setCountdownStep(0);

    // Clear any previous timers
    countdownTimerRef.current.forEach(clearTimeout);
    countdownTimerRef.current = [];

    // 5 sequential red lights
    for (let step = 1; step <= 5; step++) {
      const t = setTimeout(() => {
        setCountdownStep(step);
      }, step * 1000);
      countdownTimerRef.current.push(t);
    }

    // Authentic F1 random hold (1.0 to 2.2 seconds after 5th light)
    const randomHold = 1000 + Math.random() * 1200;
    const lightsOutTimer = setTimeout(() => {
      setCountdownStep(6); // Lights Out!
      setPhase('racing');

      // Clear countdown indicator after 1.5 seconds
      const clearCountdown = setTimeout(() => {
        setCountdownStep(0);
      }, 1500);
      countdownTimerRef.current.push(clearCountdown);
    }, 5000 + randomHold);

    countdownTimerRef.current.push(lightsOutTimer);
  }, []);

  const handleLapCompleted = useCallback((lap: number, total: number, lapTime: number) => {
    // Handled by telemetry & chime
  }, []);

  const handleRaceFinished = useCallback(() => {
    setPhase('finished');
  }, []);

  const handleRestart = useCallback(() => {
    startRaceCountdown();
  }, [startRaceCountdown]);

  const handleReturnToPaddock = useCallback(() => {
    countdownTimerRef.current.forEach(clearTimeout);
    setPhase('paddock');
    setCountdownStep(0);
    audioEngine.stop();
  }, []);

  const handleResetCar = useCallback(() => {
    // Reset inputs & recover vehicle to track center
    setInputState({
      throttle: 0,
      brake: 0,
      steer: 0,
      drs: false,
      handbrake: false,
    });
    setResetTrigger((prev) => prev + 1);
  }, []);

  // Touch control handlers
  const handleTouchThrottle = (active: boolean) => {
    setInputState((prev) => ({ ...prev, throttle: active ? 1 : 0 }));
  };

  const handleTouchBrake = (active: boolean) => {
    setInputState((prev) => ({ ...prev, brake: active ? 1 : 0 }));
  };

  const handleTouchSteer = (dir: number) => {
    setInputState((prev) => ({ ...prev, steer: dir }));
  };

  const handleTouchDrs = (active: boolean) => {
    setInputState((prev) => ({ ...prev, drs: active }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Paddock & Machine Selection Screen */}
      {phase === 'paddock' && (
        <PaddockView
          selectedClass={vehicleClass}
          weather={weather}
          totalLaps={totalLaps}
          onSelectVehicle={setVehicleClass}
          onSelectWeather={setWeather}
          onSelectLaps={setTotalLaps}
          onStartRace={startRaceCountdown}
        />
      )}

      {/* Active 3D Race Scene (Rendered during Countdown, Racing, and Finished states) */}
      {phase !== 'paddock' && (
        <>
          <RaceCanvas
            vehicleClass={vehicleClass}
            weather={weather}
            cameraMode={cameraMode}
            totalLaps={totalLaps}
            isRacing={phase === 'racing'}
            countdownStep={countdownStep}
            onTelemetryUpdate={setTelemetry}
            onLapCompleted={handleLapCompleted}
            onRaceFinished={handleRaceFinished}
            inputState={inputState}
            resetTrigger={resetTrigger}
          />

          <BroadcastHUD
            telemetry={telemetry}
            cameraMode={cameraMode}
            countdownStep={countdownStep}
            isMuted={isMuted}
            weather={weather}
            onToggleCamera={() =>
              setCameraMode((prev) => (prev === 'chase' ? 'cockpit' : prev === 'cockpit' ? 'helicopter' : 'chase'))
            }
            onToggleMute={() => {
              const muted = audioEngine.toggleMute();
              setIsMuted(muted);
            }}
            onResetCar={handleResetCar}
            onSelectCamera={setCameraMode}
            onTouchThrottle={handleTouchThrottle}
            onTouchBrake={handleTouchBrake}
            onTouchSteer={handleTouchSteer}
            onTouchDrs={handleTouchDrs}
          />
        </>
      )}

      {/* Post-Race Classification & Podium Celebration */}
      {phase === 'finished' && telemetry && (
        <RaceResultsModal
          telemetry={telemetry}
          vehicleClass={vehicleClass}
          onRestart={handleRestart}
          onReturnToPaddock={handleReturnToPaddock}
        />
      )}
    </div>
  );
}
