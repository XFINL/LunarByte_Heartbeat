import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import ServerCard from '@/components/ServerCard';
import ResponseChart from '@/components/ResponseChart';
import Modal from '@/components/Modal';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useServerStore } from '@/store/serverStore';
import type { Server, ServerFormData } from '@/types';

export default function Dashboard() {
  const { servers, getStats, addServer, updateServer, deleteServer, updateServerStatus, getServerLogs } = useServerStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);

  const stats = getStats();
  const sampleLogs = getServerLogs(1);

  const handleRefresh = () => {
    servers.forEach((server) => {
      if (server.status === 'pending') {
        const isOnline = Math.random() > 0.3;
        updateServerStatus(server.id, isOnline ? 'online' : 'offline', Math.floor(Math.random() * 100) + 10);
      } else {
        const isOnline = Math.random() > 0.1;
        updateServerStatus(server.id, isOnline ? 'online' : 'offline', Math.floor(Math.random() * 100) + 10);
      }
    });
  };

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

  return (
    <div className="space-y-6">
      <Header title="仪表盘" onRefresh={handleRefresh} />
      
      <StatsCard stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">服务器状态</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加服务器
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map((server, index) => (
              <div key={server.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ServerCard
                  server={server}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <ResponseChart logs={sampleLogs} />
        </div>
      </div>

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