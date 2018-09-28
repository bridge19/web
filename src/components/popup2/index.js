import MyDailog from './my-dialog'
import Vue from 'vue'
const div = document.createElement('div')
div.id = 'dialog-content-two'
document.body.appendChild(div)
function open (config) {
  let Content = config.content
  new Vue({
    data: function () {
      return {
        dialogConfig: {
          title: config.title,
          width: config.width || '800px',
          content: config.content,
          contentConfig: config.contentConfig || {},
          close: config.close
        },
        show: true
      }
    },
    components: {
      'my-dialog-two': MyDailog,
      'my-form-two': Content
    },
    methods: {
      Myclose (param) {
        this.show = false
        this.dialogConfig.close(param)
        this.$destroy()
      }
    },
    template: `
      <my-dialog-two
        :show='show'
        :title='dialogConfig.title'
        :width='dialogConfig.width'
        :handleClose="Myclose"
      >
        <my-form-two
        slot="content"
        :handleClose="Myclose"
        :contentConfig="dialogConfig.contentConfig"
        >
        </my-form-two>
      </my-dialog-two>`
  }).$mount('#dialog-content-two')
}

function close () {
  if (document.getElementById('el-dialog-two')) {
    document.body.removeChild(document.getElementById('el-dialog-two'))
    document.body.appendChild(div)
  }
}
export default {
  open,
  close
}
