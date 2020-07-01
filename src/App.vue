<template>
  <div id="app">
    <map-view />
    <year-slider />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MapView from './components/MapView.vue'
import YearSlider from './components/YearSlider.vue'

export default {
  name: 'App',
  components: {
    MapView,
    YearSlider,
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
