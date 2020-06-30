<template>
  <div id="app">
    <map-view :records="records" />
    <year-slider />
  </div>
</template>

<script>
import { csv } from 'd3-fetch'
import MapView from './components/MapView.vue'
import YearSlider from './components/YearSlider.vue'

export default {
  name: 'App',
  components: {
    MapView,
    YearSlider,
  },
  data() {
    return {
      records: [],
    }
  },
  created() {
    csv('./bfro_report_locations.csv').then((data) => {
      this.records = data
    })
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
