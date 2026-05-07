import { Server, Wifi, WifiOff, Loader, Clock, Activity, Globe, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useServerStore } from '@/store/serverStore';
import ResponseChart from '@/components/ResponseChart';

export default function PublicDisplay() {
  const { publicSettings, getPublicServers, getServerLogs, getStats, updateServerStatus } = useServerStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!publicSettings.is_enabled) return;
    
    const refreshInterval = setInterval(() => {
      const servers = getPublicServers();
      servers.forEach((server) => {
        const isOnline = Math.random() > 0.1;
        updateServerStatus(server.id, isOnline ? 'online' : 'offline', Math.floor(Math.random() * 100) + 10);
      });
    }, publicSettings.refresh_interval * 1000);

    return () => clearInterval(refreshInterval);
  }, [publicSettings.is_enabled, publicSettings.refresh_interval, getPublicServers, updateServerStatus]);

  const publicServers = getPublicServers();
  const stats = getStats();
  const sampleLogs = publicServers.length > 0 ? getServerLogs(publicServers[0].id) : [];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return { label: '在线', class: 'status-online', icon: Wifi };
      case 'offline':
        return { label: '离线', class: 'status-offline', icon: WifiOff };
      case 'pending':
        return { label: '检测中', class: 'status-pending', icon: Loader };
      default:
        return { label: '未知', class: 'bg-gray-400', icon: Server };
    }
  };

  const getHeartbeatColor = (status: 'online' | 'offline' | 'pending' | null) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-purple-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">ServerPulse - 公共监控</h1>
                <p className="text-slate-400 text-sm">实时服务器状态监控面板</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl md:text-4xl font-mono font-bold text-indigo-400">
                {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
              </div>
              <div className="text-slate-400 text-sm">
                {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </div>
            </div>
          </div>
        </header>

        {publicSettings.show_stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-slate-400 text-sm">总服务器</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-400">{stats.online}</p>
              <p className="text-slate-400 text-sm">在线</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <WifiOff className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-red-400">{stats.offline}</p>
              <p className="text-slate-400 text-sm">离线</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-400">{stats.uptime_percentage}%</p>
              <p className="text-slate-400 text-sm">在线率</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-indigo-400" />
              服务器状态
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicServers.map((server) => {
                const statusConfig = getStatusConfig(server.status);
                const StatusIcon = statusConfig.icon;
                const heartbeatRecords = server.heartbeat;
                const totalSlots = 12;
                const emptySlots = totalSlots - heartbeatRecords.length;

                return (
                  <div
                    key={server.id}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
                          <Server className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{server.name}</h3>
                          <p className="text-slate-400 text-sm">{server.hostname}:{server.port}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full ${statusConfig.class} flex items-center justify-center`}>
                          <StatusIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{statusConfig.label}</span>
                      </div>

                      {server.status === 'online' && (
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-400">{server.response_time}</span>
                          <span className="text-slate-400 text-sm ml-1">ms</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 text-sm">心跳记录</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: emptySlots }).map((_, i) => (
                          <div
                            key={`empty-${server.id}-${i}`}
                            className="w-3 h-3 rounded-full bg-purple-400 opacity-60"
                            title="服务器未添加"
                          />
                        ))}
                        {heartbeatRecords.map((record, index) => (
                          <div
                            key={`heartbeat-${server.id}-${index}`}
                            className={`w-3 h-3 rounded-full ${getHeartbeatColor(record.status)} transition-all hover:scale-150`}
                            title={record.timestamp ? new Date(record.timestamp).toLocaleTimeString('zh-CN') : '未检测'}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-slate-400">在线</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-xs text-slate-400">离线</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          <span className="text-xs text-slate-400">未检测</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>最后检测: {server.last_check ? new Date(server.last_check).toLocaleTimeString('zh-CN') : '从未检测'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {publicSettings.show_chart && publicServers.length > 0 && (
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-400" />
                响应时间趋势
              </h2>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                <canvas
                  ref={(canvas) => {
                    if (!canvas) return;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    const dpr = window.devicePixelRatio || 1;
                    const rect = canvas.getBoundingClientRect();
                    canvas.width = rect.width * dpr;
                    canvas.height = rect.height * dpr;
                    ctx.scale(dpr, dpr);

                    const width = rect.width;
                    const height = rect.height;
                    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
                    const chartWidth = width - padding.left - padding.right;
                    const chartHeight = height - padding.top - padding.bottom;

                    ctx.clearRect(0, 0, width, height);

                    const values = sampleLogs.map((log) => log.response_time);
                    const maxValue = Math.max(...values, 100);
                    const minValue = Math.min(...values, 0);
                    const range = maxValue - minValue || 1;

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.lineWidth = 1;
                    for (let i = 0; i <= 4; i++) {
                      const y = padding.top + (chartHeight / 4) * i;
                      ctx.beginPath();
                      ctx.moveTo(padding.left, y);
                      ctx.lineTo(width - padding.right, y);
                      ctx.stroke();

                      const value = maxValue - (range / 4) * i;
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                      ctx.font = '10px sans-serif';
                      ctx.textAlign = 'right';
                      ctx.fillText(`${Math.round(value)}ms`, padding.left - 8, y + 3);
                    }

                    if (sampleLogs.length > 0) {
                      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
                      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
                      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

                      ctx.beginPath();
                      ctx.moveTo(padding.left, height - padding.bottom);

                      sampleLogs.forEach((log, index) => {
                        const x = padding.left + (chartWidth / (sampleLogs.length - 1)) * index;
                        const y = padding.top + chartHeight - ((log.response_time - minValue) / range) * chartHeight;
                        if (index === 0) {
                          ctx.lineTo(x, y);
                        } else {
                          ctx.lineTo(x, y);
                        }
                      });

                      ctx.lineTo(padding.left + chartWidth, height - padding.bottom);
                      ctx.closePath();
                      ctx.fillStyle = gradient;
                      ctx.fill();

                      ctx.beginPath();
                      sampleLogs.forEach((log, index) => {
                        const x = padding.left + (chartWidth / (sampleLogs.length - 1)) * index;
                        const y = padding.top + chartHeight - ((log.response_time - minValue) / range) * chartHeight;
                        if (index === 0) {
                          ctx.moveTo(x, y);
                        } else {
                          ctx.lineTo(x, y);
                        }
                      });
                      ctx.strokeStyle = '#6366f1';
                      ctx.lineWidth = 2;
                      ctx.stroke();

                      sampleLogs.forEach((log, index) => {
                        const x = padding.left + (chartWidth / (sampleLogs.length - 1)) * index;
                        const y = padding.top + chartHeight - ((log.response_time - minValue) / range) * chartHeight;
                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, Math.PI * 2);
                        ctx.fillStyle = '#6366f1';
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = '#fff';
                        ctx.fill();
                      });
                    }

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    sampleLogs.forEach((log, index) => {
                      const x = padding.left + (chartWidth / (sampleLogs.length - 1)) * index;
                      const time = new Date(log.created_at);
                      const label = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
                      ctx.fillText(label, x, height - 10);
                    });
                  }}
                  className="w-full h-48"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}