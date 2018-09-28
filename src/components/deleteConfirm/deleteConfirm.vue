<template>
<div class='my-form_container'>
    <div class='delete_container'>
      <i class='icon-ic_upload_fail_norma iconfont font30 fontWarningStatus'></i>
      <span v-html='contentConfig.content'></span>
    </div>
    <div class='action-btn_container'>
      <el-button @click='handleClose' size="small">取消</el-button>
      <el-button type ='primary' @click="submit()" size="small">确定</el-button>
    </div>
</div>

</template>
<script>
// import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      roleId: null
    }
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
    submit () {
      this.handleClose()
      this.contentConfig.reload()
    }
  },
  mounted () {
    this.roleId = this.contentConfig.roleId
  }
}
</script>
<style>

</style>


