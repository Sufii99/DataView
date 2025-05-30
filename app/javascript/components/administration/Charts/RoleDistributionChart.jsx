import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function RoleDistributionChart({ users }) {
  const chartRef = useRef()

  useEffect(() => {
    if (!users || users.length === 0) return
    renderDonutChart(users, chartRef.current)
  }, [users])

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (!chartRef.current.contains(e.relatedTarget)) {
        d3.select(chartRef.current).select("#tooltip").style("opacity", 0)
      }
    }

    const el = chartRef.current
    el?.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el?.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const adminCount = users.filter(u => u.admin).length
  const userCount = users.length - adminCount

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-sm relative flex flex-col items-center">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">Distribución de roles</h2>
      <div ref={chartRef} className="w-full h-56 flex justify-center items-center relative" />

      {/* Leyenda */}
      <div className="mt-4 flex gap-6 justify-center text-sm">
        <LegendItem label="Admins" count={adminCount} color="#34D399" />
        <LegendItem label="Usuarios" count={userCount} color="#3B82F6" />
      </div>
    </div>
  )
}

function LegendItem({ label, count, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-gray-700">{label}</span>
      <span className="text-gray-400">({count})</span>
    </div>
  )
}

function renderDonutChart(users, container) {
  const data = [
    { label: "Admins", value: users.filter(u => u.admin).length },
    { label: "Usuarios", value: users.filter(u => !u.admin).length },
  ]

  const width = 250
  const height = 220
  const radius = Math.min(width, height) / 2

  d3.select(container).selectAll("*").remove()

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(["#34D399", "#3B82F6"])

  const pie = d3.pie().value(d => d.value)
  const arc = d3.arc().innerRadius(60).outerRadius(radius)

  /* Tooltip */
  const tooltip = d3.select(container)
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 transition-opacity duration-200 shadow-xl backdrop-blur z-10")
    .style("position", "absolute")

  svg.selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", d3.color(color(d.data.label)).darker(0.7))
      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.data.label}</strong><br/>${d.data.value} usuarios`)
        .style("left", `${event.offsetX + 12}px`)
        .style("top", `${event.offsetY - 35}px`)
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.offsetX + 12}px`)
        .style("top", `${event.offsetY - 35}px`)
    })
    .on("mouseleave", function (event, d) {
      d3.select(this).style("fill", color(d.data.label))
      tooltip.style("opacity", 0)
    })
    .transition()
    .duration(1000)
    .ease(d3.easeCubicOut)
    .attrTween("d", function (d) {
      const i = d3.interpolate(d.startAngle, d.endAngle)
      return function (t) {
        d.endAngle = i(t)
        return arc(d)
      }
    })
}
