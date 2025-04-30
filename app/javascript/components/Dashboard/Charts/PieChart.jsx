import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { toPng } from 'html-to-image';

export default function PieChart({ data, valueKey, aggregation }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  const handleDownload = () => {
    if (!wrapperRef.current) return;
    toPng(wrapperRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `piechart-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error al generar la imagen:', err);
      });
  };

  useEffect(() => {
    if (!data || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const categoryKey = Object.keys(data[0]).find(k => k !== valueKey);

    const aggregated = Array.from(
      d3.group(data, d => d[categoryKey]),
      ([key, values]) => ({
        label: key,
        value: aggregation === 'mean'
          ? d3.mean(values, v => +v[valueKey])
          : d3.sum(values, v => +v[valueKey])
      })
    );

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const pie = d3.pie()
      .value(d => d.value);

    const data_ready = pie(aggregated);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const group = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    group.selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("class", "slice")
      .attr("fill", (d, i) => colors(i))
      .attr("stroke", "none")
      .transition()
      .duration(800)
      .attrTween("d", function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(i(t));
        };
      });
  }, [data, valueKey, aggregation]);

  return (
    <div className="relative">
      <div ref={wrapperRef} className="bg-white p-6 rounded-2xl shadow-lg">
        <svg ref={svgRef} className="w-full h-auto"></svg>
      </div>
      <button
        onClick={handleDownload}
        className="mt-2 ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Descargar como PNG
      </button>
    </div>
  );
}
