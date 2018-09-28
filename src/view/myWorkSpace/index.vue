<template>
  <el-container class='approot'>
    <el-header height='70px'>
      <my-header ></my-header>
    </el-header>
    <el-container>
      <el-aside width='180px'>
        <my-aside ></my-aside>
      </el-aside>
      <el-main class='app-container'>
        <router-view></router-view>
        <user-info-slide></user-info-slide>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import MyAside from './components/MyAside'
import MyHeader from './components/MyHeader'
import userInfoSlide from './components/userInfoSlide'
export default {
  name: 'Workspace',
  components: {MyAside, MyHeader, userInfoSlide}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>