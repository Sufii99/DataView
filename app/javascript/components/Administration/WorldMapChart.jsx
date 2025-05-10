import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

export default function WorldMapChart({ countryData }) {
  const mapRef = useRef(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    if (Object.keys(countryData).length > 0) drawMap()
  }, [countryData, selectedCountry])

  function normalizeCountryName(name) {
    const map = {
      "Spain": "España",
      "France": "Francia",
      "Mexico": "México",
      "Germany": "Alemania",
      "Italy": "Italia",
      "United Kingdom": "Reino Unido",
      "United States of America": "Estados Unidos",
      "Portugal": "Portugal",
      "Argentina": "Argentina",
      "Colombia": "Colombia",
      "Peru": "Perú",
      "Chile": "Chile",
      "Uruguay": "Uruguay",
      "Venezuela": "Venezuela"
    }
    return map[name] || name
  }

  const drawMap = async () => {
    d3.select(mapRef.current).selectAll("*").remove()

    const width = 800
    const height = 450

    const svg = d3.select(mapRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto")

    const projection = d3.geoNaturalEarth1()
      .scale(130)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)
    const geoData = await d3.json("/maps/world.geojson")

    const maxUsers = Math.max(...Object.values(countryData))
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, maxUsers || 1])

    svg.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => {
        const name = d.properties.name
        const normalized = normalizeCountryName(name)
        const count = countryData[normalized] || 0
        return count > 0 ? colorScale(count) : "#E5E7EB"
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", d =>
        d.properties.name === selectedCountry ? 2.5 : 0.5
      )
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedCountry(d.properties.name)
      })
      .append("title")
      .text(d => {
        const name = d.properties.name
        const normalized = normalizeCountryName(name)
        const count = countryData[normalized] || 0
        return `${normalized}: ${count}`
      })
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full">
      <h2 className="text-base text-center font-semibold text-gray-800 mb-3">Usuarios por país</h2>
      <div ref={mapRef} className="w-full" />
      {selectedCountry && (
        <p className="mt-4 text-sm text-center text-gray-700">
          {normalizeCountryName(selectedCountry)}:{" "}
          {countryData[normalizeCountryName(selectedCountry)] || 0} usuario(s)
        </p>
      )}
    </div>
  )
}
