<template>
<el-container class="global_context" ref="global">
  <span style="display:none">{{templateId}}</span>
  
  <el-aside width="220px">
    <el-menu
      default-active="0"
      style="height:100%"
      class="el-menu-vertical-demo">
      <el-menu-item index="0" @click="changeToSubject({subjectName:'问答'})">
        <span slot="title">问答</span>
      </el-menu-item>
      <el-menu-item :index="(key+1).toString()" v-for="(item,key) in subjects" :key="key" @click="changeToSubject(item)">
        <span slot="title">{{item.subjectName}}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
  <el-main class="plate_content">
    <div style="margin-right:200px;" v-show="subject.subjectName==='问答'">
      <div v-for="(item,key) in modals" :key="item.sort" v-show="item.statu!=='delete'">
        <el-form label-position="right" label-width="200px" :model="item">
          <el-form-item :label="'问答'+(key+1)">
            <span class="marginR10">{{item.intentName}}</span>
            <span @click="changeQA(item)" class="cursorP"><i class="icon-ic_edit_normal iconfont"></i></span>
            <span class="cursorP floatR" @click="askDelete(item,key)"><i class="iconfont icon-ic_delete_normal"></i></span>
          </el-form-item>
          <el-form-item label="AI">
            <el-input v-model="item.questionContent" @change="togglechange"></el-input>
          </el-form-item>
          
        </el-form>
      </div>
      
      <label style="margin-left:170px;" class="cursorP blue" @click="addQA()"><i class="iconfont icon-ic_add_dialing_normal marginR20"></i>添加问答</label>
      <div></div>
      <el-button class="floatR" v-show="modals.length" type="primary" @click="beforeSubmit('QA')">保存</el-button>
    </div>

    <div style="margin-right:200px;" v-show="subject.subjectName!=='问答'">
      <el-form label-position="right" label-width="200px" :model="items" v-for="(items,key) in modals" :key="key">
          <el-form-item :label="mint[items.sentiment]">
            <el-input v-model="items.content" @change="togglechange"></el-input>
            
            <el-form label-position="right" style="margin-top:25px;" label-width="40px" :model="item" v-for="(item,key1) in items.childrenAction" :key="key1">
              <div class="actionChildrenLine"></div>
              <el-form-item :label="mint[item.sentiment]">
                <el-input v-model="item.content" @change="togglechange"></el-input>
              </el-form-item>
            </el-form>
          </el-form-item>
      </el-form>
      <el-button class="floatR" type="primary" @click="beforeSubmit('other')">保存</el-button>
    </div>

  <!--   <div class='action-btn_container'>
      <el-button type ='primary' @click="submit()">保存</el-button>
    </div> -->

  </el-main>

</el-container>

