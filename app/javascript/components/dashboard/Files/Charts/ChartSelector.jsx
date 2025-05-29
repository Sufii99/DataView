/* Componente que permite al usuario seleccionar tipo de gráfico, columnas y método de agregación para visualizar los datos */
import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import StackedBarChart from './StackedBarChart';
import ChartStatistics from './ChartStatistics';

export default function ChartSelector({ data, columns }) {
  const [chartType, setChartType] = useState('bar');
  const [xColumn, setXColumn] = useState(columns[0]);
  const [yColumn, setYColumn] = useState(columns[1] || columns[0]);
  const [stackColumn, setStackColumn] = useState(columns[2] || columns[0]);
  const [aggregation, setAggregation] = useState('sum');
  const [color, setColor] = useState('#4f46e5'); // Color para barras o línea

  useEffect(() => {
    if (!columns || columns.length === 0) return;
    setXColumn(columns[0]);
    setYColumn(columns[1] || columns[0]);
    setStackColumn(columns[2] || columns[0]);
  }, [columns]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tipo de gráfico */}
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

        {/* Tipo de agregación */}
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

        {/* Selector de color si aplica */}
        {(chartType === 'bar' || chartType === 'line') && (
          <div>
            <label className="block mb-2 font-semibold">
              Color {chartType === 'line' ? 'de la línea' : 'de las barras'}
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-[42px] rounded cursor-pointer border"
            />
          </div>
        )}
      </div>

      {/* Renderizado del gráfico */}
      {(() => {
        let chart = null;

        if (chartType === 'bar') {
          chart = (
            <BarChart
              data={data}
              xKey={xColumn}
              yKey={yColumn}
              aggregation={aggregation}
              barColor={color}
            />
          );
        } else if (chartType === 'line') {
          chart = (
            <LineChart
              data={data}
              xKey={xColumn}
              yKey={yColumn}
              aggregation={aggregation}
              lineColor={color}
            />
          );
        } else if (chartType === 'pie') {
          chart = (
            <PieChart
              data={data}
              categoryKey={xColumn}
              valueKey={yColumn}
              aggregation={aggregation}
            />
          );
        } else if (chartType === 'stacked') {
          chart = (
            <StackedBarChart
              data={data}
              xKey={xColumn}
              yKey={yColumn}
              stackKey={stackColumn}
              aggregation={aggregation}
            />
          );
        }

        // Valores numéricos actuales para estadísticas
        return (
          <>
            {chart}
            <ChartStatistics
              data={data}
              xKey={xColumn}
              yKey={yColumn}
              aggregation={aggregation}
            />
          </>
        );
      })()}

    </div>
  );
}

/*
  - data: array de objetos representando los datos del archivo parseado.
  - columns: array con los nombres de columna detectados (cabeceras del archivo).
*/
