import MyDailog from './my-dialog'
import Vue from 'vue'
const div = document.createElement('div')
div.id = 'dialog-content'
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
      'my-dialog': MyDailog,
      'my-form': Content
    },
    methods: {
      Myclose (param) {
        this.show = false
        this.dialogConfig.close(param)
        this.$destroy() //  强行销毁
      }
    },
    template: `
      <my-dialog
        :show='show'
        :title='dialogConfig.title'
        :width='dialogConfig.width'
        :handleClose="Myclose"
      >
        <my-form 
        slot="content"
        :handleClose="Myclose"
        :contentConfig="dialogConfig.contentConfig"
        >
        </my-form>
      </my-dialog>`
  }).$mount('#dialog-content')
}

function close () {
  if (document.getElementById('el-dialog')) {
    document.body.removeChild(document.getElementById('el-dialog'))
    document.body.appendChild(div)
  }
}
export default {
  open,
  close
}
