<template>
  <div class="header">
    <div class='header-container'>
      <div class='title fontBold fontSpace2'>话术模板管理后台</div>
      <div class='header-info textR marginR10'>
        <span>{{userInfo.userName}}</span>
        <el-dropdown 
          class='marginL10'
          trigger='hover'
          @command='_handleCommand'
        >
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right cursorP fontWhite"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click="_openuserinfo"
              command='userinfo'>
            个人信息</el-dropdown-item>
            <el-dropdown-item 
              @click='_handlerLogOut' 
              command='loginOut'>
            退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'MyHeader',
  data () {
    return {
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    // 退出登陆
    // 根据token 获取用户信息
    ...mapMutations({
      _setUserInfo: 'set-userInfo'
    }),
    getUserInfo () {
      let token = localStorage.getItem('Authentication')
      if (token) {
        this.$fetch(`/user/getuser`)
          .then(res => {
            if (parseInt(res.code) === 200) {
              this._setUserInfo({
                userInfo: res.data
              })
            }
          })
          .catch(err => {
            this.$message.error(err.data.error.message)
          })
      } else {
        this.$router.push('/login')
      }
    },
    _handlerLogOut () {
      let token = localStorage.getItem('Authentication')
      if (token) {
        this.$post(`/user/logout`, {
          token
        })
        .then((res) => {
          // 清空缓存
          localStorage.removeItem('Authentication')
          this.$router.push('/login')
        })
        .catch(err => {
          this.$message.error(err.data.error.message)
        })
      } else {
        this.$router.push('/login')
      }
    },
    // 下拉菜单的指令
    _handleCommand (command) {
      if (command === 'loginOut') {
        this._handlerLogOut()
      } else if (command === 'userinfo') {
        this._openuserinfo()
      }
    },
    _openuserinfo () {
      this.$store.state.userInfoManage.modalShow = true
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style scoped>
  
</style>
