<template>
  <div>
    <svg id="year-chart" :width="width" :height="height">
      <g id="year-data" fill="#69b3a2" />
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
  },
  watch: {
    bundled() {
      if (this.bundled.length > 0) {
        const svg = d3.select('#year-data')
        const x = d3
          .scaleBand()
          .domain(d3.timeYears(new Date(1920, 0, 1), new Date(2020, 11, 1)))
          .range([this.margin.left, this.width - this.margin.right])
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(this.bundled, (d) => d.value)])
          .nice()
          .range([this.height - this.margin.bottom, this.margin.top])

        svg
          .selectAll('rect')
          .data(this.bundled)
          .join('rect')
          .attr('x', (d) => x(d.date))
          .attr('y', (d) => y(d.value))
          .attr('height', (d) => y(0) - y(d.value))
          .attr('width', x.bandwidth())
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
