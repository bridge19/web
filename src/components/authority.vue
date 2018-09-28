<template>
  <div class='tab_container'>
      <el-tabs tab-position="left" style="height: 200px;">
        <el-tab-pane label="客户话术管理">
          <span slot="label" style="text-align: left">
            客户话术管理
            <el-switch
              class="mySwitch"
              v-model="verbalManageAuthority.isEnable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="_switchVerbalManage">
            </el-switch>
          </span>
          <el-tree
            ref="verbalManageTree"
            :props="defaultProps"
            class="marginL60"
            :data="verbalManageAuthority.AuthorityList"
            show-checkbox
            node-key="perms"
            :default-expand-all="true"
            @check= '_getVerbalManageNode'
            >
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="话术模板管理">
          <span slot="label">
            话术模板管理
            <el-switch
              class="mySwitch"
              v-model="verbalTemplateAuthority.isEnable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="_switchVerbalTemplate">
            </el-switch>
          </span>
          <el-tree
            ref="verbalTemplateTree"
            :props="defaultProps"
            class="marginL60"
            :data="verbalTemplateAuthority.AuthorityList"
            show-checkbox
            node-key="perms"
            :default-expand-all="true"
            @check="_getVerbalTemplateNode"
            >
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="系统管理" >
          <span slot="label" style="margin-right: 92px">系统管理</span>
          <el-checkbox-group v-model="sysAuthority.checkedList" class="mycheckGroup marginL60">
            <el-checkbox v-for="(item, index) in sysAuthority.sysAuthorityList" class="mycheckBox" :key="index" :label="item.perms">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'authority-view',
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      verbalManageAuthority: {
        key: 'customerVoiceManage',
        isEnable: true,
        AuthorityList: [],
        checkedList: [],
        halfCheckedList: []
      },
      verbalTemplateAuthority: {
        key: 'voiceTemplateManage',
        isEnable: true,
        AuthorityList: [],
        checkedList: [],
        halfCheckedList: []
      },
      sysAuthority: {
        sysTree: {},
        sysAuthorityList: [],
        checkedList: []
      }
    }
  },
  props: {
    // verbalManageInfo: {
    //   type: Object
    // },
    // verbalTemplateInfo: {
    //   type: Object
    // }
  },
  methods: {
    _getVerbalManageNode (node, treeStatus) {
      this.verbalManageAuthority.checkedList = treeStatus.checkedKeys
      this.verbalManageAuthority.halfCheckedList = treeStatus.halfCheckedKeys
      // console.log('客户话术管理', this.verbalManageAuthority)
    },
    _getVerbalTemplateNode (node, treeStatus) {
      this.verbalTemplateAuthority.checkedList = treeStatus.checkedKeys
      this.verbalTemplateAuthority.halfCheckedList = treeStatus.halfCheckedKeys
       // console.log('话术模板管理', this.verbalTemplateAuthority)
    },
    _switchVerbalManage (status) {
      this._disabledCtrl(this.verbalManageAuthority, status)
      // if (!status) {
      //   this._romoveRootAuthority(this.verbalManageAuthority)
      // }
      // console.log('客户话术管理', this.verbalManageAuthority)
    },
    _switchVerbalTemplate (status) {
      this._disabledCtrl(this.verbalTemplateAuthority, status)
      // if (!status) {
      //   this._romoveRootAuthority(this.verbalTemplateAuthority)
      // }
      // console.log('话术模板管理', this.verbalTemplateAuthority)
    },
    _disabledCtrl (authority, status) {
      authority.AuthorityList[0].disabled = !status
      authority.AuthorityList[0].children.forEach(item => {
        item.disabled = !status
        if (item.children) {
          item.children.forEach(child => {
            child.disabled = !status
          })
        }
      })
      if (!status) {
        this._romoveRootAuthority(authority)
      }
    },
    _romoveRootAuthority (authority) {
      // console.log(this.verbalManageAuthority)
      // let key = authority.key
      // let checkIndex = authority.checkedList.indexOf(key)
      // let halfCheckIndex = authority.halfCheckedList.indexOf(key)
      // // 将根权限移除
      // if (checkIndex !== -1) {
      //   authority.checkedList.splice(checkIndex, 1)
      // } else if (halfCheckIndex !== -1) {
      //   authority.halfCheckedList.splice(halfCheckIndex, 1)
      // }
      authority.checkedList = []
      authority.halfCheckedList = []
    },
    _getTreesStatus () {
      // console.log('半选', this.$refs.verbalManageTree.getHalfCheckedKeys())
      // console.log('fsdfsd', this.$refs.verbalManageTree.getCheckedKeys())
    }
  },
  mounted () {
    this.$fetch('/resources/list')
      .then((res) => {
        // console.log(res)
        res.data.forEach((item) => {
          if (item.id === 1) {
            this.verbalManageAuthority.AuthorityList.push(item)
            this.verbalManageAuthority.checkedList = item.permsList
            this.verbalManageAuthority.halfCheckedList = item.halfList
            this.verbalManageAuthority.isEnable = !item.disabled
            if (!this.verbalManageAuthority.isEnable) {
              this._disabledCtrl(this.verbalManageAuthority, this.verbalManageAuthority.isEnable)
              this._romoveRootAuthority(this.verbalManageAuthority)
            }
          } else if (item.id === 2) {
            this.verbalTemplateAuthority.AuthorityList.push(item)
            this.verbalTemplateAuthority.checkedList = item.permsList
            this.verbalTemplateAuthority.halfCheckedList = item.halfList
            this.verbalTemplateAuthority.isEnable = !item.disabled
            if (!this.verbalTemplateAuthority.isEnable) {
              this._disabledCtrl(this.verbalTemplateAuthority, this.verbalTemplateAuthority.isEnable)
              this._romoveRootAuthority(this.verbalTemplateAuthority)
            }
          } else if (item.id === 3) {
            this.sysAuthority.sysTree = item
            item.children.forEach((item) => {
              this.sysAuthority.sysAuthorityList.push({
                perms: item.perms,
                name: item.name
              })
            })
            this.sysAuthority.checkedList = item.permsList
          }
        })
        // this.AuthorityCheckedList = res.data.permsList
      })
      .catch(err => {
        this.$message.error(err.data.error.message)
      })
  },
  updated () {
    this.$refs.verbalManageTree.setCheckedKeys(this.verbalManageAuthority.checkedList)
    this.$refs.verbalTemplateTree.setCheckedKeys(this.verbalTemplateAuthority.checkedList)
    // this.sysAuthority.checkedList = this.sysAuthority.checkedList
  }
}
</script>
<style lang='less' scoped>
  .tab_container{
    height: 100%;
    .mySwitch{
      width: 40px;
      height: 20px;
      margin-left: 20px;
    }
    .el-tabs {
      height: 100% !important;
    }
    .el-tree{
      background-color: #FAFBFC;
    }
    .mycheckGroup{
      .mycheckBox{
        display: block;
        text-align: left;
        margin-bottom: 10px;
        margin-left: 0px;
      }
    }
  }

</style>



