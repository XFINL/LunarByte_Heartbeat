import { useEffect, useRef } from 'react';
import type { MonitorLog } from '@/types';

interface ResponseChartProps {
  logs: MonitorLog[];
  darkMode?: boolean;
}

export default function ResponseChart({ logs, darkMode = false }: ResponseChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const textColor = darkMode ? '#94a3b8' : '#374151';
  const gridColor = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const bgColor = darkMode ? 'rgba(255,255,255,0.05)' : '#f9fafb';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const values = logs.map((log) => log.response_time);
    const maxValue = Math.max(...values, 100);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue || 1;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const value = maxValue - (range / 4) * i;
      ctx.fillStyle = textColor;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(value)}ms`, padding.left - 8, y + 3);
    }

    if (logs.length > 0) {
      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      if (darkMode) {
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      }

      ctx.beginPath();
      ctx.moveTo(padding.left, height - padding.bottom);

      logs.forEach((log, index) => {
        const x = padding.left + (chartWidth / (logs.length - 1)) * index;
        const y = padding.top + chartHeight - ((log.response_time - minValue) / range) * chartHeight;
        
        if (index === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.lineTo(padding.left + chartWidth, height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      logs.forEach((log, index) => {
        const x = padding.left + (chartWidth / (logs.length - 1)) * index;
        const y = padding.top + chartHeight - ((log.response_time - minValue) / range) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.stroke();

      logs.forEach((log, index) => {
        const x = padding.left + (chartWidth / (logs.length - 1)) * index;
        const y = padding.top + chartHeight - ((log.response_time - minValue) / range) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? '#1f2937' : '#ffffff';
        ctx.fill();
      });
    }

    ctx.fillStyle = textColor;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    logs.forEach((log, index) => {
      const x = padding.left + (chartWidth / (logs.length - 1)) * index;
      const time = new Date(log.created_at);
      const label = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
      ctx.fillText(label, x, height - 10);
    });

  }, [logs, darkMode, textColor, gridColor, bgColor]);

  return (
    <div className={`rounded-2xl p-5 ${darkMode ? 'bg-white/10 backdrop-blur-xl border border-white/10' : 'glass'}`}>
      <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>响应时间趋势</h4>
      <canvas
        ref={canvasRef}
        className="w-full h-48"
        style={{ maxHeight: '200px' }}
      />
    </div>
  );
}