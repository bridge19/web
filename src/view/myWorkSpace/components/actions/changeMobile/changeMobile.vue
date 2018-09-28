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
      <el-form-item prop='password' label='账号密码'>
        <el-input
          v-model="myForm.password"
          auto-complete="off"
          type="password"
        ></el-input>
      </el-form-item>
      
      <el-form-item prop='mobile' label='新手机号'>
        <el-input
          class="phone_input"
          v-model="myForm.mobile"
          auto-complete="off"
        ></el-input>
        <el-button class="phone_btn" :disabled="myForm.parsecount>0" @click="sendmsg()">{{myForm.parsecount?(myForm.parsecount+'s后可重发'):'发送验证码'}}</el-button>
      </el-form-item>
      
      <el-form-item prop='smsCode' label='验证码'>
        <el-input
          v-model="myForm.smsCode"
          auto-complete="off"
        ></el-input>
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
    let $t = this.contentConfig.$t
    // 密码格式验证
    let validateMobile = (rule, value, callback) => {
      return Validator.mobile(rule, value, callback, $t)
    }
    return {
      myForm: {
        password: '',
        smsCode: '',
        mobile: '',
        parsecount: 0
      },
      myFormRules: {
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        smsCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入新手机号', trigger: 'blur'},
          {validator: validateMobile, trigger: 'blur'}
        ]
      },
      intervalid: null
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
    // 修改手机号
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post('/user/bindingmobile', {
            smsCode: this.myForm.smsCode,
            phoneNumber: this.myForm.mobile
          })
          .then((res) => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.contentConfig.reload(this.myForm.mobile)
            this.handleClose()
          })
          .catch(err => {
            this.$message.error(err.data.error.message)
          })
        }
      })
    },
    // 发送验证码
    sendmsg () {
      this.$refs.myForm.validateField('mobile')
      if (this.myForm.mobile.length < 11) {
        return
      }
      this.$fetch(`/user/smscode`, {
        password: this.myForm.password,
        phoneNumber: this.myForm.mobile
      })
       .then(res => {
         this.myForm.parsecount = 60
         this.$forceUpdate()
         this.intervalid = setInterval(() => {
           if (this.myForm.parsecount > 0) {
             this.myForm.parsecount -= 1
             this.$forceUpdate()
           } else {
             clearInterval(this.intervalid)
           }
         }, 1000)
       })
       .catch(err => {
         this.$message.error(err.data.error.message)
       })
    }
  },
  mounted () {

  }
}
</script>
<style scoped>
.phone_input{
  width: 68%;
}
.phone_btn{
  width: 30%
}
</style>



