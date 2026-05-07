import { Server, Clock, Wifi, WifiOff, Loader, MoreVertical } from 'lucide-react';
import type { Server as ServerType } from '@/types';
import { useState } from 'react';

interface ServerCardProps {
  server: ServerType;
  onEdit: (server: ServerType) => void;
  onDelete: (id: number) => void;
}

export default function ServerCard({ server, onEdit, onDelete }: ServerCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusConfig = () => {
    switch (server.status) {
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

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const formatTime = (dateString: string) => {
    if (!dateString) return '从未检测';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Server className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{server.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{server.hostname}:{server.port}</p>
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl hover:bg-white/60 transition-all"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-36 glass rounded-xl py-2 z-10 shadow-xl animate-slide-in">
              <button
                onClick={() => { onEdit(server); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-white/60 transition-all"
              >
                编辑
              </button>
              <button
                onClick={() => { onDelete(server.id); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-all"
              >
                删除
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${statusConfig.class} flex items-center justify-center`}>
            <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">{statusConfig.label}</span>
        </div>

        {server.status === 'online' && (
          <div className="flex items-center gap-1 text-green-600">
            <span className="text-base sm:text-lg font-bold">{server.response_time}</span>
            <span className="text-xs sm:text-sm">ms</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200/50 flex items-center gap-2 text-xs text-gray-500">
        <Clock className="w-3 h-3 flex-shrink-0" />
        <span className="truncate">最后检测: {formatTime(server.last_check)}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {server.protocol.toUpperCase()}
        </span>
      </div>
    </div>
  );
}