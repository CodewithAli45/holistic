import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  trend?: {
    value: string | number;
    label: string;
    isPositive: boolean; // positive trend in recovery (e.g., lower pain is positive, higher strength is positive)
  };
  colorClass?: string;
  description?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  icon,
  trend,
  colorClass = 'primary',
  description
}: MetricCardProps) {
  // Map colorClass to theme classes
  const colorMap: Record<string, { bg: string; text: string; lightBg: string }> = {
    primary: {
      bg: 'bg-primary',
      text: 'text-primary',
      lightBg: 'bg-primary-light'
    },
    secondary: {
      bg: 'bg-secondary',
      text: 'text-secondary',
      lightBg: 'bg-secondary-light'
    },
    accent: {
      bg: 'bg-accent',
      text: 'text-accent',
      lightBg: 'bg-accent-light'
    },
    danger: {
      bg: 'bg-danger',
      text: 'text-danger',
      lightBg: 'bg-danger-light'
    },
    warning: {
      bg: 'bg-warning',
      text: 'text-warning',
      lightBg: 'bg-warning-light'
    }
  };

  const colors = colorMap[colorClass] || colorMap.primary;

  return (
    <div className="bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm hover:shadow-md smooth-transition flex flex-col justify-between h-full group relative overflow-hidden">
      {/* Background soft glow on hover */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-3xl opacity-0 group-hover:opacity-20 smooth-transition -mr-5 -mt-5 ${colors.bg}`}></div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-text-muted">{title}</span>
          <div className={`${colors.lightBg} ${colors.text} p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110`}>
            {icon}
          </div>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-text-main tracking-tight leading-none">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-text-light">{unit}</span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        {trend ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
              trend.isPositive 
                ? 'bg-secondary-light text-secondary-hover' 
                : 'bg-danger-light text-danger'
            }`}>
              {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend.value}
            </span>
            <span className="text-text-muted font-medium text-[11px]">{trend.label}</span>
          </div>
        ) : (
          <span className="text-xs text-text-light font-medium">{description || 'No recent change'}</span>
        )}
      </div>
    </div>
  );
}
