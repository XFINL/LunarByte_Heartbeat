import { Search, User, ChevronDown, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Header({ title, onRefresh }: { title: string; onRefresh?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="glass rounded-2xl p-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">
          最后更新: {new Date().toLocaleString('zh-CN')}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索服务器..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-white/50 border-none outline-none text-sm w-64 focus:bg-white/80 transition-all"
          />
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white/50 hover:bg-white/80 transition-all hover:rotate-180 duration-500"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">管理员</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}