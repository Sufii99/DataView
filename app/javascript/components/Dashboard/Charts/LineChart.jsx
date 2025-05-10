/* Componente que renderiza un gráfico de líneas */
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { toPng } from 'html-to-image';

export default function LineChart({ data, xKey, yKey, aggregation, lineColor = '#3b82f6' }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  /* Generar y descargar imagen del gráfico como PNG */
  const handleDownload = () => {
    if (!wrapperRef.current) return;
    toPng(wrapperRef.current).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `linechart-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('Error al generar la imagen:', err);
    });
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Limpiar SVG anterior

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 420;
    const margin = { top: 60, right: 30, bottom: 60, left: 100 };

    /* Agrupamos y agregamos los datos por xKey */
    const aggregatedData = Array.from(
      d3.group(data, d => d[xKey]),
      ([key, values]) => ({
        [xKey]: key,
        [yKey]: aggregation === 'mean'
          ? d3.mean(values, v => +v[yKey])
          : d3.sum(values, v => +v[yKey])
      })
    ).sort((a, b) => {
      const valA = a[xKey];
      const valB = b[xKey];
      if (typeof valA === "string" && typeof valB === "string") {
        return valA.localeCompare(valB);
      }
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    });

    /* Tooltip personalizado */
    const tooltip = d3.select(wrapper)
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 transition-opacity duration-200 shadow-xl backdrop-blur")
      .style("z-index", 10);

    /* Configuración del SVG */
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    /* Escalas */
    const x = d3.scalePoint()
      .domain(aggregatedData.map(d => d[xKey]))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(aggregatedData, d => +d[yKey]) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    /* Línea principal */
    const line = d3.line()
      .x(d => x(d[xKey]))
      .y(d => y(+d[yKey]))
      .curve(d3.curveMonotoneX);

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

    const path = svg.append("path")
      .datum(aggregatedData)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 3)
      .attr("d", line);

    /* Animación de trazo */
    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    /* Puntos de datos */
    svg.selectAll("circle")
      .data(aggregatedData)
      .join("circle")
      .attr("cx", d => x(d[xKey]))
      .attr("cy", d => y(+d[yKey]))
      .attr("r", 4)
      .attr("fill", lineColor)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", d3.color(lineColor).darker(0.7));
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d[xKey]}</strong><br/>${yKey}: ${d[yKey].toFixed(2)}`)
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY - 35}px`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY - 35}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", lineColor);
        tooltip.style("opacity", 0);
      });

    /* Etiqueta eje Y */
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 18)
      .attr('x', -(height / 2))
      .attr('text-anchor', 'middle')
      .style('fill', '#374151')
      .style('font-size', '13px')
      .text(`${aggregation === 'mean' ? 'Media' : 'Suma'} de ${yKey}`);

    /* Etiqueta eje X */
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('fill', '#374151')
      .style('font-size', '12px')
      .text(xKey);
  }, [data, xKey, yKey, aggregation, lineColor]);

  return (
    <div className="relative">
      <div ref={wrapperRef} className="bg-white p-6 rounded-2xl shadow-xl">
        <svg ref={svgRef} className="w-full h-auto"></svg>
      </div>
      <button
        onClick={handleDownload}
        className="mt-3 ml-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
      >
        Descargar como PNG
      </button>
    </div>
  );
}

/*
  - data: array de objetos con los datos agregados.
  - xKey: nombre de la columna para el eje X.
  - yKey: nombre de la columna para el eje Y.
  - aggregation: método de agregación ('sum' o 'mean') aplicado a los valores Y.
  - lineColor: color de la línea y los puntos (por defecto '#3b82f6').
*/
