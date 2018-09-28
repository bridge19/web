<template>
  <el-container class="forget_pass">
  <el-header style="height:90px">
    <div class="leftbox">
      <img src="/static/img/logo_white.png">
      <label class="central_line"></label>
      <label class="logoword">找回密码</label>
    </div>
    <div class="rightbox">
      <router-link :to="{path: '/login'}">
        <img src="/static/img/back_login.png" alt="">
      </router-link>
    </div>
  </el-header>
  <el-main>
    <el-steps :active="step" align-center>
      <el-step description="" class="blue">
        <div slot="icon" class="blue">1
          <div class="steptext">填写账号</div>
        </div>
      </el-step>
      <el-step description="" class="blue">
        <div slot="icon" class="blue">2
          <div class="steptext">身份验证</div>
        </div>
      </el-step>
      <el-step description="" class="blue">
        <div slot="icon" class="blue">3
          <div class="steptext">设置新密码</div>
        </div>
      </el-step>
      <el-step description="" class="blue">
        <div slot="icon" class="blue">4
          <div class="steptext">完成</div>
        </div>
      </el-step>
    </el-steps>
    <div class="mainform">



      <el-form label-position="right" ref="form1" label-width="150px" :model="step1obj" v-show="step===0">
        <el-form-item label="账号" prop="userId" :rules="{required: true, message: '请输入账号', trigger: 'blur'}">
          <el-input v-model="step1obj.userId"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="region" :rules="{required: true, message: '请输入验证码', trigger: 'blur'}">
          <el-input v-model="step1obj.region"></el-input>
          <img :src="imgURL" class="imgcode" title="看不清？换一个" @click="_refreshCode()">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm1()">下一步</el-button>
        </el-form-item>
      </el-form>



      <el-form label-position="right" ref="form2" label-width="150px" :model="step2obj" v-show="step===1" :status-icon="true">
        <el-form-item label="手机号" prop="phone" :rules="[{required: true, message: '请输入手机号', trigger: 'blur'},{validator:phoneval, trigger: 'blur'}]">
          <el-input v-model="step2obj.phone" placeholder="请输入绑定账号的手机号码"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码" prop="smsCode" class="msgbox">
          <el-input v-model="step2obj.smsCode" placeholder="请输入验证码"></el-input><el-button :disabled="step2obj.parsecount>0" @click="sendmsg()">{{step2obj.parsecount?(step2obj.parsecount+'s后可重发'):'发送验证码'}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm2()">下一步</el-button>
        </el-form-item>
      </el-form>



      <el-form label-position="right" ref="form3" label-width="150px" :model="step3obj" v-show="step===2">
        <el-form-item label="设置新密码" prop="password" :rules="[{required: true, message: '请输入新密码', trigger: 'blur'},{validator: passwordval, trigger: 'blur'}]">
          <el-input type="password" v-model="step3obj.password" placeholder="8-16位 大写字母+小写字母+数字  如：BigBoss01"></el-input>
        </el-form-item>
        <el-form-item label="请再次输入新密码" prop="repassword" :rules="[{required: true, message: '请再次输入', trigger: 'blur'},{validator:valPwd, trigger: 'blur'}]">
          <el-input type="password" v-model="step3obj.repassword" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm3()">下一步</el-button>
        </el-form-item>
      </el-form>
      <div class="finalbox" v-show="step===3">
        <p><i class='icon-ic_upload_success_no1 iconfont marginR10'></i>恭喜，新密码设置成功</p>
        <router-link :to="{path: '/login'}">
        <el-button type="primary">立即登录</el-button>
      </router-link>
      </div>



    </div>
  </el-main>
</el-container>
</template>

<script>
import Validator from '@/common/js/validator'
export default {
  name: 'retrieve',
  data () {
    return {
      step: 0,
      userid: '',
      imgURL: '',
      intervalid: null,
      step1obj: {},
      step2obj: {},
      step3obj: {}
    }
  },
  methods: {
    // 刷新图形验证码
    _refreshCode () {
      this.$fetch(`/user/imagecode`, {
        width: 100,
        height: 40
      })
       .then(res => {
         this.imgURL = 'data:image/png;base64,' + res.data.imageCodeBase64
         this.step1obj.imagekey = res.data.imageKey
       })
       .catch(err => {
         this.$message.error(err.data.error.message)
       })
    },
    mycallback () {
      this.$refs.form3.validateField('repassword')
    },
    // 重复输入密码验证规则
    valPwd (rule, value, callback) {
      return Validator.confirmPassword(rule, value, callback, this.$t, this.step3obj.password)
    },
    // 密码格式验证
    passwordval (rule, value, callback) {
      return Validator.password(rule, value, callback, this.$t, this.mycallback)
    },
    // 手机号格式验证
    phoneval (rule, value, callback) {
      return Validator.mobile(rule, value, callback, this.$t)
    },
    // 判断账号与验证码是否满足表单校验条件
    submitForm1 () {
      this.$refs.form1.validate(result => {
        if (result) {
          this.checkcode()
        } else {
          return false
        }
      })
    },
    // 校验验证码并获取用户id（如果验证码正确）
    checkcode () {
      this.$post('/user/recall/verifyuser', {
        userAccount: this.step1obj.userId,
        imageKey: this.step1obj.imagekey,
        imgCode: this.step1obj.region
      })
       .then(res => {
         if (res.code === '200') {
           this.userid = res.data
           this.step = 1
         } else {
           this.$message.error(res.data.message)
         }
       })
       .catch(err => {
         this.$message.error(err.data.error.message)
       })
    },
    // 发送校验短信
    sendmsg () {
      if (this.step2obj.phone.length) {
        this.$post(`/user/recall/smscode`, {
          userId: this.userid,
          phoneNumber: this.step2obj.phone
        })
       .then(res => {
         if (res.code === '200') {
           this.step2obj.parsecount = 60
           this.$forceUpdate()
           this.intervalid = setInterval(() => {
             if (this.step2obj.parsecount > 0) {
               this.step2obj.parsecount -= 1
               this.$forceUpdate()
             } else {
               clearInterval(this.intervalid)
             }
           }, 1000)
         } else {
           this.$message.error(res.data.message)
         }
       })
       .catch(err => {
         this.$message.error(err.data.error.message)
       })
      }
    },
    // 判断手机号与短信验证码是否符合表单规则
    submitForm2 () {
      this.$refs.form2.validate(result => {
        if (result) {
          this.judgeSmsCode()
        } else {
          return false
        }
      })
    },
    // 校验短信验证码
    judgeSmsCode () {
      this.$post('/user/recall/checksmscode', {
        userId: this.userid,
        smsCode: this.step2obj.smsCode
        // mobile: this.step2obj.phone
      })
       .then(res => {
         if (res.code === '200') {
           this.step = 2
         } else {
           this.$message.error(res.data.message)
         }
       })
       .catch(err => {
         this.$message.error(err.data.error.message)
       })
    },
    // 判断密码输入格式
    submitForm3 () {
      this.$refs.form3.validate(result => {
        if (result) {
          this.setPassword()
        } else {
          return false
        }
      })
    },
    // 发送请求修改密码
    setPassword () {
      this.$post(`/user/recall/setpassword`, {
        userId: this.userid,
        password: this.step3obj.password,
        password2: this.step3obj.password
      })
       .then(res => {
         if (res.code === '200') {
           this.step = 3
         } else {
           this.$message.error(res.data.message)
         }
       })
       .catch(err => {
         this.$message.error(err.data.error.message)
       })
    }
  },
  mounted () {
    this._refreshCode()
  }
}
</script>
<style lang="less" rel='stylesheet/less'>
.forget_pass{
.el-header{
  background-color: #2096EF;
  text-align: left;
  .leftbox{
    margin-left: 130px;
    height: 38px;
    float: left;
    padding: 27px 0;
    .central_line{
      margin: 9px 20px;
      width: 1px;
      height: 20px;
      display: inline-block;
      background-color: rgba(255,255,255,0.40);
    }
    .logoword{
      margin: 9px 0;
      width: 100px;
      height: 20px;
      display: block;
      font-size: 18px;
      color: #FFFFFF;
      letter-spacing: 1.8px;
      line-height: 20px;
      float: right;
    }
  }
  .rightbox{
    float: right;
    margin-right: 130px;
    height: 22px;
    padding: 34px 0;
    img{
      cursor: pointer;
    }
  }
}

.el-main{
  text-align: center;
  .el-steps{
    width: 850px;
    margin: 80px auto;
  }
  .finalbox{
    width: 300px;
    margin: 0 auto;
    p{
      font-size: 24px;
      color: #1BB934;
      margin-bottom: 80px;
      .iconfont{
      font-size: 24px;

      }
    }
    button{
      padding: 14px 54px;
      span{
      font-size: 18px;
      }
    }
  }
  .imgcode{
    position: absolute;
    cursor: pointer;
    top: 3px;
    right: 3px;
  }
  .mainform{
    width: 470px;
    margin: 0 auto;
    .msgbox{
      .el-input{
        width: 60%;
        float: left;
      }
      button{
        width: 35%;
        height: 48px;
        float: right;
      }
    }
    .el-form-item__label{
      line-height: 48px;
    }
    .el-input__inner{
      height: 48px;
      line-height: 48px;
    }
  }
  
}
}
</style>


