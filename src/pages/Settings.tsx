import Header from '@/components/Header';
import { User, Bell, BellOff, Mail, Globe, Shield, Palette, Clock, Save, Eye, EyeOff, Monitor, Copy, ExternalLink } from 'lucide-react';
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
  const { servers, publicSettings, updatePublicSettings } = useServerStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'general' | 'security' | 'public'>('profile');
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

  const tabs = [
    { id: 'profile' as const, label: '个人资料', icon: User },
    { id: 'notifications' as const, label: '通知设置', icon: Bell },
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
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
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
                      className={`w-12 h-7 rounded-full transition-all ${
                        notificationSettings.email ? 'bg-indigo-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block w-6 h-6 rounded-full bg-white shadow transition-all ${
                        notificationSettings.email ? 'translate-x-5' : 'translate-x-0.5'
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
                      className={`w-12 h-7 rounded-full transition-all ${
                        notificationSettings.webhook ? 'bg-indigo-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block w-6 h-6 rounded-full bg-white shadow transition-all ${
                        notificationSettings.webhook ? 'translate-x-5' : 'translate-x-0.5'
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
                      className={`w-12 h-7 rounded-full transition-all ${
                        notificationSettings.sound ? 'bg-indigo-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block w-6 h-6 rounded-full bg-white shadow transition-all ${
                        notificationSettings.sound ? 'translate-x-5' : 'translate-x-0.5'
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
                    <select
                      value={generalSettings.theme}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, theme: e.target.value as 'light' | 'dark' })}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all appearance-none cursor-pointer"
                    >
                      <option value="light">浅色模式</option>
                      <option value="dark">深色模式</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">语言</label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all appearance-none cursor-pointer"
                    >
                      <option value="zh-CN">中文</option>
                      <option value="en-US">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">时区</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                    </select>
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
                    className={`w-12 h-7 rounded-full transition-all ${
                      publicSettings.is_enabled ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block w-6 h-6 rounded-full bg-white shadow transition-all ${
                      publicSettings.is_enabled ? 'translate-x-5' : 'translate-x-0.5'
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
                          className="px-4 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all flex items-center gap-2"
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
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                        <div>
                          <p className="font-medium text-gray-800">显示统计面板</p>
                          <p className="text-sm text-gray-500">在公共页面显示服务器统计信息</p>
                        </div>
                        <button
                          onClick={() => updatePublicSettings({ show_stats: !publicSettings.show_stats })}
                          className={`w-12 h-7 rounded-full transition-all ${
                            publicSettings.show_stats ? 'bg-indigo-500' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`inline-block w-6 h-6 rounded-full bg-white shadow transition-all ${
                            publicSettings.show_stats ? 'translate-x-5' : 'translate-x-0.5'
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
                          className={`w-12 h-7 rounded-full transition-all ${
                            publicSettings.show_chart ? 'bg-indigo-500' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`inline-block w-6 h-6 rounded-full bg-white shadow transition-all ${
                            publicSettings.show_chart ? 'translate-x-5' : 'translate-x-0.5'
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
                                <p className="text-sm text-gray-500">{server.hostname}:{server.port}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleServerPublic(server.id)}
                              className={`w-12 h-7 rounded-full transition-all ${
                                publicSettings.public_servers.includes(server.id) ? 'bg-indigo-500' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block w-6 h-6 rounded-full bg-white shadow transition-all ${
                                publicSettings.public_servers.includes(server.id) ? 'translate-x-5' : 'translate-x-0.5'
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
          </div>
        </div>
      </div>
    </div>
  );
}