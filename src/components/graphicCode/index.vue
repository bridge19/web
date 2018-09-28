<template>
    <el-form-item label="" prop='code' v-show='errorFlag>1'>
      <el-input
        v-model.trim="myForm.code"
        placeholder="请输入验证码"
      ></el-input>
      <el-tooltip content="看不清楚？换一张" placement="top">
        <div class="codeValidate" @click="_refreshCode">
          <graphic-code :identifyCode="myForm.identifyCode"></graphic-code>
        </div>
      </el-tooltip>
    </el-form-item>
</template>
<script>
import GraphicCode from './GraphicCode'
export default {
  name: 'validator-code',
  data () {
    return {
      identifyCodes: '1234567890ABCDEF'
    }
  },
  methods: {
    _randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    _makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.myForm.identifyCode += this.identifyCodes[this._randomNum(0, this.identifyCodes.length)]
      }
    },
    _refreshCode () {
      this.myForm.identifyCode = ''
      this._makeCode(this.identifyCodes, 4)
    }
  },
  components: {
    GraphicCode
  },
  props: {
    myForm: {
      required: true
    },
    errorFlag: {
      required: true
    }
  },
  mounted () {
    this._makeCode(this.identifyCodes, 4)
  }
}
</script>
<style lang="less" scoped>
  .codeValidate{
    position:absolute;
    right:10px;
    top:4px;
    .s-canvas{
      width: 100px;
      height: 40px;
    }
  }
</style>

