'use client';

import { useState, useEffect } from 'react';
import { usePhysioStore } from '@/store/usePhysioStore';
import { exercisesData } from '@/data/exercisesData';
import { Flame, Compass, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function StatusIndicator() {
  const { logs, streak, recoveryStage } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const dateStr = new Date().toISOString().split('T')[0];
    const todayLog = logs[dateStr];
    
    if (todayLog && todayLog.exercisesCompleted) {
      const completed = todayLog.exercisesCompleted.length;
      const total = exercisesData.length;
      setCompletedCount(completed);
      setCompletionPercentage(Math.round((completed / total) * 100));
    } else {
      setCompletedCount(0);
      setCompletionPercentage(0);
    }
  }, [logs]);

  // Stage description mapper
  const getStageDetails = (stage: string) => {
    switch (stage) {
      case 'Early':
        return {
          title: 'Early Stage (Weeks 1-4)',
          focus: 'Reduce swelling & stiffness, regain gentle active range of motion.',
          color: 'from-sky-400 to-primary',
          bgLight: 'bg-sky-50 border-sky-100',
          text: 'text-primary'
        };
      case 'Advanced':
        return {
          title: 'Advanced Stage (Weeks 8+)',
          focus: 'Load-bearing recovery, resistance training, full functional strength.',
          color: 'from-accent to-indigo-600',
          bgLight: 'bg-indigo-50 border-indigo-100',
          text: 'text-accent'
        };
      case 'Mid':
      default:
        return {
          title: 'Mid Stage (Weeks 4-8)',
          focus: 'Active stretching, moderate wrist mobility & early strength restoration.',
          color: 'from-emerald-400 to-secondary',
          bgLight: 'bg-emerald-50 border-emerald-100',
          text: 'text-secondary-hover'
        };
    }
  };

  if (!mounted) {
    return (
      <div className="bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm h-full animate-pulse">
        <div className="h-6 w-32 bg-slate-100 rounded-md mb-6"></div>
        <div className="space-y-4">
          <div className="h-20 w-full bg-slate-100 rounded-lg"></div>
          <div className="h-20 w-full bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const stageInfo = getStageDetails(recoveryStage);
  const totalCount = exercisesData.length;

  return (
    <div className="bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm hover:shadow-md smooth-transition flex flex-col justify-between h-full relative overflow-hidden group">
      <div>
        <h3 className="font-extrabold text-text-main text-lg tracking-tight mb-5">Recovery Insights</h3>

        {/* Circular Progress & Completion rate */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3.5">
            {/* SVG Circle Progress */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-slate-200 fill-none"
                  strokeWidth="5"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-primary fill-none transition-all duration-500 ease-out"
                  strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - completionPercentage / 100)}`}
                />
              </svg>
              <span className="absolute text-xs font-black text-text-main">{completionPercentage}%</span>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-text-main leading-snug">Routine Progress</h4>
              <p className="text-xs text-text-muted mt-0.5">
                {completedCount} of {totalCount} exercises done today
              </p>
            </div>
          </div>

          {completionPercentage === 100 && (
            <div className="bg-secondary-light text-secondary-hover p-2 rounded-xl animate-bounce">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Streak Flame Alert */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-4 mb-5">
          <div className="bg-orange-500 text-white p-2.5 rounded-xl animate-pulse">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-black text-orange-950">{streak} Days Streak</h4>
              <span className="text-[9px] bg-orange-200 text-orange-900 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Hot
              </span>
            </div>
            <p className="text-xs text-orange-700 font-semibold mt-0.5">
              Consistent exercise accelerates fracture healing by up to 30%.
            </p>
          </div>
        </div>

        {/* Recovery Stage Status */}
        <div className={`border rounded-2xl p-4 bg-gradient-to-br ${stageInfo.bgLight}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <Compass className={`w-4 h-4 ${stageInfo.text}`} />
            <h4 className={`text-xs font-black uppercase tracking-wider ${stageInfo.text}`}>
              Current Phase: {recoveryStage}
            </h4>
          </div>
          <p className="text-xs text-text-main font-bold leading-snug mb-1">
            {stageInfo.title}
          </p>
          <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
            {stageInfo.focus}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-text-muted font-bold">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-secondary-hover" /> 
          Recovery Tracked
        </span>
        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
          FlexiRecover v1.0
        </span>
      </div>
    </div>
  );
}
