<template>
    <el-menu
      :default-active="path"
      :router="true"
      mode='vertical'
      class="el-menu-vertical"
      @select="_handerSelect"
    >
      <el-menu-item index="/verbalManage">
        <i class="icon-ic_user_selected iconfont"></i>
        <span slot="title" >客户话术管理</span>
      </el-menu-item>

      <el-menu-item index="/templateManage" v-if='userInfo.userAccount==="admin"'>
        <i class="icon-huashuguanlimokuai iconfont"></i>
        <span slot="title" >模板管理</span>
      </el-menu-item>

      <el-menu-item index="/userManage" v-if='userInfo.userAccount==="admin"'>
        <i class="icon-ic_system iconfont"></i>
        <span slot="title" >系统管理</span>
      </el-menu-item>
      <!-- <el-submenu index="2">
        <template slot="title">
          <i class="icon-ic_system iconfont"></i>
          <span >系统管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/userManage">
            <span >用户管理</span>
          </el-menu-item>
          <el-menu-item index="/roleManage">
            <span >角色管理</span>
          </el-menu-item>
          <el-menu-item index="/authorityManage">
            <span >权限管理</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
    </el-menu>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'MyAside',
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    path () {
      let path = this.$route.path
      return path
    },
    isAdmin () {
      return this.userInfo.userAccount === 'admin'
    }
  },
  methods: {
    ...mapMutations({
      _setUserInfo: 'verbalTemplate/set-userInfo',
      _setActiveId: 'verbalTemplate/set-activeId'
    }),
    _handerSelect (index) {
      if (index === '/verbalTemplate') {
        this._setActiveId({
          activeId: ''
        })
        this._setUserInfo({
          userInfo: {
            type: 0,
            userId: 'null'
          }
        })
      }
    }
  }
}
</script>
<style scoped>
</style>
