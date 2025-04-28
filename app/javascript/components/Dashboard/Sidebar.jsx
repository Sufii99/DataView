import React from 'react';

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, setSelectedFileId, uploadedFiles }) {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                     transition-transform duration-200 ease-in-out 
                     bg-white w-64 shadow-lg z-40 md:relative md:translate-x-0`}>
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-semibold">Panel</h2>
        
        {/* Subir archivo */}
        <button
          className={`block w-full text-left ${activeSection === 'upload' ? 'text-indigo-600 font-bold' : 'text-gray-700 hover:text-indigo-600'}`}
          onClick={() => {
            setActiveSection('upload');
            setSidebarOpen(false);
          }}
        >
          ➕ Subir archivo
        </button>

        {/* Archivos */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Archivos</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <button
                key={index}
                className="block w-full text-left text-gray-700 hover:text-indigo-600"
                onClick={() => {
                  setActiveSection('file');
                  setSelectedFileId(index);
                  setSidebarOpen(false);
                }}
              >
                📄 {file.name}
              </button>
            ))}
          </div>
        </div>

        {/* Configuración */}
        <button
          className={`block w-full text-left mt-6 ${activeSection === 'settings' ? 'text-indigo-600 font-bold' : 'text-gray-700 hover:text-indigo-600'}`}
          onClick={() => {
            setActiveSection('settings');
            setSidebarOpen(false);
          }}
        >
          ⚙️ Configuración
        </button>
      </div>
    </div>
  );
}
