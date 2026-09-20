import React from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Mail, 
  FileCode2, 
  Bell, 
  Trash2, 
  Clock, 
  ExternalLink,
  Tag,
  Link2
} from 'lucide-react';
import { StreamItem, ChannelSource } from '../types';

interface StreamFeedProps {
  items: StreamItem[];
  selectedSource: ChannelSource | 'all';
  onSelectSource: (source: ChannelSource | 'all') => void;
  onDeleteItem: (id: string) => void;
  connectedItemIds?: string[];
  onOpenAddModal: () => void;
}

const getSourceMeta = (source: ChannelSource) => {
  switch (source) {
    case 'messages':
      return {
        label: 'Message',
        icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />,
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      };
    case 'email':
      return {
        label: 'Email',
        icon: <Mail className="w-3.5 h-3.5 text-sky-400" />,
        badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      };
    case 'calendar':
      return {
        label: 'Calendar',
        icon: <Calendar className="w-3.5 h-3.5 text-amber-400" />,
        badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      };
    case 'assignments':
      return {
        label: 'Assignment / LMS',
        icon: <FileCode2 className="w-3.5 h-3.5 text-purple-400" />,
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      };
    default:
      return {
        label: 'Notification',
        icon: <Bell className="w-3.5 h-3.5 text-rose-400" />,
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      };
  }
};

export const StreamFeed: React.FC<StreamFeedProps> = ({
  items,
  selectedSource,
  onSelectSource,
  onDeleteItem,
  connectedItemIds = [],
  onOpenAddModal,
}) => {
  const filteredItems = selectedSource === 'all'
    ? items
    : items.filter((item) => item.source === selectedSource);

  const tabs: Array<{ id: ChannelSource | 'all'; label: string }> = [
    { id: 'all', label: 'All Inbound Streams' },
    { id: 'messages', label: 'Messages' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'email', label: 'Email' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div id="section-stream-feed" className="w-full flex flex-col gap-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Personal Stream Lake
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              ({filteredItems.length} active inputs)
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            Connected Phone Clues & Signals
          </h3>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-medium font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>+ Ingest Notification</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
        {tabs.map((tab) => {
          const isActive = selectedSource === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSource(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-neutral-800 text-white border border-neutral-700 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feed List */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center text-neutral-400 text-xs font-mono">
          No stream items found in this channel. Try simulating an inbound message.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const meta = getSourceMeta(item.source);
            const isConnectedToCrisis = connectedItemIds.includes(item.id);
            const isRebalanced = item.dateTag.includes('[Rebalanced]') || item.tags?.includes('Auto-Rebalanced');

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isRebalanced
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : isConnectedToCrisis
                    ? 'bg-neutral-900/95 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.06)]'
                    : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  {/* Top Bar: Source badge + Timestamp + Delete */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono border ${meta.badgeColor}`}>
                        {meta.icon}
                        <span className="capitalize">{meta.label}</span>
                      </span>

                      {isConnectedToCrisis && !isRebalanced && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                          <Link2 className="w-3 h-3" /> Clue Connected
                        </span>
                      )}

                      {isRebalanced && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          Rescheduled
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-mono text-neutral-500">
                        {item.timestamp}
                      </span>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Delete stream item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Sender */}
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    From: {item.sender}
                  </p>

                  {/* Body Snippet */}
                  <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                {/* Bottom Bar: When Tag + Tags */}
                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span className={`font-semibold ${isRebalanced ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {item.dateTag}
                    </span>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      {item.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800/80 text-neutral-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
