<template>
<div class='my-form_container'>
  <el-form
        label-position="left"
        label-width="80px"
        :model="myForm"
        ref='myForm'
        :rules='myFormRules'
        class='my-form my_score-form'
      >
      <el-form-item prop='thresholdA' label='A'>
         <el-input-number 
          v-model="myForm.thresholdA" 
          :min="0"  
          label="描述文字">
        </el-input-number>
      </el-form-item>
      <el-form-item prop='name' label='B'>
        <el-input-number 
          v-model="myForm.thresholdB" 
          :min="0"  
          label="描述文字">
        </el-input-number>
      </el-form-item>
      <el-form-item prop='name' label='C'>
        <el-input-number 
          v-model="myForm.thresholdC" 
          :min="0"  
          label="描述文字">
        </el-input-number>
      </el-form-item>
      <el-form-item prop='name' label='D'>
        <el-input-number 
          v-model="myForm.thresholdD" 
          :min="0"  
          label="描述文字">
        </el-input-number>
      </el-form-item>
      <el-form-item prop='name' label='目标P'>
        <el-input-number 
          v-model="myForm.thresholdP" 
          :min="0"  
          label="描述文字">
        </el-input-number>
      </el-form-item>
    </el-form>
    <div class='action-btn_container'>
      <el-button @click='handleClose' size="small">取消</el-button>
      <el-button type ='primary' @click="submit('myForm')" size="small">确定</el-button>
    </div>
</div>

</template>
<script>
export default {
  data () {
    let contentConfig = this.contentConfig
    let projectInfo = this.contentConfig.projectInfo
    return {
      loading: false,
      allCompanyName: [],
      selectdCompanyName: [],
      folderName: [],
      myForm: {
        id: contentConfig.templateId,
        thresholdA: projectInfo.thresholdA,
        thresholdB: projectInfo.thresholdB,
        thresholdC: projectInfo.thresholdC,
        thresholdD: projectInfo.thresholdD,
        thresholdP: projectInfo.thresholdP
      },
      myFormRules: {
        thresholdA: [
          {required: true, message: '请输入A门限值', trigger: 'blur'}
        ],
        thresholdB: [
          {required: true, message: '请输入B门限值', trigger: 'blur'}
        ],
        thresholdC: [
          {required: true, message: '请输入C门限值', trigger: 'blur'}
        ],
        thresholdD: [
          {required: true, message: '请输入D门限值', trigger: 'blur'}
        ],
        thresholdP: [
          {required: true, message: '请输入目标P门限值', trigger: 'blur'}
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
    // 提交表单
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post('/template/update/info', this.myForm)
          .then(res => {
            this.handleClose()
            this.$message.success(res.message)
          })
          .catch(err => {
            this.handleClose()
            this.$message.error(err.data.error.message)
          })
        }
      })
    }
  }
}
</script>
<style lang ='less' scoped>
  .my_score-form{
    .el-input-number{
      width: 100%
    }
  }
</style>


