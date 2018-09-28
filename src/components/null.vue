<template>
  <div class='null_contaienr'>
    <img src="/static/img/Illustrations.png" alt="">
    <div class='null_tip'>
      <div>什么都没有哦</div><br/>
      <div>快去新建模板吧</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'null'
  }
</script>
<style scoped lang='less' rel='stylesheet/less'>
  @import "../../src/common/stylus/variable";
.null_contaienr{
  width: 515px;
  height: 295px;
  position: relative;
  margin: 0 auto;
  img{
    width: 100%;
    height: 100%;
  }
  .null_tip{
    position: absolute;
    left:300px;
    top:80px;
    text-align: left;
    color: @hintText;
  }
}
</style>
