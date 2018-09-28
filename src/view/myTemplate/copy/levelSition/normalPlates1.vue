<template>
  <div id='flow'>
    <span v-show='false'>{{plates}}</span>
    <div
      class ='sutationBg plate_content'
      v-for ='(allItem,allIndex) in normalPlates'
      :key='allIndex'
    >
    <div class='plate-left__con'>
      <div class='plate-header'>
        <div class='palte_btn__group' v-if='allItem.showAddBtn'>
          <el-button
          @click='_handlerAddFirstSituations(2,allItem.sort,allItem)'
          >
            肯定语境
          </el-button>
          <el-button
          @click='_handlerAddFirstSituations(4,allItem.sort,allItem)'
          >
            中性语境
          </el-button>
          <el-button
          @click='_handlerAddFirstSituations(6,allItem.sort,allItem)'
          >
            否定语境
          </el-button>
          <el-button
          @click='_handlerAddFirstSituations(8,allItem.sort,allItem)'
          >
            拒绝语境
          </el-button>
        </div>

        <div class='p-header__left'>
            <el-tag class="tag">{{allItem.sort}}</el-tag>
            <el-tooltip
              :content="allItem.name"
              placement="top"
            >
              <span class='title'>{{allItem.name}}</span>
            </el-tooltip>
            <i
              class='icon-ic_edit_normal iconfont'
              @click='_hannderRenamePlate(allItem.name,allItem.sort)'
            ></i>
          </div>
          <div class='p-header__middle'>
            <div class='width50'>关键词:</div>
            <div class='plate_keyword'>
              <el-tooltip
                :key='allkWdIndex'
                placement="top"
                :content="allkWItem"
                v-for='(allkWItem,allkWdIndex) in allItem.keyWordArray'
              >
                <el-tag>{{allkWItem}}</el-tag>
              </el-tooltip>
            </div>
            <div
              class='p_action width40'
              @click='_handlerEditorkeyWord(allItem.sort,allItem.keyWordArray)'
            >编辑</div>
          </div>
          <div class='p-header__right'>
            <span
              class='p_action marginR10'
              @click='_showFourSituation(allItem.sort,allItem)'
              >添加语境</span>
            <el-tooltip effect="dark" content="删除" placement="top">
              <i
                class='icon-ic_delete_normal iconfont'
                v-if='normalPlates.length >1'
                @click='_handlerDeletePlate(allItem.sort,allItem)'>
              </i>
            </el-tooltip>
          </div>
      </div>
      <!-- 具体语境内容 -->
      <div
        v-for = '(firstItem,firstIndex) in allItem.contexts'
        :key='firstIndex'
      >
        <first-situation
          :isSystem='isSystem'
          level='1'
          :allItem='allItem'
          :firstItem='firstItem'
          :firstIndex='firstIndex'
        ></first-situation>
        <second-situation
          :isSystem='isSystem'
          level='2'
          v-if='firstItem.sonContext.length>0'
          :allItem='allItem'
          :firstItem='firstItem'
          :firstIndex='firstIndex'
          v-for ='(secondItem,secondIndex) in firstItem.sonContext'
          :key='secondIndex'
          :secondIndex='secondIndex'
          :secondItem='secondItem'
        ></second-situation>
      </div>
    </div>
    <div class='plate-right__con'>
      <div class='plate_add'>
        <span @click='_handlerAddPlates(allItem.sort)' >
          <el-tooltip effect="dark" content="添加板块" placement="top">
            <i class='icon-ic_cancel_dialing_no iconfont'></i>
          </el-tooltip>
        </span>
      </div>
    </div>

  </div>
  </div>
