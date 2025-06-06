import React, { useState } from "react";
import BarChart from "./Charts/BarChart";
import LineChart from "./Charts/LineChart";
import PieChart from "./Charts/PieChart";
import StackedBarChart from "./Charts/StackedBarChart";

const ChartDemo = () => {
  const [selectedChart, setSelectedChart] = useState("bar");

  const renderChart = () => {
    switch (selectedChart) {
      case "bar":
        return <BarChart />;
      case "line":
        return <LineChart />;
      case "pie":
        return <PieChart />;
      case "stacked":
        return <StackedBarChart />;
      default:
        return <BarChart />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <label
          htmlFor="chart-select"
          className="block mb-2 text-lg font-semibold text-gray-700"
        >
          Selecciona el tipo de gráfico:
        </label>
        <select
          id="chart-select"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
        >
          <option value="bar">Gráfico de Barras</option>
          <option value="line">Gráfico de Líneas</option>
          <option value="pie">Gráfico de Tarta</option>
          <option value="stacked">Gráfico de Barras Apiladas</option>
        </select>
      </div>

      <div>
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartDemo;
