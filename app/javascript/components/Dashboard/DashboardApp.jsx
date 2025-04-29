import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

export default function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('upload');
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    /* Cargamos los archivos del servidor */
    const fetchFiles = async () => {
      try {
        const response = await fetch('/file_uploads');
        if (response.ok) {
          const files = await response.json();
          setUploadedFiles(files);
        } else {
          console.error('Error al cargar archivos.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setSelectedFileId={setSelectedFileId}
        uploadedFiles={uploadedFiles}
      />

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 bg-white shadow-md md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 focus:outline-none"
          >
            ☰ Abrir menú
          </button>
        </header>

        <MainContent
          activeSection={activeSection}
          selectedFileId={selectedFileId}
          setUploadedFiles={setUploadedFiles}
          uploadedFiles={uploadedFiles}
        />
      </div>
    </div>
  );
}
