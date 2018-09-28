<template>
<div class='my-form_container'>
  <el-form
        label-position="left"
        label-width="100px"
        :model="myForm"
        ref='myForm'
        :rules='myFormRules'
        class='my-form'
      >
      

      <el-form-item prop='intentId' label='意图选择'>
        <el-select v-model="myForm.intentId" @change="selectGet" filterable placeholder="请选择" style="width: 280px">
          <el-option
            v-for="item in intentOptions"
            :key="item.id"
            :label="item.intentionName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class='action-btn_container'>
      <el-button @click='handleClose' size="small">取消</el-button>
      <el-button type ='primary' @click="submit('myForm')" size="small">确定</el-button>
    </div>
</div>

</template>
<script>
// import Validator from '@/common/js/validator'
export default {
  data () {
    return {
      myForm: {
        intentId: '',
        intentName: ''
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
    getIntentList () {
      let sceneId = this.contentConfig.sceneId
      this.$fetch('/template/intention', {
        sceneId: sceneId,
        intentType: 2
      })
        .then(res => {
          this.intentOptions = res.data
        })
        .catch(err => {
          this.$message.error(err.data.error.message)
        })
    },
    selectGet (vId) { // 这个vId也就是value值
      let obj = {}
      obj = this.intentOptions.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.id === vId// 筛选出匹配数据
      })
      this.myForm.intentName = obj.intentionName
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.contentConfig.reload(this.myForm.intentId, this.myForm.intentName)
          this.handleClose()
        }
      })
    }
  },
  mounted () {
    this.getIntentList()
    if (this.contentConfig.intentId) {
      this.myForm.intentId = this.contentConfig.intentId
    }
  },
  destroyed () {
  }
}
</script>
<style>

</style>


