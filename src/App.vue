<template>
  <div id="app">
    <h1>Bigfoot Sightings</h1>
    <p>
      The
      <a href="https://www.bfro.net/">BFRO</a> has an extensive database of Bigfoot sightings. The data isn't all that easy to sift through or analyze. Fortunately, a user on
      <a
        href="https://data.world/timothyrenner/bfro-sightings-data"
      >data.world</a> scraped, formatted, and uploaded CSVs of all 3000+ sightings.
    </p>
    <p>The map below is all the sightings sorted into hexbins with darker hue for areas with more points. The data can also be filtered by years and time of year.</p>
    <map-view />
    <year-chart />
    <month-chart />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MapView from "./components/MapView.vue";
import YearChart from "./components/YearChart.vue";
import MonthChart from "./components/MonthChart.vue";

export default {
  name: "App",
  components: {
    MapView,
    YearChart,
    MonthChart
  },
  created() {
    this.loadRecords();
  },
  methods: {
    ...mapActions("records", ["loadRecords"])
  }
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: auto;
  margin-right: auto;
  width: 800px;
}

#app h1 {
  text-align: center;
}
</style>
