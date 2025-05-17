import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function PieChart() {
  const svgRef = useRef();
  const wrapperRef = useRef();

  const data = [
    { label: "A", value: 10 },
    { label: "B", value: 20 },
    { label: "C", value: 30 },
    { label: "D", value: 40 }
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 420;
    const radius = Math.min(width, height) / 2 - 40;

    const pie = d3.pie().value(d => d.value);
    const data_ready = pie(data);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius * 0.6);
    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const total = d3.sum(data, d => d.value);

    const tooltip = d3.select(wrapper)
      .append("div")
      .attr("class", "absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 transition-opacity duration-200 shadow-xl backdrop-blur")
      .style("z-index", 10);

    svg
      .attr("width", width)
      .attr("height", height + 60)
      .attr("viewBox", `0 0 ${width} ${height + 60}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const group = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    group.selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("fill", (d, i) => colors(i))
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        const { top, left } = wrapper.getBoundingClientRect();
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.data.label}</strong><br/>Valor: ${d.data.value}<br/>${((d.data.value / total) * 100).toFixed(1)}%`)
          .style("left", `${event.clientX - left + 12}px`)
          .style("top", `${event.clientY - top - 35}px`);
      })
      .on("mousemove", function (event) {
        const { top, left } = wrapper.getBoundingClientRect();
        tooltip
          .style("left", `${event.clientX - left + 12}px`)
          .style("top", `${event.clientY - top - 35}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(800)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t));
        };
      });

    group.selectAll("text")
      .data(data_ready)
      .join("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fill", "white")
      .style("font-size", "11px")
      .text(d => `${((d.data.value / total) * 100).toFixed(1)}%`);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .style("fill", "#374151")
      .style("font-size", "13px")
      .text("Distribución de categorías");

    const legend = svg.append("g")
      .attr("transform", `translate(${width / 2},${height + 10})`);

    const legendItems = legend.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${-width / 4 + (i % 4) * 120},${Math.floor(i / 4) * 20})`);

    legendItems.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", (d, i) => colors(i));

    legendItems.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .style("font-size", "12px")
      .style("fill", "#374151")
      .text(d => d.label);
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-white p-6 rounded-2xl shadow-xl">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
}
