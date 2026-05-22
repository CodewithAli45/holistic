'use client';

import { useEffect, useState } from 'react';
import { usePhysioStore } from '@/store/usePhysioStore';
import MetricCard from '@/components/Dashboard/MetricCard';
import QuickTracker from '@/components/Dashboard/QuickTracker';
import StatusIndicator from '@/components/Dashboard/StatusIndicator';
import ProgressChart from '@/components/Progress/ProgressChart';
import { 
  Heart, 
  Sparkles, 
  Activity, 
  Dumbbell, 
  PlusCircle, 
  TrendingUp, 
  Smile, 
  Sparkle
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { logs, recoveryStage } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [todayDateStr, setTodayDateStr] = useState('');
  
  // Stats
  const [painValue, setPainValue] = useState(3);
  const [gripValue, setGripValue] = useState(5);
  const [mobilityValue, setMobilityValue] = useState(0);

  useEffect(() => {
    setMounted(true);
    const dateStr = new Date().toISOString().split('T')[0];
    setTodayDateStr(dateStr);
  }, []);

  useEffect(() => {
    if (mounted && todayDateStr) {
      const todayLog = logs[todayDateStr];
      if (todayLog) {
        setPainValue(todayLog.painLevel);
        setGripValue(todayLog.gripStrength);
        
        // Average mobility percentage calculation (flexion/90 + extension/70 + rotation/90) / 3
        const flexRatio = todayLog.mobility.flexion / 90;
        const extRatio = todayLog.mobility.extension / 70;
        const rotRatio = todayLog.mobility.rotation / 90;
        const avg = Math.round(((flexRatio + extRatio + rotRatio) / 3) * 100);
        setMobilityValue(avg);
      } else {
        // Find most recent log for defaults
        const sorted = Object.values(logs).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (sorted.length > 0) {
          setPainValue(sorted[0].painLevel);
          setGripValue(sorted[0].gripStrength);
          
          const flexRatio = sorted[0].mobility.flexion / 90;
          const extRatio = sorted[0].mobility.extension / 70;
          const rotRatio = sorted[0].mobility.rotation / 90;
          const avg = Math.round(((flexRatio + extRatio + rotRatio) / 3) * 100);
          setMobilityValue(avg);
        }
      }
    }
  }, [mounted, logs, todayDateStr]);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-100 rounded-3xl"></div>
          <div className="h-32 bg-slate-100 rounded-3xl"></div>
          <div className="h-32 bg-slate-100 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Welcomer Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/50 border border-border-card rounded-3xl p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-text-main tracking-tight leading-none flex items-center gap-2">
            Welcome back, Ali! <Smile className="w-6 h-6 text-primary animate-bounce" />
          </h2>
          <p className="text-xs text-text-muted mt-1.5 font-semibold">
            Track and accelerate your wrist rehabilitation session for distal radius fracture.
          </p>
        </div>
        <Link
          href="/exercises"
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-1.5 shadow-md shadow-primary/10 self-start sm:self-center transition-all duration-200 cursor-pointer"
        >
          <Dumbbell className="w-4 h-4" />
          <span>Start Daily Exercises</span>
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="Current Pain Index"
          value={painValue}
          unit="/10"
          icon={<Heart className="w-5 h-5 fill-current" />}
          colorClass={painValue > 6 ? 'danger' : painValue > 3 ? 'warning' : 'secondary'}
          trend={{
            value: '-2 pts',
            label: 'vs last week',
            isPositive: true // lower pain is positive
          }}
        />

        <MetricCard
          title="Grip Strength"
          value={gripValue}
          unit="kg"
          icon={<Activity className="w-5 h-5" />}
          colorClass="secondary"
          trend={{
            value: '+1.5 kg',
            label: 'vs last week',
            isPositive: true
          }}
        />

        <MetricCard
          title="Average Joint Range"
          value={`${mobilityValue}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          colorClass="accent"
          trend={{
            value: '+8%',
            label: 'improvement',
            isPositive: true
          }}
        />
      </div>

      {/* Inputs and Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <QuickTracker />
        <StatusIndicator />
      </div>

      {/* Simplified Weekly progress visualization */}
      <ProgressChart />
    </div>
  );
}
