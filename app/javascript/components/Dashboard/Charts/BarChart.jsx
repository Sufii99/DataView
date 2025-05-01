/* Componente que renderiza un gráfico de barras */
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { toPng } from 'html-to-image';

export default function BarChart({ data, xKey, yKey, aggregation }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  /* Generar y descargar imagen del grafico como PNG */
  const handleDownload = () => {
    if (!wrapperRef.current) return;
    toPng(wrapperRef.current).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `barchart-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('Error al generar la imagen:', err);
    });
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Limpiar SVG anterior

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 420;
    const margin = { top: 60, right: 30, bottom: 60, left: 100 };

    /* Agrupamos datos por valor de xKey y agregamos los valores de yKey */
    const aggregatedData = Array.from(
      d3.group(data, d => d[xKey]),
      ([key, values]) => ({
        [xKey]: key,
        [yKey]: aggregation === 'mean'
          ? d3.mean(values, v => +v[yKey])
          : d3.sum(values, v => +v[yKey])
      })
    );

    /* Tooltip personalizado */
    const tooltip = d3.select(wrapper)
      .append('div')
      .attr('id', 'tooltip')
      .attr('class', 'absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 transition-opacity duration-200 shadow-xl backdrop-blur')
      .style('z-index', 10);

    /* Configuración SVG */
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    /* Escala eje X */
    const x = d3.scaleBand()
      .domain(aggregatedData.map(d => d[xKey]))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    /* Escala eje Y */
    const y = d3.scaleLinear()
      .domain([0, d3.max(aggregatedData, d => +d[yKey]) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    /* Eje X */
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    xAxis.selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end')
      .style('font-size', '12px');

    /* Eje Y */
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSizeOuter(0))
      .selectAll('text')
      .style('font-size', '12px');

    /* Barras del gráfico */
    svg.selectAll('.bar')
      .data(aggregatedData)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d[xKey]))
      .attr('width', x.bandwidth())
      .attr('y', y(0))
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', '#4f46e5')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#4338ca');
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d[xKey]}</strong><br/>${yKey}: ${d[yKey].toFixed(2)}`)
          .style('left', `${event.offsetX + 12}px`)
          .style('top', `${event.offsetY - 35}px`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.offsetX + 12}px`)
          .style('top', `${event.offsetY - 35}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#4f46e5');
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(+d[yKey]))
      .attr('height', d => y(0) - y(+d[yKey]));

    /* Etiqueta eje Y (con nombre de la columna y tipo de agregación) */
    svg.append('text')
      .attr('transform', `rotate(-90)`)
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
  }, [data, xKey, yKey, aggregation]);

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
  - aggregation: método de agregación ('sum' o 'mean') para los valores de Y.
*/