<template>
  <div>
    <svg id="year-chart" :width="width" :height="height">
      <g id="year-data" fill="#69b3a2">
        <rect
          v-for="d in bundled"
          :key="d.date"
          :x="xScale(d.date)"
          :y="yScale(d.value)"
          :height="barHeight(d.value)"
          :width="xScale.bandwidth()"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      width: 975,
      height: 200,
      margin: { top: 20, right: 20, bottom: 30, left: 30 },
    }
  },
  computed: {
    ...mapState('records', ['records']),
    bundled() {
      if (this.records.length > 0) {
        const parseTime = d3.timeParse('%Y-%m-%d')

        return d3
          .nest()
          .key((d) => {
            const date = new Date(d.timestamp)
            const year = date.getFullYear()
            // const month = date.getMonth()

            return new Date(year, 0, 1).toISOString().split('T')[0]
          })
          .sortKeys(d3.ascending)
          .rollup((v) => v.length)
          .entries(this.records)
          .map((entry) => {
            return {
              date: parseTime(entry.key),
              value: entry.value,
            }
          })
      }

      return []
    },
    xScale() {
      return d3
        .scaleBand()
        .domain(d3.timeYears(new Date(1920, 0, 1), new Date(2020, 11, 1)))
        .range([this.margin.left, this.width - this.margin.right])
        .padding(0.1)
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.bundled, (d) => d.value)])
        .nice()
        .range([this.height - this.margin.bottom, this.margin.top])
    },
  },
  methods: {
    barHeight(value) {
      return this.yScale(0) - this.yScale(value)
    },
  },
}
</script>

<style>
#map {
  transform: scale(0.8);
}
</style>
