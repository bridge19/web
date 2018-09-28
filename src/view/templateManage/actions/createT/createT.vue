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
      <el-form-item prop='sampleName' label='模版名称'>
        <el-input
          clearable
          v-model="myForm.sampleName"
          auto-complete="off"
          placeholder="请输入模版名称，模版名称不能重复"
        ></el-input>
      </el-form-item>
      <el-form-item prop='industryId' label='行业'>
        <el-select 
          :disabled='disabled'
          v-model="myForm.industryId" 
          placeholder="请选择行业">
          <el-option
            v-for="item in industry"
            :key='item.id'
            :label="item.sceneName"
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
// import { industry } from '@/common/js/enumeration'
export default {
  data () {
    // let $t = this.contentConfig.$t
    // let validateUserName = (rule, value, callback) => {
    //   return Validator.account(rule, value, callback, $t)
    // }
    return {
      disabled: false,
      industry: [],
      // industryName:''
      myForm: {
        sampleName: '',
        industryId: ''
      },
      myFormRules: {
        sampleName: [
          {required: true, message: '请输入模版名称', trigger: 'blur'}
        ],
        industryId: [
          {required: true, message: '请选择行业', trigger: 'change'}
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
    // 获取行业
    getIndustry () {
      let url = '/template/scene'
      this.$fetch(url)
        .then(res => {
          this.industry = res.data
        })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let type = this.contentConfig.type
          let url = ''
          let params = this.myForm
          this.industry.map(item => {
            if (item.id === this.myForm.industryId) {
              params.industryName = item.sceneName
            }
          })
          if (type === 'new') {
            url = '/sample/create'
          } else if (type === 'update') {
            url = '/sample/update'
          } else if (type === 'copy') {
            url = '/sample/copy'
          }
          this.commitPost(params, url)
        }
      })
    },
    commitPost (params, url) {
      this.$post(url, params)
        .then((res) => {
          this.$message.success(res.message)
          this.handleClose()
          setTimeout(() => { this.contentConfig.reload() }, 300)
        })
        .catch((err) => {
          this.$message.error(err.data.error.message)
        })
    }
  },
  mounted () {
    this.getIndustry()
    let type = this.contentConfig.type
    if (type === 'update') {
      this.disabled = true
      let row = this.contentConfig.row
      this.myForm = {
        sampleName: row.sampleName,
        industryId: row.industryId,
        sampleId: row.sampleId
      }
    } else if (type === 'copy') {
      this.disabled = true
      let row = this.contentConfig.row
      this.myForm = {
        sampleName: row.sampleName + '(2)',
        industryId: row.industryId,
        sampleId: row.sampleId
      }
    }
  }
}
</script>
<style lang='less' scoped >
  .my-form{
    .el-select{
      width: 100%;
    }
  }
</style>



