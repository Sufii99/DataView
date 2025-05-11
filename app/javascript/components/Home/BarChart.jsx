import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function BarChart() {
  const svgRef = useRef();
  const wrapperRef = useRef();

  const data = [
    { categoria: 'Ventas', valor: 120 },
    { categoria: 'Marketing', valor: 80 },
    { categoria: 'Soporte', valor: 45 },
    { categoria: 'Producto', valor: 150 },
    { categoria: 'Otros', valor: 60 }
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Limpieza del SVG

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 420;
    const margin = { top: 60, right: 30, bottom: 60, left: 100 };

    const x = d3.scaleBand()
      .domain(data.map(d => d.categoria))
      .range([margin.left, width - margin.right])
      .padding(0.25);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.valor)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const tooltip = d3.select(wrapper)
      .append('div')
      .attr('class', 'absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 transition-opacity duration-200 shadow-xl backdrop-blur')
      .style('z-index', 10);

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

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

    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.categoria))
      .attr('width', x.bandwidth())
      .attr('y', y(0))
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', '#4f46e5')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', d3.color('#4f46e5').darker(0.7));
        const { top, left } = wrapper.getBoundingClientRect();
        tooltip
          .style('opacity', 1)
          .html(`<strong>${d.categoria}</strong><br/>Valor: ${d.valor}`)
          .style('left', `${event.clientX - left + 12}px`)
          .style('top', `${event.clientY - top - 35}px`);
      })
      .on('mousemove', function (event) {
        const { top, left } = wrapper.getBoundingClientRect();
        tooltip
          .style('left', `${event.clientX - left + 12}px`)
          .style('top', `${event.clientY - top - 35}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#4f46e5');
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.valor))
      .attr('height', d => y(0) - y(d.valor));

    svg.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('y', 18)
      .attr('x', -(height / 2))
      .attr('text-anchor', 'middle')
      .style('fill', '#374151')
      .style('font-size', '13px')
      .text('Valor');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('fill', '#374151')
      .style('font-size', '12px')
      .text('Categoría');
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-white p-6 rounded-2xl shadow-xl">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
}
