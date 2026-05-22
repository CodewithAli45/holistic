'use client';

import { useState, useEffect } from 'react';
import { usePhysioStore, LogEntry } from '@/store/usePhysioStore';
import { Save, Check, ShieldAlert, Sparkles } from 'lucide-react';

export default function QuickTracker() {
  const { logs, addLogEntry } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [todayDateStr, setTodayDateStr] = useState('');
  
  // Local states for form inputs
  const [painLevel, setPainLevel] = useState(3);
  const [gripStrength, setGripStrength] = useState(5.0);
  const [flexion, setFlexion] = useState(30);
  const [extension, setExtension] = useState(25);
  const [rotation, setRotation] = useState(40);
  const [notes, setNotes] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dateStr = new Date().toISOString().split('T')[0];
    setTodayDateStr(dateStr);
    
    // Load today's log if it exists
    if (logs[dateStr]) {
      const todayLog = logs[dateStr];
      setPainLevel(todayLog.painLevel);
      setGripStrength(todayLog.gripStrength);
      setFlexion(todayLog.mobility.flexion);
      setExtension(todayLog.mobility.extension);
      setRotation(todayLog.mobility.rotation);
      setNotes(todayLog.notes);
    }
  }, [logs]);

  const handleSave = () => {
    if (!todayDateStr) return;
    
    addLogEntry(todayDateStr, {
      painLevel,
      gripStrength,
      mobility: {
        flexion,
        extension,
        rotation
      },
      notes
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  // Helper for pain severity color & text
  const getPainDescriptor = (level: number) => {
    if (level === 0) return { text: 'No Pain', color: 'text-secondary' };
    if (level <= 3) return { text: 'Mild', color: 'text-primary' };
    if (level <= 6) return { text: 'Moderate', color: 'text-warning' };
    if (level <= 9) return { text: 'Severe', color: 'text-danger' };
    return { text: 'Worst Imaginable', color: 'text-danger font-extrabold animate-pulse' };
  };

  if (!mounted) {
    return (
      <div className="bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm h-full animate-pulse">
        <div className="h-6 w-32 bg-slate-100 rounded-md mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
          <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
          <div className="h-24 w-full bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const painInfo = getPainDescriptor(painLevel);

  return (
    <div className="bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm hover:shadow-md smooth-transition flex flex-col justify-between h-full relative overflow-hidden">
      {/* Dynamic backdrop accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-text-main text-lg tracking-tight">Daily Progress Logging</h3>
            <p className="text-xs text-text-muted mt-0.5">Update metrics to track daily recovery</p>
          </div>
          <div className="bg-primary-light text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Today's Log
          </div>
        </div>

        <div className="space-y-6">
          {/* Pain Level 0-10 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                Pain Level
                <span className={`text-xs font-semibold ${painInfo.color}`}>
                  ({painInfo.text})
                </span>
              </label>
              <span className="text-sm font-black text-text-main bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                {painLevel}/10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={painLevel}
              onChange={(e) => setPainLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-text-light font-bold px-1 mt-1">
              <span>0 (None)</span>
              <span>5 (Mod)</span>
              <span>10 (Worst)</span>
            </div>
          </div>

          {/* Grip Strength Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-text-main">
                Grip Strength
              </label>
              <span className="text-sm font-black text-text-main bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                {gripStrength} kg
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={gripStrength}
              onChange={(e) => setGripStrength(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-secondary focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-text-light font-bold px-1 mt-1">
              <span>0 kg</span>
              <span>15 kg</span>
              <span>30 kg</span>
            </div>
          </div>

          {/* Wrist Mobility Degrees */}
          <div>
            <h4 className="text-xs font-black text-text-muted uppercase tracking-wider mb-3">Wrist Mobility Limits</h4>
            <div className="grid grid-cols-3 gap-3">
              {/* Flexion */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col items-center">
                <span className="text-[10px] font-bold text-text-muted mb-1">Flexion</span>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={flexion}
                  onChange={(e) => setFlexion(Math.min(90, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16 text-center font-black text-base text-text-main bg-white border border-slate-200 rounded-lg py-1 px-1 focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <span className="text-[9px] text-text-light font-medium mt-1">Goal: 0-90°</span>
              </div>

              {/* Extension */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col items-center">
                <span className="text-[10px] font-bold text-text-muted mb-1">Extension</span>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={extension}
                  onChange={(e) => setExtension(Math.min(70, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16 text-center font-black text-base text-text-main bg-white border border-slate-200 rounded-lg py-1 px-1 focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <span className="text-[9px] text-text-light font-medium mt-1">Goal: 0-70°</span>
              </div>

              {/* Rotation */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col items-center">
                <span className="text-[10px] font-bold text-text-muted mb-1">Rotation</span>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={rotation}
                  onChange={(e) => setRotation(Math.min(90, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16 text-center font-black text-base text-text-main bg-white border border-slate-200 rounded-lg py-1 px-1 focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <span className="text-[9px] text-text-light font-medium mt-1">Goal: 0-90°</span>
              </div>
            </div>
          </div>

          {/* Quick Notes */}
          <div>
            <label className="text-sm font-bold text-text-main block mb-2">
              Today's Recovery Note
            </label>
            <textarea
              placeholder="e.g. Swelling down, successfully completed all rotations..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-text-main focus:ring-1 focus:ring-primary focus:bg-white focus:outline-none resize-none transition-all placeholder:text-text-light"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50">
        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all duration-200 ${
            isSaved 
              ? 'bg-secondary text-white shadow-secondary/20 scale-[0.98]' 
              : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Metrics Log Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Daily Log</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
