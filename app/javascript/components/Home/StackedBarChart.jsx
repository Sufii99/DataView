import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function StackedBarChartDemo() {
  const svgRef = useRef();
  const wrapperRef = useRef();

  const data = [
    { trimestre: "Q1", ventas: 40, soporte: 20, marketing: 15 },
    { trimestre: "Q2", ventas: 35, soporte: 25, marketing: 20 },
    { trimestre: "Q3", ventas: 50, soporte: 15, marketing: 30 },
    { trimestre: "Q4", ventas: 45, soporte: 30, marketing: 25 }
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 420;
    const margin = { top: 60, right: 30, bottom: 60, left: 100 };

    const keys = ["ventas", "soporte", "marketing"];

    const x = d3.scaleBand()
      .domain(data.map(d => d.trimestre))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => keys.reduce((sum, k) => sum + d[k], 0))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeTableau10);

    const stack = d3.stack().keys(keys);
    const series = stack(data);

    const tooltip = d3.select(wrapper)
      .append("div")
      .attr("class", "absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 transition-opacity duration-200 shadow-xl backdrop-blur")
      .style("z-index", 10);

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSizeOuter(0))
      .selectAll("text")
      .style("font-size", "12px");

    svg.selectAll("g.layer")
      .data(series)
      .join("g")
      .attr("class", "layer")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data.trimestre))
      .attr("width", x.bandwidth())
      .attr("rx", 4)
      .attr("y", y(0))
      .attr("height", 0)
      .on("mouseover", function (event, d) {
        const key = d3.select(this.parentNode).datum().key;
        d3.select(this).attr("fill", d3.color(color(key)).darker(0.7));
        const { top, left } = wrapper.getBoundingClientRect();
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.data.trimestre}</strong><br/>${key}: ${(d[1] - d[0]).toFixed(2)}`)
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
        const key = d3.select(this.parentNode).datum().key;
        d3.select(this).attr("fill", color(key));
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("fill", "#374151")
      .style("font-size", "13px")
      .text("Trimestre");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("fill", "#374151")
      .style("font-size", "13px")
      .text("Total por área");
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-white p-6 rounded-2xl shadow-xl">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
}
