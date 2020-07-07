<template>
  <div class="map-view">
    <svg id="map" :width="width" :height="height">
      <path
        id="world"
        fill="#eee"
        stroke="#333"
        stroke-width="0.5"
        stroke-linejoin="round"
      />
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
import * as d3GeoProjection from 'd3-geo-projection'
import { mapGetters } from 'vuex'
import worldJson from '../assets/world-110m.json'

export default {
  data() {
    return {
      hexbin: d3Hexbin
        .hexbin()
        .extent([
          [0, 0],
          [this.width, this.height],
        ])
        .radius(4),
      width: 975,
      height: 610,
    }
  },
  computed: {
    ...mapGetters('records', ['filteredRecords']),
    projection() {
      const p0 = [-155, 55]
      const p1 = [-35, 55]
      const p2 = [-92.5, 10]

      if (this.width && this.height) {
        return d3GeoProjection
          .geoChamberlin(p0, p1, p2)
          .scale(600)
          .translate([this.width / 2, this.height / 2])
          .precision(0.1)
      }

      return d3GeoProjection.geoChamberlin(p0, p1, p2).scale(350)
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
    const world = d3.select('#world')
    const land = topojson.feature(worldJson, worldJson.objects.land)
    const path = d3.geoPath().projection(this.projection)

    world.datum(land).attr('d', path)
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

<style lang="scss" scoped>
#map {
  margin-left: auto;
  margin-right: auto;
}
</style>
