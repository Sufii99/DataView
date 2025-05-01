/* Componente lateral que permite navegar entre secciones del panel (subida, archivos, configuración) */
import React from 'react';

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, setSelectedFileId, uploadedFiles }) {
  
  /* Funcion para eliminar los archivos del sidebar (y de la BD) */
  async function handleDelete(file) {
    if (!confirm(`¿Seguro que quieres eliminar el archivo "${file.name}"?`)) return;
  
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

  return (
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
          <svg viewBox="0 0 512.022 512.022" fill="currentColor" className="w-4 h-4 text-gray-600">
            <path d="M165.558,141.889l59.328-59.349l0.448,290.816c0,17.673,14.327,32,32,32l0,0c17.673,0,32-14.327,32-32l-0.448-290.453   l58.987,58.987c12.278,12.712,32.536,13.064,45.248,0.786s13.064-32.536,0.786-45.248c-0.258-0.267-0.52-0.529-0.786-0.786   l-68.523-68.523c-37.49-37.491-98.274-37.491-135.765-0.001c0,0-0.001,0.001-0.001,0.001L120.31,96.641   c-12.278,12.712-11.926,32.97,0.786,45.248C133.497,153.866,153.157,153.866,165.558,141.889z"/>
            <path d="M480.011,309.355c-17.673,0-32,14.327-32,32v97.941c-0.012,4.814-3.911,8.714-8.725,8.725H72.736   c-4.814-0.012-8.714-3.911-8.725-8.725v-97.941c0-17.673-14.327-32-32-32s-32,14.327-32,32v97.941   c0.047,40.146,32.58,72.678,72.725,72.725h366.549c40.146-0.047,72.678-32.58,72.725-72.725v-97.941   C512.011,323.682,497.684,309.355,480.011,309.355z"/>
          </svg>
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
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                    <path d="M17 14a1 1 0 0 1 -1 1h-8a1 1 0 0 1 0-2h8a1 1 0 0 1 1 1zm-4 3h-5a1 1 0 0 0 0 2h5a1 1 0 0 0 0-2zm9-6.515v8.515a5.006 5.006 0 0 1 -5 5h-10a5.006 5.006 0 0 1 -5-5v-14a5.006 5.006 0 0 1 5-5h4.515a6.958 6.958 0 0 1 4.95 2.05l3.484 3.486a6.951 6.951 0 0 1 2.051 4.949zm-6.949-7.021a5.01 5.01 0 0 0 -1.051-.78v4.316a1 1 0 0 0 1 1h4.316a4.983 4.983 0 0 0 -.781-1.05zm4.949 7.021c0-.165-.032-.323-.047-.485h-4.953a3 3 0 0 1 -3-3v-4.953c-.162-.015-.321-.047-.485-.047h-4.515a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3z"/>
                  </svg>
                  {file.name}
                </button>
                <button
                  onClick={() => handleDelete(file)}
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

        {/* Configuración */}
        <button
          className={`flex items-center gap-2 w-full text-left mt-6 cursor-pointer ${activeSection === 'settings' ? 'text-indigo-600 font-bold' : 'text-gray-700 hover:text-indigo-600'}`}
          onClick={() => {
            setActiveSection('settings');
            setSidebarOpen(false);
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-600">
            <path d="M2.5,6.936h1.896c.426,1.255,1.473,1.89,3.131,1.89s2.705-.635,3.13-1.89h10.843c.829,0,1.5-.671,1.5-1.5s-.671-1.5-1.5-1.5H10.657c-.426-1.255-1.473-1.89-3.13-1.89s-2.705,.635-3.131,1.89h-1.896c-.829,0-1.5,.671-1.5,1.5s.671,1.5,1.5,1.5Z"/>
            <path d="M21.5,10.5h-1.896c-.426-1.255-1.473-1.89-3.131-1.89s-2.704,.635-3.13,1.89H2.5c-.829,0-1.5,.671-1.5,1.5s.671,1.5,1.5,1.5H13.343c.426,1.255,1.473,1.89,3.13,1.89s2.705-.634,3.131-1.89h1.896c.829,0,1.5-.671,1.5-1.5s-.671-1.5-1.5-1.5Z"/>
            <path d="M21.5,17.063H10.657c-.426-1.255-1.473-1.89-3.13-1.89s-2.705,.634-3.131,1.89h-1.896c-.829,0-1.5,.672-1.5,1.5s.671,1.5,1.5,1.5h1.896c.426,1.256,1.473,1.89,3.131,1.89s2.705-.635,3.13-1.89h10.843c.829,0,1.5-.672,1.5-1.5s-.671-1.5-1.5-1.5Z"/>
          </svg>
          Configuración
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