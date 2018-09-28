<template>
    <div class='theme_container' v-if='activeTreeItem.subjectId'>
      <span v-show="false">{{vState}}{{theme}}{{activeTreeItem}}{{hasDeletedList}}</span>
      <div
      v-if='theme.length > 0'
      v-for = '(firstItem,firstIndex) in theme '
      :key='firstIndex'
    >
        <first-situation
          level='1'
          :firstItem='firstItem'
          :firstIndex='firstIndex'
        ></first-situation>
        <div  
          v-if='firstItem.sonModel &&  firstItem.sonModel.length>0'
          :key='secondIndex'
          v-for ='(secondItem,secondIndex) in firstItem.sonModel'
        >
          <second-situation
            level='2'
            :firstItem='firstItem'
            :firstIndex='firstIndex'
            :secondIndex='secondIndex'
            :secondItem='secondItem'
          ></second-situation>
          <third-situation
            v-if='secondItem.sonModel && secondItem.sonModel.length>0'
            v-for ='(thirdItem,thirdIndex) in secondItem.sonModel'
            level='3'
            :firstIndex='firstIndex'
            :firstItem='firstItem'
            :secondIndex='secondIndex'
            :secondItem='secondItem'
            :thirdItem='thirdItem'
            :thirdIndex='thirdIndex'
            :key='thirdIndex'
          ></third-situation>
        </div>
      </div>
      <div class = 'marginT20 textRight'>
        <el-button 
        type = 'primary'
        size='mini'
        :loading='loading'
        @click='_save'
        >{{ saveText }}</el-button>
        <!-- <el-button>取消</el-button> -->
      </div>
  </div>
  
  
