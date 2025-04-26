import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

export default function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('upload'); // 'upload', 'file', 'settings'
  const [selectedFileId, setSelectedFileId] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setSelectedFileId={setSelectedFileId}
      />

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Botón abrir sidebar en móvil */}
        <header className="p-4 bg-white shadow-md md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 focus:outline-none"
          >
            ☰ Abrir menú
          </button>
        </header>

        <MainContent
          activeSection={activeSection}
          selectedFileId={selectedFileId}
        />
      </div>

    </div>
  );
}
