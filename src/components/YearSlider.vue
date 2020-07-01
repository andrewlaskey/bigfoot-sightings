<template>
  <div>
    <label>
      <input id="filter-year" type="checkbox" @change="toggleYearFilter" />
      Filter by year
    </label>
    <input
      id="year"
      max="2020"
      min="1920"
      step="5"
      type="range"
      v-model="selectedYear"
      @input="updateMinMax"
    />
    <div id="yearOutput">
      {{ selectedYear }}
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      selectedYear: 1985,
    }
  },
  computed: {
    ...mapState('records', ['filterYear']),
  },
  methods: {
    ...mapMutations('records', [
      'toggleYearFilter',
      'setYearMin',
      'setYearMax',
    ]),
    toggleFilter() {
      this.toggleFilter()

      if (this.filterYear) {
        this.updateMinMax()
      }
    },
    updateMinMax() {
      this.setYearMin(this.selectedYear)
      this.setYearMax(+this.selectedYear + 5)
    },
  },
}
</script>

<style></style>
