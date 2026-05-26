'use client';

import { usePhysioStore } from '@/store/usePhysioStore';
import { 
  Palette, 
  Sparkles, 
  RotateCcw,
  Eye,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

const WEEKDAYS = [
  { name: 'Sunday', colorName: 'Soft Beige', hex: '#FAF6EE', tone: 'Calm & Warm' },
  { name: 'Monday', colorName: 'Light Cyan', hex: '#E6FCFF', tone: 'Fresh & Ice Blue' },
  { name: 'Tuesday', colorName: 'Light Pink', hex: '#FDF2F8', tone: 'Gentle Rose / Magenta' },
  { name: 'Wednesday', colorName: 'Warm Gold', hex: '#FFFDEB', tone: 'Sunny & Uplifting' },
  { name: 'Thursday', colorName: 'Lilac Mist', hex: '#FAF5FF', tone: 'Restful Lavender' },
  { name: 'Friday', colorName: 'Fresh Mint', hex: '#F0FDF4', tone: 'Calming Green' },
  { name: 'Saturday', colorName: 'Peach Cream', hex: '#FFF7ED', tone: 'Soft Peach Glow' }
];

export default function BgThemeSelector() {
  const { 
    dailyBgEnabled, 
    toggleDailyBg, 
    previewBgDay, 
    setPreviewBgDay 
  } = usePhysioStore();

  const todayIndex = new Date().getDay();
  const activeDayIndex = previewBgDay !== null ? previewBgDay : todayIndex;

  const handleDaySelect = (index: number) => {
    if (!dailyBgEnabled) return;
    setPreviewBgDay(index);
  };

  const handleReset = () => {
    setPreviewBgDay(null);
  };

  return (
    <div className="bg-white/50 border border-border-card rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header section with toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary-light text-primary p-2.5 rounded-xl">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-text-main tracking-tight leading-none">Weekly Color Atmosphere</h3>
            <p className="text-[11px] text-text-muted mt-1 font-semibold">
              Rotate through calming pastel light colors daily to refresh your recovery environment.
            </p>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-100/50 p-2.5 rounded-2xl border border-slate-100 self-start sm:self-center">
          <span className="text-xs font-bold text-text-muted pl-1.5 select-none">Daily Rotation</span>
          <button
            onClick={() => {
              toggleDailyBg();
              if (previewBgDay !== null) setPreviewBgDay(null);
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              dailyBgEnabled ? 'bg-primary' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                dailyBgEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        {WEEKDAYS.map((day, index) => {
          const isToday = index === todayIndex;
          const isSelected = index === activeDayIndex && dailyBgEnabled;
          const isPreviewing = previewBgDay === index && dailyBgEnabled;

          return (
            <button
              key={day.name}
              disabled={!dailyBgEnabled}
              onClick={() => handleDaySelect(index)}
              className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border text-center transition-all duration-200 group ${
                !dailyBgEnabled 
                  ? 'bg-slate-50/50 border-slate-100 opacity-60 cursor-not-allowed'
                  : isSelected
                    ? 'bg-white border-primary shadow-md scale-[1.03] ring-1 ring-primary/30'
                    : 'bg-white/40 border-border-card hover:bg-white hover:border-slate-300 hover:scale-[1.01] cursor-pointer'
              }`}
            >
              {/* Day Name */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">
                  {day.name.slice(0, 3)}
                </span>
                {isToday && (
                  <span className="block text-[8px] bg-primary-light text-primary font-black px-1.5 py-0.5 rounded-full uppercase leading-none mx-auto w-fit">
                    Today
                  </span>
                )}
              </div>

              {/* Color Bubble */}
              <div className="my-3 relative">
                <div 
                  className="w-10 h-10 rounded-full border border-slate-200 shadow-inner flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: day.hex }}
                >
                  {isToday && !isPreviewing && dailyBgEnabled && (
                    <CheckCircle2 className="w-5 h-5 text-primary-hover drop-shadow-sm" />
                  )}
                  {isPreviewing && (
                    <Eye className="w-5 h-5 text-slate-700 drop-shadow-sm" />
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-text-main leading-tight">{day.colorName}</p>
                <p className="text-[8px] text-text-muted leading-tight">{day.tone}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info & Reset Actions */}
      {dailyBgEnabled && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-text-muted font-medium">
            <CalendarDays className="w-4 h-4 text-primary" />
            {previewBgDay !== null ? (
              <span className="flex items-center gap-1">
                Previewing <strong className="text-text-main">{WEEKDAYS[previewBgDay].name}&apos;s</strong> atmosphere.
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Active atmosphere: <strong className="text-text-main">{WEEKDAYS[todayIndex].colorName}</strong> ({WEEKDAYS[todayIndex].name}).
              </span>
            )}
          </div>

          {previewBgDay !== null && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-hover bg-primary-light hover:bg-primary-light/80 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Today</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
