import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RiskAlertBanner } from './components/RiskAlertBanner';
import { ContextFlowVisualizer } from './components/ContextFlowVisualizer';
import { StreamFeed } from './components/StreamFeed';
import { TimelineCollisionMatrix } from './components/TimelineCollisionMatrix';
import { WhyAmIStressedModal } from './components/WhyAmIStressedModal';
import { AddNotificationModal } from './components/AddNotificationModal';
import { StreamItem, DetectedRisk, StressAuditReport, ChannelSource } from './types';
import { INITIAL_STREAM_ITEMS, INITIAL_RISK, INITIAL_STRESS_REPORT } from './data/seedData';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [streamItems, setStreamItems] = useState<StreamItem[]>(INITIAL_STREAM_ITEMS);
  const [risk, setRisk] = useState<DetectedRisk>(INITIAL_RISK);
  const [stressReport, setStressReport] = useState<StressAuditReport>(INITIAL_STRESS_REPORT);
  const [selectedSource, setSelectedSource] = useState<ChannelSource | 'all'>('all');
  const [isStressModalOpen, setIsStressModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAppliedRebalance, setHasAppliedRebalance] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show transient toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Fetch current state on mount
  useEffect(() => {
    const fetchState = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/stream-items');
        if (res.ok) {
          const data = await res.json();
          if (data.items) setStreamItems(data.items);
          if (data.risk) setRisk(data.risk);
          if (data.stressReport) setStressReport(data.stressReport);
        }
      } catch (err) {
        console.warn('Using client initial state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchState();
  }, []);

  // Re-run AI context engine analysis
  const handleAnalyzeContext = async () => {
    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/context-engine/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: streamItems }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.risk) {
          setRisk(data.risk);
          triggerToast('AI Context Engine updated: Disparate signals synthesized.');
        }
      }
    } catch (err) {
      console.error('Error analyzing context:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // The Killer Feature: "Why am I stressed?"
  const handleWhyAmIStressedClick = async () => {
    setIsStressModalOpen(true);
    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/stress-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: streamItems }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setStressReport(data.report);
        }
      }
    } catch (err) {
      console.error('Error during stress audit:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply all suggested rebalances (1-Click Automation)
  const handleApplyAllRebalances = async () => {
    try {
      const res = await fetch('/api/apply-rebalance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rebalances: stressReport.suggestedRebalance }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items) setStreamItems(data.items);
        if (data.risk) setRisk(data.risk);
        if (data.stressReport) setStressReport(data.stressReport);
        setHasAppliedRebalance(true);
        triggerToast('Schedule Rebalanced! Friday internal test buffer is protected.');
      }
    } catch (err) {
      console.error('Error applying rebalance:', err);
    }
  };

  // Apply single rebalance
  const handleApplySingleRebalance = async (id: string) => {
    try {
      const res = await fetch('/api/apply-rebalance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rebalanceId: id }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items) setStreamItems(data.items);
        if (data.risk) setRisk(data.risk);
        if (data.stressReport) setStressReport(data.stressReport);
        triggerToast('Task rescheduled to low-friction slot.');
      }
    } catch (err) {
      console.error('Error applying single rebalance:', err);
    }
  };

  // Add new stream item (Simulate inbound phone clue)
  const handleAddItem = async (itemData: Partial<StreamItem>) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/stream-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items) setStreamItems(data.items);
        triggerToast(`Inbound clue received from ${itemData.sender || 'Phone'}. Re-evaluating risk...`);
        // Trigger context engine re-evaluation
        setTimeout(() => {
          handleAnalyzeContext();
        }, 300);
      }
    } catch (err) {
      console.error('Error adding stream item:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete stream item
  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/stream-items/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items) setStreamItems(data.items);
        triggerToast('Stream record removed. Updating predictive risk...');
        handleAnalyzeContext();
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // Reset to initial prompt scenario
  const handleReset = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/stream-items/reset', {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items) setStreamItems(data.items);
        if (data.risk) setRisk(data.risk);
        if (data.stressReport) setStressReport(data.stressReport);
        setHasAppliedRebalance(false);
        triggerToast('Reset to initial DBMS + Exam collision scenario.');
      }
    } catch (err) {
      console.error('Error resetting state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute stream counts
  const streamCounts: Record<ChannelSource, number> = {
    messages: streamItems.filter((i) => i.source === 'messages').length,
    calendar: streamItems.filter((i) => i.source === 'calendar').length,
    email: streamItems.filter((i) => i.source === 'email').length,
    assignments: streamItems.filter((i) => i.source === 'assignments').length,
    notifications: streamItems.filter((i) => i.source === 'notifications').length,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* OS Header */}
      <Header
        onWhyStressedClick={handleWhyAmIStressedClick}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onReset={handleReset}
        isLoading={isLoading}
        isAnalyzing={isAnalyzing}
        missProbability={risk.missProbability}
        hasAppliedRebalance={hasAppliedRebalance}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono shadow-2xl animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Core Prediction Hero Banner: "You're going to miss this." */}
        <RiskAlertBanner
          risk={risk}
          onResolveClick={handleWhyAmIStressedClick}
          hasAppliedRebalance={hasAppliedRebalance}
        />

        {/* The Graphic Architecture Visualizer (Messages, Calendar, Email, Assignments -> Context Engine -> Risk) */}
        <ContextFlowVisualizer
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
          streamCounts={streamCounts}
          missProbability={risk.missProbability}
          hasAppliedRebalance={hasAppliedRebalance}
          onAnalyzeClick={handleAnalyzeContext}
          isAnalyzing={isAnalyzing}
        />

        {/* Workload Density & Collision Radar (Thursday vs Friday) */}
        <TimelineCollisionMatrix
          hasAppliedRebalance={hasAppliedRebalance}
          onApplyPlan={handleApplyAllRebalances}
          onWhyStressedClick={handleWhyAmIStressedClick}
        />

        {/* The Personal Stream Lake (Connected Phone Clues) */}
        <StreamFeed
          items={streamItems}
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
          onDeleteItem={handleDeleteItem}
          connectedItemIds={risk.connectedItemIds}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 px-4 text-center text-xs font-mono text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LifeOS — Predictive Cognitive Workload Engine</span>
          <span className="text-neutral-600">
            &ldquo;You&apos;re not behind. You&apos;re overloaded.&rdquo;
          </span>
          <span>AI + Personal Context + Prediction + Automation</span>
        </div>
      </footer>

      {/* "Why am I stressed?" Deep Audit Modal */}
      <WhyAmIStressedModal
        isOpen={isStressModalOpen}
        onClose={() => setIsStressModalOpen(false)}
        report={stressReport}
        onApplyAllRebalances={handleApplyAllRebalances}
        onApplySingleRebalance={handleApplySingleRebalance}
        isLoading={isLoading}
        hasAppliedRebalance={hasAppliedRebalance}
      />

      {/* Ingest Phone Notification / Clue Modal */}
      <AddNotificationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
        isLoading={isLoading}
      />
    </div>
  );
}
