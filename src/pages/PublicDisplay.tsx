import { Server, Wifi, WifiOff, Loader, Clock, Activity, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useServerStore } from '@/store/serverStore';
import ResponseChart from '@/components/ResponseChart';
import HeartbeatDot from '@/components/HeartbeatDot';

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
                <Server className="w-4 h-4 text-indigo-400" />
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
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
                          <Server className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{server.name}</h3>
                          <p className="text-slate-400 text-sm">{server.hostname}:{server.port} ({server.protocol})</p>
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
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
              <h3 className="font-semibold text-white mb-4">响应时间趋势</h3>
              <ResponseChart logs={sampleLogs} />
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          {footerText}
        </footer>
      </div>
    </div>
  );
}
