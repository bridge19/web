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
      <el-form-item prop='oldPassword' label='原始密码'>
        <el-input
          v-model="myForm.oldPassword"
          auto-complete="off"
          type="password"
        ></el-input>
      </el-form-item>
      
      <el-form-item prop='newPassword' label='新密码'>
        <el-input
          v-model="myForm.newPassword"
          auto-complete="off"
          type="password"
        ></el-input>
      </el-form-item>
      
      <el-form-item prop='repeatPassword' label='再次输入'>
        <el-input
          v-model="myForm.repeatPassword"
          auto-complete="off"
          type="password"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item prop='mobile' label='手机号'>
        <el-input
          v-model="myForm.mobile"
          auto-complete="off"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item> -->
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
    let $t = this.contentConfig.$t
    let mycallback = () => {
      this.$refs.myForm.validateField('repeatPassword')
    }
    // 重复输入密码验证规则
    let valPwd = (rule, value, callback) => {
      return Validator.confirmPassword(rule, value, callback, $t, this.myForm.newPassword)
    }
    // 密码格式验证
    let passwordval = (rule, value, callback) => {
      return Validator.password(rule, value, callback, $t, mycallback)
    }
    let validateMobile = (rule, value, callback) => {
      return Validator.mobile(rule, value, callback, $t)
    }
    return {
      myForm: {
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
      },
      myFormRules: {
        oldPassword: [
          {required: true, message: '请输入原有密码', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {validator: passwordval, trigger: 'blur'}
        ],
        repeatPassword: [
          {validator: valPwd, trigger: 'blur'}
        ],
        mobile: [
          {validator: validateMobile, trigger: 'blur'}
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
      // let userInfo = this.contentConfig.userInfo
      this.$refs[formName].validate((valid) => {
        // let name = this.myForm.name
        // let params = {
        //   name,
        //   ...userInfo
        // }
        if (valid) {
          this.$post('/user/modifypassword', {
            oldPassword: this.myForm.oldPassword,
            password: this.myForm.newPassword,
            password2: this.myForm.newPassword
          })
          .then((res) => {
          // 清空缓存
            this.$message({
              type: 'success',
              message: res.message
            })
            this.handleClose()
          })
          .catch(err => {
            this.$message.error(err.data.error.message)
          })
        }
      })
    }
  },
  mounted () {

  }
}
</script>
<style>

</style>



