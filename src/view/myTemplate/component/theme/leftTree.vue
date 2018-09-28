<template>
  <div class='left-tree__container'>
    <span v-show='false'>{{templateId}}{{treeList}}{{activeTreeItem}}</span>
    <ul >
      <li
        v-for='(item,index) in treeList'
        :key='index'
        class='marginB20'
        :class='{
          "li-height0":item.intentId,
          "li-height1":!item.intentId,
          "el-active":item.subjectId === activeTreeItem.subjectId
        }' 
      >
       <el-tag 
        class ='index-tip'
        v-if='item.intentId'
        :type='computedTagType(item)'
      >{{ item.sort }}</el-tag>
        <el-button 
         class='tree-button text-hidden'
         :class='{
          "el-bt0":item.intentId,
          "el-bt1":!item.intentId,
          "el-active":item.subjectId === activeTreeItem.subjectId
        }'
        @click='_selectActiveTreeItem(item)' 
        >
          <div class='text-hidden' >{{item.subjectName}}</div>
          <div v-if = 'item.intentId' class='marginT10 text-hidden'>{{item.intentName}}</div>
        </el-button>
      </li>
    </ul>
    <div class='leftAction'>
      <button
        @click='_handlerCreateTheme'
        class='activeActive'
        ><i class = 'icon-ic_add_dialing_normal iconfont'></i></button>
      <button
         @click='_handlerEditorTheme'
         :disabled='!activeTreeItem.intentId'
         :class='{
          activeActive:activeTreeItem.intentId
        }'
      ><i class = 'icon-ic_edit_normal iconfont'></i></button>
      <button
        @click='_handlerdeleteTheme'
        :disabled='!activeTreeItem.intentId'
        :class='{
          activeActive:activeTreeItem.intentId
        }'
      ><i class = 'icon-ic_delete_normal iconfont'></i></button>
    </div>
  </div>
</template>
<script>
import actions from './action/index'
import { mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
    }
  },
  props: {
    isSystem: {
      required: true
    }
  },
  methods: {
    ...mapActions({
      _getTreeList: 'verbalTemplate/getTreeList',
      _getSubjectTemplate: 'verbalTemplate/getSubjectTemplate',
      _getTemplateStatus: 'verbalTemplate/getTemplateStatus'
    }),
    ...mapMutations({
      _setActiveTreeItem: 'verbalTemplate/set-activeTreeItem',
      _setInitialState: 'verbalTemplate/set-initial-state',
      _clearDeletedID: 'verbalTemplate/celear-ID'
    }),
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    // 计算渲染的tagType
    computedTagType (item) {
      let activeTreeItem = this.activeTreeItem
      if (activeTreeItem.subjectId === item.subjectId) {
        return ''
      } else {
        return 'info'
      }
    },
    // 选中左边操作树
    _selectActiveTreeItem (item) {
      this._setActiveTreeItem({
        activeTreeItem: item
      })
      // 清空删除ID的保存
      this._clearDeletedID()
      this._getSubjectTemplate({
        subjectId: item.subjectId
      })
    },
    //
    formatSortOption (length) {
      let arr = []
      for (let i = 0; i < length; i++) {
        let v = i + 2
        arr.push(v)
      }
      return arr
    },
    // 新建意图
    _handlerCreateTheme () {
      let sceneId = this.$route.query.sceneId
      let length = this.treeList.length
      let initialSort = length
      let sortOptions = this.formatSortOption(length - 1)
      let isSystem = this.isSystem
      let templateId = this.templateId
      this._execAction('createTheme', {
        title: '新建主题',
        sceneId,
        type: 'new',
        initialSort,
        sortOptions,
        sampleId: templateId,
        isSystem,
        reload: () => {
          this._getTreeList()
        }
      })
    },
     // 编辑意图
    _handlerEditorTheme () {
      let sceneId = this.$route.query.sceneId
      let activeTreeItem = this.activeTreeItem
      let templateId = this.templateId
      let length = this.treeList.length
      let initialSort = this.activeTreeItem.sort
      let sortOptions = this.formatSortOption(length - 2)
      let isSystem = this.isSystem
      this._execAction('createTheme', {
        title: '编辑主题',
        type: 'update',
        sceneId,
        initialSort,
        sortOptions,
        initialData: activeTreeItem,
        sampleId: templateId,
        isSystem,
        reload: () => {
          this._getTreeList()
        }
      })
    },
    // 删除意图
    _handlerdeleteTheme () {
      let subjectId = this.activeTreeItem.subjectId
      let isSystem = this.isSystem
      let url = ''
      if (isSystem) {
        url = '/sample/subject/delete'
      } else {
        url = '/template/subject/delete'
      }
      this._execAction('deleteConfirm', {
        content: '你确当要删除当前主题吗?',
        reload: () => {
          // 删除接口
          // 右边不显示
          this.$post(url, {
            subjectId
          })
            .then(res => {
              this.$message.success(res.message)
              // 重新获取下状态
              // 更新左边的树
              this._getTreeList()
              this._getTemplateStatus()
              // 初始化左边的树
              // 初始化 删除数组
              this._clearDeletedID()
              this._setActiveTreeItem({
                activeTreeItem: {}
              })
            })
            .catch(err => {
              this.$message.error(err.data.error.message)
            })
        }
      })
    }
  },
  computed: {
    vState () {
      return this.$store.state.verbalTemplate
    },
    templateId () {
      let templateId = this.vState.templateId
      return templateId
    },
    treeList () {
      return this.vState.treeList
    },
    activeTreeItem () {
      return this.vState.activeTreeItem
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../../../common/stylus/variable.less'; 
.left-tree__container {
  border-right:1px solid @border;
  height:~"calc(100vh - 235px)";
  min-height: ~"calc(100vh - 235px)";
  position: relative;
  ul{
    height:~"calc(100vh - 295px)";
    max-height:~"calc(100vh - 295px)";
    overflow-y: scroll;
    .li-height0{
      min-height: 56px;
    }
    .li-height1{
      min-height: 36px;
    }

    .el-bt0{
      min-height: 56px;
      width: 160px;
    }
    .el-btn1{
      min-height: 56px;
      width:80px;
    }
    li{
      position: relative;
      text-align: left;
      
      .index-tip{
        position: absolute !important;
        right:190px;
        display:inline-block;
        padding:0px 6px; 
        line-height:20px;
        height: 20px;
        position:relative;
        top:10px;
        box-sizing: border-box;
      }
      .el-active{
         background-color:#fff;
          color: @blue;
          border-color:@blue;
      }
      .el-button {
        position: absolute !important;
        left:60px;
        padding:10px 10px ;
        box-sizing: border-box;
        text-align: left;
        &:hover{
          background-color:#fff;
          color: @blue;
          border-color:@blue;
        }
      }
    }
  }
  .leftAction{
    position: absolute;
    bottom:20px;
    display: flex;
    justify-content: space-around;
    width:100%;
    button{
      background-color: transparent;
      display: block;
      cursor:not-allowed;
      color:@icon;
      border:none;
    }
    .activeActive{
      color:@blue !important;
      cursor: pointer;
    } 
  }
}

</style>


