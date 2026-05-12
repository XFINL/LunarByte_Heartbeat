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
    | 'dns'
    | 'probe';
  status: 'online' | 'offline' | 'pending';
  response_time: number;
  last_check: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  heartbeat: HeartbeatRecord[];
  probe_data?: ProbeData;
  probe_secret?: string;
}

export interface ProbeData {
  cpu_usage: number;
  memory_usage: number;
  memory_total: number;
  memory_used: number;
  disk_usage: number;
  disk_total: string;
  disk_used: string;
  network_rx: number;
  network_tx: number;
  gpu_usage?: number;
  gpu_memory?: number;
  os_name: string;
  os_arch: string;
  cpu_cores: number;
  cpu_model: string;
  ip_location?: IPLocation;
  uptime: number;
  load_avg: [number, number, number];
}

export interface IPLocation {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  latitude?: number;
  longitude?: number;
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
    | 'dns'
    | 'probe';
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
  privacy_protection?: boolean;
  public_url?: string;
}

export interface ProfileSettings {
  username: string;
  email: string;
}

export interface NotificationSettings {
  email: boolean;
  webhook: boolean;
  sound: boolean;
  dingtalk: boolean;
  wecom: boolean;
  webhook_url?: string;
  dingtalk_url?: string;
  wecom_url?: string;
}

export interface GeneralSettings {
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  check_interval: number;
}

export interface NotificationConfig {
  offline_delay: number;
  repeat_interval: number;
  send_recovery: boolean;
  send_daily: boolean;
  send_weekly: boolean;
  template?: string;
}
