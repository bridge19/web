import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

export function showSuccess (message) {
  Vue.$message({
    type: 'success',
    message
  })
}
export function showError (message) {
  Vue.$message({
    type: 'error',
    message
  })
}
