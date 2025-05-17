/* Componente que carga, parsea y muestra los datos de un archivo mediante ChartSelector */
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import ChartSelector from './Charts/ChartSelector';

export default function FileVisualizer({ file }) {
  const [data, setData] = useState([]);       // Filas del CSV parseado
  const [columns, setColumns] = useState([]); // Nombres de las columnas (cabecera del CSV)

  useEffect(() => {
    if (!file || !file.file_url) return;

    /* Cargamos y parseamos el archivo desde el backend */
    const fetchData = async () => {
      try {
        const response = await fetch(file.file_url);
        const blob = await response.blob();
  
        if (file.file_type === 'csv') {
          /* Parseamos archivo CSV como texto plano */
          const text = await blob.text();
          const parsed = Papa.parse(text, { header: true });
  
          /* Filtramos filas completamente vacías */
          const rows = parsed.data.filter(row =>
            Object.values(row).some(value => value !== "")
          );
  
          if (rows.length > 0) {
            setColumns(Object.keys(rows[0])); // Detectamos las cabeceras
            setData(rows);
          }

        } else if (['xls', 'xlsx'].includes(file.file_type)) {
          /* Parseamos archivo Excel desde arrayBuffer */
          const arrayBuffer = await blob.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
          const sheetName = workbook.SheetNames[0];   // Usamos la primera hoja por defecto
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // Convertimos a array de objetos
  
          if (rows.length > 0) {
            setColumns(Object.keys(rows[0]));
            setData(rows);
          }
        } else {
          /* Tipo de archivo no reconocido por el visualizador */
          console.warn("Tipo de archivo no soportado:", file.file_type);
        }
      } catch (err) {
        console.error("Error al procesar el archivo:", err);
      }
    };

    fetchData();
  }, [file]);

  return (
    <div>
      {data.length > 0 && columns.length > 0 ? (
        <ChartSelector data={data} columns={columns} />
      ) : (
        <p className="text-gray-500">Cargando datos o no hay datos disponibles.</p>
      )}
    </div>
  );
}

/*
  - file: objeto con los datos del archivo seleccionado, que incluye al menos { file_url }.
*/
