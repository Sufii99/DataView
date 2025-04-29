import React from 'react';
import UploadForm from './UploadForm';
import FileVisualizer from './FileVisualizer'; 

export default function MainContent({ activeSection, selectedFileId, setUploadedFiles, uploadedFiles }) {
  const selectedFile = uploadedFiles[selectedFileId] || null;

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {activeSection === 'upload' && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Subir nuevo archivo</h1>
          <UploadForm setUploadedFiles={setUploadedFiles} />
        </div>
      )}

      {activeSection === 'file' && selectedFile && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Archivo: {selectedFile.name}</h1>
          <FileVisualizer file={selectedFile} />
        </div>
      )}

      {activeSection === 'settings' && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Configuración</h1>
          <p className="text-gray-700">Ajustes y configuraciones del usuario o de la plataforma.</p>
        </div>
      )}
    </main>
  );
}
