// RoleDistributionChart.jsx
import React, { useEffect } from "react"
import * as d3 from "d3"

export default function RoleDistributionChart({ users }) {
  useEffect(() => {
    renderDonutChart(users)
  }, [users])

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-sm">
      <h2 className="text-base text-center font-semibold text-gray-800 mb-3">Distribución de roles</h2>
      <div id="admin-role-chart" className="w-full h-56 flex justify-center items-center"></div>
    </div>
  )
}

function renderDonutChart(users) {
  const data = [
    { label: "Admins", value: users.filter(u => u.admin).length },
    { label: "Usuarios", value: users.filter(u => !u.admin).length },
  ]

  const width = 250
  const height = 220
  const radius = Math.min(width, height) / 2

  d3.select("#admin-role-chart").selectAll("*").remove()

  const svg = d3.select("#admin-role-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(["#34D399", "#3B82F6"])

  const pie = d3.pie().value(d => d.value)
  const arc = d3.arc().innerRadius(50).outerRadius(radius)

  svg.selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label))
    .attr("stroke", "white")
    .style("stroke-width", "2px")

  svg.selectAll("text")
    .data(pie(data))
    .enter()
    .append("text")
    .text(d => `${d.data.label}: ${d.data.value}`)
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-size", "0.65rem")
    .style("fill", "#111827")
}
