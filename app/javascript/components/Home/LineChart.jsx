import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const LineChart = () => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([10, 20, 15, 30, 25, 40, 35]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 40, left: 40 };

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6c5ce7")
      .attr("stroke-width", 3)
      .attr("d", line);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(data.length).tickFormat(i => i + 1));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "4px")
      .style("font-size", "14px");

    svg.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d, i) => x(i))
      .attr("cy", d => y(d))
      .attr("r", 5)
      .attr("fill", "#6c5ce7")
      .on("mouseover", function(event, d) {
        tooltip.style("visibility", "visible").text(`Valor: ${d}`);
        d3.select(this).attr("fill", "#ff6347");
      })
      .on("mousemove", function(event) {
        tooltip.style("top", `${event.pageY + 10}px`).style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", "#6c5ce7");
      });
  }, [data]);

  return (
    <div ref={wrapperRef} className="max-w-3xl mx-auto p-6 w-full">
      <h2 className="text-2xl text-center font-semibold text-gray-900 mb-6">Gráfico de Líneas</h2>
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default LineChart;
