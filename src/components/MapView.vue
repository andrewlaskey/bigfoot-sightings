<template>
  <div>
    <svg id="map" :width="width" :height="height">
      <g>
        <path
          v-for="(d, index) in hexbinData"
          :key="index"
          :transform="`translate(${d.x},${d.y})`"
          :d="hexbin.hexagon()"
          :fill="color(d.length)"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import * as d3Hexbin from 'd3-hexbin'
import { mapGetters } from 'vuex'
import statesJson from '../assets/states-albers-10m.json'

export default {
  data() {
    return {
      hexbin: d3Hexbin
        .hexbin()
        .extent([
          [0, 0],
          [this.width, this.height],
        ])
        .radius(10),
      width: 975,
      height: 610,
    }
  },
  computed: {
    ...mapGetters('records', ['filteredRecords']),
    projection() {
      if (this.width && this.height) {
        return d3
          .geoAlbersUsa()
          .scale(1300)
          .translate([this.width / 2, this.height / 2])
      }

      return d3.geoAlbersUsa()
    },
    geoData() {
      if (
        Array.isArray(this.filteredRecords) &&
        this.filteredRecords.length > 0
      ) {
        return this.filteredRecords.map((record) => {
          return {
            id: record.number,
            type: 'Feature',
            geometry: {
              coordinates: [+record.longitude, +record.latitude],
              type: 'Point',
            },
            properties: {
              class: record.classification,
              datetime: record.timestamp,
            },
          }
        })
      }

      return []
    },
    projectionData() {
      if (
        Array.isArray(this.filteredRecords) &&
        this.filteredRecords.length > 0
      ) {
        return this.filteredRecords.reduce((points, record) => {
          const newPoint = this.projection([
            +record.longitude,
            +record.latitude,
          ])

          if (newPoint) {
            points.push(newPoint)
          }

          return points
        }, [])
      }

      return []
    },
    hexbinData() {
      if (this.projectionData.length > 0) {
        return this.hexbin(this.projectionData)
      }

      return []
    },
  },
  mounted() {
    const svg = d3.select('#map')
    const topo = topojson.mesh(statesJson, statesJson.objects.states)
    const path = d3.geoPath()

    svg
      .append('path')
      .datum(topo)
      .attr('fill', 'none')
      .attr('stroke', '#777')
      .attr('stroke-width', 0.5)
      .attr('stroke-linejoin', 'round')
      .attr('d', path)
  },
  methods: {
    color(size) {
      const scale = d3
        .scaleSqrt(
          [0, d3.max(this.hexbinData, (d) => d.length)],
          [0, this.hexbin.radius() * Math.SQRT2]
        )
        .range(['transparent', '#69b3a2'])

      return scale(size)
    },
  },
}
</script>

<style>
#map {
  transform: scale(0.8);
}
</style>
