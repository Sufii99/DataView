/* Componente lateral que permite navegar entre secciones del panel (subida, archivos, configuración) */
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
              <div key={index} className="flex justify-between items-center">
                <button
                  className="text-left text-gray-700 hover:text-indigo-600 flex-1"
                  onClick={() => {
                    setActiveSection('file');
                    setSelectedFileId(index);
                    setSidebarOpen(false);
                  }}
                >
                  📄 {file.name}
                </button>
                <button
                  onClick={async () => {
                    if (confirm(`¿Seguro que quieres eliminar el archivo "${file.name}"?`)) {
                      try {
                        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
                        const response = await fetch(`/file_uploads/${file.id}`, {
                          method: 'DELETE',
                          headers: {
                            'X-CSRF-Token': csrfToken,
                            'Accept': 'application/json',
                          },
                        });
                        if (response.ok) {
                          window.location.reload(); // Refrescamos para actualizar la lista de archivos
                        } else {
                          alert('Error al eliminar el archivo.');
                        }
                      } catch (error) {
                        console.error('Error al eliminar:', error);
                        alert('Error en la eliminación.');
                      }
                    }
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                  title="Eliminar archivo"
                >
                  🗑️
                </button>
              </div>
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

/*
  - sidebarOpen: booleano que indica si el sidebar está visible (para diseño responsive).
  - setSidebarOpen: función para cambiar el estado de visibilidad del sidebar.
  - activeSection: string que indica la sección actualmente activa del panel ('upload', 'file', 'settings').
  - setActiveSection: función para actualizar la sección activa.
  - setSelectedFileId: función para seleccionar un archivo concreto (por su índice en la lista).
  - uploadedFiles: array de archivos subidos (cada uno con al menos { id, name }).
*/