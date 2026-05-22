'use client';

import { useState, useEffect } from 'react';
import { usePhysioStore } from '@/store/usePhysioStore';
import { 
  FileText, 
  Plus, 
  Save, 
  Calendar, 
  Sparkles, 
  Check, 
  MessageSquare,
  TrendingUp,
  Heart
} from 'lucide-react';

export default function NotesPage() {
  const { logs, addLogEntry } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Update note field when date changes
  useEffect(() => {
    if (mounted && selectedDate) {
      const entry = logs[selectedDate];
      setNoteContent(entry?.notes || '');
    }
  }, [mounted, selectedDate, logs]);

  const handleSaveNote = () => {
    if (!selectedDate) return;
    
    addLogEntry(selectedDate, {
      notes: noteContent
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded-md"></div>
        <div className="h-48 bg-slate-100 rounded-3xl"></div>
      </div>
    );
  }

  // Get list of all logs containing non-empty notes sorted by date descending
  const sortedNotes = Object.values(logs)
    .filter(log => log.notes && log.notes.trim() !== '')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white/50 border border-border-card rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-black text-text-main tracking-tight leading-none">Personal Recovery Journal</h2>
        </div>
        <p className="text-xs text-text-muted leading-normal font-semibold">
          Document your rehabilitation wins, feelings, milestones, or questions for your occupational therapist.
        </p>
      </div>

      {/* Editor & Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Note Editor Card */}
        <div className="lg:col-span-1 bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm hover:shadow-md smooth-transition space-y-5">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <h3 className="font-extrabold text-text-main text-base tracking-tight">Write Journal Entry</h3>
            <span className="bg-primary-light text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Log Notes
            </span>
          </div>

          {/* Date Selector input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-text-muted uppercase tracking-wider block">
              Log Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-text-main focus:ring-1 focus:ring-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Note Editor TextArea */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-text-muted uppercase tracking-wider block">
              Journal Content
            </label>
            <textarea
              placeholder="e.g. Swelling is almost completely gone today. Able to grasp and open the water bottle independently! Pain remained very manageable during flexion exercises."
              rows={6}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-semibold leading-relaxed text-text-main focus:ring-1 focus:ring-primary focus:bg-white focus:outline-none resize-none placeholder:text-text-light"
            ></textarea>
          </div>

          <button
            onClick={handleSaveNote}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all duration-200 ${
              isSaved 
                ? 'bg-secondary text-white shadow-secondary/15 scale-[0.98]' 
                : 'bg-primary hover:bg-primary-hover text-white shadow-primary/15 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Notes Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Journal Entry</span>
              </>
            )}
          </button>
        </div>

        {/* Timeline Notes Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-extrabold text-text-main text-base tracking-tight">Journal Timeline</h3>
            <span className="text-[10px] text-text-muted font-bold">
              {sortedNotes.length} Entries
            </span>
          </div>

          {sortedNotes.length === 0 ? (
            <div className="bg-bg-card rounded-3xl border border-border-card p-12 text-center">
              <MessageSquare className="w-12 h-12 text-text-light mx-auto mb-3" />
              <h4 className="font-extrabold text-text-main text-sm">No journal logs written yet</h4>
              <p className="text-[11px] text-text-muted mt-1 max-w-xs mx-auto leading-normal">
                Pick a date on the left panel and save your first journal entry to track milestones!
              </p>
            </div>
          ) : (
            <div className="relative pl-6 border-l border-slate-200 space-y-6">
              {sortedNotes.map((note) => {
                const dateObj = new Date(note.date);
                const readableDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
                
                return (
                  <div key={note.date} className="relative bg-bg-card rounded-3xl border border-border-card p-5.5 shadow-sm hover:shadow-md smooth-transition space-y-3">
                    
                    {/* Time indicator circle bullet */}
                    <span className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-primary border-4 border-slate-50 shadow-sm"></span>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-text-muted font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-slate-200">
                        <Calendar className="w-3 h-3 text-primary" /> {readableDate}
                      </span>

                      {/* Mini stats highlights during this note day */}
                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="text-danger flex items-center gap-0.5 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                          <Heart className="w-3 h-3 fill-current" /> P:{note.painLevel}
                        </span>
                        <span className="text-secondary-hover flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <TrendingUp className="w-3 h-3" /> S:{note.gripStrength}kg
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-text-main leading-relaxed font-semibold">
                      {note.notes}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
