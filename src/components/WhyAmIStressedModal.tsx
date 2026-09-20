import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Flame, 
  Zap, 
  BrainCircuit, 
  ShieldCheck,
  Check,
  CalendarDays
} from 'lucide-react';
import { StressAuditReport, ScheduleRebalanceItem } from '../types';

interface WhyAmIStressedModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: StressAuditReport;
  onApplyAllRebalances: () => Promise<void>;
  onApplySingleRebalance: (id: string) => Promise<void>;
  isLoading: boolean;
  hasAppliedRebalance: boolean;
}

export const WhyAmIStressedModal: React.FC<WhyAmIStressedModalProps> = ({
  isOpen,
  onClose,
  report,
  onApplyAllRebalances,
  onApplySingleRebalance,
  isLoading,
  hasAppliedRebalance,
}) => {
  const [applying, setApplying] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyAll = async () => {
    try {
      setApplying(true);
      await onApplyAllRebalances();
    } finally {
      setApplying(false);
    }
  };

  const handleApplySingle = async (id: string) => {
    try {
      setApplyingId(id);
      await onApplySingleRebalance(id);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="modal-why-am-i-stressed"
        className="w-full max-w-3xl rounded-2xl bg-neutral-950 border border-rose-500/40 shadow-2xl overflow-hidden my-8 relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  AI Context Audit
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  Real-Time Cognitive Diagnostics
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Why am I stressed?
              </h2>
            </div>
          </div>

          <button
            id="btn-close-stress-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
          {/* THE CORE VERDICT */}
          <div className="rounded-2xl bg-gradient-to-br from-rose-950/40 via-neutral-900/90 to-amber-950/20 border border-rose-500/30 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-amber-300 tracking-wider">
                  The Clinical Diagnosis
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  &ldquo;{report.verdict}&rdquo;
                </h3>
                <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
                  {report.summaryMessage}
                </p>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="text-[11px] font-mono text-neutral-400">Cognitive Load</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-rose-400 font-mono">
                    {hasAppliedRebalance ? '18' : report.cognitiveLoadScore}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">/100</span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 mt-1">
                  {hasAppliedRebalance ? 'BUFFERED' : report.loadTier}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{report.mentalReliefIndex}</span>
            </div>
          </div>

          {/* Root Cause Analysis (Why you are stressed) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-neutral-300 uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-rose-400" />
              <span>Why Your Brain Is Stressed (Root Cause Breakdown)</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {report.whyYouAreStressed.map((reason, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3 text-xs sm:text-sm text-neutral-300"
                >
                  <span className="w-5 h-5 rounded-full bg-neutral-800 text-rose-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottlenecks */}
          {report.bottlenecks && report.bottlenecks.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-neutral-300 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Detected Collision Bottlenecks</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.bottlenecks.map((bn, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {bn.window}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bn.conflictingEvents.map((evt, eIdx) => (
                        <span key={eIdx} className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700/60">
                          {evt}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 italic">
                      {bn.riskFactor}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Automated Schedule Suggestions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-neutral-300 uppercase tracking-wider">
                <CalendarDays className="w-4 h-4 text-sky-400" />
                <span>Automated Deconfliction Suggestions</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                1-Click Execution
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {report.suggestedRebalance.map((item: ScheduleRebalanceItem) => {
                const isItemApplied = item.applied || hasAppliedRebalance;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isItemApplied
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {item.title}
                          </h4>
                          {isItemApplied && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Rescheduled
                            </span>
                          )}
                        </div>

                        {/* Relocation Flow */}
                        <div className="flex items-center gap-2 mt-2 font-mono text-xs">
                          <span className="px-2 py-0.5 rounded bg-rose-950/50 text-rose-400 border border-rose-900/40 line-through">
                            {item.originalTime}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-900/40 font-bold">
                            {item.suggestedTime}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-300 mt-2">
                          {item.reason}
                        </p>
                        <p className="text-[11px] text-sky-400 font-mono mt-1">
                          ↳ {item.impact}
                        </p>
                      </div>

                      <button
                        onClick={() => handleApplySingle(item.id)}
                        disabled={isItemApplied || applyingId === item.id || hasAppliedRebalance}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer ${
                          isItemApplied
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                        }`}
                      >
                        {isItemApplied ? 'Applied' : applyingId === item.id ? 'Moving...' : 'Apply Move'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-neutral-400 text-center sm:text-left">
            AI personal context + prediction + automated deconfliction.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              id="btn-apply-all-rebalance"
              onClick={handleApplyAll}
              disabled={applying || hasAppliedRebalance}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                hasAppliedRebalance
                  ? 'bg-emerald-600 text-white shadow-emerald-900/30 cursor-default'
                  : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-950/40 hover:scale-[1.02]'
              }`}
            >
              {hasAppliedRebalance ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Schedule Deconflicted!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                  <span>{applying ? 'Applying Rebalance Plan...' : 'Apply Plan (1-Click)'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
