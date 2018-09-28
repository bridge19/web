<template>
<div class='my-form_container'>
    <p><i class="iconfont icon-ic_upload_fail_norma"></i>确定保存当前更改？</p>
    <div class='action-btn_container'>
      <el-button @click='handleClose' size="small">取消</el-button>
      <el-button type ='primary' @click="submit()" size="small">确定</el-button>
    </div>
</div>

</template>
<script>
export default {
  data () {
    return {
      myForm: {
        intentId: ''
      },
      intentOptions: [],
      myFormRules: {
        intentId: [
          {required: true, message: '请选择意图', trigger: 'change'}
        ]
      }
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
    submit (formName) {
      this.contentConfig.reload()
      this.handleClose()
    }
  },
  mounted () {
  },
  destroyed () {
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  p{
    height: 200px;
    font-size: 16px;
    line-height: 200px;
    text-align: center;
    .iconfont{
      font-size: 25px;
      color: #F5A623;
      margin-right: 10px;
    }
  }
</style>


