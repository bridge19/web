<template>
  <div class="record">
    <template v-if="recordArray.length">
      <div class = "content">
        <div v-for="recordItem in recordArray" :key="recordItem.policyActionId" class="recordContainer">
          <span class="recordName">{{recordItem.voiceName}}</span>
          <article class="recordText">{{recordItem.content}}</article>
          <span class="recordStatus" v-if="recordItem.voiceUrl === ''|| recordItem.voiceUrl === null" ></span>
          <span class="recordStatus" v-else-if="recordItem.voiceUrl === 'ready'">
            <div class="loading"></div>
          </span>
          <span class="recordStatus failed icon-ic_error_normal iconfont" v-else-if="recordItem.voiceUrl === 'failed'" ></span>
          <span class="recordStatus success icon-ic_upload_success_no1 iconfont" v-else >
            <el-tooltip effect="dark" content="点击试听" placement="top">
              <span class="icon-ic_voice_normal1 iconfont testListion" @click="_handleTestListion(recordItem.voiceUrl)"></span>
            </el-tooltip>
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class = "content">
        <div class="hintText">暂无数据</div>
      </div>
    </template>
    <aside class = "aside">
      <el-upload
        :action= "url"
        multiple
        :on-success="_handleUploadSuccess"
        :on-error="_handleUploadError"
        :before-upload="_handleBeforeUpload"
        :show-file-list= "false"
        :file-list= "UploadfileList"
        :disabled = 'isDisabledBtn'
        :headers = 'uploadHeader'
        ref="myUpload"
        >
        <el-button class="uploadBtn" type="primary" :disabled="isDisabledBtn">点击上传</el-button>
        <div slot="tip" class="PromptText">注: <br/>目前仅支持wav格式;&ensp;&ensp;文件大小建议10M以下;批量上传录音，请将录音文件名编辑成与对话编号相同。重复上传将覆盖文件。</div>
        <div class="uploadTips">
          共<span class="number">&ensp;{{recordArray.length}}&ensp;</span>条录音文本<br/>
          已完成录音<span class="number">&ensp;{{alreadyUploadNum}}&ensp;</span>条<br/>
          待录音<span class="number">&ensp;{{waitUploadNum}}&ensp;</span>条</div>
      </el-upload>
    </aside>
    <audio :src="audioSrc" style="display: none" ref="MyAudio"></audio>
  </div>
</template>

