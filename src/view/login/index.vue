<template>
  <div class='login'>
    <div class='waves_container'>
      <waves></waves>
    </div>
    <div class='login_container'>
        <el-form
          :model="myForm"
          :rules="myFormRules"
          ref="myForm"
          label-width="0px"
        >
          <div class='logo'>
            <img src="/static/img/Logo.png" alt="logo">
          </div>
          <el-form-item label=""  prop='userAccount'>
            <el-input
              v-model.trim="myForm.userAccount"
              placeholder="登录账号"
              auto-complete="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop='password'>
            <el-input
              v-model.trim="myForm.password"
              placeholder="密码"
              auto-complete="true"
              type='password'
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop='imgCode' v-if='errorFlag>0'>
            <el-input
              v-model.trim="myForm.imgCode"
              placeholder="请输入验证码"
              maxlength=4
            ></el-input>
            <el-tooltip content="看不清楚？换一张" placement="top">
              <div class="codeValidate" @click="_refreshCode">
                <img :src="imgURL" alt="">
              </div>
            </el-tooltip>
          </el-form-item>

          <div class='retrieve'>
            <router-link to='/retrieve'>忘记密码？</router-link>
          </div>
          <el-form-item label="" prop='code'>
            <el-button 
              type="primary" 
              size='mini'
              @click='_handlerLogin'
            >登录</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>
<script>
import ValidatorCode from '@/components/graphicCode'
import Waves from './animateWaves/index'
// import { setCookie, getCookie } from '@/common/js/util'
export default {
  'name': 'login',
  data () {
    return {
      myForm: {
        userAccount: '',
        password: '',
        imageKey: '',
        imgCode: ''
      },
      imgURL: '',
      errorFlag: 0, // 记录最后一个账号登录错误次数情况
      userObj: {}, // 记录账号错误次数的对象
      myFormRules: {
        userAccount: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        imgCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 登陆
    _handlerLogin () {
      this.$refs.myForm.validate((valid) => {
        if (valid) {
          let params = {
          }
          if (this.errorFlag === 0) {
            params.password = this.myForm.password
            params.userAccount = this.myForm.userAccount
          } else {
            params = this.myForm
          }
          this.$post('/user/login', params)
            .then(res => {
              let code = res.code
              if (code === '200') {
                // 成功
                localStorage.setItem('Authentication', res.data.token)
                // loginCount
                this._saveUserForm()
                // 清除缓存中的信息
                this._updateUserObj()
                // 跳转
                this.$router.push('/index')
              }
            })
            .catch(err => {
              let code = err.data.error.code
              let message = err.data.error.message
              if (code === '201') {
                // 账号被锁定
                this.$message.error(message)
                this._saveUserForm()
              } else if (code === '203' || code === '206') {
                // 验证码错误

                this.$message.error(message)
                this._saveErrorCount()
                this._saveUserForm()
                // 刷新验证码
                this._refreshCode()
              } else if (code === '202') {
                // 用户名或者密码错误

                this.$message.error(message)
                this._saveErrorCount()
                this._saveUserForm()
                // 刷新验证码
                this._refreshCode()
              } else {
                this.$message.error(message)
              }
            })
        }
      })
    },
    // 设置表单cookie
    _saveUserForm () {
      let userForm = {
        userAccount: this.myForm.userAccount,
        password: this.myForm.password
      }
      localStorage.setItem('userForm', JSON.stringify(userForm))
    },
    // 保存错误账户
    _saveErrorCount () {
      let user = this.myForm.userAccount
      if (this.userObj[user] === undefined) {
        this.userObj[user] = 1
      } else {
        this.userObj[user] += 1
      }
      this.errorFlag = this.userObj[user]
      localStorage.setItem('userObj', JSON.stringify(this.userObj))
    },
    // 登陆成功之后，更新 cookie 数据
    _updateUserObj () {
      let userObj = this.userObj
      delete userObj[this.myForm.userAccount]
      localStorage.removeItem('userObj')
    },
    // 重新获取验证码
    _refreshCode () {
      this.$fetch(`/user/imagecode`, {
        width: 100,
        height: 40
      })
       .then(res => {
         this.imgURL = 'data:image/png;base64,' + res.data.imageCodeBase64
         this.myForm.imageKey = res.data.simageKey
       })
       .catch(err => {
         this.$message.error(err.data.error.message)
       })
    }
  },

  mounted () {
    if (localStorage.getItem('userObj')) { // 初始化对象
      this.userObj = JSON.parse(localStorage.getItem('userObj'))
      let userForm = JSON.parse(localStorage.getItem('userForm'))
      this.myForm.userAccount = userForm.userAccount
    // this.myForm.password = userForm.password
      this.errorFlag = this.userObj[this.myForm.userAccount] || 0
      if (this.errorFlag > 0) {
        this._refreshCode()
      }
    }
  },
  components: {ValidatorCode, Waves}
}
</script>
<style lang="less" >
  @import '../../common/stylus/variable';
  @import '../../common/stylus/mixin';
  .login{
    position: relative;
    .codeValidate{
      position:absolute;
      right:10px;
      top:4px;
      width: 100px;
      height: 40px;
      cursor: pointer;
      img{
        width: 100%;
        border:none;
        height: auto;
      }
    }
    .waves_container{
      position: relative;
      top:120px;
      left:0;
    }
    .login_container{
      position: absolute;
      top:200px;
      width: 360px;
      left:50%;
      margin-left: -180px;
      .logo{
        width: 213px;
        height: auto;
        text-align: center;
        display: block;
        margin: 0 auto 40px
      }
      .el-button{
        width: 100%;
        height: 48px;
      }
      .el-form-item__content{
        height: 48px;
        input{
          height: 48px;
        }
      }
      .retrieve{
        margin-bottom:22px;
        text-align: right;
        a{
          color:@SubTitleSub
        }
      }
    }
  }
</style>

