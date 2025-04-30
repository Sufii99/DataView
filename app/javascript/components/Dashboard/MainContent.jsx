/* Componente que muestra el contenido central según la sección elegida: subida, visualización de archivo o configuración */
import React from 'react';
import UploadForm from './UploadForm';
import FileVisualizer from './FileVisualizer'; 

export default function MainContent({ activeSection, selectedFileId, setUploadedFiles, uploadedFiles }) {
  const selectedFile = uploadedFiles[selectedFileId] || null;

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      
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
          <h1 className="text-3xl font-bold mb-6">Archivo: {selectedFile.name}</h1>
          {/* Visualización del archivo seleccionado */}
          <FileVisualizer file={selectedFile} />
        </div>
      )}

      {/* Configuración */}
      {activeSection === 'settings' && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Configuración</h1>
          <p className="text-gray-700">Ajustes y configuraciones del usuario o de la plataforma.</p>
        </div>
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
