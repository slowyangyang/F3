import Vue from 'vue'
import Vuex from 'vuex'
import db from 'common/localstorage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    TOKEN:db.get("TOKEN"),
    expire_time: db.get("expireTime")
  },
  getters: {
    emitCookie(state){
      return state.token
    }
  },
  mutations: {
    saveExpireTime(state,payload){
      state.expire_time = payload.time
    },
    saveUser(state,payload){
      state.user_info = payload
    },
    saveToken(state,payload){
      state.TOKEN = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
