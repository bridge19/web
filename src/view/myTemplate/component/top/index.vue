<template>
  <div class='paddingR70'>
    <span v-show='false'>{{vTState}}{{ isSystem }} {{ templateStatus }}</span>
    <div class ='right-top__container textL marginB20 clearfix'>
      <span class='res2 fontBlue fontBold cursorP'  @click='_goBack'>
        <span class='fontBlue' >
          <
        </span>返回
      </span>
      <span class='fontSubTitle marginL10 marginR10 fontBold'>{{templateName}}</span>

      <div class='floatR btn-group' v-if="!isSystem">
        <el-button
          type='primary'
          @click='_handlerSaveTemplate'
          size="mini"
          :disabled="_computedUserSaveStatus"
          class="btn"
        >
          <span class="btnText">提交</span>
        </el-button>
        <el-button
          type='primary'
          @click='_handlerTextTry'
          size="mini"
          :disabled="_computedUserTextStatus"
          class="btn"
        >
          <span class="btnText">文字试用</span>
        </el-button>

        <el-button
          type='primary'
          @click='_handlerTextPass'
          :disabled="_computedUserTextPassStatus"
          size="mini"
          class="btn"
        >
          <span class="btnText">文字试用通过</span>
        </el-button>

        <el-button
          type='primary'
          @click='_handerSetRadio'
          :disabled="_computedUserRadioStatus"
          size="mini"
          class="btn"
          >
          <span class="btnText">录音</span>
        </el-button>

        <el-button
          type='primary'
          @click='_handerSetRadioPass'
          :disabled="_computedUserRadioPassStatus"
          size="mini"
          class="btn"
          >
          <span class="btnText">录音完成</span>
        </el-button>

        <el-button
          type='primary'
          @click='_handerTellingTry'
          :disabled="_computedUserTellStatus"
          size="mini"
          class="btn"
          >
          <span class="btnText">语音试用</span>
        </el-button>

        <el-button
          type='primary'
          @click='_handerTellingPass'
          :disabled="_computedUserTellPasstatus"
          size="mini"
          class="btn"
          >
          <span class="btnText">语音通过</span>
        </el-button>

        <el-button
          type='primary'
          @click='_handerTempalatePublish'
          :disabled="_computedUserPublishStatus"
          size="mini"
          class="btn"
          >
          <span class="btnText">发布</span>
        </el-button>

      </div>
      <div class='floatR btn-group' v-if='isSystem'>
        <!-- 状态修改 -->
        <el-button
          type='primary'
          @click='_handerSamplePublish'
          size="mini"
          class="btn"
          >
          <span class="btnText">发布</span>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import actions from './action/index'