</template>
<script>
import { findAllKeyWord } from '../config'
import FirstSituation from './levelSituation/first'
import SecondSituation from './levelSituation/second'
import actions from '../action/rightContentAction/index'
import { mapMutations } from 'vuex'
export default {
  name: 'normal-plates',
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
  components: {
    FirstSituation,
    SecondSituation
  },
  props: {
    normalPlates: {
      required: true
    },
    isSystem: {
      required: true
    }
  },
  methods: {
    ...mapMutations({
      _addSituation: 'verbalTemplate/add-first-situation',
      _renamePlate: 'verbalTemplate/rename-plate',
      _createPlate: 'verbalTemplate/add-plate',
      _editorPlateKeyWord: 'verbalTemplate/editor-plate-keyWord',
      _deletePlate: 'verbalTemplate/delete-plate',
      _editorFirstAddBtnShow: 'verbalTemplate/editor-plate-addBtn-show'
    }),
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    // 重命名版块 修改版块名称的时候，可以修改版块的顺序
    _hannderRenamePlate (name, sort) {
      let comparedPlateNameArr = this._getComparedPlateNameArr(this.plates, 0, sort - 1)
      let $t = this.$t

      let length = this.plates.length - 3
      let options = []
      for (let i = 0; i < length; i++) {
        options.push(i + 1)
      }

      this._execAction('renamePlate', {
        reload: (newName, newSort) => {
          let oldIndex = sort - 1
          let newIndex = newSort - 1
          this._renamePlate({
            oldIndex,
            newName,
            newIndex
          })
        },
        sort,
        name,
        comparedPlateNameArr,
        options,
        $t
      })
    },
    // 展示4个添加语境按钮
    _showFourSituation (sort, allItem) {
      let mainIndex = sort - 1
      let show = !allItem.showAddBtn
      this._editorFirstAddBtnShow({
        mainIndex,
        show
      })
    },
     // 增加一级语境
    _handlerAddFirstSituations (situationType, sort, allItem) {
      let mainIndex = sort - 1
      let show = !allItem.showAddBtn
      // 处理需要增加的语境的初始值
      // 默认增加的是肯定语境
      let content = {
        'dialogues': [],
        keyWord: '',
        keyWordArray: [],
        sonContext: [],
        type: 2,
        nextType: 0,
        showAddBtn: false
      }
      content.type = situationType
      if (situationType === 8) {
        content.nextType = 8
      }
      this._addSituation({
        mainIndex,
        content
      })
      this._editorFirstAddBtnShow({
        mainIndex,
        show
      })
    },
    _getComparedPlateNameArr (plates, type, i) {
      let arr = []
      if (type === 1) {
        // 增加版块
        plates.map(item => {
          arr.push(item.name)
        })
      } else if (type === 0) {
        // 重命名
        plates.map((item, index) => {
          if (index !== i) {
            arr.push(item.name)
          }
        })
      }
      return arr
    },
    // 增加版块
    _handlerAddPlates (sort) {
      let initialSort = sort + 1
      let length = this.plates.length - 3 + 1
      let options = []
      for (let i = 0; i < length; i++) {
        options.push(i + 1)
      }
      let $t = this.$t
      let comparedPlateNameArr = this._getComparedPlateNameArr(this.plates, 1)
      this._execAction('createPlate', {
        reload: (name, mainIndex) => {
          this._createPlate({
            mainIndex,
            name
          })
        },
        options,
        initialSort,
        comparedPlateNameArr,
        $t
      })
    },
     // 编辑关键字
    _handlerEditorkeyWord (sort, keyWordArray) {
      let mainIndex = sort - 1
      let arr = keyWordArray.map(item => {
        return item
      })
      let comparedKeyWords = findAllKeyWord(this.normalPlates, mainIndex)
      let errorMessage = '其他流程版块中有相同关键词'

      this._execAction('tempalteEditorKeyWord', {
        reload: (newKeyWordArray) => {
          this._editorPlateKeyWord({
            mainIndex,
            keyWordArray: newKeyWordArray
          })
        },
        keyWordArray: arr,
        comparedKeyWords,
        errorMessage
      })
    },
    // 删除版块
    _handlerDeletePlate (sort, allItem) {
      this._execAction('deleteConfirm', {
        reload: () => {
          this._handlerDeleteSituationReload(sort, allItem)
        },
        content: '您确定要删除当前版块吗？',
        title: '删除版块'
      })
    },
    _handlerDeleteSituationReload (sort, allItem) {
      let mainIndex = sort - 1
      let plateId = allItem.id
      if (plateId) {
        this.$delete(`/plate/del/${plateId}`, {
          plateId
        })
          .then((res) => {
            this._deletePlate({
              mainIndex
            })
            this.$message.success('删除成功')
          })
          .catch((err) => {
            this.$message.error(err.data.error.message)
          })
      } else {
        this._deletePlate({
          mainIndex
        })
        this.$message.success('删除成功')
      }
    }
  }
}
</script>
<style>
</style>

