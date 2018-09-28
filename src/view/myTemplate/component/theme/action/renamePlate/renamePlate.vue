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
      <el-form-item prop='sort' label='序号值'>
        <el-select v-model="myForm.sort" placeholder="请选择" style="width: 280px">
          <el-option
            v-for="(item,index) in contentConfig.options"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop='name' label='版块名称'>
        <el-input
          v-model.trim="myForm.name"
          auto-complete="off"
          placeholder="请输入版块名称"
        ></el-input>
         <el-input style='display:none'></el-input>
      </el-form-item>
    </el-form>
    <div class='action-btn_container'>
      <el-button @click='handleClose' size="small">取消</el-button>
      <el-button type ='primary' @click="submit('myForm')" size="small">确定</el-button>
    </div>
</div>

</template>
<script>
import Validator from '@/common/js/validator'

export default {
  data () {
    let comparedPlateNameArr = this.contentConfig.comparedPlateNameArr
    let $t = this.contentConfig.$t
    let validatePlateName = (rule, value, callback) => {
      return Validator.plateName(rule, value, callback, $t, comparedPlateNameArr)
    }
    return {
      myForm: {
        name: this.contentConfig.name,
        sort: this.contentConfig.sort
      },
      myFormRules: {
        name: [
          {required: true, message: '请输入版块名称', trigger: 'blur'},
           {validator: validatePlateName, trigger: 'blur'}
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
      this.$refs[formName].validate((valid) => {
        let name = this.myForm.name
        let sort = this.myForm.sort
        if (valid) {
          // 修改plate 名字
          this.handleClose()
          this.contentConfig.reload(name, sort)
        }
      })
    }
  }
}
</script>
<style>

</style>


