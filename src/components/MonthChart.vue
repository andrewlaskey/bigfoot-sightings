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
      <g ref="brush" class="brush" />
      <g ref="xAxis" :transform="`translate(0,${height - margin.bottom})`" />
      <g ref="yAxis" :transform="`translate(${margin.left},0)`" />
    </svg>
    <p>{{ getFullMonth(monthMin) }} - {{ getFullMonth(monthMax) }}</p>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as d3Axis from "d3-axis";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      width: 800,
      height: 200,
      margin: { top: 20, right: 20, bottom: 30, left: 30 }
    };
  },
  computed: {
    ...mapState("records", ["records", "monthMin", "monthMax"]),
    bundled() {
      if (this.records.length > 0) {
        return d3
          .nest()
          .key(d => {
            const date = new Date(d.timestamp);

            return date.getMonth();
          })
          .sortKeys(d3.ascending)
          .rollup(v => v.length)
          .entries(this.records)
          .map(entry => {
            return {
              month: parseInt(entry.key, 10),
              value: entry.value
            };
          });
      }

      return [];
    },
    monthStrings() {
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
    },
    xScale() {
      return d3
        .scaleBand()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        .range([this.margin.left, this.width - this.margin.right])
        .padding(0.1);
    },
    xAxisScale() {
      return d3
        .scaleBand()
        .domain(this.monthStrings)
        .range([this.margin.left, this.width - this.margin.right])
        .padding(0.1);
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.bundled, d => d.value)])
        .nice()
        .range([this.height - this.margin.bottom, this.margin.top]);
    },
    brushX() {
      return d3
        .brushX()
        .extent([
          [this.margin.left, this.margin.top],
          [this.width - this.margin.right, this.height - this.margin.bottom]
        ])
        .on("end", this.brushed);
    }
  },
  watch: {
    bundled() {
      if (this.bundled.length > 0) {
        const xAxis = d3.select(this.$refs.xAxis);
        xAxis.call(d3Axis.axisBottom(this.xAxisScale));

        const yAxis = d3.select(this.$refs.yAxis);
        yAxis.call(d3Axis.axisLeft(this.yScale).ticks(5));
      }
    }
  },
  mounted() {
    const brush = d3.select(this.$refs.brush);
    brush.call(this.brushX);
  },
  methods: {
    ...mapMutations("records", [
      "disableMonthFilter",
      "enableMonthFilter",
      "setMonthMin",
      "setMonthMax"
    ]),
    getFullMonth(value) {
      const date = new Date(2000, value, 1);

      return d3.timeFormat("%B")(date);
    },
    barHeight(value) {
      return this.yScale(0) - this.yScale(value);
    },
    brushed() {
      if (!d3.event.sourceEvent) return;

      const selection = d3.event.selection;

      if (!selection) {
        this.disableMonthFilter();
        return;
      }

      const domain = this.xScale.domain();
      const range = this.xScale.range();
      const invert = d3
        .scaleQuantize()
        .domain(range)
        .range(domain);

      const [x0, x1] = selection.map(d => invert(d));
      const newX0 = this.xScale(x0);
      const newX1 =
        this.xScale(x1) + this.xScale.bandwidth() + this.xScale.padding();

      const brush = d3.select(this.$refs.brush);

      brush
        .transition()
        .call(this.brushX.move, newX1 > newX0 ? [newX0, newX1] : null);

      this.enableMonthFilter();
      this.setMonthMin(x0);
      this.setMonthMax(x1);
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  text-align: center;
}
</style>