</template>
<script>
import actions from './action/index'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      submitdata: {},
      subject: {
        name: '问答'
      },
      newQA: {
        'questionContent': '',
        'subjectName': ''
      },
      modals: [
      ],
      subjects: [],
      mint: {
        40: '超时1次',
        41: '超时结束',
        42: '超时2次',
        50: '未识别1次',
        51: '未识别结束',
        52: '未识别2次',
        60: '在忙结束',
        70: '强势打断',
        71: '听不清打断',
        72: '离开打断',
        73: '成功',
        74: '失败',
        80: '转邀约',
        90: '转人工',
        91: '成功',
        92: '失败',
        93: '等待'
      },
      changed: false

    }
  },
  mounted: function () {
    // this.finddata(this.templeteinfo.type, this.templeteinfo.templeteId)
  },
  methods: {
    // 获取左侧列表数据
    ...mapActions({
      _getTemplateStatus: 'verbalTemplate/getTemplateStatus'
    }),
    togglechange () {
      this.changed = true
    },
    getsubject () {
      let url
      if (this.templeteinfo.type !== 0) {
        url = '/global/get/subject'
      } else {
        url = '/sample/global/getSampleSubject'
      }
      this.$fetch(url, {
        templateId: this.templeteinfo.templateId
      })
        .then(res => {
          this.subjects = res.data
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.data.error.message
          })
        })
    },
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    // 非问答板块提交
    beforeSubmit (type) {
      if (this.changed) {
        this._execAction('BeforeSave', {
          reload: () => {
            if (type === 'QA') {
              this.submitQA()
            } else {
              this.submitOther()
            }
          }
        })
      } else {
        this.$message({
          type: 'success',
          message: '当前页面无更改哦，无需保存'
        })
      }
    },
    submitOther () {
      /* this.modals.forEach(item => {
        item.actionId = item.policyActionId
      }) */

      let url
      if (this.templeteinfo.type !== 0) {
        url = '/global/updateAction'
      } else {
        url = '/sample/global/updateSampleAction'
      }
      this.$post(url, this.modals)
        .then(res => {
          if (this.templeteinfo.type !== 0) {
            this._getTemplateStatus()
          }
          this.changeToSubject(this.subject)
          this.$message({
            type: 'success',
            message: '提交成功'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.data.error.message
          })
        })
    },
    // 添加问答
    addQA () {
      let url
      if (this.templeteinfo.type !== 0) {
        url = '/global/saveQA'
      } else {
        url = '/sample/global/saveSampleQA'
      }
      this._execAction('createQA', {
        sceneId: this.$route.query.sceneId,
        reload: (id, name) => {
          let newqa = JSON.parse(JSON.stringify(this.newQA))
          this.$post(url, {
            intentId: id,
            templateId: this.templeteinfo.templateId,
            intentName: name
          })
            .then(res => {
              if (this.templeteinfo.type !== 0) {
                this._getTemplateStatus()
              }
              newqa.intentId = id
              newqa.intentName = name
              newqa.subjectId = res.data.subjectId
              newqa.actionId = res.data.actionId
              newqa.templateId = this.templeteinfo.templateId
              newqa.statu = 'create'
              this.modals.push(newqa)
              setTimeout(() => { this.changed = false })
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.data.error.message
              })
            })
        }
      })
    },
    // 修改问答意向
    changeQA (item) {
      let url
      if (this.templeteinfo.type !== 0) {
        url = '/global/saveQA'
      } else {
        url = '/sample/global/saveSampleQA'
      }
      this._execAction('createQA', {
        sceneId: this.$route.query.sceneId,
        intentId: item.intentId,
        reload: (id, name) => {
          this.$post(url, {
            intentId: id,
            templateId: this.templeteinfo.templateId,
            subjectId: item.subjectId,
            intentName: name
          })
            .then(res => {
              if (this.templeteinfo.type !== 0) {
                this._getTemplateStatus()
              }
              item.intentId = id
              item.intentName = name
              this.$forceUpdate()
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.data.error.message
              })
            })
        }
      })
    },
    // 删除问答
    askDelete (item, key) {
      let url
      if (this.templeteinfo.type !== 0) {
        url = '/global/deleteQA'
      } else {
        url = '/sample/global/deleteSampleQA'
      }
      this._execAction('deleteQA', {
        subjectName: item.intentName,
        reload: () => {
          this.$post(url, {
            subjectId: item.subjectId
          })
            .then(res => {
              if (this.templeteinfo.type !== 0) {
                this._getTemplateStatus()
              }
              this.modals.splice(key, 1)
              this.$message({
                type: 'success',
                message: '已删除'
              })
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err.data.error.message
              })
            })
        }
      })
    },
    // 切换导航项目
    changeToSubject (item) {
      let url, params
      this.subject = item
      if (this.templeteinfo.type !== 0) {
        if (item.subjectName === '问答') {
          url = '/global/getQA'
          params = {
            templateId: this.templeteinfo.templateId
          }
        } else {
          url = '/global/get/policyAction'
          params = {
            subjectId: item.subjectId
          }
        }
      } else {
        if (item.subjectName === '问答') {
          url = '/sample/global/getSampleQA'
          params = {
            templateId: this.templeteinfo.templateId
          }
        } else {
          url = '/sample/global/getSamplePolicyAction'
          params = {
            subjectId: item.subjectId
          }
        }
      }

      this.$fetch(url, params)
        .then(res => {
          this.modals = res.data
          this.$forceUpdate()
          setTimeout(() => { this.changed = false })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.data.error.message
          })
        })
    },
    /* jumpToSubject (item) {
      if (this.changed) {
         this._execAction('createQA', {
        sceneId: this.$route.query.sceneId,
        reload: (id, name) => {}})

    }, */
    // 提交问答内容
    submitQA () {
      let url
      if (this.templeteinfo.type !== 0) {
        url = '/global/updateQAContent'
      } else {
        url = '/sample/global/updateSampleQAContent'
      }
      this.$post(url, this.modals)
        .then(res => {
          if (this.templeteinfo.type !== 0) {
            this._getTemplateStatus()
          }
          this.changeToSubject(this.subject)
          this.$message({
            type: 'success',
            message: '提交成功'
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.data.error.message
          })
        })
    }
  },
  computed: {
    templeteinfo () {
      return this.$store.state.verbalTemplate
    },
    templateId () {
      if (this.$store.state.verbalTemplate.templateId) {
        this.getsubject()
        this.changeToSubject({subjectName: '问答'})
      }
      return this.$store.state.verbalTemplate.templateId
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.global_context{
  height: calc(100vh - 230px);
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  text-align: left !important;
  .blue{
    color:#2096EF;
    .iconfont{
    color:#2096EF;

    }
  }
  .actionChildrenLine{
    height: 56px;
    width: 34px;
    position: absolute;
    margin-top: -35px;
    margin-left: -42px;
    border-bottom: 1px dashed #ddd;
    border-left: 1px dashed #ddd;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .iconfont{
    color:#BBC5D5;
  }
  .plate_content{
    width: 100%;
    overflow: auto;
    padding: 20px 15px;
    box-sizing: border-box;
    
    .iconfont.disabled{
      cursor: not-allowed;
    }
  }
}

</style>
