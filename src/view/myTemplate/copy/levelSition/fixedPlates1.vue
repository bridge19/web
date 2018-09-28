<template>
<div >
  <span v-if='false'>{{plates}}</span>
  <div
    :id='computedId(allItem.type)'
    :class ='{
      plate_content:true,
      finishBg:allItem.type === 2,
      recoverBg:allItem.type === 4,
      questionBg:allItem.type === 6,
    }'
    v-for ='(allItem,myIndex) in fixedPlates'
    :key='myIndex'
  >
    <div class='plate-left__con'>
      <div class='plate-header'>
        <div class='p-header__left'>
          <el-tag v-if='false'>{{allItem.sort}}</el-tag>
          <el-tooltip
            :content="allItem.name"
            placement="top"
          >
            <span class='title'>{{allItem.name}}</span>
          </el-tooltip>
          <i class='icon-ic_edit_normal iconfont'  v-if='false'></i>
        </div>
        <div class='p-header__right'>
          <span
            v-if='allItem.type!==2'
            class='p_action marginR10 add_question'
            @click='_handerAddFirstSituations(allItem.type,allItem.sort)'
          >{{allItem.type | formateTypeToOperation }}
          </span>
          <i class='icon-ic_delete_normal iconfont' v-if='false'></i>
        </div>
      </div>
      <div
        class='plate-list'
        v-for = '(item,index) in allItem.contexts'
        :key='index'
      >
        <div class='plate-list__right'>
          <div class='plate-list__container'>
            <div :class ="{
              'plate-list__title':true,
              'finishBg-inner':allItem.type === 2,
              'recoverBg-inner':allItem.type === 4,
              'questionBg-inner':allItem.type === 6,
            }">
              <div>{{item.type |formateTypeName}}</div>
            </div>
            <div class='plate-list_body'>
              <div class='plate-list__editor' v-if='allItem.type!==2'>
                <div class='plate-delete'>
                  <i
                  class='icon-ic_delete_normal iconfont'
                  v-if='allItem.contexts.length>1'
                  @click='_handlerDeleteSituation(allItem.sort, item,index)'
                ></i>
                </div>
                <div class ='p_l_e__contaienr'>
                  <div class='p-header__middle'>
                    <div class='width50'>关键词:</div>
                      <div class='plate_keyword'>
                        <el-tooltip
                          :key='ii'
                          placement="top"
                          :content="value"
                          v-for='(value,ii) in item.keyWordArray'
                        >
                          <el-tag>{{value}}</el-tag>
                        </el-tooltip>
                      </div>
                      <div
                        class='p_action width40'
                        @click='_handlerEditorkeyWord(allItem.sort,index,item.keyWordArray,allItem)'
                      >编辑</div>
                  </div>
                </div>
              </div>
              <div class='plate-list__dialog' style='padding-top:20px'>
                <div class='p-l-d_left'>
                  AI:
                </div>
                <div class='p-l-d_right'>
                  <div class = 'p-l-d__world'
                    v-for='(v, i) in item.dialogues'
                    :key='i'
                  >
                    <el-input
                      type="textarea"
                      autosize
                      v-model.trim="v.word"
                      @change="_handlerWordChange(allItem.sort,index,i,$event)"
                      placeholder="请输入内容">
                    </el-input>
                    <div class='p-l-d__action'>

                      <i
                        class='icon-ic_error_normal2 iconfont marginL10'
                        v-if='item.dialogues.length>1'
                        @click='_handerDeleteDialogues(allItem.sort,index,i)'
                      ></i>
                      <span
                        @click='_handlerAudition(allItem.sort,index,i)'
                        class='audition_container marginL20'
                        v-if='!isSystem && v.videoUrl !==""'>
                        <span class='audition' >
                          试听
                        </span>
                        <i class = 'icon-ic_voice_normal iconfont audition_font '></i>
                      </span>
                      <span
                        class='upload_record_container marginR10'
                        v-if='!isSystem'
                        @click='_handlerUpload(allItem.sort,index,i)'
                      >
                        <i class='icon-btn_upload_type iconfont'></i>
                      </span>
                    </div>
                  </div>
                  <div class = 'p-l-d__edtior' v-if='allItem.type!==2'>
                    <span
                      @click='_handerAddDialogues(allItem.sort,index,item.dialogues)'
                      :style='_showAddBtnDisabled(item.dialogues)'>
                      <i class='icon-ic_add_ iconfont fontSubTitle marginR5'></i>
                    添加对话</span>
                    <span class='p_pause add-subcontent'>停顿时间
                      <el-input-number
                        v-model.trim="item.pauseTime"
                        :controls='false'
                        :min="0"
                        @change='_handlerNumberChange(allItem.sort,index,$event)'
                        label="描述文字">
                      </el-input-number>秒
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='plate-right__con'>
      <div class='plate_add'>
        <span v-if='false'><i class='icon-ic_cancel_dialing_no iconfont'></i></span>
      </div>
    </div>
  </div>
</div>

