/* Componente que renderiza un gráfico de barras apiladas */
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { toPng } from 'html-to-image';

export default function StackedBarChart({ data, xKey, yKey, stackKey, aggregation }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  const handleDownload = () => {
    if (!wrapperRef.current) return;
    toPng(wrapperRef.current).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `stackedbarchart-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('Error al generar la imagen:', err);
    });
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 460;
    const margin = { top: 50, right: 30, bottom: 60, left: 100 };

    // Obtener productos realmente existentes por categoría
    const categoryToProducts = d3.group(data, d => d[xKey]);
    const stackKeys = Array.from(
      new Set(
        Array.from(categoryToProducts.values()).flatMap(group =>
          group.map(d => d[stackKey])
        )
      )
    ).filter(k => typeof k === 'string' || typeof k === 'number');

    // Agrupación por xKey y stackKey
    const grouped = d3.rollup(
      data,
      values => aggregation === 'mean'
        ? d3.mean(values, d => +d[yKey])
        : d3.sum(values, d => +d[yKey]),
      d => d[xKey],
      d => d[stackKey]
    );

    // Construcción del array para stack()
    const stackedData = Array.from(grouped, ([xVal, innerMap]) => {
      const row = { [xKey]: xVal };
      for (const k of innerMap.keys()) {
        row[k] = innerMap.get(k);
      }
      return row;
    }).sort((a, b) => {
      const valA = a[xKey];
      const valB = b[xKey];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB);
      }
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    });

    const x = d3.scaleBand()
      .domain(stackedData.map(d => String(d[xKey])))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    const y = d3.scaleLinear()
      .domain([
        0,
        d3.max(stackedData, d =>
          d3.sum(stackKeys, k => d[k] || 0)
        ) || 0
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(stackKeys)
      .range(d3.schemeTableau10);

    const stack = d3.stack()
      .keys(stackKeys)
      .value((d, key) => d[key] || 0);

    const series = stack(stackedData);

    // Tooltip
    const tooltip = d3.select(wrapper)
      .append('div')
      .attr('class', 'absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 transition-opacity duration-200 shadow-xl backdrop-blur')
      .style('z-index', 10);

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Ejes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end')
      .style('font-size', '12px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSizeOuter(0))
      .selectAll('text')
      .style('font-size', '12px');

    // Barras apiladas
    svg.selectAll('g.layer')
      .data(series)
      .join('g')
      .attr('fill', d => color(d.key))
      .attr('class', 'layer')
      .selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => x(String(d.data[xKey])))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .on('mouseover', function (event, d) {
        const stackName = d3.select(this.parentNode).datum().key;
        tooltip
          .style('opacity', 1)
          .html(`<strong>${String(d.data[xKey])}</strong><br/>${stackName}: ${(d[1] - d[0]).toFixed(2)}`)
          .style('left', `${event.offsetX + 12}px`)
          .style('top', `${event.offsetY - 35}px`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.offsetX + 12}px`)
          .style('top', `${event.offsetY - 35}px`);
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
      });

    // Etiquetas
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('fill', '#374151')
      .style('font-size', '13px')
      .text(xKey);

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('fill', '#374151')
      .style('font-size', '13px')
      .text(`${aggregation === 'mean' ? 'Media' : 'Suma'} de ${yKey}`);
  }, [data, xKey, yKey, stackKey, aggregation]);

  return (
    <div className="relative">
      <div ref={wrapperRef} className="bg-white p-6 rounded-2xl shadow-xl">
        <svg ref={svgRef} className="w-full h-auto" />
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
  - data: array de objetos con datos.
  - xKey: clave principal para el eje X.
  - yKey: valor numérico a agregar.
  - stackKey: clave de subdivisión para apilar las barras.
  - aggregation: 'sum' o 'mean' para valores Y.
*/
