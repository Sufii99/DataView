/* Muestra estadisticas descriptivas (min, max, media...) de una columna numerica */
import React from "react";

/* Calculamos las estadísticas */
function calculateStats(values) {
  const numeric = values.map(Number).filter(v => !isNaN(v));
  const n = numeric.length;
  if (n === 0) return null;

  const sum = numeric.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const sorted = [...numeric].sort((a, b) => a - b);
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];
  const stdDev = Math.sqrt(
    numeric.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n
  );

  return {
    min: Math.min(...numeric).toFixed(2),
    max: Math.max(...numeric).toFixed(2),
    mean: mean.toFixed(2),
    median: median.toFixed(2),
    stdDev: stdDev.toFixed(2),
    count: n,
  };
}

const Stat = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3 shadow-sm text-center">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-base font-semibold">{value}</div>
  </div>
);

const ChartStatistics = ({ data }) => {
  const stats = calculateStats(data);

  if (!stats) {
    return (
      <div className="mt-6 border-t pt-4 text-sm text-gray-500">
        No hay datos numéricos para mostrar estadísticas.
      </div>
    );
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Estadísticas</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
        <Stat label="Mínimo" value={stats.min} />
        <Stat label="Máximo" value={stats.max} />
        <Stat label="Media" value={stats.mean} />
        <Stat label="Mediana" value={stats.median} />
        <Stat label="Desv. estándar" value={stats.stdDev} />
        <Stat label="Total de registros" value={stats.count} />
      </div>
    </div>
  );
};

export default ChartStatistics;

/*
Props:
- data: array de valores numéricos (ej. [12, 45, 67, 34, ...])
*/
