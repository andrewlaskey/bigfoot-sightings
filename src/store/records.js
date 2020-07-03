import { csv } from 'd3-fetch'

const validYear = function (datetime, min, max) {
  const incidentDate = new Date(datetime)
  const year = incidentDate.getFullYear()

  return year >= min && year <= max
}

const validMonth = function (datetime, min, max) {
  const incidentDate = new Date(datetime)
  const month = incidentDate.getMonth() + 1

  return month >= min && month <= max
}


const state = () => ({
  records: [],
  filterYear: false,
  yearMin: 1920,
  yearMax: 2020,
  filterMonth: false,
  monthMin: 0,
  monthMax: 11
})

const getters = {
  filteredRecords(state) {
    let filtered = state.records

    if (state.filterYear) {
      filtered = filtered.filter(record => {
        return validYear(record.timestamp, state.yearMin, state.yearMax)
      })
    }

    if (state.filterMonth) {
      filtered = filtered.filter(record => {
        return validMonth(record.timestamp, state.monthMin, state.monthMax)
      })
    }

    return filtered
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
  },

  toggleMonthFilter(state) {
    state.filterMonth = !state.filterMonth
  },

  enableMonthFilter(state) {
    state.filterMonth = true
  },

  disableMonthFilter(state) {
    state.filterMonth = false
  },

  setMonthMin(state, month) {
    state.monthMin = parseInt(month, 10)
  },

  setMonthMax(state, month) {
    state.monthMax = parseInt(month, 10)
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