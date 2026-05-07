import Header from '@/components/Header';
import SelectModal from '@/components/SelectModal';
import { User, Bell, BellOff, Mail, Globe, Shield, Palette, Clock, Save, Eye, EyeOff, Monitor, Copy, ExternalLink, ChevronDown, Sparkles, Volume2, Zap, Check, Puzzle, X } from 'lucide-react';
import { useState } from 'react';
import { useServerStore } from '@/store/serverStore';

interface NotificationSettings {
  email: boolean;
  webhook: boolean;
  sound: boolean;
  dingtalk: boolean;
  wecom: boolean;
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
  const [pluginUploadModalOpen, setPluginUploadModalOpen] = useState(false);
  const [themeUploadModalOpen, setThemeUploadModalOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    webhook: false,
    sound: true,
    dingtalk: false,
    wecom: false,
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
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
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
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
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
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        notificationSettings.sound ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        notificationSettings.sound ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">钉钉通知</p>
                        <p className="text-sm text-gray-500">通过钉钉机器人发送通知</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, dingtalk: !notificationSettings.dingtalk })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        notificationSettings.dingtalk ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        notificationSettings.dingtalk ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">企业微信通知</p>
                        <p className="text-sm text-gray-500">通过企业微信机器人发送通知</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, wecom: !notificationSettings.wecom })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        notificationSettings.wecom ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        notificationSettings.wecom ? 'left-7' : 'left-1'
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

                {notificationSettings.dingtalk && (
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">钉钉机器人Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://oapi.dingtalk.com/robot/send?access_token=..."
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                )}

                {notificationSettings.wecom && (
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">企业微信机器人Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=..."
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
                  <div className="p-4 rounded-xl bg-gradient-to-r from-pink-400/70 to-rose-300/70 border border-pink-200/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">WebSocket插件</h4>
                        <p className="text-sm text-white/80">实时推送服务器状态更新</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-white/20 text-xs text-white">内置插件</span>
                        <span className="text-xs text-white/60">无法卸载</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/80">v1.0.0</span>
                        <button className="relative w-14 h-8 rounded-full bg-white/30 cursor-not-allowed">
                          <span className="absolute top-1 w-6 h-6 rounded-full bg-white shadow left-7" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50/80 to-rose-50/80 border border-pink-100/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-pink-500/80" />
                      <span className="font-medium text-gray-800">插件商店</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">从官方插件商店发现并安装更多插件</p>
                    <button 
                      onClick={() => alert('内测中暂无资格')}
                      className="w-full py-3 rounded-xl bg-white/80 text-gray-700 font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      <Puzzle className="w-4 h-4" />
                      浏览插件商店
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border border-blue-100/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-blue-500/80" />
                      <span className="font-medium text-gray-800">上传插件</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">上传 .plk 格式的插件文件进行安装</p>
                    <button 
                      onClick={() => setPluginUploadModalOpen(true)}
                      className="w-full py-3 rounded-xl bg-white/80 text-gray-700 font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      选择插件文件
                    </button>
                  </div>
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

                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-400/70 to-rose-300/70 border border-pink-200/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-lg">月</h4>
                      <p className="text-sm text-white/80">作者: LunarByte · 版本: 1.0.2</p>
                      <p className="text-sm text-white/60 mt-1">当前使用主题</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border border-blue-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-5 h-5 text-blue-500/80" />
                    <span className="font-medium text-gray-800">上传主题</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">上传 .thk 格式的主题文件进行安装</p>
                  <button 
                    onClick={() => setThemeUploadModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-white/80 text-gray-700 font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    选择主题文件
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="w-full py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
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

      {pluginUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0" onClick={() => setPluginUploadModalOpen(false)} />
          <div className="relative glass rounded-3xl p-6 w-full max-w-md animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">上传插件</h3>
              <button
                onClick={() => setPluginUploadModalOpen(false)}
                className="p-2 rounded-xl hover:bg-white/60 transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-6 rounded-xl border-2 border-dashed border-pink-300/50 bg-pink-50/30 text-center">
                <input
                  type="file"
                  id="plugin-file"
                  accept=".plk"
                  className="hidden"
                />
                <label htmlFor="plugin-file" className="cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400/70 to-rose-300/70 flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-gray-700 mb-1">点击选择插件文件</p>
                  <p className="text-sm text-gray-500">支持 .plk 格式</p>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPluginUploadModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    alert('插件安装功能开发中');
                    setPluginUploadModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  安装插件
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {themeUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0" onClick={() => setThemeUploadModalOpen(false)} />
          <div className="relative glass rounded-3xl p-6 w-full max-w-md animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">上传主题</h3>
              <button
                onClick={() => setThemeUploadModalOpen(false)}
                className="p-2 rounded-xl hover:bg-white/60 transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-6 rounded-xl border-2 border-dashed border-blue-300/50 bg-blue-50/30 text-center">
                <input
                  type="file"
                  id="theme-file"
                  accept=".thk"
                  className="hidden"
                />
                <label htmlFor="theme-file" className="cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/70 to-cyan-300/70 flex items-center justify-center mx-auto mb-3">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-gray-700 mb-1">点击选择主题文件</p>
                  <p className="text-sm text-gray-500">支持 .thk 格式</p>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setThemeUploadModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    alert('主题安装功能开发中');
                    setThemeUploadModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  安装主题
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}