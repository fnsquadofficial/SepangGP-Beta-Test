import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, Home, Clock, Zap } from 'lucide-react';
import { TelemetryData, VehicleClass } from '../types/game';
import { DEFAULT_AI_DRIVERS } from '../physics/racingEngine';

interface RaceResultsModalProps {
  telemetry: TelemetryData;
  vehicleClass: VehicleClass;
  onRestart: () => void;
  onReturnToPaddock: () => void;
}

export const RaceResultsModal: React.FC<RaceResultsModalProps> = ({
  telemetry,
  vehicleClass,
  onRestart,
  onReturnToPaddock,
}) => {
  const isPodium = telemetry.position <= 3;
  const isWinner = telemetry.position === 1;

  useEffect(() => {
    if (isPodium) {
      confetti({
        particleCount: isWinner ? 120 : 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00a19b', '#f59e0b', '#ef4444', '#ffffff', '#38bdf8'],
      });
    }
  }, [isPodium, isWinner]);

  const formatLap = (secs: number) => {
    if (!secs || secs <= 0) return '1:34.821';
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 1000);
    return `${mins}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  // Compile final leaderboard including player
  const leaderboard = [
    {
      id: 'player',
      name: 'YOU (Driver)',
      team: vehicleClass === 'f1' ? 'Apex Works GP' : 'Sepang GT Racing',
      class: vehicleClass.toUpperCase(),
      bestLap: formatLap(telemetry.bestLapTime || telemetry.lastLapTime),
      position: telemetry.position,
      isPlayer: true,
    },
    ...DEFAULT_AI_DRIVERS.map((ai, index) => {
      // Offset position around player
      const pos = index < telemetry.position - 1 ? index + 1 : index + 2;
      return {
        id: ai.id,
        name: ai.name,
        team: ai.team,
        class: ai.carClass.toUpperCase(),
        bestLap: formatLap(92 + (index * 1.2)),
        position: pos,
        isPlayer: false,
      };
    }),
  ].sort((a, b) => a.position - b.position);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/20 p-6 md:p-8 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            {isWinner ? (
              <div className="p-3 bg-amber-500/20 rounded-full border border-amber-400 text-amber-300">
                <Trophy className="w-8 h-8" />
              </div>
            ) : isPodium ? (
              <div className="p-3 bg-cyan-500/20 rounded-full border border-cyan-400 text-cyan-300">
                <Award className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-3 bg-slate-800 rounded-full border border-slate-700 text-slate-400">
                <Clock className="w-8 h-8" />
              </div>
            )}
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
            Sepang Grand Prix · Official Classification
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-telemetry text-white uppercase mt-1">
            {isWinner ? 'Victory at Sepang!' : isPodium ? 'Podium Finish!' : 'Race Complete'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            You crossed the finish line in{' '}
            <strong className="text-white font-telemetry">Position P{telemetry.position}</strong> after completing{' '}
            {telemetry.totalLaps} laps.
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="glass-panel p-3.5 rounded-xl border border-white/10 flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Final Position</span>
            <span className="text-2xl font-bold font-telemetry text-cyan-400">P{telemetry.position}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-white/10 flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Best Lap Time</span>
            <span className="text-2xl font-bold font-telemetry text-purple-400">
              {formatLap(telemetry.bestLapTime || telemetry.lastLapTime)}
            </span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-white/10 col-span-2 md:col-span-1 flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Class Machine</span>
            <span className="text-2xl font-bold font-telemetry text-white uppercase">{vehicleClass}</span>
          </div>
        </div>

        {/* Official Race Classification Leaderboard */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
          <div className="grid grid-cols-12 text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1 border-b border-white/10">
            <span className="col-span-2">Pos</span>
            <span className="col-span-6">Driver / Team</span>
            <span className="col-span-4 text-right">Best Lap</span>
          </div>

          {leaderboard.map((row) => (
            <div
              key={row.id}
              className={`grid grid-cols-12 items-center px-3 py-2 rounded-lg text-xs font-telemetry ${
                row.isPlayer
                  ? 'bg-cyan-500/20 border border-cyan-400 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="col-span-2 flex items-center gap-1.5 font-bold">
                <span>P{row.position}</span>
                {row.position <= 3 && (
                  <span className={`w-1.5 h-1.5 rounded-full ${row.position === 1 ? 'bg-amber-400' : 'bg-slate-300'}`} />
                )}
              </div>
              <div className="col-span-6 truncate">
                <span className={row.isPlayer ? 'text-cyan-300' : 'text-white'}>{row.name}</span>
                <span className="text-slate-400 text-[10px] ml-2 font-sans">{row.team}</span>
              </div>
              <div className="col-span-4 text-right font-mono text-slate-300">
                {row.bestLap}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onReturnToPaddock}
            className="flex-1 py-3 px-4 glass-panel hover:bg-white/10 border border-white/20 rounded-xl font-bold font-telemetry text-sm flex items-center justify-center gap-2 text-white transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            RETURN TO PADDOCK
          </button>

          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 rounded-xl font-black font-telemetry text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            RACE AGAIN
          </button>
        </div>
      </div>
    </div>
  );
};
