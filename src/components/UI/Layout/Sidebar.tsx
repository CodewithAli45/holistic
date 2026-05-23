'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Dumbbell, 
  CalendarRange, 
  LineChart, 
  FileText,
  Flame,
  HeartPulse
} from 'lucide-react';
import { usePhysioStore } from '@/store/usePhysioStore';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/exercises', label: 'Exercises', icon: Dumbbell },
  { href: '/routine', label: 'Daily Routine', icon: CalendarRange },
  { href: '/progress', label: 'Progress Details', icon: LineChart },
  { href: '/notes', label: 'Daily Notes', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const streak = usePhysioStore((state) => state.streak);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="w-64 glass-panel border-r border-border-card flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-border-card">
        <div className="bg-primary-light text-primary p-2.5 rounded-xl">
          <HeartPulse className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-text-main leading-tight tracking-tight">Flexi</h1>
          <p className="text-xs text-text-muted font-medium">Physiotherapy Tracker</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'text-text-muted hover:bg-slate-100 hover:text-text-main'
              }`}
            >
              <Icon className={`w-5 h-5 smooth-transition ${
                isActive ? 'text-white' : 'text-text-light group-hover:text-text-main'
              }`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Streak Display */}
      {mounted && (
        <div className="p-4 m-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
          <div className="bg-orange-500 text-white p-2.5 rounded-xl animate-bounce">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-orange-950">{streak} Day Streak!</h4>
            <p className="text-xs text-orange-700 font-medium">Keep moving daily</p>
          </div>
        </div>
      )}
    </aside>
  );
}
