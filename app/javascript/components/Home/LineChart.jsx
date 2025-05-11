import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function LineChart() {
  const svgRef = useRef();
  const wrapperRef = useRef();

  const data = [10, 20, 15, 30, 25, 40, 35];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth;
    const height = 420;
    const margin = { top: 60, right: 30, bottom: 60, left: 100 };

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
      .call(d3.axisBottom(x).ticks(data.length).tickFormat(i => `Día ${i + 1}`))
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end')
      .style('font-size', '12px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSizeOuter(0))
      .selectAll('text')
      .style('font-size', '12px');

    const path = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);

    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d, i) => x(i))
      .attr('cy', d => y(d))
      .attr('r', 5)
      .attr('fill', '#3b82f6')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', d3.color('#3b82f6').darker(0.7));
        const { top, left } = wrapper.getBoundingClientRect();
        tooltip
          .style('opacity', 1)
          .html(`Valor: ${d}`)
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
        d3.select(this).attr('fill', '#3b82f6');
        tooltip.style('opacity', 0);
      });

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 18)
      .attr('x', -(height / 2))
      .attr('text-anchor', 'middle')
      .style('fill', '#374151')
      .style('font-size', '13px')
      .text('Cantidad');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('fill', '#374151')
      .style('font-size', '12px')
      .text('Día');
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-white p-6 rounded-2xl shadow-xl">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
}
