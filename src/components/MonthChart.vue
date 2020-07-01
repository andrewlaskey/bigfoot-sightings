<template>
  <div>
    <svg id="month-chart" :width="width" :height="height">
      <path id="month-data" fill="#69b3a2" />
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
            // const year = date.getFullYear()
            const month = date.getMonth()

            return new Date(1, month, 1).toISOString().split('T')[0]
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
  },
  watch: {
    bundled() {
      if (this.bundled.length > 0) {
        const svg = d3.select('#month-data')
        const x = d3
          .scaleTime()
          .domain(d3.extent(this.bundled, (d) => d.date))
          .range([this.margin.left, this.width - this.margin.right])
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(this.bundled, (d) => d.value)])
          .nice()
          .range([this.height - this.margin.bottom, this.margin.top])
        const curve = d3.curveLinear
        const area = d3
          .area()
          .curve(curve)
          .x((d) => x(d.date))
          .y0(y(0))
          .y1((d) => y(d.value))

        svg.datum(this.bundled).attr('d', area)
      }
    },
  },
}
</script>

<style>
#map {
  transform: scale(0.8);
}
</style>
