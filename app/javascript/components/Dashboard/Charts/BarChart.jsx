import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { toPng } from 'html-to-image';

export default function BarChart({ data, xKey, yKey, aggregation }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  const handleDownload = () => {
    if (!wrapperRef.current) return;
    toPng(wrapperRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `barchart-${Date.now()}.png`;
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
    );

    let tooltip = d3.select(wrapper).select("#tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select(wrapper)
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "absolute pointer-events-none bg-black text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity duration-200");
    }

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const x = d3.scaleBand()
      .domain(aggregatedData.map(d => d[xKey]))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(aggregatedData, d => +d[yKey]) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll(".bar")
      .data(aggregatedData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d[xKey]))
      .attr("width", x.bandwidth())
      .attr("y", y(0))
      .attr("height", 0)
      .attr("fill", "#6366f1")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#4f46e5");
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d[xKey]}</strong>: ${d[yKey].toFixed(2)}`)
          .style("left", `${event.offsetX + 10}px`)
          .style("top", `${event.offsetY - 30}px`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.offsetX + 10}px`)
          .style("top", `${event.offsetY - 30}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#6366f1");
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(800)
      .attr("y", d => y(+d[yKey]))
      .attr("height", d => y(0) - y(+d[yKey]));
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
