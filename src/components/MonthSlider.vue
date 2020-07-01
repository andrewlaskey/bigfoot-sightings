<template>
  <div>
    <label>
      <input id="filter-month" type="checkbox" @change="toggleFilter" />
      Filter by month
    </label>
    <input
      id="month"
      max="12"
      min="1"
      step="1"
      type="range"
      v-model="selectedMonth"
      @input="updateMinMax"
    />
    <div id="monthOutput">
      {{ selectedMonth }}
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      selectedMonth: 8,
    }
  },
  computed: {
    ...mapState('records', ['filterMonth']),
  },
  methods: {
    ...mapMutations('records', [
      'toggleMonthFilter',
      'setMonthMin',
      'setMonthMax',
    ]),
    toggleFilter() {
      this.toggleMonthFilter()

      if (this.filterMonth) {
        this.updateMinMax()
      }
    },
    updateMinMax() {
      this.setMonthMin(this.selectedMonth)
      this.setMonthMax(+this.selectedMonth)
    },
  },
}
</script>

<style></style>
