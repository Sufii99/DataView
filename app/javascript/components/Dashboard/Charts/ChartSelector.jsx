/* Componente que permite al usuario seleccionar tipo de gráfico, columnas y método de agregación para visualizar los datos */
import React, { useState } from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';

export default function ChartSelector({ data, columns }) {
  const [chartType, setChartType] = useState('bar');                // Tipo de gráfico seleccionado
  const [xColumn, setXColumn] = useState(columns[0]);               // Columna del eje X
  const [yColumn, setYColumn] = useState(columns[1] || columns[0]); // Columna del eje Y o valores
  const [aggregation, setAggregation] = useState('sum');            // Método de agregación aplicado a Y

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 font-semibold">Tipo de Gráfico</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="bar">Gráfico de Barras</option>
            <option value="line">Gráfico de Líneas</option>
            <option value="pie">Gráfico de Pastel</option>
          </select>
        </div>

        {/* Mostrar solo si no es un PieChart (por ahora) */}
        {chartType !== 'pie' && (
          <>
            <div>
              <label className="block mb-2 font-semibold">Eje X</label>
              <select
                value={xColumn}
                onChange={(e) => setXColumn(e.target.value)}
                className="w-full border rounded px-4 py-2"
              >
                {columns.map((col, idx) => (
                  <option key={idx} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Eje Y</label>
              <select
                value={yColumn}
                onChange={(e) => setYColumn(e.target.value)}
                className="w-full border rounded px-4 py-2"
              >
                {columns.map((col, idx) => (
                  <option key={idx} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* El select de agregación aparece SIEMPRE */}
        <div>
          <label className="block mb-2 font-semibold">Tipo de Agregación</label>
          <select
            value={aggregation}
            onChange={(e) => setAggregation(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="sum">Suma</option>
            <option value="mean">Media</option>
          </select>
        </div>
      </div>

      {/* Mostrar la gráfica */}
      {chartType === 'bar' && (
        <BarChart data={data} xKey={xColumn} yKey={yColumn} aggregation={aggregation} />
      )}
      {chartType === 'line' && (
        <LineChart data={data} xKey={xColumn} yKey={yColumn} aggregation={aggregation} />
      )}
      {chartType === 'pie' && (
        <PieChart data={data} valueKey={yColumn} aggregation={aggregation} />
      )}
    </div>
  );
}

/*
  - data: array de objetos representando los datos del archivo paseado.
  - columns: array con los nombres de columna detectados (cabeceras del archivo).
*/