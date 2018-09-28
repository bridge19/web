// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import '@/common/stylus/index'
import '@/common/stylus/font/iconfont'
// import '@/common/js/dialog-draggable'
import store from '@/store/index'
import {post, fetch, patch, put, del} from './service/http'
import '@/common/js/audio'
import VueI18n from 'vue-i18n'

import ZkTable from 'vue-table-with-tree-grid'
// 定义全局变量
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
Vue.prototype.$patch = patch
Vue.prototype.$put = put
Vue.prototype.$delete = del
// Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(Vuex)
Vue.use(ZkTable)
const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    'zh': require('./common/lang/zh.json'),
    'en': require('./common/lang/en.json')
  }
})

// Vue.config.silent = true
/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  template: '<App/>',
  components: {App}
})
