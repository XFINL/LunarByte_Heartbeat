import Header from '@/components/Header';
import ServerCard from '@/components/ServerCard';
import Modal from '@/components/Modal';
import { Plus, Filter, Download } from 'lucide-react';
import { useState } from 'react';
import { useServerStore } from '@/store/serverStore';
import type { Server, ServerFormData } from '@/types';

type FilterType = 'all' | 'online' | 'offline' | 'pending';

export default function Servers() {
  const { servers, addServer, updateServer, deleteServer, getServerLogs } = useServerStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredServers = servers.filter((server) => {
    if (filter === 'all') return true;
    return server.status === filter;
  });

  const handleSave = (data: ServerFormData) => {
    if (editingServer) {
      updateServer(editingServer.id, data);
    } else {
      addServer(data);
    }
    setEditingServer(null);
  };

  const handleEdit = (server: Server) => {
    setEditingServer(server);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这个服务器吗？')) {
      deleteServer(id);
    }
  };

  const filterOptions: Array<{ value: FilterType; label: string }> = [
    { value: 'all', label: '全部' },
    { value: 'online', label: '在线' },
    { value: 'offline', label: '离线' },
    { value: 'pending', label: '检测中' },
  ];

  return (
    <div className="space-y-6">
      <Header title="服务器管理" />

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="pl-10 pr-8 py-2 rounded-xl bg-white/50 border-none outline-none text-sm focus:bg-white/80 transition-all appearance-none cursor-pointer"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === option.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/50 text-gray-600 hover:bg-white/80'
                  }`}
                >
                  {option.label}
                  <span className="ml-1.5 opacity-70">
                    {servers.filter((s) => option.value === 'all' || s.status === option.value).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-glass px-4 py-2 rounded-xl flex items-center gap-2 text-gray-600">
              <Download className="w-4 h-4" />
              导出数据
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加服务器
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServers.map((server) => (
          <ServerCard
            key={server.id}
            server={server}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredServers.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-gray-500">没有找到匹配的服务器</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingServer(null); }}
        onSave={handleSave}
        title={editingServer ? '编辑服务器' : '添加服务器'}
        server={editingServer}
      />
    </div>
  );
}