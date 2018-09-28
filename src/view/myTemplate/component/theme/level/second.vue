<template>
  <div class='t-list' >
    <span v-show='false'>{{theme}}</span>
    <!-- <div class='t-left' v-if='level===1'>
      <div class='t-left_top__border'></div>
      <div class='t-left_bottom__border'></div>
    </div> -->
    <div class='t-right' style='padding-left:100px;' v-if='!(firstItem.isCallManager===1)'>
      <div class='t-right_container'>
        <div :class ="{
          't-list__title':true,
          'second-level':true
        }">
          <div>{{secondItem.wordClass|formateTypeName(firstItem,secondIndex)}}</div>
        </div>
        <div class='t-right__body'>
          <div class='t-r-body-contaienr'>
            <div class='b-left'>
              <div class='AI'>AI:</div>
              <div class='yuzhuan'
              v-if="secondItem.isCallManager===1"
              >
                预转人工
              </div>
            </div>
            <div class='b-right'>
              <div class='b-right-word'>
                <el-input
                  type="textarea"
                  autosize
                  v-model.trim="secondItem.questionContent"
                  @change="_handlerSecondWordChange(firstIndex,secondIndex,$event)"
                  placeholder="请输入内容">
                </el-input>
              </div>
              <div class='b-right-action'>

                <div class ='action_first' v-if='secondItem.wordClass!=="0" && secondItem.wordClass!= "30" && secondItem.wordClass!=="31"'>
                  <!-- 三级词性 -->
                  <div class='action_btn' v-if='secondItem.showAddBtn'>
                    <el-button
                    v-for='item in fourSituationType'
                    :key='item.value'
                    @click='_handerAddThirdSituations(firstIndex,secondIndex,secondItem,item.label)'
                    >
                      {{ item.value }} 
                    </el-button>
                  </div>
                  <span
                    class='fontYellow action_biaoji'
                    v-if="secondItem.isCallManager===1"
                    @click='_handerSecondCallManage(firstIndex,secondIndex,secondItem)'
                   >
                     取消标记为[预转人工]
                   </span>

                   <span
                    class='fontBlue action_biaoji'
                    v-if="secondItem.isCallManager===0"
                    @click='_handerSecondCallManage(firstIndex,secondIndex,secondItem)'
                   >
                     标记为[预转人工]
                   </span>
                  <span
                    class='fontBlue action_add'
                    v-if="secondItem.isCallManager===0"
                    @click='_showFourSecondSituation(firstIndex,secondIndex,secondItem)'
                  >
                    <!-- <i class='icon-ic_add_ iconfont fontBlue marginR5 '></i> -->
                    添加词性
                  </span>
                  <!-- 删除一级词性 -->
                  <i
                    v-if='activeTreeItem.subjectType!==3'
                    class='icon-ic_delete_normal iconfont action_delete'
                    @click='_handlerSecondDeleteSituation(firstIndex,secondIndex,secondItem)'
                  ></i>
                </div>
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
  situationType,
  canAddSituation
} from '../../../config'
import actions from '../action/index'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import $ from 'jquery'
export default {
  data () {
    return {
      fourSituationType: [{
        label: '10',
        value: '肯定词性'
      }, {
        label: '12',
        value: '否定词性'
      } ]
    }
  },
  computed: {
    ...mapGetters({
      standardTypeOptions: 'verbalTemplate/standardTypeOptions'
    }),
    vState () {
      return this.$store.state.verbalTemplate
    },
    theme () {
      return this.vState.subjectTemplate.theme
    },
    activeTreeItem () {
      return this.vState.activeTreeItem
    }

  },
  methods: {
    ...mapMutations({
      _setSecondWord: 'verbalTemplate/set-second-word',
      _addThirdSituation: 'verbalTemplate/add-third-situation',
      _deleteSecondSituation: 'verbalTemplate/delete-second-situation',
      _editorSecondAddBtnShow: 'verbalTemplate/set-second-addBtn-show',
      _setDeleteID: 'verbalTemplate/set-delete-ID',
      _setSecondIsCallManage: 'verbalTemplate/set-second-isCallManage'
    }),
    ...mapActions({
      _getTemplate: 'verbalTemplate/getTemplate'
    }),
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    // 展示10个添加语境按钮
    _showFourSecondSituation (firstIndex, secondIndex, secondItem) {
      let show = !secondItem.showAddBtn
      this._editorSecondAddBtnShow({
        firstIndex,
        secondIndex,
        show
      })
    },

    // 添加三级词性
    _handerAddThirdSituations (firstIndex, secondIndex, secondItem, wordClass) {
      // 首先做一下现在增加的语境是否是唯一语境
      let arr = this.theme[firstIndex].sonModel[secondIndex].sonModel
      let flag = canAddSituation(arr, wordClass)
      if (flag === false) {
        this.$message.error('已有相同词性')
        return false
      }
      let show = !secondItem.showAddBtn
      // 处理需要增加的语境的初始值
      // 默认增加的是肯定语境
      // 二级语境中没有3级语境了
      let content = {
        questionContent: '',
        wordClass: '10',
        showAddBtn: false,
        sonModel: [],
        isCallManager: 0
      }
      content.wordClass = wordClass
      // 有下一级语境，上面nex
      this._addThirdSituation({
        firstIndex,
        secondIndex,
        content
      })
      this._editorSecondAddBtnShow({
        firstIndex,
        secondIndex,
        show
      })
    },
    // 设置二级对话内容
    _handlerSecondWordChange (firstIndex, secondIndex, value) {
      this._setSecondWord({
        firstIndex,
        secondIndex,
        value: $.trim(value)
      })
    },

    // 设置是否转人工
    _handerSecondCallManage (firstIndex, secondIndex, secondItem) {
      let isCallManager = secondItem.isCallManager === 1 ? 0 : 1
      let content = ''
      if (isCallManager) {
        content = `此节点标记为【预转人工】后，将不可在此节点下添加词性<br/>此节点下已添加的词性将会被删除，您确定标记？`
      } else {
        content = `取消【预转人工】标记后，您可在此节点下添加词性。<br/>您确定取消？`
      }
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handerSecondCallManageReload(firstIndex, secondIndex, isCallManager)
        },
        content: content,
        title: '提示'
      })
    },
    _handerSecondCallManageReload (firstIndex, secondIndex, isCallManager) {
      this._setSecondIsCallManage({
        firstIndex,
        secondIndex,
        isCallManager
      })
    },
    // 删除二级词性
    _handlerSecondDeleteSituation (firstIndex, secondIndex, secondItem) {
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handlerDeleteSituationReload(firstIndex, secondIndex, secondItem)
        },
        content: '您确定要删除当前词性吗？',
        title: '删除词性'
      })
    },
    _handlerDeleteSituationReload (firstIndex, secondIndex, secondItem) {
      let id = secondItem.id
      if (id) {
        this._setDeleteID({
          id
        })
      }
      this._deleteSecondSituation({
        firstIndex,
        secondIndex
      })
    }
  },

  filters: {
    formateTypeName (wordClass, firstItem, secondIndex) {
      if (firstItem.wordClass === '30') {
        if (wordClass === '30') {
          if (secondIndex === 0) {
            return '1次'
          } else if (secondIndex === 1) {
            return '2次'
          }
        } else if (wordClass === '31') {
          return situationType[wordClass]
        }
      } else {
        return situationType[wordClass]
      }
    }
  },
  props: {
    level: {
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
    }
  }
}
</script>
<style>
</style>



