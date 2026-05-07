export interface Server {
  id: number;
  name: string;
  hostname: string;
  port: number;
  protocol: 'http' | 'https' | 'tcp';
  status: 'online' | 'offline' | 'pending';
  response_time: number;
  last_check: string;
  created_at: string;
  updated_at: string;
}

export interface MonitorLog {
  id: number;
  server_id: number;
  status: string;
  response_time: number;
  error_message: string | null;
  created_at: string;
}

export interface ServerFormData {
  name: string;
  hostname: string;
  port: number;
  protocol: 'http' | 'https' | 'tcp';
}

export interface OverviewStats {
  total: number;
  online: number;
  offline: number;
  average_response_time: number;
  uptime_percentage: number;
}

export type PageType = 'dashboard' | 'servers' | 'settings';