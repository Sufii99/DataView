import React, { useState } from 'react';
import FilePreviewModal from './FilePreviewModal';

export default function UploadForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setShowModal(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className={`border-4 border-dashed rounded-lg w-full max-w-xl p-12 flex flex-col items-center justify-center
                   ${isDragging ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput" className="flex flex-col items-center cursor-pointer">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-gray-600">
            {isDragging ? '¡Suéltalo aquí!' : 'Arrastra un archivo o haz clic para seleccionarlo'}
          </p>
        </label>
      </div>

      {showModal && selectedFile && (
        <FilePreviewModal file={selectedFile} onClose={handleCancel} />
      )}
    </div>
  );
}
