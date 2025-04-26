import React, { useState } from 'react';

export default function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                       transition-transform duration-200 ease-in-out 
                       bg-white w-64 shadow-lg z-40 md:relative md:translate-x-0`}>
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-6">Mis Archivos</h2>
          <nav className="space-y-4">
            {/* Aquí luego listarás los archivos */}
            <button className="block w-full text-left text-gray-700 hover:text-indigo-600">
              Archivo 1
            </button>
            <button className="block w-full text-left text-gray-700 hover:text-indigo-600">
              Archivo 2
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        
        {/* Botón de abrir sidebar en móvil */}
        <header className="p-4 bg-white shadow-md md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 focus:outline-none"
          >
            ☰ Abrir menú
          </button>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <p className="text-gray-700">Aquí irá todo el contenido principal: gráficas, archivos, etc.</p>
        </main>

      </div>
    </div>
  );
}
