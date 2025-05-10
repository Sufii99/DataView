/* Componente que permite al usuario seleccionar tipo de gráfico, columnas y método de agregación para visualizar los datos */
import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import StackedBarChart from './StackedBarChart';

export default function ChartSelector({ data, columns }) {
  const [chartType, setChartType] = useState('bar');                // Tipo de gráfico seleccionado
  const [xColumn, setXColumn] = useState(columns[0]);               // Columna del eje X o categoría
  const [yColumn, setYColumn] = useState(columns[1] || columns[0]); // Columna del eje Y o valores
  const [stackColumn, setStackColumn] = useState(columns[2] || columns[0]); // Columna secundaria para barras apiladas
  const [aggregation, setAggregation] = useState('sum');            // Método de agregación aplicado a Y

  /* Reseteamos los selectores al cambiar columnas */
  useEffect(() => {
    if (!columns || columns.length === 0) return;
    setXColumn(columns[0]);
    setYColumn(columns[1] || columns[0]);
    setStackColumn(columns[2] || columns[0]);
  }, [columns]);

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
            <option value="stacked">Barras Apiladas</option>
          </select>
        </div>

        {/* Selectores de columnas */}
        {chartType === 'pie' ? (
          <>
            <div>
              <label className="block mb-2 font-semibold">Categoría (etiqueta)</label>
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
              <label className="block mb-2 font-semibold">Valor numérico</label>
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
        ) : (
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
            {chartType === 'stacked' && (
              <div>
                <label className="block mb-2 font-semibold">Subcategoría (stack)</label>
                <select
                  value={stackColumn}
                  onChange={(e) => setStackColumn(e.target.value)}
                  className="w-full border rounded px-4 py-2"
                >
                  {columns.map((col, idx) => (
                    <option key={idx} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        {/* Selector de agregación */}
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

      {/* Gráfico renderizado */}
      {chartType === 'bar' && (
        <BarChart data={data} xKey={xColumn} yKey={yColumn} aggregation={aggregation} />
      )}
      {chartType === 'line' && (
        <LineChart data={data} xKey={xColumn} yKey={yColumn} aggregation={aggregation} />
      )}
      {chartType === 'pie' && (
        <PieChart data={data} categoryKey={xColumn} valueKey={yColumn} aggregation={aggregation} />
      )}
      {chartType === 'stacked' && (
        <StackedBarChart data={data} xKey={xColumn} yKey={yColumn} stackKey={stackColumn} aggregation={aggregation} />
      )}
    </div>
  );
}

/*
  - data: array de objetos representando los datos del archivo paseado.
  - columns: array con los nombres de columna detectados (cabeceras del archivo).
*/
