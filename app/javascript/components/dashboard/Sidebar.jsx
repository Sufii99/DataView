/* Componente lateral que permite navegar entre secciones del panel (subida, archivos, configuración) */
import React, { useState } from 'react';
import ConfirmModal from "../shared/ConfirmModal";

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, setSelectedFileId, uploadedFiles }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  async function handleDelete(file) {
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
        window.location.reload();
      } else {
        alert('Error al eliminar el archivo.');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error en la eliminación.');
    }
  }

  return (
    <>
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                       transition-transform duration-200 ease-in-out 
                       bg-white w-64 shadow-lg z-40 md:relative md:translate-x-0`}>
        <div className="p-4 space-y-6">
          <h2 className="text-2xl font-semibold">Panel</h2>

          {/* Subir archivo */}
          <button
            className={`flex items-center gap-2 w-full text-left cursor-pointer ${activeSection === 'upload' ? 'text-indigo-600 font-bold' : 'text-gray-700 hover:text-indigo-600'}`}
            onClick={() => {
              setActiveSection('upload');
              setSidebarOpen(false);
            }}
          >
            {/* Cambio de icono Subir archivo */}
            Subir archivo
          </button>

          {/* Archivos */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Archivos</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center">
                  <button
                    className="flex items-center gap-2 text-left text-gray-700 hover:text-indigo-600 flex-1 cursor-pointer"
                    onClick={() => {
                      setActiveSection('file');
                      setSelectedFileId(index);
                      setSidebarOpen(false);
                    }}
                  >
                    {/* Cambio de icono Archivo */}
                    {file.name}
                  </button>
                  <button
                    onClick={() => {
                      setFileToDelete(file);
                      setModalOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                    title="Eliminar archivo"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M15.561,11.561l-1.439,1.439,1.439,1.439c.586.586.586,1.535,0,2.121-.293.293-.677.439-1.061.439s-.768-.146-1.061-.439l-1.439-1.439-1.439,1.439c-.293.293-.677.439-1.061.439s-.768-.146-1.061-.439c-.586-.586-.586-1.535,0-2.121l1.439-1.439-1.439-1.439c-.586-.586-.586-1.535,0-2.121s1.535-.586,2.121,0l1.439,1.439,1.439-1.439c.586-.586,1.535-.586,2.121,0s.586,1.535,0,2.121Zm8.439-7.061c0,.828-.671,1.5-1.5,1.5h-.62l-1.08,12.957c-.235,2.828-2.643,5.043-5.481,5.043h-6.639c-2.838,0-5.246-2.215-5.481-5.043l-1.08-12.957h-.62c-.829,0-1.5-.672-1.5-1.5s.671-1.5,1.5-1.5h4.757c.619-1.746,2.287-3,4.243-3h3c1.956,0,3.624,1.254,4.243,3h4.757c.829,0,1.5.672,1.5,1.5Zm-5.13,1.5H5.13l1.059,12.707c.107,1.286,1.202,2.293,2.492,2.293h6.639c1.29,0,2.384-1.007,2.492-2.293l1.059-12.707Z"/>
                  </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Información */}
          <button
            className={`flex items-center gap-2 w-full text-left cursor-pointer ${
              activeSection === 'info' ? 'text-indigo-600 font-bold' : 'text-gray-700 hover:text-indigo-600'
            }`}
            onClick={() => {
              setActiveSection('info');
              setSelectedFileId(null); // por si acaso quieres limpiar selección
              setSidebarOpen(false);
            }}
          >
            Información
          </button>

        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        open={modalOpen}
        title="¿Eliminar archivo?"
        message={`¿Seguro que quieres eliminar el archivo "${fileToDelete?.name}"?`}
        onCancel={() => {
          setModalOpen(false);
          setFileToDelete(null);
        }}
        onConfirm={() => {
          if (fileToDelete) handleDelete(fileToDelete);
          setModalOpen(false);
          setFileToDelete(null);
        }}
      />
    </>
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
