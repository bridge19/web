
<template>
  <div class="textTrialConent">
    <div ref="dialogWindow" class="dialogWindow">
      <div class="textContent" v-for="(item, index) in dialogues" :key="'chatWindow'+index">
        <template v-if="item.networkState === networkNormalCode ">
          <span class="imgContent" :class="[item.role === 'robort'? 'robortImgConent':'manImgConent']">
            <img :src="item.role === 'robort'? robortImgSrc : humanImgSrc" class="headImg">
          </span>
          <Article class="text" :class="[item.role === 'robort'? 'robortText':'manText']">{{item.message}}</Article>
        </template>
        <template v-else-if="item.networkState === netStartFaldeCode">
          <div class="promptWindow"><span class="promptContainer">对话初始化失败，请点击关闭后重新尝试链接</span></div>
        </template>
        <template v-else-if="item.networkState === talkContentErrCode">
          <div class="promptWindow"><span class="promptContainer">对话内容不能为空</span></div>
        </template>
        <template v-else>
          <div class="promptWindow"><span class="promptContainer">网络或服务器出错，请检查网络后重新发送或关闭对话</span></div>
        </template>
      </div>
    </div>
    <div class="inputWindow">
      <div class="textEareContent">
        <textarea autofocus  class="textEare" placeholder="请输入对话信息..." v-model="textareaInputValue" @keydown.enter.ctrl="_handleSbmitText"></textarea>
      </div>
      <div class="footerConent">
        <el-button class="Btn" size="mini" type="primary" plain
                   @click="_handleSbmitText"
        >发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'textTrial',
      props: {
        contentConfig: {
          type: Object,
          required: true
        }
      },
      data () {
        return {
          textareaInputValue: '',
          humanImgSrc: '/static/img/img_boy.png',
          robortImgSrc: '/static/img/img_robort.png',
          timer: undefined,
          dialogues: [],
          networkNormalCode: 1, // 网络正常
          networkErrCode: 0, // 网络出错
          netStartFaldeCode: 2, // 对话初始失败
          talkContentErrCode: 3, // 对话内容为空
          templateId: this.contentConfig.templateId
        }
      },
      methods: {
        _handleSbmitText () {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            let message = this.textareaInputValue.replace(/</g, '《').replace(/>/g, '》').replace(/"/g, '“').replace(/'/g, '‘').replace(/\s/g, '')
            if (message === '') {
              this._dialoguesPushHuman(message)
              this.textareaInputValue = ''
              this._dialoguesPushRobort(this.talkContentErrCode, '')
            } else {
              this._sendMsg(message)
              this._dialoguesPushHuman(message)
              this.textareaInputValue = ''
            }
          }, 300)
        },
        // 启动对话
        _startTallk () {
          let templateId = this.templateId
          this.$fetch(`/text/start`, {templateId})
            .then((res) => {
              let RobortMsg = res.data
              this._dialoguesPushRobort(this.networkNormalCode, RobortMsg)
            })
            .catch((er) => {
              this._dialoguesPushRobort(this.netStartFaldeCode, '')
            })
        },
        _sendMsg (msg) {
          let params = {
            templateId: this.templateId,
            word: msg
          }
          this.$fetch('/text/talk', params)
            .then((res) => {
              let RobortMsg = res.data
              this._dialoguesPushRobort(this.networkNormalCode, RobortMsg)
            })
            .catch((er) => {
              this._dialoguesPushRobort(this.networkErrCode, '')
            })
        },
        _dialoguesPushHuman (msg) {
          this.dialogues.push({
            role: 'human',
            networkState: this.networkNormalCode,
            message: msg
          })
        },
        _dialoguesPushRobort (networkState, msg) {
          this.dialogues.push({
            role: 'robort',
            networkState: networkState,
            message: msg
          })
        }
      },
      mounted () {
        this._startTallk()
      },
      updated () {
        let div = this.$refs.dialogWindow
        div.scrollTop = div.scrollHeight
      },
      beforeDestroy () {
        let templateId = this.templateId
        this.$fetch(`/text/end`, {templateId})
          .then((res) => {
            this.$message.info('试用已关闭')
          })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      },
      destroyed () {
        this.contentConfig.reload()
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../../../../common/stylus/variable";
  @import "../../../../../../common/stylus/minScroll";

  .textTrialConent{
    height: 694px;
    .dialogWindow{
      height: 508px;
      overflow: auto;
      border-bottom: 1px solid #ced0da;
      padding: 20px 20px 0 20px;
      background-color: @white;
      .textContent{
        padding-bottom: 20px;
        overflow: hidden;
        .text{
          display: inline-block;
          max-width: 500px;
          min-width: 19px;
          min-height: 29px;
          padding: 10px;
          border-radius: 4px;
          font-size: @FontSizeBase;
          line-height: 29px;
        }
        .imgContent{
          display: inline-block;
          width: 36px;
          height: 36px;
          img{
            width: 100%;
          }
        }
        .robortText{
          float: left;
          background-color: @greyLightLight;
          color: @SubTitle;
        }
        .robortImgConent{
          float: left;
          margin-right: 10px;
        }
        .manText{
          float: right;
          background-color: @blue;
          color: @whiteLight;
        }
        .manImgConent{
          float: right;
          margin-left: 10px;
        }
        .promptWindow{
          padding-top: 35px;
          padding-bottom: 20px;
          text-align: center;
          .promptContainer{
            display: inline-block;
            width: 320px;
            height: 25px;
            background-color: @greyLightLight;
            font-size: 12px;
            color: #7d8795;
            line-height: 25px;
            .textBtn{
              font-size: 12px;
              color: @blue ;
              cursor: pointer;
            }
          }
        }
      }
    }
    .inputWindow{
      background-color: @greyLightLight ;
      .textEareContent{
        height: 130px;
        border-bottom: 1px solid @border;
        .textEare{
          box-sizing: border-box;
          width: 668px;
          height: 130px;
          padding: 10px 10px 10px 20px;
          border: none;
          border-style: hidden;
          resize:none;
          background-color: @greyLightLight;
          font-size: @FontSizeBase;
          color: @SubTitle;
          line-height: 24px;
        }
        :focus {
          outline: none;
        }
      }
      .footerConent{
        height: 56px;
        .Btn{
          width: 80px;
          height: 36px;
          margin: 10px 0 0 568px;
        }
      }
    }
  }
</style>
