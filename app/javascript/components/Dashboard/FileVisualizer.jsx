import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Papa from "papaparse";

export default function FileVisualizer({ file }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");

  useEffect(() => {
    if (!file || !file.file_url) return;

    /* Fetch y parseo del archivo CSV completo */
    const fetchData = async () => {
      try {
        const response = await fetch(file.file_url);
        const text = await response.text();
        const parsed = Papa.parse(text, { header: true });
        if (parsed.data && parsed.data.length > 0) {
          const keys = Object.keys(parsed.data[0]);
          setColumns(keys);
          setXColumn(keys[0]);
          setYColumn(keys[1] || keys[0]);
          setData(parsed.data);
        }
      } catch (error) {
        console.error("Error al cargar el CSV:", error);
      }
    };

    fetchData();
  }, [file]);

  useEffect(() => {
    if (data.length === 0 || !xColumn || !yColumn) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const x = d3.scaleBand()
      .domain(data.map(d => d[xColumn]))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d[yColumn]) || 0])
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
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d[xColumn]))
      .attr("y", d => y(+d[yColumn]))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(+d[yColumn]))
      .attr("fill", "#6c5ce7")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("transition", "all 0.3s ease");
  }, [data, xColumn, yColumn]);

  return (
    <div className="space-y-6">
      <div ref={wrapperRef} className="bg-white p-6 rounded-lg shadow-lg">
        <svg ref={svgRef} className="w-full h-auto"></svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold">Eje X</label>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            {columns.map((col, idx) => (
              <option key={idx} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Eje Y</label>
          <select
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            {columns.map((col, idx) => (
              <option key={idx} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
