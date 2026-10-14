import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="glass-panel p-8 rounded-3xl border border-red-500/30 max-w-md flex flex-col items-center shadow-2xl">
            <div className="p-3 bg-red-500/20 rounded-full border border-red-500/40 text-red-400 mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-telemetry mb-2">Simulation Encountered an Issue</h2>
            <p className="text-sm text-slate-400 mb-6">
              {this.state.error?.message || 'A WebGL or graphics rendering error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-3 px-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-telemetry text-sm rounded-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
