<template>
  <div class='plate-list'>
      <span v-show='false'>{{plates}}</span>
      <div class='plate-list__left'>
        <div class='plate-list_top__border'></div>
        <div
          class='plate-list_bottom__border'
          v-show='showSonLine(firstItem,secondIndex)'
        ></div>
      </div>
      <div class='plate-list__right'>
        <div class='plate-list__container'>
          <div :class ="{
            'plate-list__title':true
          }">
            <div>{{secondItem.type |formateTypeName}}</div>
          </div>
          <div class='plate-list_body'>
            <div class='plate-list__editor'>
              <div class='plate-delete'>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <i
                    class='icon-ic_delete_normal iconfont'
                    v-if='secondItem.type !==0 '
                    @click='_handlerDeleteSituation(allItem.sort,firstIndex,secondItem,secondIndex)'
                  ></i>
                </el-tooltip>
              </div>
              <div class ='p_l_e__contaienr'>
                <div class='p-header__middle'>
                  <div class='width50'>关键词:</div>
                    <div class='plate_keyword'>
                      <el-tooltip
                          :key='ii'
                          placement="top"
                          :content="value"
                          v-for='(value,ii) in secondItem.keyWordArray'
                        >
                        <el-tag>{{value}}</el-tag>
                      </el-tooltip>
                    </div>
                    <div
                      class='p_action width40'
                      @click='_handlerEditorkeyWord(allItem.sort,firstIndex,secondIndex,secondItem.keyWordArray)'
                    >
                    编辑</div>
                </div>
              </div>
            </div>
            <div class='plate-list__dialog'>
              <div class='p-l-d_left'>
                AI:
              </div>
              <div class='p-l-d_right'>
                <!-- 类型选择 -->
                <div class = 'p-l-d__radioGroup' v-if='secondItem.type !==0'>
                  <el-radio-group
                    v-model='secondItem.nextType'
                    @change='_setNextTypeChange(allItem.sort,firstIndex,secondIndex,$event)'
                  >
                    <div v-if='secondItem.type===2'>
                      <el-tooltip
                        :content="allItem.nextOpenDialogsFirst"
                        placement="top"
                        v-if='allItem.nextOpenDialogsFirst'
                        >
                          <el-radio
                            :label=0
                          >
                          进入{{allItem.nextPlateName}}
                          </el-radio>
                      </el-tooltip>
                      <el-radio
                        :label=0
                        v-if='!allItem.nextOpenDialogsFirst'
                        >
                        进入{{allItem.nextPlateName}}
                      </el-radio>
                      <br/> <br/>
                      <el-radio
                        :label=2
                      >对话后进入{{allItem.nextPlateName}}</el-radio>
                    </div>
                    <div v-if='secondItem.type===4 || secondItem.type===6'>
                      <el-tooltip
                        :content="allItem.nextOpenDialogsFirst"
                        placement="top"
                        v-if='allItem.nextOpenDialogsFirst'
                        >
                          <el-radio
                            :label=0
                          >
                          进入{{allItem.nextPlateName}}
                          </el-radio>
                      </el-tooltip>
                      <el-radio
                        :label=0
                        v-if='!allItem.nextOpenDialogsFirst'
                        >
                        进入{{allItem.nextPlateName}}
                      </el-radio>
                      <span class="place"></span>
                      <el-radio
                      :label=4
                      >进入挽回语境</el-radio>
                      <br/> <br/>
                      <el-radio
                        :label=2
                      >对话后进入{{allItem.nextPlateName}}</el-radio>
                      <el-radio
                      :label=6
                      >挽回对话</el-radio>
                    </div>
                    <div v-if='secondItem.type===8'>
                      <el-radio
                      :label=8
                      >进入结束语境</el-radio>
                      <span class="place2"></span>
                      <el-radio
                      :label=4
                      >进入挽回语境</el-radio>
                      <br/> <br/>
                      <el-radio
                      :label=6
                      >挽回对话</el-radio>
                    </div>
                  </el-radio-group>
                </div>
                <!-- 得分 -->
                <div class='marginB20 marginL20'>
                    <span class='p_pause add-subcontent'>分数
                        <el-input-number
                          v-model.trim="secondItem.dialogue.score"
                          :controls='false'
                          :min="0"
                          @change='_handlerNumberChange(allItem.sort,index,$event)'
                          label="">
                        </el-input-number>
                      </span>
                </div>
                <!-- 对话 -->
                <div class = 'p-l-d__world'
                  v-for='(v, i) in secondItem.dialogues'
                  :key='i'
                >
                  <el-input
                    type="textarea"
                    autosize
                    v-model.trim="secondItem.dialogue.word"
                    @change="_handlerWordChange(allItem.sort,firstIndex,secondIndex,i,$event)"
                    placeholder="请输入内容">
                  </el-input>
                  <div class='p-l-d__action'>
                    <!-- <i
                    class='icon-ic_error_normal2 iconfont marginR10'
                    v-if='secondItem.dialogues.length>1'
                    @click='_handerDeleteDialogues(allItem.sort,firstIndex,secondIndex,v,i)'
                    ></i> -->
                    <span
                      @click='_handlerAudition (allItem.sort, firstIndex, secondIndex, i)'
                      class='audition_container marginL20'
                      v-if='!isSystem && secondItem.dialogue.videoUrl !==""'>
                        <span class='audition' >
                          试听
                        </span>
                        <i class = 'icon-ic_voice_normal iconfont audition_font '></i>
                    </span>
                    <span
                      class='upload_record_container marginR10'
                      v-if='!isSystem'
                      @click="_handlerUpload(allItem.sort,firstIndex,secondIndex,i)"
                    >
                      <i class='icon-btn_upload_type iconfont'></i>
                    </span>
                  </div>
                </div>
                <div class = 'p-l-d__edtior' v-show='_showAddDialogues(secondItem.nextType)'>
                  <span
                    :style='_showAddBtnDisabled(secondItem.dialogues)'
                    @click='_handerAddDialogues(allItem.sort,firstIndex,secondIndex,secondItem.dialogues)'>
                    <i class='icon-ic_add_ iconfont fontSubTitle marginR5'></i>添加对话
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import {
  SituationType,
  showAddDialogues,
  canAddDialogues,
  findAllKeyWord
} from '../../config'
import actions from '../../action/rightContentAction/index'
import { mapMutations, mapActions } from 'vuex'
import $ from 'jquery'
export default {
  name: 'second-situation',
  data () {
    return {
      showFour: false
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
      _setWord: 'verbalTemplate/set-template-second-word',
      _addDialogues: 'verbalTemplate/add-second-dialogues',
      _deleteDialogues: 'verbalTemplate/delete-second-dialogues',
      _deleteSecondSituation: 'verbalTemplate/delete-second-situation',
      _setNextType: 'verbalTemplate/set-second-next-type',
      _editorSecondKeyWord: 'verbalTemplate/editor-second-keyWord'
    }),
    ...mapActions({
      _saveTemplate: 'verbalTemplate/saveTemplate',
      _getTemplate: 'verbalTemplate/getTemplate'
    }),
    showSonLine (firstItem, secondIndex) {
      let length = firstItem.sonContext.length
      return length > secondIndex + 1
    },
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    // 判断是不是出现添加对话按钮
    _showAddDialogues (nextType) {
      return showAddDialogues(nextType)
    },
    // 设置对话内容
    _handlerWordChange (sort, index, sonIndex, i, value) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let sonContextIndex = sonIndex
      let dialoguesIndex = i
      this._setWord({
        mainIndex,
        contextsIndex,
        sonContextIndex,
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
    _handerAddDialogues (sort, index, sonIndex, dialoguesArr) {
      let flag = canAddDialogues(dialoguesArr)
      if (flag) {
        let mainIndex = sort - 1
        let contextsIndex = index
        let sonContextIndex = sonIndex
        this._addDialogues({
          mainIndex,
          contextsIndex,
          sonContextIndex
        })
      }
    },
    // 删除对话
    _handerDeleteDialogues (sort, index, sonIndex, dialoguesItem, i) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let sonContextIndex = sonIndex
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
              sonContextIndex,
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
          sonContextIndex,
          dialoguesIndex
        })
      }
    },
    // 删除二级语境
    _handlerDeleteSituation (sort, index, soncontextsItem, sonIndex) {
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handlerDeleteSituationReload(sort, index, soncontextsItem, sonIndex)
        },
        content: '您确定要删除当前语境吗？',
        title: '删除语境'
      })
    },
    _handlerDeleteSituationReload (sort, index, soncontextsItem, sonIndex) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let sonContextIndex = sonIndex
      let contextId = soncontextsItem.id
      if (contextId) {
        this.$delete(`/plate/context/${contextId}`, {
          contextId
        })
         .then((res) => {
           this._deleteSecondSituation({
             mainIndex,
             contextsIndex,
             sonContextIndex
           })
           this.$message.success('删除成功')
         })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      } else {
        this._deleteSecondSituation({
          mainIndex,
          contextsIndex,
          sonContextIndex
        })
        this.$message.success('删除成功')
      }
    },
    // netType 修改
    _setNextTypeChange (sort, index, sonIndex, nextType) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let sonContextIndex = sonIndex
      nextType = Number(nextType)
      this._setNextType({
        mainIndex,
        contextsIndex,
        sonContextIndex,
        nextType
      })
    },
     // 编辑关键字
    _handlerEditorkeyWord (sort, index, sonIndex, keyWordArray) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let sonContextIndex = sonIndex
      let arr = keyWordArray.map(item => {
        return item
      })
      let comparedKeyWords = findAllKeyWord(this.firstItem.sonContext, sonContextIndex)
      let errorMessage = '该语境中其他二级语境有相同关键词'
      this._execAction('tempalteEditorKeyWord', {
        reload: (newKeyWordArray) => {
          this._editorSecondKeyWord({
            mainIndex,
            contextsIndex,
            sonContextIndex,
            keyWordArray: newKeyWordArray
          })
        },
        keyWordArray: arr,
        comparedKeyWords,
        errorMessage
      })
    },
    // 上传录音
    _handlerUpload (sort, firstIndex, secondIndex, i) {
      let mainIndex = sort - 1
      let contextsIndex = firstIndex
      let sonContextIndex = secondIndex
      let dialogueIndex = i
      this._saveTemplate()
        .then((res) => {
          let plates = res.plates
          let dialogue = plates[mainIndex].contexts[contextsIndex].sonContext[sonContextIndex].dialogues[dialogueIndex]
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
    _handlerAudition (sort, index, secondIndex, i) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let dialogueIndex = i
      let sonContextIndex = secondIndex
      let plates = this.plates
      let dialogue = plates[mainIndex].contexts[contextsIndex].sonContext[sonContextIndex].dialogues[dialogueIndex]
      let videoUrl = dialogue.videoUrl
      $('#player').attr('src', videoUrl)
      let player = $('#player')[0]
      player.play()
    }
  },

  filters: {
    formateTypeName (type) {
      return SituationType[type]
    }
  },
  props: {
    level: {
      required: true
    },
    allItem: {
      required: true
    },
    firstItem: {
      required: true
    },
    firstIndex: {
      required: true
    },
    secondItem: {
      required: true
    },
    secondIndex: {
      required: true
    },
    isSystem: {
      required: true
    }
  }
}
</script>
<style>
</style>



