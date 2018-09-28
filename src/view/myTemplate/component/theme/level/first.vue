<template>
  <div class='t-list'>
    <span v-show='false'>{{theme}}{{vState}}{{activeTreeItem}}</span>
    <!-- <div class='t-left' v-if='level===1'>
      <div class='t-left_top__border'></div>
      <div class='t-left_bottom__border'></div>
    </div> -->
    <div class='t-right'>
      <div class='t-right_container'>
        <div :class ="{
          't-list__title':true,
          'first-level-open': firstItem.wordClass==='0',
          'first-level-re':firstItem.wordClass==='30',
          'first-level-search':firstItem.wordClass==='19' || firstItem.wordClass==='20' ,
          'first-level-normal':true
        }">
          <div>{{firstItem.wordClass|formateTypeName}}</div>
        </div>
        <div class='t-right__body' v-if='firstItem.wordClass!=="30"'>
          <div class='t-r-body-contaienr'>
            <div class='b-left'>
              <div class='AI'>AI:</div>
              <div class='yuzhuan'
              v-if='firstItem.isCallManager===1'
              >
                预转人工
              </div>
            </div>
            <div class='b-right'>
              <div class='b-right-word'>
                <el-input
                  type="textarea"
                  autosize
                  v-model.trim="firstItem.questionContent"
                  @change="_handlerFirstWordChange(firstIndex,$event)"
                  placeholder="请输入内容">
                </el-input>
              </div>
              <div class='b-right-action' v-if='activeTreeItem.subjectType!==3'>

                <div class ='action_first' v-if='firstItem.wordClass!=="0" && firstItem.wordClass!=="20"'>
                  <!-- 二级词性 -->
                  <div class='action_btn' v-if='firstItem.showAddBtn'>
                    <el-button
                    v-for='item in fourSituationType'
                    :key='item.value'
                    @click='_handerAddSecondSituations(firstIndex,firstItem,item.label)'
                    >
                      {{ item.value }} 
                    </el-button>
                  </div>
                  <span
                    v-if='firstItem.isCallManager===1'
                    class='fontYellow action_biaoji'
                    @click='_handerFirstCallManage(firstIndex,firstItem)'
                   >
                    取消标记为[预转人工]
                   </span>

                   <span
                    v-if='firstItem.isCallManager===0'
                    class='fontBlue action_biaoji'
                     @click='_handerFirstCallManage(firstIndex,firstItem)'
                   >
                     标记为[预转人工]
                   </span>
                  <!-- 添加按钮 -->
                   <span
                    v-if='firstItem.isCallManager===0'
                    class='fontBlue action_add'
                    @click='_showFourFirstSituation(firstIndex,firstItem)'
                  >
                    <!-- <i class='icon-ic_add_ iconfont fontBlue marginR5 '></i> -->
                    添加词性
                  </span>
                  <!-- 删除一级词性 -->
                  <i
                    class='icon-ic_delete_normal iconfont action_delete'
                    @click='_handlerFirstDeleteSituation(firstIndex,firstItem)'
                  ></i>
                </div>

                <div class='action_first' v-if='firstItem.wordClass==="0" && activeTreeItem.subjectType!==1'>
                  <div class='action_btn' v-if='firstItem.showAddBtn'>
                    <el-button
                      v-for='item in fourSituationType'
                      :key='item.value'
                      @click='_handerAddFirstSituations(firstIndex,firstItem,item.label)'
                    >
                      {{ item.value }} 
                    </el-button>
                  </div>
                  <span
                    class='fontBlue  action_add'
                    @click='_showFourFirstSituation(firstIndex,firstItem)'
                  >
                    <!-- <i class='icon-ic_add_ iconfont fontBlue marginR5'></i> -->
                    添加词性
                  </span>
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
      }]
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
      _setFirstWord: 'verbalTemplate/set-first-word',
      _addFirstSituation: 'verbalTemplate/add-first-situation',
      _deleteFirstSituation: 'verbalTemplate/delete-first-situation',
      _addSecondSituation: 'verbalTemplate/add-second-situation',
      _editorFirstAddBtnShow: 'verbalTemplate/set-first-addBtn-show',
      _setDeleteID: 'verbalTemplate/set-delete-ID',
      _setFirstIsCallManage: 'verbalTemplate/set-first-isCallManage'
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
    _showFourFirstSituation (firstIndex, firstItem) {
      let show = !firstItem.showAddBtn
      this._editorFirstAddBtnShow({
        firstIndex,
        show
      })
    },

    // 添加一级词性
    _handerAddFirstSituations (firstIndex, firstItem, wordClass) {
      // 首先做一下现在增加的语境是否是唯一语境
      let flag = canAddSituation(this.theme, wordClass)
      if (flag === false) {
        this.$message.error('已有相同词性')
        return false
      }
      let show = !firstItem.showAddBtn
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
      // 设置一级语境
      this._addFirstSituation({
        content
      })
      this._editorFirstAddBtnShow({
        firstIndex,
        show
      })
    },

    // 添加二级词性
    _handerAddSecondSituations (firstIndex, firstItem, wordClass) {
      // 首先做一下现在增加的语境是否是唯一语境
      let arr = this.theme[firstIndex].sonModel
      let flag = canAddSituation(arr, wordClass)
      if (flag === false) {
        this.$message.error('已有相同词性')
        return false
      }
      let show = !firstItem.showAddBtn
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
      this._addSecondSituation({
        firstIndex,
        content
      })
      this._editorFirstAddBtnShow({
        firstIndex,
        show
      })
    },

    // 设置一级对话内容
    _handlerFirstWordChange (firstIndex, value) {
      this._setFirstWord({
        firstIndex,
        value: $.trim(value)
      })
    },
    // 设置是否转人工
    _handerFirstCallManage (firstIndex, firstItem) {
      let isCallManager = firstItem.isCallManager === 1 ? 0 : 1
      let content = ''
      if (isCallManager) {
        content = `此节点标记为【预转人工】后，将不可在此节点下添加词性。<br/>此节点下已添加的词性将会被删除，您确定标记？`
      } else {
        content = `取消【预转人工】标记后，您可在此节点下添加词性。<br/>您确定取消?`
      }
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handerFirstCallManageReload(firstIndex, isCallManager)
        },
        content: content,
        title: '提示'
      })
    },
    _handerFirstCallManageReload (firstIndex, isCallManager) {
      this._setFirstIsCallManage({
        firstIndex,
        isCallManager
      })
    },

    // 删除一级级词性
    _handlerFirstDeleteSituation (firstIndex, firstItem) {
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handlerDeleteSituationReload(firstIndex, firstItem)
        },
        content: '您确定要删除当前词性吗？',
        title: '删除词性'
      })
    },
    _handlerDeleteSituationReload (firstIndex, firstItem) {
      let id = firstItem.id
      //  如果有记录就要写到删除列表中
      if (id) {
        this._setDeleteID({
          id
        })
      }
      this._deleteFirstSituation({
        firstIndex
      })
      this.$message.success('删除成功')
    }
  },

  filters: {
    formateTypeName (type) {
      return situationType[type]
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
    isSystem: {
    }
  }
}
</script>
<style>
</style>



