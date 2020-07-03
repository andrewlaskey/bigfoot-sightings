<template>
  <div>
    <svg id="year-chart" :width="width" :height="height">
      <g id="year-data" fill="#69b3a2">
        <rect
          v-for="(d, i) in bundled"
          :key="i"
          :x="xScale(d.date)"
          :y="yScale(d.value)"
          :height="barHeight(d.value)"
          :width="xScale.bandwidth()"
        />
      </g>
      <g ref="brush" class="brush" />
      <g ref="xAxis" :transform="`translate(0,${height - margin.bottom})`" />
      <g ref="yAxis" :transform="`translate(${margin.left},0)`" />
    </svg>
    <p>{{ yearMin }} - {{ yearMax }}</p>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as d3Axis from 'd3-axis'
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      width: 975,
      height: 200,
      margin: { top: 20, right: 20, bottom: 30, left: 30 },
    }
  },
  computed: {
    ...mapState('records', ['records', 'yearMin', 'yearMax']),
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
    xAxisScale() {
      return d3
        .scaleTime()
        .domain([new Date(1920, 0, 1), new Date(2020, 11, 1)])
        .range([this.margin.left, this.width - this.margin.right])
    },
    brushX() {
      return d3
        .brushX()
        .extent([
          [this.margin.left, this.margin.top],
          [this.width - this.margin.right, this.height - this.margin.bottom],
        ])
        .on('end', this.brushed)
    },
  },
  watch: {
    bundled() {
      if (this.bundled.length > 0) {
        const xAxis = d3.select(this.$refs.xAxis)
        xAxis.call(
          d3Axis
            .axisBottom(this.xAxisScale)
            .ticks(d3.timeYear.every(5))
            .tickFormat(d3.timeFormat('%Y'))
        )

        const yAxis = d3.select(this.$refs.yAxis)
        yAxis.call(d3Axis.axisLeft(this.yScale).ticks(5))
      }
    },
  },
  mounted() {
    const brush = d3.select(this.$refs.brush)
    brush.call(this.brushX)
  },
  methods: {
    ...mapMutations('records', [
      'disableYearFilter',
      'enableYearFilter',
      'setYearMin',
      'setYearMax',
    ]),
    barHeight(value) {
      return this.yScale(0) - this.yScale(value)
    },
    brushed() {
      if (!d3.event.sourceEvent) return

      const selection = d3.event.selection
      const interval = d3.timeYear.every(1)

      if (!selection) {
        this.disableYearFilter()
        return
      }

      const [x0, x1] = selection.map((d) =>
        interval.round(this.xAxisScale.invert(d))
      )
      const brush = d3.select(this.$refs.brush)
      brush
        .transition()
        .call(this.brushX.move, x1 > x0 ? [x0, x1].map(this.xAxisScale) : null)

      this.enableYearFilter()
      this.setYearMin(x0.getFullYear())
      this.setYearMax(x1.getFullYear())
    },
  },
}
</script>

<style>
#map {
  transform: scale(0.8);
}
</style>
