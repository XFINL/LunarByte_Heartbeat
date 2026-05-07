import { X, Save, ChevronDown, Check, Copy, Terminal, CheckCircle } from 'lucide-react';
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
  { value: 'probe', label: '探针', defaultPort: 9527 },
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
    port: 9527,
    protocol: 'http',
    isPublic: false,
  });
  const [showProtocolPicker, setShowProtocolPicker] = useState(false);
  const [probeSecret, setProbeSecret] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (server) {
      setFormData({
        name: server.name,
        hostname: server.hostname,
        port: server.port,
        protocol: server.protocol,
        isPublic: server.isPublic || false,
      });
      setProbeSecret(server.probe_secret || '');
    } else {
      setFormData({ name: '', hostname: '', port: 80, protocol: 'http', isPublic: false });
      setProbeSecret('');
    }
  }, [server, isOpen]);

  useEffect(() => {
    if (formData.protocol === 'probe' && !probeSecret) {
      setProbeSecret(generateSecret());
    }
  }, [formData.protocol, probeSecret]);

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleProtocolSelect = (protocol: ServerFormData['protocol'], defaultPort: number) => {
    setFormData({ ...formData, protocol, port: defaultPort });
    setShowProtocolPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.hostname && formData.port >= 0) {
      onSave(formData);
      onClose();
    }
  };

  const generateProbeScript = () => {
    const serverUrl = window.location.origin;
    return `#!/bin/bash
# ServerPulse Probe Agent Installation Script
# Copy this script to your server and run it

# Install dependencies
if command -v apt-get &> /dev/null; then
    apt-get update && apt-get install -y curl jq
elif command -v yum &> /dev/null; then
    yum install -y curl jq
elif command -v dnf &> /dev/null; then
    dnf install -y curl jq
fi

# Create probe agent script
cat > /usr/local/bin/serverpulse-agent.sh << 'AGENT_SCRIPT'
#!/bin/bash

SERVER_URL="${serverUrl}"
SECRET="${probeSecret}"
SERVER_ID="${server?.id || 'NEW'}"

while true; do
    # Collect system metrics
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{print 100 - $1}')
    MEM_INFO=$(free -m | awk 'NR==2{printf "%.2f,%.2f,%.2f", $3/$2*100, $2, $3}')
    DISK_INFO=$(df -h / | awk 'NR==2{printf "%.2f,%s,%s", $5, $2, $3}')
    NETWORK_RX=$(cat /sys/class/net/*/statistics/rx_bytes 2>/dev/null | awk '{sum+=$1} END {print sum}')
    NETWORK_TX=$(cat /sys/class/net/*/statistics/tx_bytes 2>/dev/null | awk '{sum+=$1} END {print sum}')
    UPTIME=$(cat /proc/uptime | awk '{print int($1)}')
    LOAD_AVG=$(cat /proc/loadavg | awk '{print $1","$2","$3}')
    CPU_CORES=$(nproc)
    CPU_MODEL=$(cat /proc/cpuinfo | grep "model name" | head -1 | cut -d':' -f2 | xargs)
    OS_NAME=$(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)
    OS_ARCH=$(uname -m)

    # Send data to server
    curl -s -X POST "\${SERVER_URL}/api/probe/report" \\
        -H "Content-Type: application/json" \\
        -H "X-Secret: \${SECRET}" \\
        -d "{
            \\"server_id\\": \\"\${SERVER_ID}\\",
            \\"cpu_usage\\": \${CPU_USAGE:-0},
            \\"memory_usage\\": $(echo $MEM_INFO | cut -d',' -f1),
            \\"memory_total\\": $(echo $MEM_INFO | cut -d',' -f2),
            \\"memory_used\\": $(echo $MEM_INFO | cut -d',' -f3),
            \\"disk_usage\\": $(echo $DISK_INFO | cut -d',' -f1 | tr -d '%'),
            \\"disk_total\\": \\"$(echo $DISK_INFO | cut -d',' -f2)\\",
            \\"disk_used\\": \\"$(echo $DISK_INFO | cut -d',' -f3)\\",
            \\"network_rx\\": \${NETWORK_RX},
            \\"network_tx\\": \${NETWORK_TX},
            \\"uptime\\": \${UPTIME},
            \\"load_avg\\": \\"\${LOAD_AVG}\\",
            \\"cpu_cores\\": \${CPU_CORES},
            \\"cpu_model\\": \\"\${CPU_MODEL}\\",
            \\"os_name\\": \\"\${OS_NAME}\\",
            \\"os_arch\\": \\"\${OS_ARCH}\\"
        }"

    sleep 5
done
AGENT_SCRIPT

chmod +x /usr/local/bin/serverpulse-agent.sh

# Create systemd service
cat > /etc/systemd/system/serverpulse-agent.service << 'SERVICE'
[Unit]
Description=ServerPulse Probe Agent
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/serverpulse-agent.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable serverpulse-agent
systemctl start serverpulse-agent

echo "ServerPulse Probe Agent installed successfully!"
echo "Server ID: ${server?.id || 'NEW'}"
echo "Secret: ${probeSecret}"
`;
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generateProbeScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const currentProtocol = protocols.find(p => p.value === formData.protocol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      
      <div className="relative glass rounded-3xl p-6 w-full max-w-lg animate-slide-in max-h-[90vh] overflow-y-auto">
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

          {formData.protocol === 'probe' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-gray-800">探针安装脚本</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  请将以下脚本复制到目标服务器上执行，以安装探针客户端。
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto max-h-60 font-mono">
                    {generateProbeScript()}
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
                    title="复制脚本"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                  </button>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    <strong>密钥:</strong> <code className="bg-yellow-100 px-1 rounded">{probeSecret}</code>
                    <br />
                    请妥善保管此密钥，用于验证探针客户端身份。
                  </p>
                </div>
              </div>
            </div>
          )}

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
