import React from 'react';
import { 
  ShieldAlert, 
  Smartphone, 
  Sparkles, 
  RefreshCw, 
  PlusCircle, 
  Flame,
  CheckCircle2,
  Bell
} from 'lucide-react';

interface HeaderProps {
  onWhyStressedClick: () => void;
  onOpenAddModal: () => void;
  onReset: () => void;
  isLoading: boolean;
  isAnalyzing: boolean;
  missProbability: number;
  hasAppliedRebalance: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onWhyStressedClick,
  onOpenAddModal,
  onReset,
  isLoading,
  isAnalyzing,
  missProbability,
  hasAppliedRebalance,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Core Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 via-neutral-900 to-amber-500/10 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <Smartphone className="w-5 h-5 text-rose-400" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Life<span className="text-rose-500">OS</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-neutral-800/90 text-neutral-300 border border-neutral-700/60">
                  Predictive Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Your phone knows what you forgot
              </p>
            </div>
          </div>

          {/* Quick status pill for mobile */}
          <div className="md:hidden">
            {hasAppliedRebalance ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Deconflicted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-400 bg-rose-950/60 border border-rose-800/60 rounded-full animate-pulse">
                <Flame className="w-3.5 h-3.5" /> {missProbability}% Risk
              </span>
            )}
          </div>
        </div>

        {/* Live Context Telemetry and Killer Feature Trigger */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
          {/* Channel telemetry badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>4 Streams Connected</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">Zero To-Dos Required</span>
          </div>

          {/* THE KILLER FEATURE BUTTON */}
          <button
            id="btn-why-am-i-stressed"
            onClick={onWhyStressedClick}
            disabled={isAnalyzing}
            className={`relative group flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-lg overflow-hidden cursor-pointer ${
              hasAppliedRebalance
                ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700'
                : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white shadow-rose-900/30 hover:shadow-rose-600/40 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
            <span className="font-bold tracking-wide">
              Why am I stressed?
            </span>
            <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded bg-black/30 font-mono text-amber-200 uppercase font-medium">
              1-Click
            </span>
          </button>

          {/* Ingest Notification Button */}
          <button
            id="btn-simulate-notification"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
            title="Simulate inbound message, email or calendar change"
          >
            <Bell className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Inbound</span>
          </button>

          {/* Reset button */}
          <button
            id="btn-reset-state"
            onClick={onReset}
            disabled={isLoading}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
            title="Reset to initial prompt scenario (DBMS, Internal Test, Labs)"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
