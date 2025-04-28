import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const PieChart = () => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([
    { label: "A", value: 10 },
    { label: "B", value: 20 },
    { label: "C", value: 30 },
    { label: "D", value: 40 }
  ]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const pie = d3.pie()
      .value(d => d.value);

    const data_ready = pie(data);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "4px")
      .style("font-size", "14px");

    g.selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("mouseover", function(event, d) {
        tooltip.style("visibility", "visible").text(`${d.data.label}: ${d.data.value}`);
        d3.select(this).attr("opacity", 0.7);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", `${event.pageY + 10}px`).style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("opacity", 1);
      });

    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150},${20})`);

    legend.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 25)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d, i) => color(i));

    legend.selectAll("text")
      .data(data)
      .join("text")
      .attr("x", 24)
      .attr("y", (d, i) => i * 25 + 13)
      .text(d => d.label)
      .attr("font-size", "14px")
      .attr("fill", "#333");
  }, [data]);

  return (
    <div ref={wrapperRef} className="max-w-3xl mx-auto p-6 w-full">
      <h2 className="text-2xl text-center font-semibold text-gray-900 mb-6">Gráfico de Tarta</h2>
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default PieChart;
