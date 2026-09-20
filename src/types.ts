export type ChannelSource = 'messages' | 'calendar' | 'email' | 'assignments' | 'notifications';

export interface StreamItem {
  id: string;
  source: ChannelSource;
  title: string;
  content: string;
  timestamp: string;
  sender: string;
  dateTag: string;
  tags?: string[];
  isHighlighted?: boolean;
}

export interface DeadlineItem {
  title: string;
  time: string;
  source: ChannelSource;
  critical?: boolean;
}

export interface DetectedRisk {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  missProbability: number; // 0 - 100
  predictionStatement: string; // e.g., "You're going to miss this."
  predictedOverload: 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW';
  timeUntilCollision: string;
  cognitiveTrap: string;
  connectedItemIds: string[];
  deadlines: DeadlineItem[];
  explanation: string;
  preventionStep: string;
}

export interface ScheduleRebalanceItem {
  id: string;
  title: string;
  originalTime: string;
  suggestedTime: string;
  reason: string;
  impact: string;
  channel: ChannelSource;
  applied?: boolean;
}

export interface StressAuditReport {
  verdict: string; // e.g. "You're not behind. You're overloaded."
  cognitiveLoadScore: number; // 0 - 100
  loadTier: 'EXTREME' | 'HIGH' | 'MODERATE' | 'NORMAL';
  whyYouAreStressed: string[];
  bottlenecks: Array<{
    window: string;
    conflictingEvents: string[];
    riskFactor: string;
  }>;
  suggestedRebalance: ScheduleRebalanceItem[];
  summaryMessage: string;
  mentalReliefIndex: string; // e.g. "Reduces peak cognitive friction by 64%"
}

export interface EngineStats {
  streamsMonitored: number;
  itemsAnalyzed: number;
  activeConflicts: number;
  overloadIndex: number;
  lastSyncTime: string;
}
