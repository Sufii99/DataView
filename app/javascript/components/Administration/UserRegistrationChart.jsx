import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

export default function UserRegistrationChart() {
  const [data, setData] = useState([])
  const svgRef = useRef()
  const wrapperRef = useRef()

  useEffect(() => {
    fetch("/api/admin/users/registration_stats")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error al cargar estadísticas:", err))
  }, [])

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const wrapper = wrapperRef.current
    const width = wrapper.offsetWidth
    const height = 400
    const margin = { top: 40, right: 30, bottom: 60, left: 80 }

    const formattedData = data.map((d) => {
      const [year, month] = d.date.split("-")
      const date = new Date(`${year}-${month}-01`)
      return {
        ...d,
        label: date.toLocaleDateString("es-ES", { year: "numeric", month: "long" })
      }
    })

    const x = d3.scaleBand()
      .domain(formattedData.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.25)

    const y = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.count)])
      .nice()
      .range([height - margin.bottom, margin.top])

    const tooltip = d3.select(wrapper)
      .append("div")
      .attr("class", "absolute pointer-events-none bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 transition-opacity duration-200 shadow-xl backdrop-blur z-10")
      .style("position", "absolute")

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(0)")
      .style("text-anchor", "middle")
      .style("font-size", "12px")

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6).tickSizeOuter(0))
      .selectAll("text")
      .style("font-size", "12px")

    svg.selectAll(".bar")
      .data(formattedData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.label))
      .attr("width", x.bandwidth())
      .attr("y", y(0))
      .attr("height", 0)
      .attr("rx", 4)
      .attr("fill", "#4f46e5")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", d3.color("#4f46e5").darker(0.7))
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.label}</strong><br/>Registros: ${d.count}`)
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY - 35}px`)
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY - 35}px`)
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#4f46e5")
        tooltip.style("opacity", 0)
      })
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("y", d => y(d.count))
      .attr("height", d => y(0) - y(d.count))

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("fill", "#374151")
      .style("font-size", "12px")
      .text("Mes")

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("fill", "#374151")
      .style("font-size", "12px")
      .text("Registros")
  }, [data])

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl overflow-x-auto relative">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">Evolución mensual de registros</h2>
      <div ref={wrapperRef}>
        <svg ref={svgRef} className="w-full h-auto" />
      </div>
    </div>
  )
}
