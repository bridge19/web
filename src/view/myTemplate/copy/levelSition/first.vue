<template>
  <div class='plate-list'>
      <span v-show='false'>{{plates}}</span>
      <div class='plate-list__left' v-if='level===2'>
        <div class='plate-list_top__border'></div>
        <div class='plate-list_bottom__border'></div>
      </div>
      <div class='plate-list__right'>
        <div class='plate-list__container'>
          <div :class ="{
            'plate-list__title':true,
            'situationBg-open':true
          }">
            <div>{{firstItem.type |formateTypeName}}</div>
          </div>
          <div class='plate-list_body'>
            <div class='plate-list__editor' v-if='firstItem.type !==0'>
              <div class='plate-delete'>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <i
                    class='icon-ic_delete_normal iconfont'
                    v-if='firstItem.type !==0 '
                    @click='_handlerDeleteSituation(allItem.sort,firstItem,firstIndex)'
                  ></i>
                </el-tooltip>
              </div>
              <div class ='p_l_e__contaienr' v-if='false'>
                <div class='p-header__middle'>
                  <div class='width50'>关键词:</div>
                    <div class='plate_keyword'>

                      <el-tooltip
                          :key='ii'
                          placement="top"
                          :content="value"
                          v-for='(value,ii) in firstItem.keyWordArray'
                        >
                        <el-tag>{{value}}</el-tag>
                      </el-tooltip>
                    </div>
                    <div class='p_action width40'
                    @click='_handlerEditorkeyWord(allItem.sort,firstIndex,firstItem.keyWordArray)'>
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
                <div class = 'p-l-d__radioGroup' v-if='firstItem.type !==0'>
                  <el-radio-group
                  v-model='firstItem.nextType'
                  @change='_setNextTypeChange(allItem.sort,firstIndex,$event)'
                  >
                    <div v-if='firstItem.type===2'>
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

                      <br/><br/>
                      <el-radio
                        :label=2
                      >对话后进入{{allItem.nextPlateName}}</el-radio>
                    </div>
                    <div v-if='firstItem.type===4 || firstItem.type===6'>
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
                    <div v-if='firstItem.type===8'>
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
                          v-model.trim="firstItem.dialogue.score"
                          :controls='false'
                          :min="0"
                          @change='_handlerNumberChange(allItem.sort,index,$event)'
                          label="">
                        </el-input-number>
                      </span>
                </div>
                <!-- 对话 -->
                <div class = 'p-l-d__world'
                >
                  <el-input
                    type="textarea"
                    autosize
                    v-model.trim="firstItem.dialogue.word"
                    @change="_handlerWordChange(allItem.sort,firstIndex,i,$event)"
                    placeholder="请输入内容">
                  </el-input>
                  <div class='p-l-d__action'>
                    <!-- <i
                      v-if='firstItem.dialogues.length>1'
                      @click='_handerDeleteDialogues(allItem.sort,firstIndex,v,i)'
                      class='icon-ic_error_normal2 iconfont marginR10'>
                    </i> -->
                    <span
                      @click='_handlerAudition(allItem.sort,firstIndex,i)'
                      class='audition_container marginL20'
                      v-if='!isSystem && firstItem.dialogue.videoUrl !==""'>
                      <span class='audition' >
                        试听
                      </span>
                      <i class = 'icon-ic_voice_normal iconfont audition_font '></i>
                    </span>
                    <span
                      class='upload_record_container marginR10'
                      v-if='!isSystem'
                      @click='_handlerUpload(allItem.sort,firstIndex,i)'
                    >
                      <i class='icon-btn_upload_type iconfont'></i>
                    </span>
                  </div>
                </div>
                <div class = 'p-l-d__edtior' v-show='_showAddDialogues(firstItem.nextType)'>
                  <div class='palte_btn__group sub-btn__group' v-show='firstItem.showAddBtn'>
                    <!-- <el-select v-model="value" placeholder="请选择">
                      <el-option
                        :v-for="(firstStVal,firstStKey,firstStIndex )in SituationType"
                        :key="firstStIndex"
                        :label="firstStKey"
                        :value="firstStVal">
                      </el-option>
                    </el-select> -->
                    <!-- <el-button
                    @click='_handerAddSecondSituations(allItem.sort,firstIndex,2,firstItem)'
                    >
                      肯定语境
                    </el-button>
                    <el-button
                    @click='_handerAddSecondSituations(allItem.sort,firstIndex,4,firstItem)'
                    >
                      中性语境
                    </el-button>
                    <el-button
                    @click='_handerAddSecondSituations(allItem.sort,firstIndex,6,firstItem)'
                    >
                      否定语境
                    </el-button>
                    <el-button
                    @click='_handerAddSecondSituations(allItem.sort,firstIndex,8,firstItem)'
                    >
                      拒绝语境
                    </el-button> -->
                  </div>
                  <span
                    :style='_showAddBtnDisabled(firstItem.dialogues)'
                    @click='_handerAddDialogues(allItem.sort,firstIndex,firstItem.dialogues)'>
                    <i class='icon-ic_add_ iconfont fontSubTitle marginR5'></i>添加对话
                    </span>
                  <span class='p_pause add-subcontent' v-if='firstItem.type===0'>
                    停顿时间
                    <el-input-number
                      v-model.trim="firstItem.pauseTime"
                      :controls='false'
                      :min="0"
                      @change='_handlerNumberChange(allItem.sort,firstIndex,$event)'
                      label="描述文字">
                    </el-input-number>秒
                  </span>
                  <span
                    v-show='firstItem.nextType === 6'
                    class='fontBlue add-subcontent'
                    @click='_showFourSituation(allItem.sort,firstIndex,firstItem)'
                  >
                    <i class='icon-ic_add_ iconfont fontBlue marginR5'></i>
                  添加二级语境</span>
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
  data () {
    return {
      value: '',
      SituationType
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
      _setNextType: 'verbalTemplate/set-first-next-type',
      _addSecondSituation: 'verbalTemplate/set-second-situation',
      _editorFirstKeyWord: 'verbalTemplate/editor-first-keyWord',
      _editorFirstAddBtnShow: 'verbalTemplate/editor-first-addBtn-show'
    }),
    ...mapActions({
      _saveTemplate: 'verbalTemplate/saveTemplate',
      _getTemplate: 'verbalTemplate/getTemplate'
    }),
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    // 判断是不是出现添加对话按钮
    _showAddDialogues (nextType) {
      return showAddDialogues(nextType)
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
      // let flag = canAddDialogues(dialoguesArr)
      // if (!flag) {
      //   return {
      //     cursor: 'not-allowed'
      //   }
      // } else {
      //   return {}
      // }
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
    // 删除一级语境
    _handlerDeleteSituation (sort, contextsItem, index) {
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handlerDeleteSituationReload(sort, contextsItem, index)
        },
        content: '您确定要删除当前语境吗？',
        title: '删除语境'
      })
    },
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
    // 设置 nextType 信息
    _setNextTypeChange (sort, index, nextType) {
      let mainIndex = sort - 1
      let contextsIndex = index
      nextType = Number(nextType)
      this._setNextType({
        mainIndex,
        contextsIndex,
        nextType
      })
    },
    // 展示4个添加语境按钮
    _showFourSituation (sort, firstIndex, firstItem) {
      let mainIndex = sort - 1
      let contextsIndex = firstIndex
      let show = !firstItem.showAddBtn
      this._editorFirstAddBtnShow({
        mainIndex,
        contextsIndex,
        show
      })
    },
    // 添加二级语境
    _handerAddSecondSituations (sort, index, situationType, firstItem) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let show = !firstItem.showAddBtn
      // 处理需要增加的语境的初始值
      // 默认增加的是肯定语境
      // 二级语境中没有3级语境了
      let content = {
        'dialogues': [],
        keyWord: '',
        keyWordArray: [],
        type: 2,
        nextType: 0
      }
      content.type = situationType
      if (situationType === 8) {
        content.nextType = 8
      }
      this._addSecondSituation({
        contextsIndex,
        mainIndex,
        content
      })
      this._editorFirstAddBtnShow({
        mainIndex,
        contextsIndex,
        show
      })
    },
    // 编辑关键字
    _handlerEditorkeyWord (sort, index, keyWordArray) {
      let mainIndex = sort - 1
      let contextsIndex = index
      let arr = keyWordArray.map(item => {
        return item
      })
      let comparedKeyWords = findAllKeyWord(this.allItem.contexts, contextsIndex)
      let errorMessage = '该板块其他语境中有相同关键词'

      this._execAction('tempalteEditorKeyWord', {
        reload: (newKeyWordArray) => {
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
    isSystem: {
      required: true
    }
  }
}
</script>
<style>
</style>



