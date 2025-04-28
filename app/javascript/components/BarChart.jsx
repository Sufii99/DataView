import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const BarChart = () => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([12, 25, 8, 15, 20]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth; // Ahora la anchura es dinámica
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 40, left: 40 };

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`) // Para mantener escalabilidad en responsive
      .attr("preserveAspectRatio", "xMidYMid meet");

    const x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "4px")
      .style("font-size", "14px");

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d))
      .attr("fill", "#6c5ce7")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("transition", "all 0.3s ease")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#ff6347");
        tooltip.style("visibility", "visible").text(`Valor: ${d}`);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", `${event.pageY + 10}px`).style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#6c5ce7");
        tooltip.style("visibility", "hidden");
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => i + 1))
      .attr("class", "x-axis")
      .style("font-size", "14px")
      .style("font-family", "Arial, sans-serif");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .attr("class", "y-axis")
      .style("font-size", "14px")
      .style("font-family", "Arial, sans-serif");
  }, [data]);

  return (
    <div ref={wrapperRef} className="max-w-3xl mx-auto p-6 w-full">
      <h2 className="text-2xl text-center font-semibold text-gray-900 mb-6">Gráfico de Barras</h2>
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default BarChart;
