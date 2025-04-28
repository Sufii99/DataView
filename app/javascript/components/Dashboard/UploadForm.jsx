import React, { useState } from 'react';
import FilePreviewModal from './FilePreviewModal';

export default function UploadForm({ setUploadedFiles }) {
  const [fileToPreview, setFileToPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToPreview(file);
      setShowModal(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileToPreview(file);
      setShowModal(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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
        Arrastra tu archivo CSV aquí o haz click para seleccionarlo
      </p>
      <input 
        type="file" 
        accept=".csv" 
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
