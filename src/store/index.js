import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    settings,
  },
  getters
})

export default store
