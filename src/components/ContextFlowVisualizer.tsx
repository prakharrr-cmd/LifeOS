import React from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Mail, 
  FileCode2, 
  Cpu, 
  AlertOctagon, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ChannelSource } from '../types';

interface ContextFlowVisualizerProps {
  selectedSource: ChannelSource | 'all';
  onSelectSource: (source: ChannelSource | 'all') => void;
  streamCounts: Record<ChannelSource, number>;
  missProbability: number;
  hasAppliedRebalance: boolean;
  onAnalyzeClick: () => void;
  isAnalyzing: boolean;
}

export const ContextFlowVisualizer: React.FC<ContextFlowVisualizerProps> = ({
  selectedSource,
  onSelectSource,
  streamCounts,
  missProbability,
  hasAppliedRebalance,
  onAnalyzeClick,
  isAnalyzing,
}) => {
  const sources: Array<{
    id: ChannelSource;
    label: string;
    icon: React.ReactNode;
    color: string;
    bgHover: string;
    borderActive: string;
    snippet: string;
  }> = [
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
      color: 'text-emerald-400',
      bgHover: 'hover:border-emerald-500/50',
      borderActive: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
      snippet: 'WhatsApp extension alert',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="w-4 h-4 text-amber-400" />,
      color: 'text-amber-400',
      bgHover: 'hover:border-amber-500/50',
      borderActive: 'border-amber-500 bg-amber-950/40 text-amber-300',
      snippet: 'Friday 3-hr internal test',
    },
    {
      id: 'email',
      label: 'Email',
      icon: <Mail className="w-4 h-4 text-sky-400" />,
      color: 'text-sky-400',
      bgHover: 'hover:border-sky-500/50',
      borderActive: 'border-sky-500 bg-sky-950/40 text-sky-300',
      snippet: 'Professor deadline cutoff notice',
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: <FileCode2 className="w-4 h-4 text-purple-400" />,
      color: 'text-purple-400',
      bgHover: 'hover:border-purple-500/50',
      borderActive: 'border-purple-500 bg-purple-950/40 text-purple-300',
      snippet: 'Java Lab + DSA Quiz',
    },
  ];

  return (
    <div 
      id="section-context-engine-flow"
      className="w-full rounded-2xl bg-neutral-900/60 border border-neutral-800 p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              The Architecture
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              Continuous Disparate Signal Synthesis
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            How LifeOS Connects The Hidden Pieces
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectSource('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              selectedSource === 'all'
                ? 'bg-neutral-800 text-white border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Show All
          </button>
          <button
            id="btn-re-run-context-engine"
            onClick={onAnalyzeClick}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 transition-colors cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Synthesizing...' : 'Re-run Engine'}</span>
          </button>
        </div>
      </div>

      {/* Graphical Flow Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left Inputs (4 streams) */}
        <div className="md:col-span-4 flex flex-col gap-2.5">
          {sources.map((src) => {
            const isSelected = selectedSource === src.id;
            return (
              <button
                key={src.id}
                onClick={() => onSelectSource(isSelected ? 'all' : src.id)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                  isSelected
                    ? src.borderActive
                    : 'bg-neutral-950/80 border-neutral-800/90 text-neutral-300 ' + src.bgHover
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-neutral-900 shrink-0">
                    {src.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono tracking-tight text-white truncate">
                        {src.label}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                        {streamCounts[src.id] || 0}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {src.snippet}
                    </p>
                  </div>
                </div>

                <div className="text-neutral-600 group-hover:text-neutral-400 transition-colors shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Center: AI Context Engine Core */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 relative">
          {/* Connector lines on desktop */}
          <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-neutral-700"></div>
          <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-neutral-700"></div>

          <div className="w-full rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-700 p-5 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-rose-500/5 pointer-events-none"></div>

            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center mb-3">
              <Cpu className="w-6 h-6 text-rose-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              AI Context Engine
            </span>
            <h4 className="text-sm font-bold text-white mt-1">
              Cross-Stream Clue Fusion
            </h4>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Detects contradictions, timing traps, and hidden collision matrices without user effort.
            </p>

            <div className="mt-3 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/80 text-[11px] font-mono text-neutral-300">
              Gemini 3.8 Flash Context Engine
            </div>
          </div>
        </div>

        {/* Right: Predicted Risk / Overload */}
        <div className="md:col-span-4 flex flex-col justify-center">
          <div 
            className={`w-full p-4.5 rounded-2xl border transition-all ${
              hasAppliedRebalance
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {hasAppliedRebalance ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                )}
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  {hasAppliedRebalance ? 'Predictive Status: Safe' : 'Predictive Status: Risk'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold">
                {hasAppliedRebalance ? '14%' : `${missProbability}% Risk`}
              </span>
            </div>

            <h5 className="text-sm font-bold text-white">
              {hasAppliedRebalance ? 'Buffer Protected' : 'You are likely to miss this'}
            </h5>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              {hasAppliedRebalance
                ? 'Assignments shifted away from the exam morning window. Friday cognitive load normalized.'
                : '3 heavy deadlines and an internal exam overlap in a 24-hour bracket. High mental crash risk.'}
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-neutral-400">Context Velocity:</span>
              <span className="font-bold text-white">
                {hasAppliedRebalance ? 'Deconflicted' : 'Compression: 4.8x'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
