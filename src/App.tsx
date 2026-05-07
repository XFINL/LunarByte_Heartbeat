import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import Servers from '@/pages/Servers';
import Settings from '@/pages/Settings';
import type { PageType } from '@/types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'servers':
        return <Servers />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="p-4 sm:p-6 lg:ml-64 transition-all duration-300">
        {renderPage()}
      </main>
    </div>
  );
}