<template>
  <div class ='table_container'>
     <div class='marginB20  clearfix'>
      <div class='floatR'>
        <el-button
        type='primary'
        size='medium'
        icon="icon-ic_add_dialing_normal iconfont"
        @click='_handlerSaveAuthority'> 保存</el-button>
      </div>
    </div>
    <div class ='table_content'>
       <authority-view ref="authority"></authority-view>
    </div>
  </div>
</template>
<script>
import AuthorityView from '@/components/authority'
export default {
  data () {
    return {

    }
  },
  methods: {
    // 保存配置
    _handlerSaveAuthority (formName) {
      this.$refs.authority._getTreesStatus()
      let verbalManageAuthority = this.$refs.authority.verbalManageAuthority
      // this._setParams(verbalManageAuthority)
      // verbalManageAuthority.AuthorityList[0].permsList = verbalManageAuthority.checkedList
      // verbalManageAuthority.AuthorityList[0].halfList = verbalManageAuthority.halfCheckedList
      let verbalTemplateAuthority = this.$refs.authority.verbalTemplateAuthority
      // verbalTemplateAuthority.AuthorityList[0].permsList = verbalTemplateAuthority.checkedList
      // verbalTemplateAuthority.AuthorityList[0].halfList = verbalTemplateAuthority.halfCheckedList
      // this._setParams(verbalTemplateAuthority)
      let sysAuthority = this.$refs.authority.sysAuthority
      let params = [this._setParams(verbalManageAuthority), this._setParams(verbalTemplateAuthority),
        {
          permsList: sysAuthority.checkedList
        }
      ]
      this.$post('/resource/update', params)
        .then((res) => {
          this.$message.message('保存成功!')
        })
        .catch(err => {
          this.$message.error(err.data.error.message)
        })
    },
    _setParams (authority) {
      return {
        clocked: authority.isEnable,
        permsList: [...authority.checkedList],
        halfCheckedList: [ ...authority.halfCheckedList ]
      }
    }
  },
  components: { AuthorityView },
  mounted () {
  }
}
</script>
<style lang='less' scoped>
  .table_container{
    padding:20px;
    .table_content{
      padding:20px;
      height: ~"calc(100vh - 168px)";
      min-height: ~"calc(100vh - 168px)";
      box-sizing: border-box;
      background-color: #fff;
     }
  }
</style>



