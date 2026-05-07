import { useState, useEffect, useRef } from 'react';
import type { HeartbeatRecord } from '@/types';

interface HeartbeatDotProps {
  record: HeartbeatRecord;
  index: number;
  serverId: number;
}

export default function HeartbeatDot({ record, index, serverId }: HeartbeatDotProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);

  const getColor = (status: 'online' | 'offline' | 'pending' | null) => {
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

  const formatTime = (timestamp: string) => {
    if (!timestamp) return '未检测';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusText = (status: 'online' | 'offline' | 'pending' | null) => {
    switch (status) {
      case 'online':
        return '在线';
      case 'offline':
        return '离线';
      case 'pending':
        return '检测中';
      default:
        return '未检测';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dotRef.current && !dotRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="relative" ref={dotRef}>
      <div
        className={`w-3 h-3 rounded-full ${getColor(record.status)} transition-all hover:scale-150 cursor-pointer`}
        onClick={() => setShowTooltip(!showTooltip)}
      />
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-slide-in">
          <div className="glass rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
            <div className="font-medium text-gray-800">{formatTime(record.timestamp)}</div>
            <div className="text-gray-500">{getStatusText(record.status)}</div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-white/80 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}
