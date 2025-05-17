/* Componente que renderiza un gráfico de pastel (pie chart) */
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { toPng } from 'html-to-image';

export default function PieChart({ data, valueKey, categoryKey, aggregation }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  /* Generar y descargar imagen del gráfico como PNG */
  const handleDownload = () => {
    if (!wrapperRef.current) return;
    toPng(wrapperRef.current).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `piechart-${Date.now()}.png`;
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
    const radius = Math.min(width, height) / 2 - 40;

    /* Agregamos valores por categoría (suma o media) */
    const aggregated = Array.from(
      d3.group(data, d => d[categoryKey]),
      ([key, values]) => ({
        label: key,
        value: aggregation === 'mean'
          ? d3.mean(values, v => +v[valueKey])
          : d3.sum(values, v => +v[valueKey])
      })
    );

    const total = d3.sum(aggregated, d => d.value); // Total para calcular porcentajes

    /* Tooltip personalizado */
    const tooltip = d3.select(wrapper)
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 transition-opacity duration-200 shadow-xl backdrop-blur")
      .style("z-index", 10);

    /* Configuración SVG */
    svg
      .attr("width", width)
      .attr("height", height + 60)
      .attr("viewBox", `0 0 ${width} ${height + 60}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const pie = d3.pie().value(d => d.value);
    const data_ready = pie(aggregated);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius * 0.6);
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const group = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    /* Slices del gráfico */
    group.selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("class", "slice")
      .attr("fill", (d, i) => colors(i))
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.data.label}</strong><br/>${valueKey}: ${d.data.value.toFixed(2)}<br/>${((d.data.value / total) * 100).toFixed(1)}%`)
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY - 35}px`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY - 35}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(800)
      .attrTween("d", function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(i(t));
        };
      });

    /* Porcentaje dentro de cada sector */
    group.selectAll("text")
      .data(data_ready)
      .join("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fill", "white")
      .style("font-size", "11px")
      .text(d => `${((d.data.value / total) * 100).toFixed(1)}%`);

    /* Etiqueta inferior del gráfico */
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .style("fill", "#374151")
      .style("font-size", "13px")
      .text(`${aggregation === 'mean' ? 'Media' : 'Suma'} de ${valueKey}`);

    /* Leyenda */
    const legend = svg.append("g")
      .attr("transform", `translate(${width / 2},${height + 10})`);

    const legendItems = legend.selectAll("g")
      .data(aggregated)
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

  }, [data, valueKey, categoryKey, aggregation]);

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
  - valueKey: clave del valor numérico que se representa en el gráfico.
  - categoryKey: clave de la categoría que define los sectores.
  - aggregation: método de agregación ('sum' o 'mean') aplicado al valueKey.
*/
