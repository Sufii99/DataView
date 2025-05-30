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
                 bg-blue-900 text-white w-64 z-40 md:relative md:translate-x-0`}>
        <div className="p-4 space-y-6">
          <h2 className="text-2xl font-bold">Panel de usuario</h2>

          {/* Subir archivo */}
          <button
            className={`flex items-center gap-2 w-full text-left cursor-pointer ${
              activeSection === 'upload' ? 'text-indigo-400 font-bold' : 'text-white hover:text-indigo-300'
            }`}
            onClick={() => {
              setActiveSection('upload');
              setSidebarOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Subir archivo
          </button>

          {/* Archivos */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white font-bold mb-2">Archivos</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center">
                  <button
                    className="flex items-center gap-2 text-left text-white hover:text-indigo-300 flex-1 cursor-pointer"
                    onClick={() => {
                      setActiveSection('file');
                      setSelectedFileId(index);
                      setSidebarOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
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
              activeSection === 'info' ? 'text-indigo-400 font-bold' : 'text-white hover:text-indigo-300'
            }`}
            onClick={() => {
              setActiveSection('info');
              setSelectedFileId(null);
              setSidebarOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
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
  - uploadedFiles: array de archivos subidos (cada uno con al menos {id, name}).
*/
