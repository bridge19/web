
<template>
  <div class="telIngContent">
    <div class="numberContent">
      我们将尽快拨打
      <span class="number">{{contentConfig.telNumber}}</span>
      ，请暂时不要拦截陌生号码，请注意接听。
    </div>
    <div class="telingBtnContent">
      <el-button class="callBackBtn" type="primary" @click="_handleCallBack">确定</el-button>
    </div>
  </div>
</template>

<script>
    import telTrialAction from '../index'
    export default {
      name: 'telIng',
      props: {
        handleClose: {
          type: Function,
          default: () => {
          }
        },
        contentConfig: {
          type: Object,
          required: true
        }
      },
      data () {
        return {
          telNumber: '',
          templateId: ''
        }
      },
      methods: {
        _handleCallBack () {
          this.handleClose()
          setTimeout(() => {
            telTrialAction({
              templateId: this.contentConfig.templateId,
              reload: this.contentConfig.reload
            })
          }, 0)
        }
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../../../../../common/stylus/variable";
  .telIngContent{
    height: 196px;
    .numberContent{
      height: 119px;
      border-bottom: 1px solid @border;
      text-align: center;
      line-height: 119px;
      .number{
        color: @blue;
      }
    }
    .telingBtnContent{
      height: 76px;
      .callBackBtn{
        width: 80px;
        margin: 20px 0 0 400px;
      }
    }
  }
</style>
