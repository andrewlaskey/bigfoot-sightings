import { csv } from 'd3-fetch'

const validYear = function (datetime, min, max) {
  const incidentDate = new Date(datetime)
  const year = incidentDate.getFullYear()

  return year >= min && year <= max
}


const state = () => ({
  records: [],
  filterYear: false,
  yearMin: 0,
  yearMax: 2050
})

const getters = {
  filteredRecords(state) {
    if (state.filterYear) {
      return state.records.filter(record => {
        return validYear(record.timestamp, state.yearMin, state.yearMax)
      })
    }

    return state.records
  }
}

const mutations = {
  setRecords(state, records) {
    state.records = records
  },

  toggleYearFilter(state) {
    state.filterYear = !state.filterYear
  },

  enableYearFilter(state) {
    state.filterYear = true
  },

  disableYearFilter(state) {
    state.filterYear = false
  },

  setYearMin(state, year) {
    state.yearMin = parseInt(year, 10)
  },

  setYearMax(state, year) {
    state.yearMax = parseInt(year, 10)
  }
}

const actions = {
  async loadRecords({ commit }) {
    try {
      const records = await csv('./bfro_report_locations.csv')

      commit('setRecords', records)
    } catch (error) {
      console.log(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}