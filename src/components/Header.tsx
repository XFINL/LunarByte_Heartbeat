import { Search, User, ChevronDown, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Header({ title, onRefresh }: { title: string; onRefresh?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="glass rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-500">
          最后更新: {new Date().toLocaleString('zh-CN')}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative flex-1 sm:flex-none">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索服务器..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 rounded-xl bg-white/50 border-none outline-none text-sm w-full sm:w-48 lg:w-64 focus:bg-white/80 transition-all"
          />
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white/50 hover:bg-white/80 transition-all hover:rotate-180 duration-500 flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        )}

        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200/50 flex-shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-gray-800">管理员</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}