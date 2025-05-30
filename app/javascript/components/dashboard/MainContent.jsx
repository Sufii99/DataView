/* Componente que muestra el contenido central según la sección elegida: subida, visualización de archivo o configuración */
import React from 'react';
import UploadForm from './Upload/UploadForm';
import FileVisualizer from './Files/FileVisualizer'; 
import InfoPanel from './Info/InfoPanel';

export default function MainContent({ activeSection, selectedFileId, setUploadedFiles, uploadedFiles }) {
  const selectedFile = uploadedFiles[selectedFileId] || null;

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen text-gray-800">
      
      {/* Subir archivo */}
      {activeSection === 'upload' && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Subir nuevo archivo</h1>
          {/* Formulario para subir archivos */}
          <UploadForm setUploadedFiles={setUploadedFiles} />
        </div>
      )}

      {/* Archivos */}
      {activeSection === 'file' && selectedFile && (
        <div>
          <h1 className="text-3xl font-bold mb-6">{selectedFile.name}</h1>
          {/* Visualización del archivo seleccionado */}
          <FileVisualizer file={selectedFile} />
        </div>
      )}

      {/* Información */}
      {activeSection === 'info' && (
        <main className="flex-1 p-6 overflow-y-auto">
          <InfoPanel />
        </main>

      )}
      
    </main>
  );
}

/*
  - activeSection: string que determina qué vista se muestra ('upload', 'file', 'settings').
  - selectedFileId: índice del archivo seleccionado dentro del array uploadedFiles.
  - setUploadedFiles: función para actualizar la lista de archivos subidos.
  - uploadedFiles: array de archivos disponibles para visualizar.
*/
