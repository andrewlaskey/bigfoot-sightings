<template>
  <div>
    <svg id="month-chart" :width="width" :height="height">
      <g fill="#69b3a2">
        <rect
          v-for="d in bundled"
          :key="d.month"
          :x="xScale(d.month)"
          :y="yScale(d.value)"
          :height="barHeight(d.value)"
          :width="xScale.bandwidth()"
        />
      </g>
      <g ref="xAxis" :transform="`translate(0,${height - margin.bottom})`" />
      <g ref="yAxis" :transform="`translate(${margin.left},0)`" />
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as d3Axis from 'd3-axis'
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
        return d3
          .nest()
          .key((d) => {
            const date = new Date(d.timestamp)

            return date.getMonth()
          })
          .sortKeys(d3.ascending)
          .rollup((v) => v.length)
          .entries(this.records)
          .map((entry) => {
            return {
              month: parseInt(entry.key, 10),
              value: entry.value,
            }
          })
      }

      return []
    },
    xScale() {
      return d3
        .scaleBand()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        .range([this.margin.left, this.width - this.margin.right])
        .padding(0.1)
    },
    xAxisScale() {
      return d3
        .scaleBand()
        .domain([
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ])
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
  watch: {
    bundled() {
      if (this.bundled.length > 0) {
        const xAxis = d3.select(this.$refs.xAxis)
        xAxis.call(d3Axis.axisBottom(this.xAxisScale))

        const yAxis = d3.select(this.$refs.yAxis)
        yAxis.call(d3Axis.axisLeft(this.yScale).ticks(5))
      }
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
