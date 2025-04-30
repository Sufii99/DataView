/* Modal que muestra una vista previa del archivo antes de subirlo, permite asignar un nombre personalizado y enviarlo al backend */
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function FilePreviewModal({ file, onClose, setUploadedFiles }) {
  const [previewData, setPreviewData] = useState([]); // Primeras filas para mostrar como vista previa
  const [customName, setCustomName] = useState('');   // Nombre que el usuario introduce para guardar el archivo

  useEffect(() => {
    const fileExt = file.name.split('.').pop().toLowerCase(); // Obtenemos la extensión del archivo
    const reader = new FileReader();

    if (fileExt === 'csv') {
      /* Parseo de archivos CSV (primeras 5 filas con cabecera) */
      reader.onload = (event) => {
        const csv = event.target.result;
        const parsed = Papa.parse(csv, { header: true, preview: 5 });
        setPreviewData(parsed.data); // Guardamos la vista previa
      };
      reader.readAsText(file);
    }

    else if (['xlsx', 'xls'].includes(fileExt)) {
      /* Parseo de archivos Excel (primeras 5 filas de la primera hoja) */
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" }).slice(0, 5);
        setPreviewData(rows);
      };
      reader.readAsArrayBuffer(file);
    } else {
      /* Tipo de archivo no soportado para vista previa */
      setPreviewData([]);
    }
  }, [file]);

  /* Enviamos el archivo al backend junto con el nombre personalizado */
  const handleSave = async () => {
    if (!customName.trim()) {
      alert('Por favor, escribe un nombre para el archivo.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', customName);
    formData.append('file', file);
  
    /* Extraemos el token CSRF desde el meta tag (para seguridad en Rails) */
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  
    try {
      const response = await fetch('/file_uploads', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken,  // Para que Rails acepte la petición
        },
        body: formData,
      });
  
      if (response.ok) {
        const newFile = await response.json();
        setUploadedFiles(prev => [...prev, { ...newFile, previewData }]);
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

        {/* Vista previa de la tabla */}
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

        {/* Input para elegir nombre */}
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

/*
  - file: archivo CSV seleccionado localmente para subir.
  - onClose: función que cierra el modal.
  - setUploadedFiles: función para actualizar la lista global de archivos tras la subida.
*/