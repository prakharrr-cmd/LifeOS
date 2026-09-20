import React, { useState } from 'react';
import { 
  Clock, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface TimelineCollisionMatrixProps {
  hasAppliedRebalance: boolean;
  onApplyPlan: () => void;
  onWhyStressedClick: () => void;
}

export const TimelineCollisionMatrix: React.FC<TimelineCollisionMatrixProps> = ({
  hasAppliedRebalance,
  onApplyPlan,
  onWhyStressedClick,
}) => {
  const [viewMode, setViewMode] = useState<'current' | 'comparison'>('current');

  return (
    <div 
      id="section-collision-matrix"
      className="w-full rounded-2xl bg-neutral-900/60 border border-neutral-800 p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-neutral-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              Workload Density Radar
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              24-Hour Cognitive Friction Model
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            The Collision Radar: Friday Gauntlet
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('current')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'current'
                ? 'bg-neutral-800 text-white border border-neutral-700 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {hasAppliedRebalance ? 'Deconflicted Schedule' : 'Current Collision State'}
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'comparison'
                ? 'bg-neutral-800 text-white border border-neutral-700 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Before vs After Rebalance
          </button>
        </div>
      </div>

      {viewMode === 'current' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thursday Timeline Card */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase text-neutral-400">
                  Thursday (Evening Buffer)
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  hasAppliedRebalance
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {hasAppliedRebalance ? 'Optimized Execution' : 'Underutilized Slot'}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {hasAppliedRebalance ? (
                  <>
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-300">
                          Java Lab Exercise 7
                        </span>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Moved from Friday 2 PM (Finished ahead of time)
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        6:00 PM
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-300">
                          DBMS Assignment Queries
                        </span>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Moved from Friday 11:59 PM (Early submission)
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        8:30 PM
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-lg border border-dashed border-neutral-800 text-center text-xs font-mono text-neutral-500">
                    Empty evening. LifeOS recommends moving Friday tasks here to absorb overload.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Cognitive Strain:</span>
              <span className="font-bold text-neutral-200">
                {hasAppliedRebalance ? 'Balanced 35%' : 'Idle 10%'}
              </span>
            </div>
          </div>

          {/* Friday Timeline Card */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            hasAppliedRebalance
              ? 'bg-neutral-950/80 border-neutral-800'
              : 'bg-rose-950/20 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.08)]'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase text-white">
                  Friday (High Stakes Day)
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  hasAppliedRebalance
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                }`}>
                  {hasAppliedRebalance ? 'Buffer Preserved' : 'CRITICAL OVERLOAD (94%)'}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Exam */}
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-300">
                      CN Internal Test (3-Hour Exam)
                    </span>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      Hall B-204 (Closed Book)
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-300">
                    9 AM - 12 PM
                  </span>
                </div>

                {/* Java Lab */}
                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  hasAppliedRebalance
                    ? 'bg-neutral-900/50 border-neutral-800/80 opacity-60'
                    : 'bg-rose-950/40 border-rose-500/30'
                }`}>
                  <div>
                    <span className={`text-xs font-bold ${hasAppliedRebalance ? 'text-neutral-400 line-through' : 'text-rose-300'}`}>
                      Java Lab Evaluation
                    </span>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      {hasAppliedRebalance ? 'Moved to Thursday evening' : 'TA viva + thread testing'}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-400">
                    {hasAppliedRebalance ? 'Moved' : '2:00 PM'}
                  </span>
                </div>

                {/* DSA Quiz */}
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-300">
                      DSA Timed Quiz (Dynamic Prog.)
                    </span>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      Online Canvas Lockout
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-300">
                    4:00 PM
                  </span>
                </div>

                {/* DBMS */}
                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  hasAppliedRebalance
                    ? 'bg-neutral-900/50 border-neutral-800/80 opacity-60'
                    : 'bg-rose-950/40 border-rose-500/30'
                }`}>
                  <div>
                    <span className={`text-xs font-bold ${hasAppliedRebalance ? 'text-neutral-400 line-through' : 'text-rose-300'}`}>
                      DBMS Assignment Portal
                    </span>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      {hasAppliedRebalance ? 'Submitted Thursday 8:30 PM' : 'Extended deadline cutoff trap'}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-400">
                    {hasAppliedRebalance ? 'Done' : '11:59 PM'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Peak Load Index:</span>
              <span className={`font-bold ${hasAppliedRebalance ? 'text-emerald-400' : 'text-rose-400'}`}>
                {hasAppliedRebalance ? '38% (Manageable Single Exam Focus)' : '94% (Near-Guaranteed Miss)'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Side by Side Comparison */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-rose-950/15 border border-rose-500/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Before LifeOS Deconfliction</span>
            </div>
            <ul className="text-xs text-neutral-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Extension Bias:</strong> DBMS extended to Friday gave illusion of relief, but collided with 3-hour exam.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>No Buffer:</strong> Exam ends at 12 PM, leaving just 2 hours to prep for Java lab and DSA quiz simultaneously.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Fatigue Miss:</strong> Post-exam exhaustion leads directly to missing the 11:59 PM DBMS deadline.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>After LifeOS 1-Click Rebalance</span>
            </div>
            <ul className="text-xs text-neutral-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Pre-emptive Execution:</strong> Java Lab and DBMS tackled Thursday evening while mental cache is fresh.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Protected Exam Morning:</strong> Friday morning is 100% dedicated to Computer Networks internal test.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Stress Relief:</strong> Zero midnight deadlines hanging over Friday evening.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
