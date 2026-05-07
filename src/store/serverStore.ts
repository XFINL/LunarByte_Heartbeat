import { create } from 'zustand';
import type { Server, ServerFormData, OverviewStats, MonitorLog } from '@/types';

const mockServers: Server[] = [
  {
    id: 1,
    name: 'Production API',
    hostname: 'api.example.com',
    port: 443,
    protocol: 'https',
    status: 'online',
    response_time: 45,
    last_check: new Date().toISOString(),
    created_at: '2024-01-15T10:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Web Server',
    hostname: 'www.example.com',
    port: 443,
    protocol: 'https',
    status: 'online',
    response_time: 67,
    last_check: new Date().toISOString(),
    created_at: '2024-01-16T08:30:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Database Server',
    hostname: 'db.example.com',
    port: 5432,
    protocol: 'tcp',
    status: 'online',
    response_time: 23,
    last_check: new Date().toISOString(),
    created_at: '2024-01-17T14:20:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Redis Cache',
    hostname: 'redis.example.com',
    port: 6379,
    protocol: 'tcp',
    status: 'offline',
    response_time: 0,
    last_check: new Date(Date.now() - 300000).toISOString(),
    created_at: '2024-01-18T09:15:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'CDN Service',
    hostname: 'cdn.example.com',
    port: 443,
    protocol: 'https',
    status: 'online',
    response_time: 12,
    last_check: new Date().toISOString(),
    created_at: '2024-01-19T11:45:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Elasticsearch',
    hostname: 'es.example.com',
    port: 9200,
    protocol: 'http',
    status: 'pending',
    response_time: 0,
    last_check: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockLogs: MonitorLog[] = [
  { id: 1, server_id: 1, status: 'online', response_time: 45, error_message: null, created_at: new Date().toISOString() },
  { id: 2, server_id: 1, status: 'online', response_time: 52, error_message: null, created_at: new Date(Date.now() - 60000).toISOString() },
  { id: 3, server_id: 1, status: 'online', response_time: 38, error_message: null, created_at: new Date(Date.now() - 120000).toISOString() },
  { id: 4, server_id: 1, status: 'online', response_time: 41, error_message: null, created_at: new Date(Date.now() - 180000).toISOString() },
  { id: 5, server_id: 1, status: 'online', response_time: 49, error_message: null, created_at: new Date(Date.now() - 240000).toISOString() },
  { id: 6, server_id: 1, status: 'online', response_time: 55, error_message: null, created_at: new Date(Date.now() - 300000).toISOString() },
];

interface ServerStore {
  servers: Server[];
  logs: MonitorLog[];
  addServer: (data: ServerFormData) => void;
  updateServer: (id: number, data: Partial<ServerFormData>) => void;
  deleteServer: (id: number) => void;
  updateServerStatus: (id: number, status: Server['status'], response_time: number) => void;
  getStats: () => OverviewStats;
  getServerLogs: (serverId: number) => MonitorLog[];
}

export const useServerStore = create<ServerStore>((set, get) => ({
  servers: mockServers,
  logs: mockLogs,

  addServer: (data) => {
    const newServer: Server = {
      id: Date.now(),
      ...data,
      status: 'pending',
      response_time: 0,
      last_check: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((state) => ({ servers: [...state.servers, newServer] }));
  },

  updateServer: (id, data) => {
    set((state) => ({
      servers: state.servers.map((server) =>
        server.id === id
          ? { ...server, ...data, updated_at: new Date().toISOString() }
          : server
      ),
    }));
  },

  deleteServer: (id) => {
    set((state) => ({ servers: state.servers.filter((server) => server.id !== id) }));
  },

  updateServerStatus: (id, status, response_time) => {
    set((state) => ({
      servers: state.servers.map((server) =>
        server.id === id
          ? {
              ...server,
              status,
              response_time,
              last_check: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : server
      ),
    }));
  },

  getStats: () => {
    const { servers } = get();
    const total = servers.length;
    const online = servers.filter((s) => s.status === 'online').length;
    const offline = servers.filter((s) => s.status === 'offline').length;
    const onlineServers = servers.filter((s) => s.status === 'online');
    const avgResponseTime =
      onlineServers.length > 0
        ? Math.round(
            onlineServers.reduce((sum, s) => sum + s.response_time, 0) / onlineServers.length
          )
        : 0;
    const uptimePercentage = total > 0 ? Math.round((online / total) * 100) : 0;

    return { total, online, offline, average_response_time: avgResponseTime, uptime_percentage: uptimePercentage };
  },

  getServerLogs: (serverId) => {
    const { logs } = get();
    return logs.filter((log) => log.server_id === serverId);
  },
}));