</template>
<script>
import FirstSituation from './level/first'
import SecondSituation from './level/second'
import ThirdSituation from './level/third'
import { mapMutations, mapActions } from 'vuex'
import $ from 'jquery'
export default {
  name: 'normal-plates',
  data () {
    return {
      loading: false,
      saveText: '保存',
      editorList: [],  // 修改的数组列表
      addList: [] // 增加的列表
    }
  },
  props: {
    isSystem: {
      required: true
    }
  },
  computed: {
    vState () {
      return this.$store.state.verbalTemplate
    },
    theme () {
      return this.vState.subjectTemplate.theme
    },
    activeTreeItem () {
      return this.vState.activeTreeItem
    },
    hasDeletedList () {
      return this.vState.hasDeletedList
    },
    templateId () {
      return this.vState.templateId
    }
  },
  methods: {
    // 主题的保存
    ...mapMutations({
      _setDeleteID: 'verbalTemplate/set-delete-ID',
      _clearDeletedID: 'verbalTemplate/celear-ID'
    }),
    ...mapActions({
      _getSubjectTemplate: 'verbalTemplate/getSubjectTemplate',
      _getTemplateStatus: 'verbalTemplate/getTemplateStatus'
    }),
    // 格式化 修改的词性
    _formateEditorList (item) {
      if (item.initialQuestionContent !== undefined) {
        if (item.id) {
          if ($.trim(item.initialQuestionContent) !== $.trim(item.questionContent) ||
            item.isCallManager !== item.initialIsCallManager
           ) {
            this.editorList.push({
              id: item.id,
              isCallManager: item.isCallManager,
              questionContent: $.trim(item.questionContent)
            })
          }
        }
      }
    },
    // 获取修改的词性列表
    _getEditorList (theme) {
      if (!theme) {
        return
      }
      theme.map(item => {
        this._formateEditorList(item)
        if (item.sonModel && item.sonModel.length > 0) {
          this._getEditorList(item.sonModel)
        }
      })
    },
    // 格式化增加的列表
    // 没有 parentID 增加 parentID
    _formateaddList (arr) {
      let res = arr.map(item => {
        if (!item.parentId) {
          item.parentId = '0'
        }
        if (item.sonModel && item.sonModel.length > 0) {
          item.sonModel.map(v => {
            if (!v.parentId) {
              v.parentId = '0'
            }
            if (v.sonModel && v.sonModel.length > 0) {
              v.sonModel.map(j => {
                if (!j.parentId) {
                  j.parentId = '0'
                }
                return j
              })
            }
            return v
          })
        }
        return item
      })
      return res
    },
    // 获取增加的词性列表
    _getaddList (theme) {
      let arr = []
      if (!theme) {
        return
      }
      theme.map(item => {
        if (!item.id) {
          // 全部新增的情况下
          arr.push({
            wordClass: item.wordClass,
            questionContent: item.questionContent,
            sonModel: item.sonModel,
            isCallManager: item.isCallManager
          })
        } else {
          // 非全部新增的情况下
          if (item.sonModel && item.sonModel.length > 0) {
            item.sonModel.map(v => {
              if (!v.id) {
                arr.push({
                  wordClass: v.wordClass,
                  questionContent: v.questionContent,
                  sonModel: v.sonModel,
                  parentId: item.id,
                  isCallManager: item.isCallManager
                })
              } else {
                if (v.sonModel && v.sonModel.length > 0) {
                  v.sonModel.map(j => {
                    if (!j.id) {
                      arr.push({
                        wordClass: j.wordClass,
                        questionContent: j.questionContent,
                        parentId: v.id,
                        isCallManager: item.isCallManager
                      })
                    }
                  })
                }
              }
            })
          }
        }
      })
      if (arr.length > 0) {
        this.addList = this._formateaddList(arr)
      }
    },
    // 把标记下的数据删除掉sonModel
    _deleteHasCalled (theme, hasDeletedList) {
      let deleteList = []
      let newTheme = theme.map(item => {
        if (item.isCallManager === 1) {
          if (item.sonModel && item.sonModel.length > 0) {
            deleteList.push(item.sonModel)
            item.sonModel = []
          }
        } else {
          if (item.sonModel && item.sonModel.length > 0) {
            item.sonModel.map(v => {
              if (v.isCallManager === 1) {
                if (v.sonModel && v.sonModel.length > 0) {
                  deleteList.push(v.sonModel)
                  v.sonModel = []
                }
              }
              return v
            })
          }
        }
        return item
      })
      let newHasDeletedList = hasDeletedList
      deleteList.map(item => {
        if (item.id) {
          newHasDeletedList.push(item.id)
        }
        if (item.sonModel && item.sonModel.length > 0) {
          item.sonModel.map(v => {
            if (v.id) {
              newHasDeletedList.push(v.id)
            }
          })
        }
      })
      return {
        newTheme,
        newHasDeletedList
      }
    },
    _save () {
      // 先清空一次
      if (this.loading) {
        return false
      }
      this.loading = true
      this.saveText = '保存中'
      this.editorList = []
      this.addList = []
      let theme = this.theme
      let hasDeletedList = this.hasDeletedList
      // 如果标记为转人工，那么转人工下的数据需要删除
      let newTheme = this._deleteHasCalled(theme, hasDeletedList).newTheme
      let newHasDeletedList = this._deleteHasCalled(theme, hasDeletedList).newHasDeletedList
      this._getaddList(newTheme) // 先计算新增的
      this._getEditorList(newTheme) // 再计算修改的

      let editorList = this.editorList
      let addList = this.addList

      let addListLength = addList.length
      let editorListLength = editorList.length
      let hasDeletedListLength = newHasDeletedList.length

      if (editorListLength === 0 && addListLength === 0 && hasDeletedListLength === 0) {
        this.loading = false
        this.saveText = '保存'
        this.$message.warning('当前无更改，无需保存')
      } else {
        let addP = null
        let EditorP = null
        let deleteP = null
        let PromiseList = []
        if (addListLength > 0) {
          let url = ''
          if (this.isSystem) {
            url = '/sample/subject/create/policy'
          } else {
            url = '/template/subject/create/policy'
          }
          addP = this.$post(url, {
            templateId: this.templateId,
            subjectId: this.activeTreeItem.subjectId,
            policyList: addList
          })
          PromiseList.push(addP)
        }
        if (editorListLength > 0) {
          let url = ''
          if (this.isSystem) {
            url = '/sample/subject/update/policy'
          } else {
            url = '/template/subject/update/policy'
          }
          EditorP = this.$post(url, {
            templateId: this.templateId,
            subjectId: this.activeTreeItem.subjectId,
            policyList: editorList
          })
          PromiseList.push(EditorP)
        }
        if (hasDeletedListLength > 0) {
          let url = ''
          if (this.isSystem) {
            url = '/sample/subject/delete/policy'
          } else {
            url = '/template/subject/delete/policy'
          }
          deleteP = this.$post(url, newHasDeletedList)
          PromiseList.push(deleteP)
        }
        Promise.all(PromiseList)
          .then(res => {
            this.editorList = []
            this.addList = []
            this.loading = false
            this.saveText = '保存'
            this.$message.success('保存成功')
            this._clearDeletedID() // 情况delete-ID
            this._getSubjectTemplate() // 获取主题
            this._getTemplateStatus() // 获取主题状态
          })
          .catch(err => {
            this.editorList = []
            this.addList = []
            this.loading = false
            this.saveText = '保存'
            this.$message.error(err.data.error.message)
          })
      }
    }
  },
  components: {
    FirstSituation,
    SecondSituation,
    ThirdSituation
  }
}
</script>
<style lang="less" scoped>
.theme_container{
  height:~"calc(100vh - 235px)";
  min-height: ~"calc(100vh - 235px)";
  overflow-y: scroll;
  padding: 0  20px 20px 20px ;
  box-sizing: border-box;
}
</style>

