
// initial state
const state = {
  // 为了在vuex 中使用 Element-UI消息提示组件Message
  msg: {
    count: 0,
    type: 'error',
    messate: '服务器错误'
  },
  loginCount: 0,
  userInfo: {} // 用户信息
}

// 根级别的getters
const getters = {

}

// 根级别的actions
const actions = {

}

// 根级别的mutations
const mutations = {
  'set-msg': (state, payload) => {
    state.msg = payload.msg
  },
  'set-userInfo': (state, payload) => {
    state.userInfo = payload.userInfo
  },
  //   设置登陆次数
  'set-loginCount': (state, payload) => {
    state.loginCount = payload.loginCount
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
