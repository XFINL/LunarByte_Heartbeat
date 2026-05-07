import { Cpu, HardDrive, Wifi, Globe, Clock, Server, MapPin } from 'lucide-react';
import type { ProbeData } from '@/types';
import CountryFlag from './CountryFlag';

interface ProbeDataCardProps {
  data: ProbeData;
}

export default function ProbeDataCard({ data }: ProbeDataCardProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}天 ${hours}小时`;
    if (hours > 0) return `${hours}小时 ${mins}分钟`;
    return `${mins}分钟`;
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-green-500';
    if (usage < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getUsageBgColor = (usage: number) => {
    if (usage < 50) return 'bg-green-500';
    if (usage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-white/30">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-3 h-3 text-indigo-500" />
            <span className="text-xs text-gray-500">CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${getUsageColor(data.cpu_usage)}`}>
              {data.cpu_usage.toFixed(1)}%
            </span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getUsageBgColor(data.cpu_usage)} transition-all`}
                style={{ width: `${Math.min(data.cpu_usage, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">{data.cpu_cores}核 · {data.cpu_model.slice(0, 20)}</p>
        </div>

        <div className="p-2 rounded-lg bg-white/30">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-3 h-3 text-purple-500" />
            <span className="text-xs text-gray-500">内存</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${getUsageColor(data.memory_usage)}`}>
              {data.memory_usage.toFixed(1)}%
            </span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getUsageBgColor(data.memory_usage)} transition-all`}
                style={{ width: `${Math.min(data.memory_usage, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">{data.memory_used}MB / {data.memory_total}MB</p>
        </div>

        <div className="p-2 rounded-lg bg-white/30">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-gray-500">磁盘</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${getUsageColor(data.disk_usage)}`}>
              {data.disk_usage.toFixed(1)}%
            </span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getUsageBgColor(data.disk_usage)} transition-all`}
                style={{ width: `${Math.min(data.disk_usage, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">{data.disk_used} / {data.disk_total}</p>
        </div>

        <div className="p-2 rounded-lg bg-white/30">
          <div className="flex items-center gap-2 mb-1">
            <Wifi className="w-3 h-3 text-green-500" />
            <span className="text-xs text-gray-500">网络</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-green-600">↑ {formatBytes(data.network_tx)}</span>
            <span className="text-xs text-blue-600">↓ {formatBytes(data.network_rx)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">负载: {data.load_avg.join(' / ')}</p>
        </div>
      </div>

      {data.gpu_usage !== undefined && (
        <div className="p-2 rounded-lg bg-white/30">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-3 h-3 text-orange-500" />
            <span className="text-xs text-gray-500">GPU</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${getUsageColor(data.gpu_usage)}`}>
              {data.gpu_usage.toFixed(1)}%
            </span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getUsageBgColor(data.gpu_usage)} transition-all`}
                style={{ width: `${Math.min(data.gpu_usage, 100)}%` }}
              />
            </div>
          </div>
          {data.gpu_memory && <p className="text-xs text-gray-400 mt-1">显存: {data.gpu_memory}MB</p>}
        </div>
      )}

      <div className="p-2 rounded-lg bg-white/30">
        <div className="flex items-center gap-2 mb-1">
          <Server className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-500">系统信息</span>
        </div>
        <p className="text-xs text-gray-600">{data.os_name}</p>
        <p className="text-xs text-gray-400">{data.os_arch}</p>
      </div>

      {data.ip_location && (
        <div className="p-2 rounded-lg bg-white/30">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-red-500" />
            <span className="text-xs text-gray-500">IP位置</span>
          </div>
          <div className="flex items-center gap-2">
            <CountryFlag countryCode={data.ip_location.country} />
            <p className="text-xs text-gray-600">
              {data.ip_location.country} {data.ip_location.region} {data.ip_location.city}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            IP: {data.ip_location.ip} · ISP: {data.ip_location.isp}
          </p>
        </div>
      )}

      <div className="p-2 rounded-lg bg-white/30">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-500">运行时间</span>
          <span className="text-xs text-gray-700 font-medium ml-auto">{formatUptime(data.uptime)}</span>
        </div>
      </div>
    </div>
  );
}
