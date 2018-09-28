<template>
  <div class='t-list'>
    <span v-show='false'>{{theme}}</span>
    <!-- <div class='t-left' v-if='level===1'>
      <div class='t-left_top__border'></div>
      <div class='t-left_bottom__border'></div>
    </div> -->
    <div class='t-right' style='padding-left:200px;' v-if='!((firstItem.isCallManager===1) || (secondItem.isCallManager===1))'>
      <div class='t-right_container'>
        <div :class ="{
          't-list__title':true,
          'third-level':true
        }">
          <div>{{thirdItem.wordClass|formateTypeName}}</div>
        </div>
        <div class='t-right__body'>
          <div class='t-r-body-contaienr'>
            <div class='b-left'>
              <div class='AI'>AI:</div>
              <div class='yuzhuan'
              v-if='thirdItem.isCallManager===1'
              >
                预转人工
              </div>
            </div>
            <div class='b-right'>
              <div class='b-right-word'>
                <el-input
                  type="textarea"
                  autosize
                  v-model.trim="thirdItem.questionContent"
                  @change="_handlerThirdWordChange(firstIndex,secondIndex,thirdIndex,$event)"
                  placeholder="请输入内容">
                </el-input>
              </div>
              <div class='b-right-action'>

                <div class ='action_first'>
                  <!-- 三级词性 -->

                  <div class='action_btn' v-if='thirdItem.showAddBtn'>
                    <el-button
                    v-for='item in fourSituationType'
                    :key='item.value'
                    >
                      {{ item.value }} 
                    </el-button>
                  </div>
                  <span
                    class='fontYellow action_biaoji'
                    v-if='thirdItem.isCallManager===1'
                    @click='_handerThirdCallManage(firstIndex,secondIndex,thirdIndex,thirdItem)'
                   >
                     取消标记为[预转人工]
                   </span>

                   <span
                    class='fontBlue action_biaoji'
                     v-if='thirdItem.isCallManager===0'
                    @click='_handerThirdCallManage(firstIndex,secondIndex,thirdIndex,thirdItem)'
                   >
                     标记为[预转人工]
                   </span>

                  <span
                    v-if='false'
                    class='fontBlue action_add'
                  >
                    <!-- <i class='icon-ic_add_ iconfont fontBlue marginR5 '></i> -->
                    添加词性
                  </span>
                  <!-- 删除一级词性 -->
                  <i
                    class='icon-ic_delete_normal iconfont action_delete'
                    @click='_handlerThirdDeleteSituation(firstIndex,secondIndex,thirdIndex,thirdItem)'
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
  situationType
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
        label: '11',
        value: '中性词性'
      }, {
        label: '12',
        value: '否定词性'
      }, {
        label: '13',
        value: '拒绝词性'
      }]
    }
  },
  computed: {
    ...mapGetters({
      standardTypeOptions: 'verbalTemplate/standardTypeOptions'
    }),
    theme () {
      return this.$store.state.verbalTemplate.subjectTemplate.theme
    }

  },
  methods: {
    ...mapMutations({
      _setThirdWord: 'verbalTemplate/set-third-word',
      _deleteThirdSituation: 'verbalTemplate/delete-third-situation',
      _setDeleteID: 'verbalTemplate/set-delete-ID',
      _setThirdIsCallManage: 'verbalTemplate/set-third-isCallManage'
    }),
    ...mapActions({
      _getTemplate: 'verbalTemplate/getTemplate'
    }),
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    // 设置三级对话内容
    _handlerThirdWordChange (firstIndex, secondIndex, thirdIndex, value) {
      this._setThirdWord({
        firstIndex,
        secondIndex,
        thirdIndex,
        value: $.trim(value)
      })
    },
    // 设置是否转人工
    _handerThirdCallManage (firstIndex, secondIndex, thirdIndex, thirdItem) {
      let isCallManager = thirdItem.isCallManager === 1 ? 0 : 1
      let content = ''
      if (isCallManager) {
        content = `<div>您确定标记？</div>`
      } else {
        content = `<div>您确定取消？</div>`
      }
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handerThirdCallManageReload(firstIndex, secondIndex, thirdIndex, isCallManager)
        },
        content: content,
        title: '提示'
      })
    },
    _handerThirdCallManageReload (firstIndex, secondIndex, thirdIndex, isCallManager) {
      this._setThirdIsCallManage({
        firstIndex,
        secondIndex,
        thirdIndex,
        isCallManager
      })
    },
    // 删除三级词性
    _handlerThirdDeleteSituation (firstItem, secondIndex, thirdIndex, thirdItem) {
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handlerDeleteSituationReload(firstItem, secondIndex, thirdIndex, thirdItem)
        },
        content: '您确定要删除当前词性吗？',
        title: '删除词性'
      })
    },
    _handlerDeleteSituationReload (firstIndex, secondIndex, thirdIndex, thirdItem) {
      let id = thirdItem.id
      if (id) {
        this._setDeleteID({
          id
        })
      }
      this._deleteThirdSituation({
        firstIndex,
        secondIndex,
        thirdIndex
      })
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
    firstIndex: {
      required: true
    },
    firstItem: {
      required: true
    },
    secondIndex: {
      required: true
    },
    secondItem: {
      required: true
    },
    thirdItem: {
      required: true
    },
    thirdIndex: {
      required: true
    },
    isSystem: {
    }
  }
}
</script>
<style>
</style>



