
// 我们组装模块并导出 store 的地方
import Vue from 'vue'
import Vuex from 'vuex'
import global from './global'
import verbalManage from './modules/verbalManage'
import verbalTemplate from './modules/verbalTemplate'
import userInfoManage from './modules/userInfoManage'

Vue.use(Vuex)
// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  ...global,
  modules: {
    verbalManage,
    verbalTemplate,
    userInfoManage
  }
  // strict: debug
})
