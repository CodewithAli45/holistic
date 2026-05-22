'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Calendar, Award } from 'lucide-react';
import { usePhysioStore, RecoveryStage } from '@/store/usePhysioStore';

export default function Header() {
  const { recoveryStage, updateRecoveryStage, remindersEnabled, toggleReminders } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  useEffect(() => {
    setMounted(true);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDateStr(new Date().toLocaleDateString('en-US', options));
  }, []);

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateRecoveryStage(e.target.value as RecoveryStage);
  };

  const handleNotificationClick = () => {
    toggleReminders();
    setShowNotificationPopup(true);
    setTimeout(() => {
      setShowNotificationPopup(false);
    }, 3000);
  };

  if (!mounted) {
    return (
      <header className="h-20 bg-white border-b border-border-card px-8 flex items-center justify-between sticky top-0 z-30 w-full">
        <div className="h-6 w-48 bg-slate-100 rounded-md animate-pulse"></div>
        <div className="flex gap-4">
          <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-slate-100 rounded-lg animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-20 glass-panel border-b border-border-card px-8 flex items-center justify-between sticky top-0 z-30 w-full">
      {/* Date and Welcomer */}
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-primary" />
        <div>
          <span className="text-sm font-semibold text-text-muted">{currentDateStr}</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-6">
        {/* Recovery Stage Picker */}
        <div className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200/80 smooth-transition px-3 py-1.5 rounded-xl border border-slate-200">
          <Award className={`w-4 h-4 ${
            recoveryStage === 'Advanced' ? 'text-indigo-500' :
            recoveryStage === 'Mid' ? 'text-secondary' : 'text-primary'
          }`} />
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Recovery Stage</span>
            <select
              value={recoveryStage}
              onChange={handleStageChange}
              className="text-xs font-bold text-text-main bg-transparent border-none outline-none cursor-pointer pr-1 focus:ring-0"
            >
              <option value="Early">Early (Stiffness)</option>
              <option value="Mid">Mid (Mobility)</option>
              <option value="Advanced">Advanced (Strength)</option>
            </select>
          </div>
        </div>

        {/* Reminder Toggle Button (Mock) */}
        <div className="relative">
          <button
            onClick={handleNotificationClick}
            className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 cursor-pointer relative ${
              remindersEnabled 
                ? 'bg-primary-light text-primary border-primary/20' 
                : 'bg-slate-100 text-text-light border-slate-200'
            }`}
            title={remindersEnabled ? "Mute Reminders" : "Enable Reminders"}
          >
            {remindersEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            {remindersEnabled && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full animate-ping"></span>
            )}
          </button>
          
          {/* Toast style notification popover */}
          {showNotificationPopup && (
            <div className="absolute right-0 top-14 w-64 bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-3">
              <p className="font-bold flex items-center gap-2">
                {remindersEnabled ? "🔔 Reminders Activated!" : "🔕 Reminders Silenced!"}
              </p>
              <p className="text-[10px] text-slate-300 mt-1">
                {remindersEnabled 
                  ? "We'll nudge you for morning and evening routines." 
                  : "Daily notifications have been disabled."}
              </p>
            </div>
          )}
        </div>

        {/* Profile Card Mock */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-md shadow-primary/10">
            AM
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-bold text-text-main leading-tight">Ali Murtaza</span>
            <span className="text-[10px] text-secondary font-bold">Patient Portal</span>
          </div>
        </div>
      </div>
    </header>
  );
}
