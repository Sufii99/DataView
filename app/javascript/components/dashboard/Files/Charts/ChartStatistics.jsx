import React from "react";
import * as d3 from "d3";

/* Agrupamos y agregamos los datos por xKey */
function aggregateData(data, xKey, yKey, aggregation) {
  return Array.from(
    d3.group(data, d => d[xKey]),
    ([key, values]) => {
      const numericValues = values.map(v => +v[yKey]).filter(v => !isNaN(v));
      const agg = aggregation === "mean"
        ? d3.mean(numericValues)
        : d3.sum(numericValues);
      return agg;
    }
  ).filter(v => !isNaN(v));
}

/* Calculamos estadísticas básicas */
function calculateStats(values) {
  const n = values.length;
  if (n === 0) return null;

  const sum = d3.sum(values);
  const mean = sum / n;
  const sorted = [...values].sort((a, b) => a - b);
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];
  const stdDev = Math.sqrt(values.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n);

  return {
    min: d3.min(values).toFixed(2),
    max: d3.max(values).toFixed(2),
    mean: mean.toFixed(2),
    median: median.toFixed(2),
    stdDev: stdDev.toFixed(2),
    count: n
  };
}

const Stat = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3 shadow-sm text-center">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-base font-semibold">{value}</div>
  </div>
);

const ChartStatistics = ({ data, xKey, yKey, aggregation }) => {
  const aggregatedValues = aggregateData(data, xKey, yKey, aggregation);
  const stats = calculateStats(aggregatedValues);

  if (!stats) {
    return (
      <div className="mt-6 border-t pt-4 text-sm text-gray-500">
        No hay datos numéricos para mostrar estadísticas.
      </div>
    );
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">
        Estadísticas por {aggregation === "mean" ? "media" : "suma"} de <code>{yKey}</code>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
        <Stat label="Mínimo" value={stats.min} />
        <Stat label="Máximo" value={stats.max} />
        <Stat label="Media" value={stats.mean} />
        <Stat label="Mediana" value={stats.median} />
        <Stat label="Desv. estándar" value={stats.stdDev} />
        <Stat label="Nº categorías" value={stats.count} />
      </div>
    </div>
  );
};

export default ChartStatistics;

/*
Props:
- data: array de objetos con los datos originales (sin agrupar)
- xKey: nombre de la categoría por la que se agrupa
- yKey: nombre de la columna numérica que se agrega
- aggregation: 'sum' o 'mean'
*/
