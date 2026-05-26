'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, BellOff, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePhysioStore, RecoveryStage } from '@/store/usePhysioStore';

export default function Header() {
  const { recoveryStage, updateRecoveryStage, remindersEnabled, toggleReminders } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [shortDateStr, setShortDateStr] = useState('');
  const [showShortDate, setShowShortDate] = useState(false);
  const [clockStr, setClockStr] = useState('');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Calendar Modal States
  const [showCalendar, setShowCalendar] = useState(false);
  const [calDate, setCalDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Set standard full date format
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setCurrentDateStr(today.toLocaleDateString('en-US', options));

    // Set short date format: dd/mm/yy
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    setShortDateStr(`${day}/${month}/${year}`);

    // Responsive and PWA date format checks
    const checkPwaAndMobile = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isMobileWidth = window.innerWidth < 768;
      setShowShortDate(isStandalone || isMobileWidth);
    };

    checkPwaAndMobile();
    window.addEventListener('resize', checkPwaAndMobile);

    // Digital clock update - HH:MM:SS format
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setClockStr(`${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const clockTimer = setInterval(updateClock, 1000);

    return () => {
      window.removeEventListener('resize', checkPwaAndMobile);
      clearInterval(clockTimer);
    };
  }, []);

  // Close calendar modal on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

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

  // Calendar Helpers
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1));
  };

  const today = new Date();
  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const daysGrid = [];
  for (let i = 0; i < firstDay; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekdayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  if (!mounted) {
    return (
      <header className="h-20 bg-white border-b border-border-card px-8 flex items-center justify-between sticky top-0 z-30 w-full relative">
        <div className="h-6 w-48 bg-slate-100 rounded-md animate-pulse"></div>
        <div className="flex gap-4">
          <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
          <div className="h-10 w-10 bg-slate-100 rounded-lg animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-20 glass-panel border-b border-border-card px-8 flex items-center justify-between sticky top-0 z-30 w-full relative">
      {/* Date and Welcomer Button */}
      <div className="relative" ref={calendarRef}>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/40 hover:bg-white border border-border-card text-text-main transition-all cursor-pointer font-bold text-xs md:text-sm select-none shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <Calendar className="w-4 h-4 text-primary" />
          <span>{showShortDate ? shortDateStr : currentDateStr}</span>
        </button>

        {/* Custom Calendar Modal */}
        {showCalendar && (
          <div className="absolute top-12 left-0 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-border-card p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-black text-text-main">
                {monthNames[calMonth]} {calYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-primary-light text-text-muted hover:text-primary rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-primary-light text-text-muted hover:text-primary rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-text-light py-2">
              {weekdayNames.map((name) => (
                <div key={name}>{name}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {daysGrid.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} />;
                }
                const isCalToday =
                  day === today.getDate() &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear();

                return (
                  <div
                    key={`day-${day}`}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${isCalToday
                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                        : 'text-text-main hover:bg-primary-light hover:text-primary cursor-pointer'
                      }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MacBook-style Digital Clock */}


      {/* Header Actions */}
      <div className="flex items-center gap-6">
        {/* Recovery Stage Picker */}
        <div className="flex items-center gap-2.5 bg-white/60 hover:bg-white smooth-transition px-3 py-1.5 rounded-xl border border-border-card">
          <Award className={`w-4 h-4 ${recoveryStage === 'Advanced' ? 'text-indigo-500' :
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
            className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 cursor-pointer relative ${remindersEnabled
                ? 'bg-primary-light text-primary border-primary/20'
                : 'bg-white/60 text-text-light border-border-card'
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
