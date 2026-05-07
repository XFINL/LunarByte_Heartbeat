import { LayoutDashboard, Server, Settings, Bell, Shield, Activity } from 'lucide-react';
import type { PageType } from '@/types';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navItems = [
  { id: 'dashboard' as PageType, icon: LayoutDashboard, label: '仪表盘' },
  { id: 'servers' as PageType, icon: Server, label: '服务器' },
  { id: 'settings' as PageType, icon: Settings, label: '设置' },
];

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-64 h-screen glass rounded-3xl m-4 p-6 flex flex-col fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">ServerPulse</h1>
          <p className="text-xs text-gray-500">服务器监测面板</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-white/60 hover:text-gray-800 transition-all duration-300">
          <Bell className="w-5 h-5" />
          <span className="font-medium">通知</span>
          <span className="ml-auto w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-white/60 hover:text-gray-800 transition-all duration-300">
          <Shield className="w-5 h-5" />
          <span className="font-medium">安全</span>
        </button>
      </div>
    </aside>
  );
}