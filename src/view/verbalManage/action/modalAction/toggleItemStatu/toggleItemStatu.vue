<template>
<div class='my-form_container'>
  <div class="action-form_container textC">
    <p>
      <span>您将为</span><span class="blue">{{contentConfig.companyName}}</span><span>企业{{contentConfig.toggle}}</span><span class="blue">{{contentConfig.templateName}}话术？</span>
        
    </p>
  </div>
  <div class='action-btn_container'>
    <el-button @click='handleClose'>取消</el-button>
    <el-button type ='primary' @click="submit(contentConfig)">确定</el-button>
  </div>
</div>
  
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    contentConfig: {
      type: Object
    },
    handleClose: {
      type: Function,
      required: true
    }
  },
  methods: {
    submit (contentConfig) {
      let url = ''
      if (contentConfig.toggle === '删除') {
        url = 'template/delete'
      } else if (contentConfig.toggle === '启用') {
        url = 'template/active'
      } else if (contentConfig.toggle === '停用') {
        url = 'template/dead'
      }
      this.$post(url, {
        templateId: contentConfig.templateId
      })
        .then(res => {
          this.contentConfig.reload(res)
          this.handleClose()
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.data.error.message
          })
        })
    }
  }
}
</script>
<style scoped>
.action-form_container p{
  width: 300px;
  margin: 66px auto;
}
.blue{
  color: #079af6;
}
</style>
