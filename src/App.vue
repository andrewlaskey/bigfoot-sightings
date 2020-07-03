<template>
  <div id="app">
    <h1>Bigfoot Sightings</h1>
    <map-view />
    <year-chart />
    <month-chart />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MapView from './components/MapView.vue'
import YearChart from './components/YearChart.vue'
import MonthChart from './components/MonthChart.vue'

export default {
  name: 'App',
  components: {
    MapView,
    YearChart,
    MonthChart,
  },
  created() {
    this.loadRecords()
  },
  methods: {
    ...mapActions('records', ['loadRecords']),
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
