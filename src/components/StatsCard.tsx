import { Server, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import type { OverviewStats } from '@/types';
import { useLanguageStore } from '@/store/languageStore';

const statsConfig = [
  { key: 'total', icon: Server, color: 'from-pink-400/70 to-rose-300/70', labelKey: 'dashboard.totalServers' },
  { key: 'online', icon: CheckCircle, color: 'from-green-400/70 to-emerald-300/70', labelKey: 'dashboard.online' },
  { key: 'offline', icon: XCircle, color: 'from-red-400/70 to-pink-300/70', labelKey: 'dashboard.offline' },
  { key: 'average_response_time', icon: Clock, color: 'from-yellow-400/70 to-orange-300/70', labelKey: 'dashboard.averageResponse' },
  { key: 'uptime_percentage', icon: TrendingUp, color: 'from-pink-400/70 to-rose-300/70', labelKey: 'dashboard.uptimeRate' },
];

interface StatsCardProps {
  stats: OverviewStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const { t } = useLanguageStore();
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {statsConfig.map(({ key, icon: Icon, color, labelKey }) => {
        const value = stats[key as keyof OverviewStats];
        const label = t(labelKey);
        const displayValue = key === 'average_response_time' ? `${value}ms` : 
                            key === 'uptime_percentage' ? `${value}%` : value;
        
        return (
          <div
            key={key}
            className="glass rounded-2xl p-3 sm:p-4 animate-slide-in hover:scale-105 transition-transform"
            style={{ animationDelay: `${statsConfig.indexOf({ key, icon: Icon, color, labelKey }) * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              {key === 'online' && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
              )}
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{displayValue}</p>
            <p className="text-xs sm:text-sm text-gray-500">{label}</p>
          </div>
        );
      })}
    </div>
  );
}