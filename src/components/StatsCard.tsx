import { Server, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import type { OverviewStats } from '@/types';

const statsConfig = [
  { key: 'total', label: '总服务器', icon: Server, color: 'from-blue-400 to-cyan-400' },
  { key: 'online', label: '在线', icon: CheckCircle, color: 'from-green-400 to-emerald-400' },
  { key: 'offline', label: '离线', icon: XCircle, color: 'from-red-400 to-pink-400' },
  { key: 'average_response_time', label: '平均响应', icon: Clock, color: 'from-yellow-400 to-orange-400' },
  { key: 'uptime_percentage', label: '在线率', icon: TrendingUp, color: 'from-purple-400 to-indigo-400' },
];

interface StatsCardProps {
  stats: OverviewStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statsConfig.map(({ key, label, icon: Icon, color }) => {
        const value = stats[key as keyof OverviewStats];
        const displayValue = key === 'average_response_time' ? `${value}ms` : 
                            key === 'uptime_percentage' ? `${value}%` : value;
        
        return (
          <div
            key={key}
            className="glass rounded-2xl p-4 animate-slide-in hover:scale-105 transition-transform"
            style={{ animationDelay: `${statsConfig.indexOf({ key, label, icon: Icon, color }) * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              {key === 'online' && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
              )}
            </div>
            <p className="text-2xl font-bold text-gray-800">{displayValue}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        );
      })}
    </div>
  );
}