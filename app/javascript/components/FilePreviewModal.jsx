import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function FilePreviewModal({ file, onClose }) {
  const [previewData, setPreviewData] = useState([]);
  const [customName, setCustomName] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const parsed = Papa.parse(csv, { header: true, preview: 5 });
      setPreviewData(parsed.data);
    };
    reader.readAsText(file);
  }, [file]);

  const handleSave = async () => {
    if (!customName.trim()) {
      alert('Por favor, escribe un nombre para el archivo.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', customName);
    formData.append('file', file);
  
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content; // Para obtener el token CSRF
  
    try {
      const response = await fetch('/file_uploads', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken, // Incluir el token CSRF en los headers
        },
        body: formData,
      });
  
      if (response.ok) {
        alert('Archivo subido correctamente.');
        onClose();
      } else {
        const error = await response.json();
        alert('Error al subir archivo: ' + error.errors.join(', '));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error en la subida.');
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl relative">
        <h2 className="text-2xl font-semibold mb-6">Vista previa del archivo</h2>

        {/* Tabla preview */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr>
                {previewData[0] &&
                  Object.keys(previewData[0]).map((key, index) => (
                    <th key={index} className="px-4 py-2 border-b font-semibold">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} className="px-4 py-2 border-b">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Input nombre personalizado */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-600">Nombre para guardar:</label>
          <input
            type="text"
            className="w-full border rounded px-4 py-2"
            placeholder="Ej: Ventas Enero"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
