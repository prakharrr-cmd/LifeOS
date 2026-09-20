import React from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Clock, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowRight, 
  Zap,
  Calendar,
  Mail,
  MessageSquare,
  FileCode2,
  Sparkles
} from 'lucide-react';
import { DetectedRisk, ChannelSource } from '../types';

interface RiskAlertBannerProps {
  risk: DetectedRisk;
  onResolveClick: () => void;
  hasAppliedRebalance: boolean;
}

const getSourceIcon = (source: ChannelSource) => {
  switch (source) {
    case 'messages':
      return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
    case 'email':
      return <Mail className="w-3.5 h-3.5 text-sky-400" />;
    case 'calendar':
      return <Calendar className="w-3.5 h-3.5 text-amber-400" />;
    case 'assignments':
      return <FileCode2 className="w-3.5 h-3.5 text-purple-400" />;
    default:
      return <Clock className="w-3.5 h-3.5 text-rose-400" />;
  }
};

export const RiskAlertBanner: React.FC<RiskAlertBannerProps> = ({
  risk,
  onResolveClick,
  hasAppliedRebalance,
}) => {
  if (hasAppliedRebalance) {
    return (
      <div 
        id="card-risk-resolved"
        className="w-full rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/30 p-6 shadow-xl relative overflow-hidden transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold uppercase">
                  Schedule Stabilized
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Miss Probability: 14% (Safely Buffered)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Deadlines Deconflicted Across Thursday & Friday
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Java Lab moved to Thursday 6 PM; DBMS moved to Tonight 8:30 PM. Friday internal test buffer is fully protected.
              </p>
            </div>
          </div>
          <button
            id="btn-view-rebalanced-audit"
            onClick={onResolveClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Review Rebalance Audit</span>
          </button>
        </div>
      </div>
    );
  }

  const isCritical = risk.severity === 'CRITICAL';

  return (
    <section
      id="card-predicted-risk-alert"
      className="w-full rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-950 border border-rose-500/40 p-6 md:p-7 shadow-[0_10px_35px_rgba(244,63,94,0.12)] relative overflow-hidden transition-all"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top Header Badge & Prediction Statement */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
          <div className="flex items-center flex-wrap gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider font-mono">
              <Flame className="w-4 h-4 animate-bounce" />
              Predicted Miss Alert
            </span>
            <span className="text-xs font-mono text-neutral-400">
              {risk.timeUntilCollision}
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-neutral-700"></span>
            <span className="text-xs font-mono text-rose-300/80">
              Cross-Channel Clue Synthesis: 4 Sources
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700 font-mono text-xs">
              <span className="text-neutral-400">Predicted Overload:</span>
              <span className="font-bold text-rose-400 uppercase tracking-wide">
                {risk.predictedOverload}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/60 border border-rose-800/60 font-mono text-xs text-rose-300">
              <span>Risk:</span>
              <span className="font-extrabold text-white text-sm">{risk.missProbability}%</span>
            </div>
          </div>
        </div>

        {/* The Core Prediction Banner: "You're going to miss this." */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                &ldquo;{risk.predictionStatement}&rdquo;
              </span>
            </div>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              <span className="text-rose-400 font-semibold">LifeOS synthesized 4 disparate channels. </span>
              {risk.explanation}
            </p>

            {/* Cognitive Trap Card */}
            <div className="mt-2 rounded-xl bg-neutral-950/70 border border-neutral-800 p-3.5 flex items-start gap-3">
              <BrainCircuit className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wide">
                  Cognitive Trap Detected:
                </span>
                <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                  {risk.cognitiveTrap}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: The 3 Deadlines Box */}
          <div className="lg:col-span-5 rounded-xl bg-neutral-950/80 border border-neutral-800/90 p-4.5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Deadlines Within 24 Hours</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[11px] font-mono font-medium">
                {risk.deadlines.length} Collisions
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {risk.deadlines.map((dl, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="p-1.5 rounded-md bg-neutral-800 shrink-0">
                      {getSourceIcon(dl.source)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">
                        {dl.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 font-mono capitalize">
                        Via {dl.source}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-neutral-800 text-rose-300 border border-neutral-700/60">
                    {dl.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Direct Action */}
            <button
              id="btn-trigger-stress-resolution"
              onClick={onResolveClick}
              className="mt-1 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>Deconflict & Fix This Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
