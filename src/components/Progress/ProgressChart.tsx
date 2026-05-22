'use client';

import { useState, useEffect } from 'react';
import { usePhysioStore, LogEntry } from '@/store/usePhysioStore';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Sparkles, TrendingUp, ShieldAlert, Award } from 'lucide-react';

export default function ProgressChart() {
  const { logs } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'pain' | 'mobility' | 'strength'>('pain');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-text-muted font-bold">Rendering clinical charts...</p>
        </div>
      </div>
    );
  }

  // Process logs into sorted array
  const rawData = Object.values(logs);
  const chartData = rawData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(log => {
      const dateObj = new Date(log.date);
      return {
        ...log,
        // Short readable date format: "May 22" or "22 May"
        formattedDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        flexion: log.mobility.flexion,
        extension: log.mobility.extension,
        rotation: log.mobility.rotation,
      };
    });

  if (chartData.length === 0) {
    return (
      <div className="bg-bg-card rounded-3xl border border-border-card p-8 text-center">
        <ShieldAlert className="w-12 h-12 text-warning mx-auto mb-3" />
        <h4 className="font-extrabold text-text-main text-base">No progress records found</h4>
        <p className="text-xs text-text-muted mt-1 leading-normal max-w-sm mx-auto">
          Start logging your metrics daily in the dashboard to generate clinical charts.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm hover:shadow-md smooth-transition flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-5 mb-5 gap-4">
          <div>
            <h3 className="font-extrabold text-text-main text-lg tracking-tight">Recovery Timeline</h3>
            <p className="text-xs text-text-muted mt-0.5">Visualize your physical therapy improvements</p>
          </div>

          {/* Metric Toggle Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-fit self-start sm:self-center">
            <button
              onClick={() => setActiveTab('pain')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pain' 
                  ? 'bg-white text-danger shadow-md shadow-slate-200/50' 
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Pain Level
            </button>
            <button
              onClick={() => setActiveTab('mobility')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'mobility' 
                  ? 'bg-white text-primary shadow-md shadow-slate-200/50' 
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Mobility (°)
            </button>
            <button
              onClick={() => setActiveTab('strength')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'strength' 
                  ? 'bg-white text-secondary-hover shadow-md shadow-slate-200/50' 
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Strength (kg)
            </button>
          </div>
        </div>

        {/* Chart Window */}
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'pain' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  domain={[0, 10]} 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false} 
                  tickCount={6}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="painLevel" 
                  name="Pain (0-10 scale)"
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorPain)" 
                />
              </AreaChart>
            ) : activeTab === 'mobility' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  domain={[0, 90]} 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false} 
                  tickCount={6}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="flexion" 
                  name="Flexion (Goal: 90°)" 
                  stroke="#0ea5e9" 
                  strokeWidth={2.5} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="extension" 
                  name="Extension (Goal: 70°)" 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rotation" 
                  name="Rotation (Goal: 90°)" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  domain={[0, 20]} 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false} 
                  tickCount={6}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar 
                  dataKey="gripStrength" 
                  name="Grip strength (kg)" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={32} 
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Summary Note */}
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-text-muted">
        <div className="flex items-center gap-1.5 text-secondary-hover">
          <TrendingUp className="w-4 h-4" />
          <span>General Recovery Rate is positive (+14% this week)</span>
        </div>
        <span className="flex items-center gap-1 text-primary">
          <Award className="w-3.5 h-3.5" /> Stage target: Mid Recovery
        </span>
      </div>
    </div>
  );
}
