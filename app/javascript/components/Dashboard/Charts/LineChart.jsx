import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { toPng } from 'html-to-image';

export default function LineChart({ data, xKey, yKey, aggregation }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  const handleDownload = () => {
    if (!wrapperRef.current) return;
    toPng(wrapperRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `linechart-${Date.now()}.png`;
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
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };

    const aggregatedData = Array.from(
      d3.group(data, d => d[xKey]),
      ([key, values]) => ({
        [xKey]: key,
        [yKey]: aggregation === 'mean'
          ? d3.mean(values, v => +v[yKey])
          : d3.sum(values, v => +v[yKey])
      })
    ).sort((a, b) => a[xKey].localeCompare(b[xKey]));

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const x = d3.scalePoint()
      .domain(aggregatedData.map(d => d[xKey]))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(aggregatedData, d => +d[yKey]) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d[xKey]))
      .y(d => y(+d[yKey]));

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const path = svg.append("path")
      .datum(aggregatedData)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("d", line);

    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }, [data, xKey, yKey, aggregation]);

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