import { mapActions } from 'vuex'
// import { templateStatus, sampleStatus } from '@/common/js/enumeration'
export default {
  name: 'right-top',
  data () {
    return {
      templateName: ''
    }
  },
  computed: {
    vTState () {
      return this.$store.state.verbalTemplate
    },
    isSystem () {
      let type = this.vTState.type
      // return false
      if (type === 0) {
        return true
      } else {
        return false
      }
    },
    templateStatus () {
      return this.vTState.templateStatus
    },
    // 用户文字试用按钮状态
    _computedUserSaveStatus () {
      let templateStatus = this.templateStatus
      let flag = templateStatus === 1
      return !flag
      // return false
    },
    // 用户文字试用状态
    _computedUserTextStatus () {
      let templateStatus = this.templateStatus
      let flag = (templateStatus === 5 || templateStatus === 10)
      return !flag
      // return false
    },
     // 用户文字试用通过状态
    _computedUserTextPassStatus () {
      let templateStatus = this.templateStatus
      let flag = templateStatus === 10
      return !flag
      // return false
    },
    // 用户录音状态
    _computedUserRadioStatus () {
      let templateStatus = this.templateStatus
      let flag = (templateStatus !== 0 && templateStatus !== 10 && templateStatus !== 1 && templateStatus !== 5)
      return !flag
      // return false
    },
    // 用户录音通过状态
    _computedUserRadioPassStatus () {
      let templateStatus = this.templateStatus
      let flag = (templateStatus === 11)
      return !flag
      // return false
    },

    // 用户语音试用状态
    _computedUserTellStatus () {
      let templateStatus = this.templateStatus
      let flag = (templateStatus === 15 || templateStatus === 20)
      return !flag
      // return false
    },
    // 用户语音通过状态
    _computedUserTellPasstatus () {
      let templateStatus = this.templateStatus
      let flag = templateStatus === 20
      return !flag
      // return false
      // return false
    },
    // 用户发布状态
    _computedUserPublishStatus () {
      let templateStatus = this.templateStatus
      let flag = templateStatus === 21
      return !flag
      // return false
    },
    // 样板发布状态
    _computedSamplePublishStatus () {
      let templateStatus = this.templateStatus
      let flag = templateStatus === 10
      return !flag
    }
  },
  methods: {
    ...mapActions({
      _getSubjectTemplate: 'verbalTemplate/getSubjectTemplate',
      _getTemplateStatus: 'verbalTemplate/getTemplateStatus'
    }),
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    // 返回
    _goBack () {
      this.$router.go(-1)
    },
    // 提交
    _handlerSaveTemplate () {
      let templateId = this.vTState.templateId
      this.$confirm(`<span class= "warningBoxContent">
      <span class="icon-ic_upload_fail_norma iconfont waringIcon">
      </span>您确定要提交？</span>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'warningBox',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$post(`/text/submit`, {templateId})
          .then((res) => {
            this._getTemplateStatus()
            this.$message.success(res.message)
          })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      }).catch(() => {})
    },

  // 文字试用模板
    _handlerTextTry () {
      let templateId = this.vTState.templateId
      this._execAction('textTrial', {
        templateId,
        reload: () => {
          this._getTemplateStatus()
        }
      })
    },
    //  文字试用通过
    _handlerTextPass () {
      let templateId = this.vTState.templateId
      this.$confirm(`<span class= "warningBoxContent" >
      <span class="icon-ic_upload_fail_norma iconfont waringIcon">
      </span>您确定文字试用通过?</span>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'warningBox',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$post(`/text/pass`, {templateId})
          .then((res) => {
            this._getTemplateStatus()
            this.$message.success('文字试用已通过')
          })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      }).catch(() => {})
    },

    // 设置录音
    _handerSetRadio () {
      let templateId = this.vTState.templateId
      this._execAction('setRecord', {
        templateId,
        reload: () => {
          this._getTemplateStatus()
        }
      })
    },
    // 录音通过状态
    _handerSetRadioPass () {
      let id = this.vTState.templateId
      this.$confirm(`<span class= "warningBoxContent" >
      <span class="icon-ic_upload_fail_norma iconfont waringIcon">
      </span>您确定录音完成？</span>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'warningBox',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$post(`/voice/passtest`, {id})
          .then((res) => {
            this._getTemplateStatus()
            this.$message.success('录音已完成')
          })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      }).catch(() => {})
    },
    // 语音试用
    _handerTellingTry () {
      let templateId = this.vTState.templateId
      this._execAction('tellTrial', {
        templateId,
        reload: () => {
          this._getTemplateStatus()
        }
      })
    },
    // 语音通过
    _handerTellingPass () {
      let templateId = this.vTState.templateId
      this.$confirm(`<span class= "warningBoxContent">
      <span class="icon-ic_upload_fail_norma iconfont waringIcon">
      </span>您确定语音试用通过？</span>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'warningBox',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$post(`/voice/pass`, {templateId})
          .then((res) => {
            this._getTemplateStatus()
            this.$message.success('语音试用已通过')
          })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      }).catch(() => {})
    },
    // 非样板发布
    _handerTempalatePublish () {
      let templateId = this.vTState.templateId

      this.$confirm(`<span class= "warningBoxContent" >
      <span class="icon-ic_upload_fail_norma iconfont waringIcon">
      </span>您确定要发布？</span>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'warningBox',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$post(`/release/formal`, {templateId})
          .then((res) => {
            this._getTemplateStatus()
            this.$message.success(res.message)
          })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      }).catch(() => {
      })
    },
    // 样本发布
    _handerSamplePublish () {
      let sampleId = this.vTState.templateId
      this.$confirm(`<span class= "warningBoxContent">
      <span class="icon-ic_upload_fail_norma iconfont waringIcon">
      </span>您确定要发布？</span>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'warningBox',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$post(`/sample/release`, {sampleId})
          .then((res) => {
            this._getTemplateStatus()
            this.$message.success(res.message)
          })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      }).catch(() => {
      })
    }
  },
  mounted () {
    this.templateName = this.$route.params.name
  }
}
</script>
<style scoped lang='less' rel='stylesheet/less'>
@import '../../../../common/stylus/variable';
@import '../../../../common/stylus/mixin';
.right-top__container{
    width: 100%;
    height: 30px;
    line-height: 30px;
    //background-color: @white;
    //padding:0 10px;
    box-sizing: border-box;
    .btn{
      height: 32px;
    }
    .btnText{
      font-weight: 600;
    }
    .releaseBtn{
      color: @white;
      background-color: @yellowBtn;
      border-color: @yellowBtn ;
    }
    .releaseBtn:hover{
        opacity: 0.8;
      }
    .fontSubTitle{
      display: inline-block;
      font-weight: 600;
      font-size: 16px;
    }
    .btn-group{
      .is-disabled{
        color:#fff ;
        background-color: @gray;
        border-color: @gray;
      }
    }
    .res2{
      position: relative;
      display: inline-block;
      line-height: 30px;
      vertical-align: top;
    }
}

</style>

