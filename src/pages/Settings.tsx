import Header from '@/components/Header';
import SelectModal from '@/components/SelectModal';
import { User, Bell, BellOff, Mail, Globe, Shield, Palette, Clock, Save, Eye, EyeOff, Monitor, Copy, ExternalLink, ChevronDown, Sparkles, Volume2, Zap, Check, Puzzle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useServerStore } from '@/store/serverStore';
import { useLanguageStore } from '@/store/languageStore';
import { getTimezones, getLanguages, LocaleKey } from '@/locales';
import type { ProfileSettings, NotificationSettings, GeneralSettings, NotificationConfig, PublicDisplaySettings } from '@/types';

export default function Settings() {
  const { t, locale, setLocale } = useLanguageStore();
  const {
    servers,
    publicSettings,
    updatePublicSettings,
    updateServer,
    profileSettings,
    updateProfileSettings,
    notificationSettings,
    updateNotificationSettings,
    generalSettings: storeGeneralSettings,
    updateGeneralSettings,
    notificationConfig,
    updateNotificationConfig,
  } = useServerStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'general' | 'security' | 'public' | 'notification-config' | 'plugins' | 'theme-manager'>('profile');
  const [pluginUploadModalOpen, setPluginUploadModalOpen] = useState(false);
  const [themeUploadModalOpen, setThemeUploadModalOpen] = useState(false);
  const [showLanguageToast, setShowLanguageToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [timezoneModalOpen, setTimezoneModalOpen] = useState(false);
  const [layoutModalOpen, setLayoutModalOpen] = useState(false);
  const [urlModalOpen, setUrlModalOpen] = useState(false);

  const [tempProfileSettings, setTempProfileSettings] = useState<ProfileSettings>({ ...profileSettings });
  const [tempNotificationSettings, setTempNotificationSettings] = useState<NotificationSettings>({ ...notificationSettings });
  const [tempGeneralSettings, setTempGeneralSettings] = useState<GeneralSettings>({ ...storeGeneralSettings });
  const [tempPublicSettings, setTempPublicSettings] = useState<PublicDisplaySettings>({ ...publicSettings });
  const [tempNotificationConfig, setTempNotificationConfig] = useState<NotificationConfig>({ ...notificationConfig });
  const [urlInputValue, setUrlInputValue] = useState('');

  useEffect(() => {
    setTempProfileSettings({ ...profileSettings });
    setTempNotificationSettings({ ...notificationSettings });
    setTempGeneralSettings({ ...storeGeneralSettings });
    setTempNotificationConfig({ ...notificationConfig });
  }, [profileSettings, notificationSettings, storeGeneralSettings, notificationConfig]);

  useEffect(() => {
    setTempPublicSettings({ ...publicSettings });
  }, [activeTab]);

  const themeOptions = [
    { value: 'light', label: '浅色模式' },
    { value: 'dark', label: '深色模式' },
  ];

  const languageOptions = getLanguages();
  const timezoneOptions = getTimezones();

  const layoutOptions = [
    { value: 'grid', label: '网格布局' },
    { value: 'list', label: '列表布局' },
  ];

  const tabs = [
    { id: 'profile' as const, label: t('settings.profile'), icon: User },
    { id: 'notifications' as const, label: t('settings.notifications'), icon: Bell },
    { id: 'notification-config' as const, label: t('settings.notificationConfig'), icon: Sparkles },
    { id: 'plugins' as const, label: t('settings.plugins'), icon: Puzzle },
    { id: 'theme-manager' as const, label: t('settings.themeManager'), icon: Palette },
    { id: 'general' as const, label: t('settings.general'), icon: Globe },
    { id: 'public' as const, label: t('settings.public'), icon: Monitor },
    { id: 'security' as const, label: t('settings.security'), icon: Shield },
  ];

  const handleSaveProfile = () => {
    updateProfileSettings(tempProfileSettings);
    alert(t('settings.settingsSaved'));
  };

  const handleSaveNotifications = () => {
    updateNotificationSettings(tempNotificationSettings);
    alert(t('settings.settingsSaved'));
  };

  const handleSaveGeneral = () => {
    updateGeneralSettings(tempGeneralSettings);
    alert(t('settings.settingsSaved'));
  };

  const handleSavePublic = () => {
    updatePublicSettings(tempPublicSettings);
    alert(t('settings.settingsSaved'));
  };

  const handleSaveNotificationConfig = () => {
    updateNotificationConfig(tempNotificationConfig);
    alert(t('settings.settingsSaved'));
  };

  const handleSaveSecurity = () => {
    alert(t('settings.settingsSaved'));
  };

  const handleSavePlugins = () => {
    alert(t('settings.settingsSaved'));
  };

  const handleSaveThemeManager = () => {
    alert(t('settings.settingsSaved'));
  };

  const handleCancelProfile = () => {
    setTempProfileSettings({ ...profileSettings });
  };

  const handleCancelNotifications = () => {
    setTempNotificationSettings({ ...notificationSettings });
  };

  const handleCancelGeneral = () => {
    setTempGeneralSettings({ ...storeGeneralSettings });
  };

  const handleCancelPublic = () => {
    setTempPublicSettings({ ...publicSettings });
  };

  const handleCancelNotificationConfig = () => {
    setTempNotificationConfig({ ...notificationConfig });
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/public`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditAvatar = () => {
    alert('头像编辑功能开发中');
  };

  const handleRefreshPlugins = () => {
    alert('插件刷新功能开发中');
  };

  const handleExportData = () => {
    alert('导出数据功能开发中');
  };

  const handleLanguageSelect = (value: string) => {
    setTempGeneralSettings({ ...tempGeneralSettings, language: value });
    setLocale(value as LocaleKey);
    setLanguageModalOpen(false);
    setShowLanguageToast(true);
    setTimeout(() => setShowLanguageToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Header title={t('nav.settings')} />

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
                <h3 className="text-lg font-bold text-gray-800">{t('settings.profile')}</h3>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <button
                      onClick={handleEditAvatar}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Palette className="w-4 h-4 text-indigo-500" />
                    </button>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">{tempProfileSettings.username}</p>
                    <p className="text-gray-500">{tempProfileSettings.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.username')}</label>
                    <input
                      type="text"
                      value={tempProfileSettings.username}
                      onChange={(e) => setTempProfileSettings({ ...tempProfileSettings, username: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.email')}</label>
                    <input
                      type="email"
                      value={tempProfileSettings.email}
                      onChange={(e) => setTempProfileSettings({ ...tempProfileSettings, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancelProfile}
                    className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">{t('settings.notifications')}</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{t('settings.emailNotification')}</p>
                        <p className="text-sm text-gray-500">{t('settings.emailNotificationDesc')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTempNotificationSettings({ ...tempNotificationSettings, email: !tempNotificationSettings.email })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        tempNotificationSettings.email ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        tempNotificationSettings.email ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{t('settings.webhookNotification')}</p>
                        <p className="text-sm text-gray-500">{t('settings.webhookNotificationDesc')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTempNotificationSettings({ ...tempNotificationSettings, webhook: !tempNotificationSettings.webhook })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        tempNotificationSettings.webhook ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        tempNotificationSettings.webhook ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                        {tempNotificationSettings.sound ? <Bell className="w-5 h-5 text-yellow-600" /> : <BellOff className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{t('settings.soundReminder')}</p>
                        <p className="text-sm text-gray-500">{t('settings.soundReminderDesc')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTempNotificationSettings({ ...tempNotificationSettings, sound: !tempNotificationSettings.sound })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        tempNotificationSettings.sound ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        tempNotificationSettings.sound ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{t('settings.dingtalkNotification')}</p>
                        <p className="text-sm text-gray-500">{t('settings.dingtalkNotificationDesc')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTempNotificationSettings({ ...tempNotificationSettings, dingtalk: !tempNotificationSettings.dingtalk })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        tempNotificationSettings.dingtalk ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        tempNotificationSettings.dingtalk ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{t('settings.wecomNotification')}</p>
                        <p className="text-sm text-gray-500">{t('settings.wecomNotificationDesc')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTempNotificationSettings({ ...tempNotificationSettings, wecom: !tempNotificationSettings.wecom })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        tempNotificationSettings.wecom ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        tempNotificationSettings.wecom ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {tempNotificationSettings.webhook && (
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.webhookUrl')}</label>
                    <input
                      type="url"
                      value={tempNotificationSettings.webhook_url}
                      onChange={(e) => setTempNotificationSettings({ ...tempNotificationSettings, webhook_url: e.target.value })}
                      placeholder="https://"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                )}

                {tempNotificationSettings.dingtalk && (
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.dingtalkWebhookUrl')}</label>
                    <input
                      type="url"
                      value={tempNotificationSettings.dingtalk_url}
                      onChange={(e) => setTempNotificationSettings({ ...tempNotificationSettings, dingtalk_url: e.target.value })}
                      placeholder="https://oapi.dingtalk.com/robot/send?access_token=..."
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                )}

                {tempNotificationSettings.wecom && (
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.wecomWebhookUrl')}</label>
                    <input
                      type="url"
                      value={tempNotificationSettings.wecom_url}
                      onChange={(e) => setTempNotificationSettings({ ...tempNotificationSettings, wecom_url: e.target.value })}
                      placeholder="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=..."
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancelNotifications}
                    className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSaveNotifications}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">{t('settings.general')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.theme')}</label>
                    <button
                      onClick={() => setThemeModalOpen(true)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{themeOptions.find(o => o.value === tempGeneralSettings.theme)?.label || tempGeneralSettings.theme}</span>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.language')}</label>
                    <button
                      onClick={() => setLanguageModalOpen(true)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{languageOptions.find(o => o.value === tempGeneralSettings.language)?.label || tempGeneralSettings.language}</span>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.timezone')}</label>
                    <button
                      onClick={() => setTimezoneModalOpen(true)}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{timezoneOptions.find(o => o.value === tempGeneralSettings.timezone)?.label || tempGeneralSettings.timezone}</span>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.checkInterval')}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tempGeneralSettings.check_interval}
                        onChange={(e) => setTempGeneralSettings({ ...tempGeneralSettings, check_interval: parseInt(e.target.value) || 60 })}
                        className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all pr-20"
                        min="1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{t('settings.seconds')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancelGeneral}
                    className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSaveGeneral}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'public' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">{t('settings.public')}</h3>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{t('settings.publicDisplayEnabled')}</p>
                      <p className="text-sm text-gray-500">{t('settings.publicDisplayEnabledDesc')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTempPublicSettings({ ...tempPublicSettings, is_enabled: !tempPublicSettings.is_enabled })}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      tempPublicSettings.is_enabled ? 'bg-pink-400/70' : 'bg-gray-300/70'
                    }`}
                  >
                    <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                      tempPublicSettings.is_enabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {tempPublicSettings.is_enabled && (
                  <>
                    <div className="p-4 rounded-xl bg-white/30">
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.publicAccessUrl')}</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setUrlInputValue(tempPublicSettings.public_url || `${window.location.origin}/public`);
                            setUrlModalOpen(true);
                          }}
                          className="flex-1 px-4 py-3 rounded-xl bg-white/50 border-none outline-none text-gray-700 hover:bg-white/80 transition-all text-left flex items-center justify-between cursor-pointer overflow-hidden"
                        >
                          <span className="truncate flex-1">{tempPublicSettings.public_url || `${window.location.origin}/public`}</span>
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                        </button>
                        <button
                          onClick={handleCopyUrl}
                          className="px-4 py-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all"
                          title={t('settings.copyLink')}
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
                          {t('settings.preview')}
                        </a>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{t('settings.publicUrlDesc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.refreshInterval')}</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={tempPublicSettings.refresh_interval}
                            onChange={(e) => setTempPublicSettings({ ...tempPublicSettings, refresh_interval: parseInt(e.target.value) || 30 })}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all pr-20"
                            min="5"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{t('settings.seconds')}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.layout')}</label>
                        <button
                          onClick={() => setLayoutModalOpen(true)}
                          className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span>{layoutOptions.find(o => o.value === (tempPublicSettings.layout || 'grid'))?.label || (tempPublicSettings.layout || 'grid')}</span>
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.pageTitle')}</label>
                        <input
                          type="text"
                          value={tempPublicSettings.title || ''}
                          onChange={(e) => setTempPublicSettings({ ...tempPublicSettings, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                          placeholder={t('settings.inputPageTitle')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.footerText')}</label>
                        <input
                          type="text"
                          value={tempPublicSettings.footer || ''}
                          onChange={(e) => setTempPublicSettings({ ...tempPublicSettings, footer: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                          placeholder={t('settings.inputFooterText')}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/30">
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.customCss')}</label>
                      <textarea
                        value={tempPublicSettings.custom_css || ''}
                        onChange={(e) => setTempPublicSettings({ ...tempPublicSettings, custom_css: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all font-mono text-sm"
                        placeholder={t('settings.inputCustomCss')}
                        rows={6}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                        <div>
                          <p className="font-medium text-gray-800">{t('settings.showStats')}</p>
                          <p className="text-sm text-gray-500">{t('settings.showStatsDesc')}</p>
                        </div>
                        <button
                          onClick={() => setTempPublicSettings({ ...tempPublicSettings, show_stats: !tempPublicSettings.show_stats })}
                          className={`relative w-14 h-8 rounded-full transition-all ${
                            tempPublicSettings.show_stats ? 'bg-pink-400/70' : 'bg-gray-300/70'
                          }`}
                        >
                          <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                            tempPublicSettings.show_stats ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                        <div>
                          <p className="font-medium text-gray-800">{t('settings.showChart')}</p>
                          <p className="text-sm text-gray-500">{t('settings.showChartDesc')}</p>
                        </div>
                        <button
                          onClick={() => setTempPublicSettings({ ...tempPublicSettings, show_chart: !tempPublicSettings.show_chart })}
                          className={`relative w-14 h-8 rounded-full transition-all ${
                            tempPublicSettings.show_chart ? 'bg-pink-400/70' : 'bg-gray-300/70'
                          }`}
                        >
                          <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                            tempPublicSettings.show_chart ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                        <div>
                          <p className="font-medium text-gray-800">{t('settings.privacyProtection')}</p>
                          <p className="text-sm text-gray-500">{t('settings.privacyProtectionDesc')}</p>
                        </div>
                        <button
                          onClick={() => setTempPublicSettings({ ...tempPublicSettings, privacy_protection: !tempPublicSettings.privacy_protection })}
                          className={`relative w-14 h-8 rounded-full transition-all ${
                            tempPublicSettings.privacy_protection ? 'bg-pink-400/70' : 'bg-gray-300/70'
                          }`}
                        >
                          <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                            tempPublicSettings.privacy_protection ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">{t('settings.selectPublicServers')}</label>
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

                    <div className="flex gap-3 pt-4 border-t border-white/20">
                      <button
                        onClick={handleCancelPublic}
                        className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                      >
                        {t('common.cancel')}
                      </button>
                      <button
                        onClick={handleSavePublic}
                        className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {t('settings.saveChanges')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">{t('settings.security')}</h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.currentPassword')}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.newPassword')}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.confirmNewPassword')}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all">
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSaveSecurity}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('settings.updatePassword')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notification-config' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">{t('settings.notificationConfig')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.offlineNotificationDelay')}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tempNotificationConfig.offline_delay}
                        onChange={(e) => setTempNotificationConfig({ ...tempNotificationConfig, offline_delay: parseInt(e.target.value) || 5 })}
                        className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all pr-20"
                        min="1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{t('settings.minutes')}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.repeatNotificationInterval')}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tempNotificationConfig.repeat_interval}
                        onChange={(e) => setTempNotificationConfig({ ...tempNotificationConfig, repeat_interval: parseInt(e.target.value) || 30 })}
                        className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all pr-20"
                        min="1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{t('settings.minutes')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div>
                      <p className="font-medium text-gray-800">{t('settings.sendRecoveryNotification')}</p>
                      <p className="text-sm text-gray-500">{t('settings.sendRecoveryNotificationDesc')}</p>
                    </div>
                    <button
                      onClick={() => setTempNotificationConfig({ ...tempNotificationConfig, send_recovery: !tempNotificationConfig.send_recovery })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        tempNotificationConfig.send_recovery ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        tempNotificationConfig.send_recovery ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div>
                      <p className="font-medium text-gray-800">{t('settings.sendDailySummary')}</p>
                      <p className="text-sm text-gray-500">{t('settings.sendDailySummaryDesc')}</p>
                    </div>
                    <button
                      onClick={() => setTempNotificationConfig({ ...tempNotificationConfig, send_daily: !tempNotificationConfig.send_daily })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        tempNotificationConfig.send_daily ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        tempNotificationConfig.send_daily ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                    <div>
                      <p className="font-medium text-gray-800">{t('settings.sendWeeklyReport')}</p>
                      <p className="text-sm text-gray-500">{t('settings.sendWeeklyReportDesc')}</p>
                    </div>
                    <button
                      onClick={() => setTempNotificationConfig({ ...tempNotificationConfig, send_weekly: !tempNotificationConfig.send_weekly })}
                      className={`relative w-14 h-8 rounded-full transition-all cursor-pointer ${
                        tempNotificationConfig.send_weekly ? 'bg-pink-400/70' : 'bg-gray-300/70'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                        tempNotificationConfig.send_weekly ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/30">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.notificationTemplate')}</label>
                  <textarea
                    value={tempNotificationConfig.template || ''}
                    onChange={(e) => setTempNotificationConfig({ ...tempNotificationConfig, template: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all font-mono text-sm"
                    placeholder={t('settings.notificationTemplatePlaceholder')}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancelNotificationConfig}
                    className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleSaveNotificationConfig}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'plugins' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">{t('settings.plugins')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-pink-400/70 to-rose-300/70 border border-pink-200/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{t('settings.websocketPlugin')}</h4>
                        <p className="text-sm text-white/80">{t('settings.websocketPluginDesc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-white/20 text-xs text-white">{t('settings.builtInPlugin')}</span>
                        <span className="text-xs text-white/60">{t('settings.cannotUninstall')}</span>
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
                      <span className="font-medium text-gray-800">{t('settings.pluginStore')}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{t('settings.pluginStoreDesc')}</p>
                    <button
                      onClick={() => alert(t('settings.betaTesting'))}
                      className="w-full py-3 rounded-xl bg-white/80 text-gray-700 font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      <Puzzle className="w-4 h-4" />
                      {t('settings.pluginStore')}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border border-blue-100/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-blue-500/80" />
                      <span className="font-medium text-gray-800">{t('settings.uploadPlugin')}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{t('settings.uploadPluginDesc')}</p>
                    <button
                      onClick={() => setPluginUploadModalOpen(true)}
                      className="w-full py-3 rounded-xl bg-white/80 text-gray-700 font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      {t('settings.selectPluginFile')}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleRefreshPlugins}
                    className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                  >
                    {t('settings.refreshPlugins')}
                  </button>
                  <button
                    onClick={handleSavePlugins}
                    className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'theme-manager' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">{t('settings.themeManager')}</h3>

                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-400/70 to-rose-300/70 border border-pink-200/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-lg">{t('settings.month')}</h4>
                      <p className="text-sm text-white/80">{t('settings.authorInfo', { author: 'LunarByte', version: '1.0.2' })}</p>
                      <p className="text-sm text-white/60 mt-1">{t('settings.currentUsingTheme')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border border-blue-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-5 h-5 text-blue-500/80" />
                    <span className="font-medium text-gray-800">{t('settings.uploadTheme')}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{t('settings.uploadThemeDesc')}</p>
                  <button
                    onClick={() => setThemeUploadModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-white/80 text-gray-700 font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {t('settings.selectThemeFile')}
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveThemeManager}
                    className="w-full py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('settings.applyTheme')}
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
        title={t('settings.selectTheme')}
        options={themeOptions}
        selectedValue={tempGeneralSettings.theme}
        onSelect={(value) => setTempGeneralSettings({ ...tempGeneralSettings, theme: value as 'light' | 'dark' })}
      />

      <SelectModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        title={t('settings.selectLanguage')}
        options={languageOptions}
        selectedValue={tempGeneralSettings.language}
        onSelect={handleLanguageSelect}
      />

      <SelectModal
        isOpen={timezoneModalOpen}
        onClose={() => setTimezoneModalOpen(false)}
        title={t('settings.selectTimezone')}
        options={timezoneOptions}
        selectedValue={tempGeneralSettings.timezone}
        onSelect={(value) => setTempGeneralSettings({ ...tempGeneralSettings, timezone: value })}
      />

      <SelectModal
        isOpen={layoutModalOpen}
        onClose={() => setLayoutModalOpen(false)}
        title={t('settings.selectLayout')}
        options={layoutOptions}
        selectedValue={tempPublicSettings.layout || 'grid'}
        onSelect={(value) => setTempPublicSettings({ ...tempPublicSettings, layout: value as 'grid' | 'list' })}
      />

      {pluginUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0" onClick={() => setPluginUploadModalOpen(false)} />
          <div className="relative glass rounded-3xl p-6 w-full max-w-md animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">{t('settings.uploadPlugin')}</h3>
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
                  <p className="font-medium text-gray-700 mb-1">{t('settings.clickSelectPluginFile')}</p>
                  <p className="text-sm text-gray-500">{t('settings.supportPlkFormat')}</p>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPluginUploadModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => {
                    alert(t('settings.pluginInstallDeveloping'));
                    setPluginUploadModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {t('settings.installPlugin')}
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
              <h3 className="text-xl font-bold text-gray-800">{t('settings.uploadTheme')}</h3>
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
                  <p className="font-medium text-gray-700 mb-1">{t('settings.clickSelectThemeFile')}</p>
                  <p className="text-sm text-gray-500">{t('settings.supportThkFormat')}</p>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setThemeUploadModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => {
                    alert(t('settings.themeInstallDeveloping'));
                    setThemeUploadModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {t('settings.installTheme')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {urlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal-backdrop absolute inset-0" onClick={() => setUrlModalOpen(false)} />
          <div className="relative glass rounded-3xl p-6 w-full max-w-md animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">{t('settings.publicAccessUrl')}</h3>
              <button
                onClick={() => setUrlModalOpen(false)}
                className="p-2 rounded-xl hover:bg-white/60 transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.inputPublicUrl')}</label>
                <input
                  type="url"
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                  placeholder={window.location.origin}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setUrlModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => {
                    setTempPublicSettings({ ...tempPublicSettings, public_url: urlInputValue });
                    setUrlModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {t('settings.saveChanges')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLanguageToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="glass rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400/70 to-emerald-300/70 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{t('settings.languageChanged')}</p>
              <p className="text-sm text-gray-500">{languageOptions.find(o => o.value === locale)?.label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
