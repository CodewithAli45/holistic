'use client';

import { useState, useEffect } from 'react';
import { usePhysioStore, LogEntry } from '@/store/usePhysioStore';
import ProgressChart from '@/components/Progress/ProgressChart';
import { 
  LineChart as LineChartIcon, 
  Trash2, 
  RotateCcw, 
  ShieldAlert, 
  Calendar,
  Sparkles,
  Flame,
  Heart,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function ProgressPage() {
  const { logs, streak, resetAllData } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded-md"></div>
        <div className="h-64 bg-slate-100 rounded-3xl"></div>
      </div>
    );
  }

  // Sort logs by date descending for the table
  const sortedLogs = Object.values(logs).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleReset = () => {
    resetAllData();
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white/50 border border-border-card rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LineChartIcon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black text-text-main tracking-tight leading-none">Rehabilitation Dashboard & History</h2>
          </div>
          <p className="text-xs text-text-muted mt-1 font-semibold">
            Evaluate your long-term fracture recovery metrics, pain indices, joint stiffness limits, and grip strength.
          </p>
        </div>

        {/* Streak banner */}
        <div className="bg-orange-500 text-white px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-md shadow-orange-500/10">
          <Flame className="w-4 h-4 fill-current animate-bounce" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-orange-200 font-bold uppercase tracking-wider">Active Recovery</span>
            <span className="text-xs font-black">{streak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Main Charts Component */}
      <ProgressChart />

      {/* Historical Logs List */}
      <div className="bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 pb-5 mb-5">
          <div>
            <h3 className="font-extrabold text-text-main text-base tracking-tight">Clinical Recovery History Log</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Summary of all daily checked metrics</p>
          </div>
          
          <div className="bg-primary-light text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {sortedLogs.length} Records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-text-light font-black uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Pain Level</th>
                <th className="py-3 px-4">Grip Strength</th>
                <th className="py-3 px-4">Mobility limits (Flex / Ext / Rot)</th>
                <th className="py-3 px-4">Daily recovery notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-text-main">
              {sortedLogs.map((log) => (
                <tr key={log.date} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-text-muted flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{log.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      log.painLevel > 6 ? 'bg-danger-light text-danger' :
                      log.painLevel > 3 ? 'bg-amber-50 text-warning-dark' :
                      'bg-emerald-50 text-secondary-hover'
                    }`}>
                      <Heart className="w-3 h-3 fill-current" />
                      {log.painLevel} / 10
                    </span>
                  </td>
                  <td className="py-4 px-4 font-black">
                    <span className="inline-flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-secondary-hover" />
                      {log.gripStrength} kg
                    </span>
                  </td>
                  <td className="py-4 px-4 text-text-muted font-bold">
                    <span className="text-primary">{log.mobility.flexion}°</span> /{' '}
                    <span className="text-accent">{log.mobility.extension}°</span> /{' '}
                    <span className="text-secondary-hover">{log.mobility.rotation}°</span>
                  </td>
                  <td className="py-4 px-4 text-text-muted text-[11px] font-medium leading-relaxed max-w-[280px] truncate" title={log.notes}>
                    {log.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Actions Center */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-10 h-10 text-amber-500/80" />
          <div className="text-left">
            <h4 className="text-sm font-black text-slate-900 leading-tight">Data Management Console</h4>
            <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
              Reset state variables to clean up LocalStorage or reload clinical simulation logs.
            </p>
          </div>
        </div>

        <div>
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="bg-danger text-white hover:bg-danger/95 px-3 py-2 rounded-xl text-xs font-bold shadow-md shadow-danger/10 transition-all cursor-pointer"
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="bg-slate-200 text-text-main px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-danger px-4.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Portal Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
