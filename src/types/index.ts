export interface Server {
  id: number;
  name: string;
  hostname: string;
  port: number;
  protocol: 
    | 'http' 
    | 'https' 
    | 'tcp' 
    | 'udp' 
    | 'icmp' 
    | 'ssh' 
    | 'ftp' 
    | 'sftp' 
    | 'smtp' 
    | 'pop3' 
    | 'imap' 
    | 'mysql' 
    | 'postgresql' 
    | 'mongodb' 
    | 'redis' 
    | 'dns';
  status: 'online' | 'offline' | 'pending';
  response_time: number;
  last_check: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  heartbeat: HeartbeatRecord[];
}

export interface HeartbeatRecord {
  timestamp: string;
  status: 'online' | 'offline' | 'pending' | null;
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
  protocol: 
    | 'http' 
    | 'https' 
    | 'tcp' 
    | 'udp' 
    | 'icmp' 
    | 'ssh' 
    | 'ftp' 
    | 'sftp' 
    | 'smtp' 
    | 'pop3' 
    | 'imap' 
    | 'mysql' 
    | 'postgresql' 
    | 'mongodb' 
    | 'redis' 
    | 'dns';
  isPublic?: boolean;
}

export interface OverviewStats {
  total: number;
  online: number;
  offline: number;
  average_response_time: number;
  uptime_percentage: number;
}

export type PageType = 'dashboard' | 'servers' | 'settings';

export interface PublicDisplaySettings {
  is_enabled: boolean;
  refresh_interval: number;
  show_stats: boolean;
  show_chart: boolean;
  public_servers: number[];
  title?: string;
  footer?: string;
  custom_css?: string;
  layout?: 'grid' | 'list';
}