</template>
<script>
import { SituationType, canAddDialogues, findAllKeyWord } from '../config'
// import { arrayFind } from '@/common/js/util'
import { mapMutations, mapActions } from 'vuex'
import actions from '../action/rightContentAction'
import $ from 'jquery'
export default {
  name: 'finish-situation',
  data () {
    return {
    }
  },
  filters: {
    formateTypeName (type) {
      return SituationType[type]
    },
    formateTypeToOperation (type) {
      let flag = '添加问题'
      if (type === 4) {
        flag = '添加挽回'
      }
      return flag
    }
  },
  computed: {
    plates () {
      return this.$store.state.verbalTemplate.userTemplate.plates
    }
  },
  methods: {
    ...mapMutations({
      _setPauseTime: 'verbalTemplate/set-template-pauseTime',
      _setWord: 'verbalTemplate/set-template-first-word',
      _addDialogues: 'verbalTemplate/add-first-dialogues',
      _deleteDialogues: 'verbalTemplate/delete-first-dialogues',
      _addSituation: 'verbalTemplate/add-first-situation',
      _deleteSituation: 'verbalTemplate/delete-first-situation',
      _editorFirstKeyWord: 'verbalTemplate/editor-first-keyWord'
    }),
    ...mapActions({
      _saveTemplate: 'verbalTemplate/saveTemplate',
      _getTemplate: 'verbalTemplate/getTemplate'
    }),
    computedId (type) {
      let id = ''
      switch (type) {
        case 2:
          id = 'finish'
          break
        case 4:
          id = 'recover'
          break
        case 6:
          id = 'question'
          break
      }
      return id
    },
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    // 停顿时间设置
    _handlerNumberChange (sort, index, value) {
      let mainIndex = sort - 1
      let contextsIndex = index
      this._setPauseTime({
        mainIndex,
        contextsIndex,
        value
      })
    },
    // 设置对话内容
    _handlerWordChange (sort, index, i, value) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let dialoguesIndex = i
      this._setWord({
        mainIndex,
        contextsIndex,
        dialoguesIndex,
        value
      })
    },
    // add 按钮显示问题
    _showAddBtnDisabled (dialoguesArr) {
      let flag = canAddDialogues(dialoguesArr)
      if (!flag) {
        return {
          cursor: 'not-allowed'
        }
      } else {
        return {}
      }
    },
    // 增加对话
    _handerAddDialogues (sort, index, dialoguesArr) {
      let flag = canAddDialogues(dialoguesArr)
      if (flag) {
        let mainIndex = sort - 1
        let contextsIndex = index
        this._addDialogues({
          mainIndex,
          contextsIndex
        })
      }
    },
    // 删除对话
    _handerDeleteDialogues (sort, index, dialoguesItem, i) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let dialoguesIndex = i
      let dialogueId = dialoguesItem.id
      // 已经提交过的模板
      if (dialogueId) {
        this.$delete(`/plate/context/dialogue/${dialogueId}`, {
          dialogueId
        })
          .then((res) => {
            this._deleteDialogues({
              mainIndex,
              contextsIndex,
              dialoguesIndex
            })
          })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      } else {
        this._deleteDialogues({
          mainIndex,
          contextsIndex,
          dialoguesIndex
        })
      }
    },
    // 增加语境
    _handerAddFirstSituations (platesType, sort) {
      let mainIndex = sort - 1
      // 处理需要增加的语境的初始值
      // 默认增加的是挽回
      let content = {
        'dialogues': [{
          'videoName': '',
          'videoUrl': '',
          'word': ''
        }],
        keyWord: '',
        keyWordArray: [],
        pauseTime: '',
        type: 16
      }
      if (platesType === 6) {
        content.type = 18
      }
      this._addSituation({
        platesType,
        mainIndex,
        content
      })
    },
    // 删除语境
    _handlerDeleteSituation (sort, contextsItem, index) {
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handlerDeleteSituationReload(sort, contextsItem, index)
        },
        content: '您确定要删除当前语境吗？',
        title: '删除语境'
      })
    },
    // 删除语境reload
    _handlerDeleteSituationReload (sort, contextsItem, index) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let contextId = contextsItem.id
      if (contextId) {
        this.$delete(`/plate/context/${contextId}`, {
          contextId
        })
         .then((res) => {
           this._deleteSituation({
             mainIndex,
             contextsIndex
           })
           this.$message.success('删除成功')
         })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      } else {
        this._deleteSituation({
          mainIndex,
          contextsIndex
        })
        this.$message.success('删除成功')
      }
    },
    // 编辑关键字
    _handlerEditorkeyWord (sort, index, keyWordArray, allItem) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let arr = keyWordArray.map(item => {
        return item
      })
      let comparedKeyWords = findAllKeyWord(allItem.contexts, contextsIndex)
      let errorMessage = '其他挽回语境中有相同关键词'
      if (allItem.type === 6) {
        errorMessage = '其他问题库语境中有相同关键词'
      }
      this._execAction('tempalteEditorKeyWord', {
        reload: (newKeyWordArray) => {
          // 关键词重复校验
          this._editorFirstKeyWord({
            mainIndex,
            contextsIndex,
            keyWordArray: newKeyWordArray
          })
        },
        keyWordArray: arr,
        comparedKeyWords,
        errorMessage
      })
    },
    // 上传录音
    _handlerUpload (sort, index, i) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let dialogueIndex = i
      this._saveTemplate()
        .then((res) => {
          let plates = res.plates
          let dialogue = plates[mainIndex].contexts[contextsIndex].dialogues[dialogueIndex]
          let videoName = dialogue.videoName
          let id = dialogue.id
          this._execAction('uploadRadio', {
            reload: () => {
              this._getTemplate({
                templateId: res.id
              })
            },
            videoName,
            id
          })
        })
    },
    // 试听
    _handlerAudition (sort, index, i) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let dialogueIndex = i
      let plates = this.plates
      let dialogue = plates[mainIndex].contexts[contextsIndex].dialogues[dialogueIndex]
      let videoUrl = dialogue.videoUrl
      $('#player').attr('src', videoUrl)
      let player = $('#player')[0]
      player.play()
    }
  },
  props: {
    fixedPlates: {
      required: true
    },
    isSystem: {
      required: true
    }
  }
}
</script>
<style scoped lang='less' rel='stylesheet/less'>
  .marginR70{
    padding-right: 70px
  }
  .p-l-d_left{
    padding-top: 10px;
  }
</style>


