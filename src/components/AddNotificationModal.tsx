import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  MessageSquare, 
  Calendar, 
  Mail, 
  FileCode2, 
  Sparkles,
  Send
} from 'lucide-react';
import { ChannelSource, StreamItem } from '../types';

interface AddNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Partial<StreamItem>) => Promise<void>;
  isLoading: boolean;
}

const PRESETS: Array<{
  source: ChannelSource;
  sender: string;
  title: string;
  content: string;
  dateTag: string;
  label: string;
}> = [
  {
    source: 'messages',
    sender: 'Mom (WhatsApp)',
    title: 'Pick up sister from train station',
    content: 'Can you pick up Ananya from the central station on Friday around 3:30 PM? Mom has an appointment.',
    dateTag: 'Friday 3:30 PM',
    label: 'Family WhatsApp: Train pickup Friday 3:30 PM',
  },
  {
    source: 'email',
    sender: 'Dr. Mehta Clinic',
    title: 'Appointment Reminder: Dental checkup',
    content: 'Your appointment is confirmed for Friday at 1:15 PM. Please arrive 15 minutes early.',
    dateTag: 'Friday 1:15 PM',
    label: 'Email: Dental appointment Friday 1:15 PM',
  },
  {
    source: 'calendar',
    sender: 'Career Center Calendar Sync',
    title: 'On-Campus Internship Interview (Google)',
    content: '30-minute behavioral screening in Student Union Room 302.',
    dateTag: 'Friday 12:30 PM',
    label: 'Calendar: Internship interview Friday 12:30 PM',
  },
  {
    source: 'assignments',
    sender: 'HackerRank Automated Grader',
    title: 'DSA Bonus Problem Set: Graph Coloring',
    content: 'Optional 5% extra credit closes Friday midnight sharp.',
    dateTag: 'Friday 11:59 PM',
    label: 'Assignment: Extra credit deadline Friday night',
  },
];

export const AddNotificationModal: React.FC<AddNotificationModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  isLoading,
}) => {
  const [source, setSource] = useState<ChannelSource>('messages');
  const [sender, setSender] = useState('Slack #study-group');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dateTag, setDateTag] = useState('Friday 3:00 PM');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAddItem({
      source,
      sender: sender.trim() || 'Phone Alert',
      title: title.trim(),
      content: content.trim() || title.trim(),
      dateTag: dateTag.trim() || 'Upcoming',
      timestamp: 'Just now',
      tags: ['Simulated Inbound', source],
    });

    setTitle('');
    setContent('');
    onClose();
  };

  const handleApplyPreset = async (preset: typeof PRESETS[0]) => {
    await onAddItem({
      source: preset.source,
      sender: preset.sender,
      title: preset.title,
      content: preset.content,
      dateTag: preset.dateTag,
      timestamp: 'Just now',
      tags: ['Simulated Clue', preset.source],
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="modal-add-notification"
        className="w-full max-w-xl rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden my-8 relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Simulate Inbound Phone Clue
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Inject a message, email, or event to test collision prediction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <span className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">
              Quick Inbound Clue Presets:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  disabled={isLoading}
                  className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-colors text-xs font-mono text-neutral-300 flex items-start gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-800"></div>
            <span className="flex-shrink mx-3 text-neutral-500 text-xs font-mono">OR CUSTOM INTAKE</span>
            <div className="flex-grow border-t border-neutral-800"></div>
          </div>

          {/* Custom Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Channel Selection */}
            <div>
              <label className="text-xs font-mono text-neutral-300 font-semibold block mb-1.5">
                Channel Source
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'messages', label: 'Message', icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> },
                  { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5 text-sky-400" /> },
                  { id: 'assignments', label: 'Assignment', icon: <FileCode2 className="w-3.5 h-3.5 text-purple-400" /> },
                ].map((ch) => (
                  <button
                    type="button"
                    key={ch.id}
                    onClick={() => setSource(ch.id as ChannelSource)}
                    className={`p-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                      source === ch.id
                        ? 'bg-neutral-800 text-white border-rose-500/50 font-bold'
                        : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    {ch.icon}
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sender & Time tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-neutral-300 font-semibold block mb-1">
                  Sender / App / Context
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g. Professor Raghavan / WhatsApp"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 font-semibold block mb-1">
                  Target Time / Deadline
                </label>
                <input
                  type="text"
                  value={dateTag}
                  onChange={(e) => setDateTag(e.target.value)}
                  placeholder="e.g. Friday 4:00 PM"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-mono text-neutral-300 font-semibold block mb-1">
                Notification Headline
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Project presentation scheduled"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-xs font-mono text-neutral-300 font-semibold block mb-1">
                Message Details / Content
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the message, snippet, or reminder body..."
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-rose-950/40 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inject Clue & Predict</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
