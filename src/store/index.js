import Vue from 'vue'
import Vuex from 'vuex'
import records from './records.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    records
  },
  strict: debug,
})