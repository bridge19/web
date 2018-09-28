<template>
  <div id="customRecord" v-show="shadow">
      <transition name="OcclusionList" v-show="modalShow">
        <div class="Occlusion" @click="handleClose"></div>
      </transition>
    <transition name='fly'>
    <div class="SlideAnimation" v-show="modalShow">
      <div class="backToTop" ref="CustomRecord" @click="handleClose">
        <i class='icon-ic_return_normal iconfont marginR10'></i>个人信息
      </div>
      <div class="userDetail">
        <el-form ref="userForm" label-position="left" label-width="80px" :model="userinfo">
          <el-form-item label="账号">
            <el-input v-model="userinfo.userAccount" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input value="password" type="password" :disabled="true"><i slot="suffix" class="iconfont icon-ic_edit_normal" @click="changePassword"></i></el-input>
          </el-form-item>
          <el-form-item label="绑定手机">
            <el-input v-model="userinfo.mobile" :disabled="true"><i slot="suffix" class="iconfont icon-ic_edit_normal" @click="changephone"></i></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input v-model="userinfo.createTime" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop='userName' :rules="[{required: true, message: '姓名不得为空', trigger: 'blur'}]">
            <el-input v-model="userinfo.userName"></el-input>
          </el-form-item>
          <el-form-item label="性别" style="text-align:left" :rules="[{required: true, message: '', trigger: 'blur'}]">
            <el-radio-group v-model="userinfo.sex">
              <el-radio :label="1">女</el-radio>
              <el-radio :label="0">男</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :rules="[{validator:emailval, trigger: 'blur'}]">
            <el-input v-model="userinfo.email"></el-input>
          </el-form-item>
          <el-form-item label="固话" prop="telphone" :rules="[{validator:telval, trigger: 'blur'}]">
            <el-input v-model="userinfo.telphone"></el-input>
          </el-form-item>
          <div>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </div>
        </el-form>
      </div>
    </div>
    </transition>
  </div>
