import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ChartSelector from './Charts/ChartSelector';

export default function FileVisualizer({ file }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!file || !file.file_url) return;

    const fetchData = async () => {
      try {
        const response = await fetch(file.file_url);
        const text = await response.text();
        const parsed = Papa.parse(text, { header: true });
        const rows = parsed.data.filter(row => Object.values(row).some(value => value !== ""));

        if (rows.length > 0) {
          const keys = Object.keys(rows[0]);
          setColumns(keys);
          setData(rows);
        }
      } catch (err) {
        console.error("Error al cargar el CSV:", err);
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
