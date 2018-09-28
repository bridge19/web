<template>
<div class='my-form_container'>
    <p>确定删除{{contentConfig.subjectName}}?</p>
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
<style>

</style>


