import { X, Save, ChevronDown, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Server, ServerFormData } from '@/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServerFormData) => void;
  title: string;
  server?: Server | null;
}

const protocols: Array<{ value: ServerFormData['protocol']; label: string; defaultPort: number }> = [
  { value: 'http', label: 'HTTP', defaultPort: 80 },
  { value: 'https', label: 'HTTPS', defaultPort: 443 },
  { value: 'tcp', label: 'TCP', defaultPort: 80 },
  { value: 'udp', label: 'UDP', defaultPort: 53 },
  { value: 'icmp', label: 'ICMP', defaultPort: 0 },
  { value: 'ssh', label: 'SSH', defaultPort: 22 },
  { value: 'ftp', label: 'FTP', defaultPort: 21 },
  { value: 'sftp', label: 'SFTP', defaultPort: 22 },
  { value: 'smtp', label: 'SMTP', defaultPort: 25 },
  { value: 'pop3', label: 'POP3', defaultPort: 110 },
  { value: 'imap', label: 'IMAP', defaultPort: 143 },
  { value: 'mysql', label: 'MySQL', defaultPort: 3306 },
  { value: 'postgresql', label: 'PostgreSQL', defaultPort: 5432 },
  { value: 'mongodb', label: 'MongoDB', defaultPort: 27017 },
  { value: 'redis', label: 'Redis', defaultPort: 6379 },
  { value: 'dns', label: 'DNS', defaultPort: 53 },
];

export default function Modal({ isOpen, onClose, onSave, title, server }: ModalProps) {
  const [formData, setFormData] = useState<ServerFormData>({
    name: '',
    hostname: '',
    port: 80,
    protocol: 'http',
    isPublic: false,
  });
  const [showProtocolPicker, setShowProtocolPicker] = useState(false);

  useEffect(() => {
    if (server) {
      setFormData({
        name: server.name,
        hostname: server.hostname,
        port: server.port,
        protocol: server.protocol,
        isPublic: server.isPublic || false,
      });
    } else {
      setFormData({ name: '', hostname: '', port: 80, protocol: 'http', isPublic: false });
    }
  }, [server, isOpen]);

  const handleProtocolSelect = (protocol: ServerFormData['protocol'], defaultPort: number) => {
    setFormData({ ...formData, protocol, port: defaultPort });
    setShowProtocolPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.hostname && formData.port > 0) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentProtocol = protocols.find(p => p.value === formData.protocol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      
      <div className="relative glass rounded-3xl p-6 w-full max-w-md animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/60 transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">服务器名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
              placeholder="输入服务器名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">主机名/IP地址</label>
            <input
              type="text"
              value={formData.hostname}
              onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
              placeholder="例如: api.example.com 或 192.168.1.1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">端口</label>
              <input
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all"
                min="0"
                max="65535"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">协议</label>
              <button
                type="button"
                onClick={() => setShowProtocolPicker(!showProtocolPicker)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border-none outline-none focus:bg-white/80 transition-all flex items-center justify-between"
              >
                <span className="font-medium">{currentProtocol?.label || formData.protocol}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showProtocolPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl p-3 z-20 shadow-2xl max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {protocols.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => handleProtocolSelect(p.value, p.defaultPort)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                          formData.protocol === p.value
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                            : 'bg-white/50 text-gray-700 hover:bg-white/80'
                        }`}
                      >
                        {p.label}
                        {formData.protocol === p.value && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
            <div>
              <p className="font-medium text-gray-700">公开显示</p>
              <p className="text-sm text-gray-500">开启后将在公共页面显示此服务器</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
              className={`relative w-14 h-7 rounded-full transition-all ${formData.isPublic ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${formData.isPublic ? 'left-8' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/50 text-gray-600 font-medium hover:bg-white/80 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl btn-primary font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}