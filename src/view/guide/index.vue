<template>
  <div class='index_container'>
    <div class='index_content'>
      <img src="/static/img/index.png" alt="">
      <div class='marginT10 fontBule'>销售是说话的艺术</div>
      <div class='marginT20 fontSubTitleSub'>
        尊敬的<span class='fontSubTitle fontBold'>{{userInfo.userName}}</span>,这是您第<span class='fontSubTitle fontBold'>{{userInfo.loginCount}}</span>次来到话术模板管理后台
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'guide',
  data () {
    return {
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  }
}
</script>
<style lang="less" scoped>
.index_container{
  padding:20px;
  .index_content{
    padding-top:110px;
    text-align: center;
    background-color: #FAFBFC;
    height: ~"calc(100vh - 110px)";
    min-height: ~"calc(100vh - 110px)";
    box-sizing: border-box;
    img{
      width: 552px;
      height: auto;
    }

  }
}
</style>


