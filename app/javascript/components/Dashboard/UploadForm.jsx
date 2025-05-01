/* Formulario para subir los archivos. Muestra una previsualización antes de enviarlo (con FilePreviewModal) */
import React, { useState } from 'react';
import FilePreviewModal from './FilePreviewModal';

export default function UploadForm({ setUploadedFiles }) {
  const [fileToPreview, setFileToPreview] = useState(null); // Archivo seleccionado por input o drag & drop
  const [showModal, setShowModal] = useState(false);        // Controla la visibilidad del modal de previsualización

  /* Seleccionamos archivo desde el input */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToPreview(file);
      setShowModal(true);
    }
  };

  /* Soltamos archivo desde el drag and drop */
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileToPreview(file);
      setShowModal(true);
    }
  };

  /* Permitir el drop */
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /* Cerramos el modal y se resetea el archivo seleccionado */
  const handleCloseModal = () => {
    setShowModal(false);
    setFileToPreview(null);
  };

  return (
    <div 
      onDrop={handleDrop} 
      onDragOver={handleDragOver} 
      className="border-4 border-dashed border-gray-300 p-8 rounded-lg flex flex-col items-center justify-center text-center bg-white hover:bg-gray-50 transition"
    >
      <p className="text-lg text-gray-600 mb-4">
        Arrastra tu archivo aquí o haz click para seleccionarlo
      </p>
      <input 
        type="file" 
        accept=".csv, .xls, .xlsx"
        onChange={handleFileChange} 
        className="hidden" 
        id="fileInput"
      />
      <label 
        htmlFor="fileInput" 
        className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Seleccionar archivo
      </label>

      {/* Modal de previsualización */}
      {showModal && fileToPreview && (
        <FilePreviewModal 
          file={fileToPreview} 
          onClose={handleCloseModal}
          setUploadedFiles={setUploadedFiles}
        />
      )}
    </div>
  );
}

/*
  - setUploadedFiles: función para actualizar la lista global de archivos después de subir uno nuevo.
*/