</template>
<script>
  import Validator from '@/common/js/validator'
  import {formatDate} from '@/common/js/filters'
  import actions from './actions/index'
  export default {
    name: 'userInfoSlide',
    data () {
      return {
        shadow: false,
        userinfo: {
        }
      }
    },
    computed: {
      modalShow () {
        let modalShow = this.$store.state.userInfoManage.modalShow
        if (modalShow) {
          this.shadow = modalShow
          let userinfo = JSON.parse(JSON.stringify(this.$store.state.userInfo))
          userinfo.createTime = formatDate(new Date(userinfo.createdTime), 'yyyy-MM-dd hh:mm:ss')
          this.userinfo = userinfo
        } else {
          setTimeout(() => { this.shadow = modalShow }, 500)
        }
  
        return modalShow
      }
    },
    methods: {
      handleClose () {
        this.$store.state.userInfoManage.modalShow = false
      },
      changePassword () {
        actions.changePassword({
          id: this.userinfo.id,
          $t: this.$t
        })
      },
      changephone () {
        actions.changeMobile({
          id: this.userinfo.id,
          reload: (newval) => {
            this.userinfo.mobile = newval
          },
          $t: this.$t
        })
      },
      onSubmit () {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            this.$post('/user/modifyuser', {
              userId: this.userinfo.userId,
              email: this.userinfo.email,
              telphone: this.userinfo.telphone,
              userName: this.userinfo.userName,
              sex: this.userinfo.sex
            })
          .then((res) => {
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
      },
      telval (rule, value, callback) {
        return Validator.tel(rule, value, callback, this.$t)
      },
      emailval (rule, value, callback) {
        return Validator.email(rule, value, callback, this.$t)
      }
    }

  }
</script>
<style lang="less" rel='stylesheet/less' scoped>
  .wholeRecord{
    padding: 10px;
    overflow: hidden;
    background-color: #f2f2f2;
    text-align: left;
    margin-bottom: 30px;
  }
  .historyNum{
    display: flex;
    background: #F3F5F7;
    border: 1px solid #E6EAEE;
    height: 60px;
    line-height: 60px;
    padding: 0 60px;
    overflow-x: scroll;
    white-space: nowrap;
  }
  .audio{
    vertical-align: middle;
    margin-left: 20px;
  }
  .chart{
    position: relative;
  }
  .ai{
    width: 50%;
    margin-right: 1px;
    float: left;
  }
  .customer{
    width: 48%;
    margin-left: 50%;
  }
  .voiceTitle {
    width: 70.2%;
    line-height: 70px;
    margin-top: 20px;
    background: #F3F8FB;
    float: left;
  }
  .backWhite {
    background: #fff;
    border: 1px solid #EEEFF2;
    border-bottom: none;
  }
  .textLeft{
    width: 70%;
    float: left;
    height: 63vh;
    text-align: left;
    border: 1px solid #EEEFF2;
    border-top: none;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .textLeft img{
    vertical-align: middle;
    margin-right: 10px;
  }
  .lineHeight30{
    line-height: 30px;
  }
  .marginR20{
    margin-right: 20px;
  }
  .marginR60{
    margin-right: 60px;
  }
  .callInfo{
    width: 23%;
    height: 81vh;
    float: left;
    padding: 1%;
    margin: 1.5%;
    border: 1px solid #EEEFF2;
    border-radius: 4px;
    background-color: white;
  }
  .borderBottomBlue{
    border-bottom: 3px solid #4285f4;
  }
  .SlideTitle {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #F3F5F7;
    box-shadow: inset 0 -1px 0 0 #E6EAEE;
  }
  .SlideTitle img {
    width: 22px;
    height: 22px;
    float: left;
    cursor: pointer;
    padding: 20px 10px 15px;
  }
  .selectHistory {
    width: 200px;
    float: right;
    margin-right: 20px;
  }
  .subTitle {
    color: #354052;
    font-weight: bold;
  }
  .callItem {
    color: #7F8FA4;
    font-size: 15px;
  }
  .AIintention {
    margin: 30px 0;
    padding-bottom: 22px;
    border-bottom: 1px solid #E6EAEE;
  }
  .AIintention div {
    margin-bottom: 12px;
  }
  .AIintention .itemSelect {
    color: #2096EF;
    border: 1px solid #2096EF;
  }
  .intention {
    display: inline-block;
    width: 108px;
    color: #7F8FA4;
    line-height: 34px;
    font-size: 15px;
    background: #F5F8FA;
    text-align: center;
    border: 1px solid #E6EAEE;
    border-radius: 4px;
    margin-bottom: 14px;
  }
  .fl {
    float: left;
    margin-right: 20px;
  }
  .padd20 {
    padding: 20px;
  }
  .SlideAnimation {
    width: 40%;
    overflow: hidden scroll;
    height: 95vh;
    background: #fff;
    top: 20px;
    position: fixed;
    right: 0;
    z-index: 100;
    /* 动画执行时间方式 */
    transition: all .3s linear;
    .backToTop{
      cursor: pointer;
      height: 60px;
      background: #F3F5F7;
      text-align: left;
      font-size: 16px;
      color: #354052;
      line-height: 60px;
      margin-left: 5px;
      position: fixed;
      width: 100%;
      z-index: 1;
    }
    .userDetail{
      padding-top: 120px;
      width: 350px;
      margin: 0 auto;
      margin-bottom: 60px;
    }
  }
  /* 动画结束状态 */
  .fly-enter-active, .fly-leave-active {
    transform: translate3d(0,0,0);
  }
  /* 动画开始状态 */
  .fly-enter, .fly-leave-active {
    transform: translate3d(100%,0,0);
  }
  .Occlusion {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    z-index: 99;
    /* 动画最终状态 */
    transition: all .5s;
    opacity: 1;
    background: rgba(7,17,27,.7);
    backdrop-filter:blur(10px);
  }
  .OcclusionList-enter, .OcclusionList-leave-active {
    opacity: 0;
    background: rgba(7,17,27,0);
  }
</style>
