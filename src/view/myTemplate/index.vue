<template>
<div class='app-content'>
  <!-- <msg-view></msg-view> -->
    <el-container>
      <el-main class='app-right'>
        <right-top></right-top>
        <div  class = 'right-bottom_contaienr tab__contaienr'>
          <el-tabs v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="主流程" name="first">
              <theme></theme>
            </el-tab-pane>
            <el-tab-pane label="全局设置" name="second">
              <global-context></global-context>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
</div>
</template>
<script>
import RightTop from './component/top/index'
import MsgView from '@/components/msg'
import Theme from './component/theme/index'
import GlobalContext from './component/globalContext/index'
// import IntentManeger from './component/intentManeger/index'
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'my-verbalTemplate',
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    ...mapActions({
      _getTreeList: 'verbalTemplate/getTreeList',
      _getTemplateStatus: 'verbalTemplate/getTemplateStatus',
      _getSubjectTemplate: 'verbalTemplate/getSubjectTemplate'
    }),
    ...mapMutations({
      _setType: 'verbalTemplate/set-type',
      _setTemplateId: 'verbalTemplate/set-templateId',
      _setInitialState: 'verbalTemplate/set-initial-state',
      _setAactiveTreeItem: 'verbalTemplate/set-activeTreeItem',
      _clearDeletedID: 'verbalTemplate/celear-ID'
    }),
    handleClick () {
    }
  },
  components: {
    RightTop,
    MsgView,
    Theme,
    GlobalContext
    // IntentManeger
  },
  mounted () {
    let route = this.$route
    let path = route.path
    // 初始化vuex 数据
    this._setInitialState()
    if (path.indexOf('global') > -1) {
      this._setType({
        type: 0
      })
    } else {
      this._setType({
        type: 1
      })
    }
    let templateId = route.params.id
    // 初始情况
    this._setTemplateId({
      templateId
    })
    this._getTreeList()
    .then(res => {
      this._setAactiveTreeItem({
        activeTreeItem: res[0]
      })
      this._clearDeletedID()
      this._getSubjectTemplate()
    }) //  获取左边的树
    this._getTemplateStatus()
  }
}
</script>
<style scoped lang='less' rel='stylesheet/less'>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.app-content{
  .app-right{
    box-sizing: border-box;
    overflow-y: hidden;
    position: relative;
  }
  .right-bottom_contaienr{
    height: ~"calc(100vh - 160px)";
    min-height: ~"calc(100vh - 160px)";
    box-sizing: border-box;
    overflow-y: hidden;
    position: relative;
    background-color: #fff;
    &::-webkit-scrollbar {
      display:none;
    }
  }
}
</style>





