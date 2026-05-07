import { Server, Wifi, WifiOff, Loader, Clock, Activity, Globe, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useServerStore } from '@/store/serverStore';
import ResponseChart from '@/components/ResponseChart';
import HeartbeatDot from '@/components/HeartbeatDot';
import CountryFlag from '@/components/CountryFlag';

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
        if (server.protocol !== 'probe') {
          const isOnline = Math.random() > 0.1;
          updateServerStatus(server.id, isOnline ? 'online' : 'offline', Math.floor(Math.random() * 100) + 10);
        }
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
    if (days > 0) return `${days}天 ${hours}小时`;
    if (hours > 0) return `${hours}小时`;
    return `${Math.floor((seconds % 3600) / 60)}分钟`;
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-green-400';
    if (usage < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const pageTitle = publicSettings.title || '服务器监控';
  const footerText = publicSettings.footer || 'Powered by Server Monitor';
  const customCss = publicSettings.custom_css || '';
  const layout = publicSettings.layout || 'grid';

  if (!publicSettings.is_enabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-400">公共显示未启用</h1>
          <p className="text-gray-500 mt-2">请在后台设置中启用公共显示功能</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {customCss && <style>{customCss}</style>}
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{pageTitle}</h1>
          <p className="text-gray-400">
            更新于 {currentTime.toLocaleString('zh-CN')}
          </p>
        </header>

        {publicSettings.show_stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-pink-400/80" />
                <span className="text-gray-400 text-sm">总服务器</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">在线</span>
              </div>
              <p className="text-2xl font-bold text-green-400">{stats.online}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-gray-400 text-sm">离线</span>
              </div>
              <p className="text-2xl font-bold text-red-400">{stats.offline}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">平均响应</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{stats.average_response_time}ms</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">在线率</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">{stats.uptime_percentage}%</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`grid gap-4 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
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
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400/30 to-rose-300/30 flex items-center justify-center backdrop-blur-sm">
                          <Server className="w-6 h-6 text-pink-400/80" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{server.name}</h3>
                            {server.protocol === 'probe' && server.probe_data?.ip_location && (
                              <CountryFlag countryCode={server.probe_data.ip_location.country} />
                            )}
                          </div>
                          <p className="text-slate-400 text-sm">{server.hostname}:{server.port} ({server.protocol === 'probe' ? '探针' : server.protocol})</p>
                        </div>
                      </div>
                    </div>

                    {server.protocol === 'probe' && server.probe_data && (
                      <div className="mb-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white/5 rounded-lg p-2">
                            <div className="text-xs text-slate-400 mb-1">CPU</div>
                            <div className={`text-lg font-bold ${getUsageColor(server.probe_data.cpu_usage)}`}>
                              {server.probe_data.cpu_usage.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-500">{server.probe_data.cpu_cores}核</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <div className="text-xs text-slate-400 mb-1">内存</div>
                            <div className={`text-lg font-bold ${getUsageColor(server.probe_data.memory_usage)}`}>
                              {server.probe_data.memory_usage.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-500">{server.probe_data.memory_used}MB / {server.probe_data.memory_total}MB</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <div className="text-xs text-slate-400 mb-1">磁盘</div>
                            <div className={`text-lg font-bold ${getUsageColor(server.probe_data.disk_usage)}`}>
                              {server.probe_data.disk_usage.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-500">{server.probe_data.disk_used} / {server.probe_data.disk_total}</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <div className="text-xs text-slate-400 mb-1">网络</div>
                            <div className="text-sm">
                              <span className="text-green-400">↑{formatBytes(server.probe_data.network_tx)}</span>
                              <span className="text-blue-400 ml-2">↓{formatBytes(server.probe_data.network_rx)}</span>
                            </div>
                            <div className="text-xs text-slate-500">负载: {server.probe_data.load_avg.join('/')}</div>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">系统: {server.probe_data.os_name}</span>
                            <span className="text-slate-400">运行: {formatUptime(server.probe_data.uptime)}</span>
                          </div>
                        </div>

                        {server.probe_data.ip_location && (
                          <div className="bg-white/5 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-red-400" />
                              <span className="text-xs text-slate-300">
                                {server.probe_data.ip_location.city}, {server.probe_data.ip_location.region}, {server.probe_data.ip_location.country}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              ISP: {server.probe_data.ip_location.isp}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full ${statusConfig.class} flex items-center justify-center`}>
                          <StatusIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{statusConfig.label}</span>
                      </div>

                      {server.status === 'online' && server.protocol !== 'probe' && (
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-400">{server.response_time}</span>
                          <span className="text-slate-400 text-sm ml-1">ms</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-slate-400" />
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
                          <HeartbeatDot
                            key={`heartbeat-${server.id}-${index}`}
                            record={record}
                            index={index}
                            serverId={server.id}
                          />
                        ))}
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
            <ResponseChart logs={sampleLogs} darkMode={true} />
          )}
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          {footerText}
        </footer>
      </div>
    </div>
  );
}