<script>
  import {BASE_URL} from '../../../../../../common/config'
  export default {
    name: 'record',
    props: {
      contentConfig: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        recordArray: [], // 有效模板文件数组
        UploadfileList: [],
        loading: true,
        url: BASE_URL + '/voice/uploadfile', // BASE_URL + '/upload',
        templateId: this.contentConfig.templateId,
        uploadHeader: {
          Authentication: ''
        },
        // type: this.contentConfig.type,
        audioSrc: '',
        uploadSuccessNum: 0,  // 本次上传成功的文件总数
        uploadErrorNum: 0, // 本次上传失败的文件总数
        uploadFileNum: 0, // 本次选择上传文件总数
        alreadyUploadNum: 0, // 已上传成功的文件数
        waitUploadNum: 0, // 待上传文件数
        isUpload: false, // 当前是否在上传中
        isShowMessageBox: true, // 关闭后不再显示
        isDisabledBtn: false // 是否失能上传按键
      }
    },
    mounted () {
      let that = this
      this.uploadHeader.Authentication = localStorage.getItem('Authentication')
      this.$fetch(`/action/list`, {templateId: this.templateId})
        .then(function (res) {
          // 过滤掉没文字的模板
          that.recordArray = res.data.filter((item) => {
            return item.content
          })
          that._updateTipes(that.recordArray)
        })
        .catch((err) => {
          this.$message.error(err.data.error.message)
        })
    },
    destroyed () {
      this.isShowMessageBox = false
      this.isDisabledBtn = false
      this.contentConfig.reload()
    },
    methods: {
      _handleBeforeUpload (file) {
        // 数组为空不发送
        if (this.recordArray.length) {
          let name = file.name
          // let SuffixName = name.substring(file.name.lastIndexOf('.') + 1).toLocaleLowerCase()
          // 判断文件格式为mp3
          let isType = file.type === 'audio/wav'
          if (!isType) {
            this.$message.error('目前仅支持上传wav格式')
            return false
          } else {
            name = name.substring(0, file.name.lastIndexOf('.'))
            let isExistence = false
            // 发送文件名与数组文件名不匹配不发送
            this.recordArray.forEach((item) => {
              if (item.voiceName === name) {
                item.voiceUrl = 'ready'
                this.uploadFileNum++
                this.isDisabledBtn = true
                isExistence = true
              }
            })
            return isExistence
          }
        } else {
          return false
        }
      },
      _handleUploadError (erro, file) {
        let name = file.name
        name = name.substring(0, file.name.lastIndexOf('.'))
        this.recordArray.forEach((item) => {
          if (item.voiceName === name) {
            item.voiceUrl = 'failed'
            this.uploadErrorNum++
            this._judgeUploadComplete()
          }
        })
      },
      _handleUploadSuccess (res, file) {
        let name = file.name
        name = name.substring(0, file.name.lastIndexOf('.'))
        if (res.code === '200') {
          let resUrl = res.data.fileUrl
          if (resUrl) {
            this._seaveUrlToServer(name, resUrl)
          } else {
            // 判断如果返回之中没有url值算失败
            this._markFailed(name)
          }
        } else {
          // 判断code不是200 算失败
          this._markFailed(name)
        }
      },
      _handleTestListion (voiceUrl) {
        let audio = this.$refs.MyAudio
        audio.pause()
        this.audioSrc = voiceUrl
        setTimeout(() => {
          audio.load()
          audio.play()
        }, 500)
      },
      _completeUpload () {
        let uploadFileNum = this.uploadFileNum
        let uploadSuccessNum = this.uploadSuccessNum
        let uploadErrorNum = this.uploadErrorNum
        this.isDisabledBtn = false
        if (this.isShowMessageBox) {
          const h = this.$createElement
          this.$msgbox({
            title: '消息',
            message: h('p', null, [
              h('span', null, '本次录音文件以全部上传完成,共上传音频 '),
              h('span', { style: 'color: #2096EF' }, `${uploadFileNum}`),
              h('span', null, ' 条,'),
              h('br', null, ''),
              h('span', null, '成功上传 '),
              h('span', { style: 'color: #2096EF' }, `${uploadSuccessNum}`),
              h('span', null, ' 条,'),
              h('br', null, ''),
              h('span', null, '上传失败 '),
              h('span', { style: 'color: #2096EF' }, `${uploadErrorNum}`),
              h('span', null, ' 条')
            ]),
            showCancelButton: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(action => {
            this._updateTipes(this.recordArray)
            this.uploadFileNum = 0
            this.uploadSuccessNum = 0
            this.uploadErrorNum = 0
          })
        }
      },
      _judgeUploadComplete () {
        if ((this.uploadSuccessNum + this.uploadErrorNum) === this.uploadFileNum) {
          this._completeUpload()
        }
      },
      _updateTipes (recodeArray) {
        let urlNum = 0
        recodeArray.forEach((item) => {
          if (item.voiceUrl) {
            urlNum++
          }
        })
        this.waitUploadNum = recodeArray.length - urlNum
        this.alreadyUploadNum = urlNum
      },
      _markFailed (name) {
        this.recordArray.forEach((item) => {
          if (item.voiceName === name) {
            item.voiceUrl = 'failed'
            this.uploadErrorNum++
            this._judgeUploadComplete()
          }
        })
      },
      _seaveUrlToServer (name, resUrl) {
        this.recordArray.forEach((item) => {
          if (item.voiceName === name) {
            this.$post(`/action/updateVoiceUrl?policyActionId=${item.policyActionId}&fileUrl=${resUrl}`)
              .then((res) => {
                if (res.code === '200') {
                  item.voiceUrl = resUrl
                  this.uploadSuccessNum++
                  this._judgeUploadComplete()
                } else {
                  item.voiceUrl = 'failed'
                  this.uploadErrorNum++
                  this._judgeUploadComplete()
                }
              })
              .catch(err => {
                this.$message.error(err.data.error.message)
                item.voiceUrl = 'failed'
                this.uploadErrorNum++
                this._judgeUploadComplete()
              })
          }
        })
      }
    }
  }
</script>

<style lang='less' scoped >
  @import "../../../../../../common/stylus/variable.less";
  ::-webkit-scrollbar {
    width:4px;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  ::-webkit-scrollbar-track {
    border-radius: 3px;
    background-color: #E6EAEE;
  }

  ::-webkit-scrollbar-thumb {
    width:4px;
    border-radius: 3px;
    background: #9FA9BA;
  }

  .success{
    color: @SucccessStatus;
  }

  .failed{
    color: @ErrorStatus;
  }

  .testListion{
    color: @blue;
    margin-left: 15px;
    cursor: pointer;
    visibility: visible;
  }

  .record{
    width: 100%;
    height: 674px;
    overflow: hidden;
    .content{
      box-sizing: border-box;
      width: 724px;
      height: 100%;
      overflow: auto;
      float: left;
      padding-bottom: 10px;
      font-size: 14px;
      color: @SubTitle;
      .recordContainer{
        box-sizing: border-box;
        display: table;
        width: 100%;
        margin-top: 20px;
        padding-left: 20px;
        overflow: hidden;
        .recordName{
          display: table-cell;
          vertical-align: middle;
          width: 130px;
          text-align: center;
        }
        .recordText{
          display: table-cell;
          width: 450px;
          padding: 8px 10px;
          background-color: @greyLightLight;
          border-radius: 4px;
        }
        .recordStatus{
          display: table-cell;
          vertical-align: middle;
          text-align: left;
          padding-left: 20px;
          height: 18px;
        }
      }
      .hintText{
        text-align: center;
        font-size: @FontSizeLarge1;
        color: @greyLight;
        margin-top: 200px;
      }
    }
    .aside{
      position: relative;
      width: 216px;
      height: 100%;
      float: left;
      background-color: @greyLightLight;
      .uploadBtn{
        position: absolute;
        top: 298px;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      .PromptText{
        width: 149px;
        position: absolute;
        top: 403px;
        left: 53%;
        transform: translate(-50%,-50%);
        font-size: 14px;
      }
      .uploadTips{
        position: absolute;
        top: 50px;
        left: 25%;
        color: #606266;
        text-align: left;
        line-height: 24px;
        .number {
          color: @blue;
        }
      }
    }
  }
</style>
