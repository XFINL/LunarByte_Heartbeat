import Header from '@/components/Header';
import SelectModal from '@/components/SelectModal';
import { User, Bell, BellOff, Mail, Globe, Shield, Palette, Clock, Save, Eye, EyeOff, Monitor, Copy, ExternalLink, ChevronDown, Sparkles, Volume2, Zap, Check, Puzzle } from 'lucide-react';
import { useState } from 'react';
import { useServerStore } from '@/store/serverStore';

interface NotificationSettings {
  email: boolean;
  webhook: boolean;
  sound: boolean;
}

interface GeneralSettings {
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  checkInterval: number;
}

export default function Settings() {
  const { servers, publicSettings, updatePublicSettings, updateServer } = useServerStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'general' | 'security' | 'public' | 'notification-config' | 'plugins' | 'theme-manager'>('profile');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    webhook: false,
    sound: true,
  });
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    theme: 'light',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    checkInterval: 60,
  });
  const [copied, setCopied] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [timezoneModalOpen, setTimezoneModalOpen] = useState(false);
  const [layoutModalOpen, setLayoutModalOpen] = useState(false);

  const themeOptions = [
    { value: 'light', label: '浅色模式' },
    { value: 'dark', label: '深色模式' },
  ];

  const languageOptions = [
    { value: 'zh-CN', label: '中文' },
    { value: 'en-US', label: 'English' },
    { value: 'ja-JP', label: '日本語' },
  ];

  const timezoneOptions = [
    { value: 'Asia/Shanghai', label: 'Asia/Shanghai (UTC+8)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
    { value: 'Europe/London', label: 'Europe/London (UTC±0)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
  ];

  const layoutOptions = [
    { value: 'grid', label: '网格布局' },
    { value: 'list', label: '列表布局' },
  ];

  const tabs = [
    { id: 'profile' as const, label: '个人资料', icon: User },
    { id: 'notifications' as const, label: '通知设置', icon: Bell },
    { id: 'notification-config' as const, label: '通知配置', icon: Sparkles },
    { id: 'plugins' as const, label: '插件管理', icon: Puzzle },
    { id: 'theme-manager' as const, label: '主题管理', icon: Palette },
    { id: 'general' as const, label: '通用设置', icon: Globe },
    { id: 'public' as const, label: '公共显示', icon: Monitor },
    { id: 'security' as const, label: '安全', icon: Shield },
  ];

  const handleSave = () => {
    alert('设置已保存');
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/public`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleServerPublic = (serverId: number) => {
    const currentPublic = publicSettings.public_servers.includes(serverId);
    let newPublicServers: number[];
    if (currentPublic) {
      newPublicServers = publicSettings.public_servers.filter((id) => id !== serverId);
    } else {
      newPublicServers = [...publicSettings.public_servers, serverId];
    }
    updatePublicSettings({ public_servers: newPublicServers });
  };

  return (
    <div className="space-y-6">
      <Header title="设置" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-400/80 to-rose-300/80 text-white shadow-lg shadow-pink-200/30'
                      : 'text-gray-600 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="glass rounded-2xl p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">个人资料</h3>
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                      <Palette className="w-4 h-4 text-indigo-500" />
                    </button>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">管理员</p>
                    <p className="text-gray-500">admin@example.com</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                    <input
                      type="text"
                      defaultValue="管理员"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
                    <input
                      type="email"
                      defaultValue="admin@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all">
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    保存更改
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">通知设置</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">邮件通知</p>
                        <p className="text-sm text-gray-500">当服务器状态变化时发送邮件通知</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, email: !notificationSettings.email })}
                      className={`relative w-14 h-8 rounded-full transition-all ${
                        notificationSettings.email ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        notificationSettings.email ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Webhook通知</p>
                        <p className="text-sm text-gray-500">向指定URL发送状态变化通知</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, webhook: !notificationSettings.webhook })}
                      className={`relative w-14 h-8 rounded-full transition-all ${
                        notificationSettings.webhook ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        notificationSettings.webhook ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                        {notificationSettings.sound ? <Bell className="w-5 h-5 text-yellow-600" /> : <BellOff className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">声音提醒</p>
                        <p className="text-sm text-gray-500">当服务器离线时播放提示音</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, sound: !notificationSettings.sound })}
                      className={`relative w-14 h-8 rounded-full transition-all ${
                        notificationSettings.sound ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        notificationSettings.sound ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {notificationSettings.webhook && (
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all">
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    保存更改
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">通用设置</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">主题</label>
                    <button
                      onClick={() => setThemeModalOpen(true)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{themeOptions.find(o => o.value === generalSettings.theme)?.label || generalSettings.theme}</span>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">语言</label>
                    <button
                      onClick={() => setLanguageModalOpen(true)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{languageOptions.find(o => o.value === generalSettings.language)?.label || generalSettings.language}</span>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">时区</label>
                    <button
                      onClick={() => setTimezoneModalOpen(true)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{timezoneOptions.find(o => o.value === generalSettings.timezone)?.label || generalSettings.timezone}</span>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">检测间隔</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={generalSettings.checkInterval}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, checkInterval: parseInt(e.target.value) || 60 })}
                        className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all pr-20"
                        min="1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">秒</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all">
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    保存更改
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'public' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">公共显示设置</h3>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">启用公共显示</p>
                      <p className="text-sm text-gray-500">开启后，可通过公共链接访问服务器状态面板</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePublicSettings({ is_enabled: !publicSettings.is_enabled })}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      publicSettings.is_enabled ? 'bg-pink-400/70' : 'bg-gray-300/70'
                    }`}
                  >
                    <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                      publicSettings.is_enabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {publicSettings.is_enabled && (
                  <>
                    <div className="p-4 rounded-xl bg-white/30">
                      <label className="block text-sm font-medium text-gray-700 mb-2">公共访问地址</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          readOnly
                          value={`${window.location.origin}/public`}
                          className="flex-1 px-4 py-3 rounded-xl bg-white/50 border-none outline-none text-gray-700"
                        />
                        <button
                          onClick={handleCopyUrl}
                          className="px-4 py-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all"
                          title="复制链接"
                        >
                          {copied ? <Save className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-600" />}
                        </button>
                        <a
                          href="/public"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 rounded-xl bg-pink-400/80 text-white hover:bg-pink-500/80 transition-all flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          预览
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">刷新间隔</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={publicSettings.refresh_interval}
                            onChange={(e) => updatePublicSettings({ refresh_interval: parseInt(e.target.value) || 30 })}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all pr-20"
                            min="5"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">秒</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">布局方式</label>
                        <button
                          onClick={() => setLayoutModalOpen(true)}
                          className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span>{layoutOptions.find(o => o.value === (publicSettings.layout || 'grid'))?.label || (publicSettings.layout || 'grid')}</span>
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">页面标题</label>
                        <input
                          type="text"
                          value={publicSettings.title || ''}
                          onChange={(e) => updatePublicSettings({ title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                          placeholder="输入页面标题"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">页脚文本</label>
                        <input
                          type="text"
                          value={publicSettings.footer || ''}
                          onChange={(e) => updatePublicSettings({ footer: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                          placeholder="输入页脚文本"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/30">
                      <label className="block text-sm font-medium text-gray-700 mb-2">自定义 CSS</label>
                      <textarea
                        value={publicSettings.custom_css || ''}
                        onChange={(e) => updatePublicSettings({ custom_css: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all font-mono text-sm"
                        placeholder="输入自定义 CSS 样式..."
                        rows={6}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                        <div>
                          <p className="font-medium text-gray-800">显示统计面板</p>
                          <p className="text-sm text-gray-500">在公共页面显示服务器统计信息</p>
                        </div>
                        <button
                          onClick={() => updatePublicSettings({ show_stats: !publicSettings.show_stats })}
                          className={`relative w-14 h-8 rounded-full transition-all ${
                            publicSettings.show_stats ? 'bg-pink-400/70' : 'bg-gray-300/70'
                          }`}
                        >
                          <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                            publicSettings.show_stats ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                        <div>
                          <p className="font-medium text-gray-800">显示趋势图表</p>
                          <p className="text-sm text-gray-500">在公共页面显示响应时间趋势图表</p>
                        </div>
                        <button
                          onClick={() => updatePublicSettings({ show_chart: !publicSettings.show_chart })}
                          className={`relative w-14 h-8 rounded-full transition-all ${
                            publicSettings.show_chart ? 'bg-pink-400/70' : 'bg-gray-300/70'
                          }`}
                        >
                          <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                            publicSettings.show_chart ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">选择要公开的服务器</label>
                      <div className="space-y-2">
                        {servers.map((server) => (
                          <div
                            key={server.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                server.status === 'online' ? 'status-online' : 
                                server.status === 'offline' ? 'status-offline' : 'status-pending'
                              }`}>
                                {server.status === 'online' ? <Eye className="w-4 h-4 text-white" /> : 
                                 server.status === 'offline' ? <EyeOff className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-white" />}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{server.name}</p>
                                <p className="text-sm text-gray-500">{server.hostname}:{server.port} ({server.protocol})</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                updateServer(server.id, { is_public: !server.is_public });
                              }}
                              className={`relative w-14 h-8 rounded-full transition-all ${
                                server.is_public ? 'bg-pink-400/70' : 'bg-gray-300/70'
                              }`}
                            >
                              <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                                server.is_public ? 'left-7' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">安全设置</h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all">
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    更新密码
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notification-config' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">通知配置</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">离线通知延迟</label>
                    <div className="relative">
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all pr-20"
                        min="1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">分钟</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">重复通知间隔</label>
                    <div className="relative">
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all pr-20"
                        min="1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">分钟</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div>
                      <p className="font-medium text-gray-800">发送恢复通知</p>
                      <p className="text-sm text-gray-500">当服务器恢复在线时发送通知</p>
                    </div>
                    <button
                      className="relative w-14 h-8 rounded-full bg-pink-400/70 transition-all"
                    >
                      <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-7 transition-all" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div>
                      <p className="font-medium text-gray-800">发送每日摘要</p>
                      <p className="text-sm text-gray-500">每天发送服务器状态摘要邮件</p>
                    </div>
                    <button
                      className="relative w-14 h-8 rounded-full bg-gray-300/70 transition-all"
                    >
                      <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-1 transition-all" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div>
                      <p className="font-medium text-gray-800">发送每周报告</p>
                      <p className="text-sm text-gray-500">每周发送服务器性能报告</p>
                    </div>
                    <button
                      className="relative w-14 h-8 rounded-full bg-gray-300/70 transition-all"
                    >
                      <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-1 transition-all" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/30">
                  <label className="block text-sm font-medium text-gray-700 mb-2">通知模板</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all font-mono text-sm"
                    placeholder="服务器 {{name}} 状态变为 {{status}}"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all">
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    保存配置
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'plugins' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">插件管理</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/30 hover:bg-white/50 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400/70 to-rose-300/70 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">性能监控插件</h4>
                        <p className="text-sm text-gray-500">实时监控服务器性能指标</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-500">已启用</span>
                      <button className="relative w-14 h-8 rounded-full bg-pink-400/70 transition-all">
                        <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-7 transition-all" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/30 hover:bg-white/50 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/70 to-cyan-300/70 flex items-center justify-center">
                        <Volume2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">声音提醒插件</h4>
                        <p className="text-sm text-gray-500">服务器状态变化时播放提示音</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-500">已启用</span>
                      <button className="relative w-14 h-8 rounded-full bg-pink-400/70 transition-all">
                        <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-7 transition-all" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/30 hover:bg-white/50 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400/70 to-gray-300/70 flex items-center justify-center">
                        <Puzzle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Webhook插件</h4>
                        <p className="text-sm text-gray-500">向外部服务发送通知</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">已禁用</span>
                      <button className="relative w-14 h-8 rounded-full bg-gray-300/70 transition-all">
                        <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-1 transition-all" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/30 hover:bg-white/50 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/70 to-pink-300/70 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">高级图表插件</h4>
                        <p className="text-sm text-gray-500">提供更丰富的数据可视化</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">已禁用</span>
                      <button className="relative w-14 h-8 rounded-full bg-gray-300/70 transition-all">
                        <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-1 transition-all" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50/80 to-rose-50/80 border border-pink-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-pink-500/80" />
                    <span className="font-medium text-gray-800">插件市场</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">发现并安装更多插件来扩展功能</p>
                  <button className="w-full py-3 rounded-xl bg-white/80 text-gray-700 font-medium hover:bg-white transition-all flex items-center justify-center gap-2">
                    <Puzzle className="w-4 h-4" />
                    浏览插件市场
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all">
                    刷新插件
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    保存更改
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'theme-manager' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">主题管理</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 rounded-xl bg-gradient-to-br from-pink-400/70 to-rose-300/70 border-2 border-white shadow-lg shadow-pink-200/30 hover:scale-105 transition-all">
                    <div className="w-full h-16 rounded-xl bg-gradient-to-br from-pink-100/80 to-rose-100/80 mb-3" />
                    <p className="font-medium text-white text-sm">桃色主题</p>
                    <div className="mt-2 flex justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </button>

                  <button className="p-4 rounded-xl bg-white/50 border-2 border-transparent hover:border-gray-200 hover:bg-white/80 transition-all">
                    <div className="w-full h-16 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 mb-3" />
                    <p className="font-medium text-gray-700 text-sm">蓝色主题</p>
                  </button>

                  <button className="p-4 rounded-xl bg-white/50 border-2 border-transparent hover:border-gray-200 hover:bg-white/80 transition-all">
                    <div className="w-full h-16 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 mb-3" />
                    <p className="font-medium text-gray-700 text-sm">紫色主题</p>
                  </button>

                  <button className="p-4 rounded-xl bg-white/50 border-2 border-transparent hover:border-gray-200 hover:bg-white/80 transition-all">
                    <div className="w-full h-16 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 mb-3" />
                    <p className="font-medium text-gray-700 text-sm">绿色主题</p>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">主色调</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        defaultValue="#f472b6"
                        className="w-10 h-10 rounded-lg cursor-pointer border-none"
                      />
                      <input
                        type="text"
                        defaultValue="#f472b6"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/50 border-none outline-none text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">次色调</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        defaultValue="#f4a3b8"
                        className="w-10 h-10 rounded-lg cursor-pointer border-none"
                      />
                      <input
                        type="text"
                        defaultValue="#f4a3b8"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/50 border-none outline-none text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">背景色</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        defaultValue="#e0f4ff"
                        className="w-10 h-10 rounded-lg cursor-pointer border-none"
                      />
                      <input
                        type="text"
                        defaultValue="#e0f4ff"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/50 border-none outline-none text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div>
                      <p className="font-medium text-gray-800">圆角风格</p>
                      <p className="text-sm text-gray-500">使用高圆角设计</p>
                    </div>
                    <button
                      className="relative w-14 h-8 rounded-full bg-pink-400/70 transition-all"
                    >
                      <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-7 transition-all" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div>
                      <p className="font-medium text-gray-800">玻璃效果</p>
                      <p className="text-sm text-gray-500">启用毛玻璃背景效果</p>
                    </div>
                    <button
                      className="relative w-14 h-8 rounded-full bg-pink-400/70 transition-all"
                    >
                      <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-7 transition-all" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div>
                      <p className="font-medium text-gray-800">动画效果</p>
                      <p className="text-sm text-gray-500">启用页面过渡动画</p>
                    </div>
                    <button
                      className="relative w-14 h-8 rounded-full bg-gray-300/70 transition-all"
                    >
                      <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-1 transition-all" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all">
                    重置为默认
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    应用主题
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SelectModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        title="选择主题"
        options={themeOptions}
        selectedValue={generalSettings.theme}
        onSelect={(value) => setGeneralSettings({ ...generalSettings, theme: value as 'light' | 'dark' })}
      />

      <SelectModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        title="选择语言"
        options={languageOptions}
        selectedValue={generalSettings.language}
        onSelect={(value) => setGeneralSettings({ ...generalSettings, language: value })}
      />

      <SelectModal
        isOpen={timezoneModalOpen}
        onClose={() => setTimezoneModalOpen(false)}
        title="选择时区"
        options={timezoneOptions}
        selectedValue={generalSettings.timezone}
        onSelect={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
      />

      <SelectModal
        isOpen={layoutModalOpen}
        onClose={() => setLayoutModalOpen(false)}
        title="选择布局方式"
        options={layoutOptions}
        selectedValue={publicSettings.layout || 'grid'}
        onSelect={(value) => updatePublicSettings({ layout: value as 'grid' | 'list' })}
      />
    </div>
  );
}