<template>
  <div class='table_container userManage'>
    <div class='table_content'>
      <div class='search_container'>
        <div class='borderB paddingT20 paddingB20 paddingR20 paddingL20' >
          <el-input
            :placeholder="searchValue.label"
            v-model.trim="search"
            prefix-icon=""
            class="input-with-select"
            clearable
            @keyup.enter.native="_handlerInputSearch"
          >
          <el-button
            slot='append'
            @click='_handlerInputSearch'
            type="primary"
          >搜索</el-button>
          </el-input>
          <div class='floatR'>
            <el-button
              type='primary'
              size='medium'
              icon="icon-ic_add_dialing_normal iconfont"
              @click='_handlerCreateUser'> 新建用户</el-button>
          </div>
        </div>
        <div class='paddingT20 paddingB20 paddingR20 paddingL20' >
          <span class='status_label marginR30 fontSubTitle fontBold'>账号状态:</span>
          <span
            class='marginR30 fontSubTitleSub cursorP'
            v-for= '(item,index) in statusOptions'
            :key='index'
            @click='_toggleStatus(item.value)'
            :class="{statusActive:item.value===searchValue.status}"
          >
          {{item.label}}
          </span>
        </div>
      </div>
      <!-- 表格 -->
      <div class='verbal_table paddingR20 paddingL20'>
        <el-table
          v-loading="tableData.loading"
          element-loading-text="拼命加载中...请耐心等候"
          element-loading-spinner="el-icon-loading"
          ref="tuserTable"
          header-align="left"
          align="center"
          :data="tableData.list"
          stripe
          tooltip-effect="dark"
          class="myTable"
          style="width: 100%;">
          <el-table-column
            v-for="(item) in tableHeaders"
            :key="item.id"
            :label="item.label"
            :width="item.width"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if='item.needFiters'>{{ scope.row[item.value] |formatDate }}</span>
              <span v-else>{{ scope.row[item.value] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="200"
            align='center'
          >
            <template slot-scope="scope" class="operation">
              <span @click='_handlerEditorUser(scope.row)'>
                <i class='icon-ic_edit_normal iconfont'></i>
              </span>
              <span @click='_handlerDeleteUser(scope.row.id, scope.row.username)'>
                <i class='icon-ic_delete_normal iconfont'></i>
              </span>
              <span @click='_handlerResetPaswword(scope.row.id, scope.row.username)'>
                <i class='icon-ic_password iconfont'></i>
              </span>
              <el-switch
                v-model="scope.row.locked"
                active-color="#15A82D"
                inactive-color="#B7C0CD"
                @change='_handlerStartUser(scope.row.id, scope.row.locked, scope.row.username)'
              >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <my-pagination
          :tableTotal="tableData.dataLength"
          @currentPage="changePage"
          @everyPageNum="changePageSize"
          style="margin: 20px 0; float:right"
          :needTotal='true'
          :needJumper='true'
          :page='tableData.page'
        ></my-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from '@/common/js/filters'
import MyPagination from '@/components/MyPagination'
import actions from './actions/index'
export default {
  name: 'userManage',
  components: { MyPagination },
  data () {
    return {
      search: '',
      searchValue: {
        search: '',
        label: '账号/姓名/手机号/固话/邮箱',
        status: ''
      },
      statusOptions: [{
        label: '全部',
        value: ''
      }, {
        label: '使用中',
        value: 1
      }, {
        label: '已停用',
        value: 2
      }],
      // 跟表格有关的字段
      tableData: {
        loading: false,
        dataLength: 0, // 所有的数据总和
        multipleSelectionId: [], // 存放选中的ID
        multipleSelection: [], // 存放选中的数据
        tempCheck: [], // 用来存放当前页曾经选中的数据，属于累计数据
        list: [], // 存放表格数据
        page: 1, // 当前页
        size: 10, // 当前页展示数据条数
        up: '', // 升降序 1 降序  0 升序
        order: '' // 排序  0 分类  1 创建时间
      },
      tableHeaders: [
        // {label: '账号', value: 'userAccount', custom: false},
        {label: '姓名', value: 'username', custom: false},
        { label: '性别', value: 'sex', custom: false },
        {label: '手机号', value: 'mobile', custom: false, startMobile: true},
        {label: '固话', value: 'telPhone', custom: false, startTelphone: true},
        {label: '邮箱', value: 'email', custom: false},
        {label: '注册时间', value: 'createTime', custom: false, needFiters: true},
        {label: '最后登录时间', value: 'lastLoginTime', custom: false, needFiters: true}
      ],
      clockAndDeletStatus: {
        delet: 2,
        unclock: 1,
        clock: 3
      }
    }
  },
  filters: {
    formatDate (time) {
      if (time === null) {
        return ''
      } else {
        let date = new Date(time)
        return formatDate(date, 'yyyy/MM/dd hh:mm')
      }
    },
    startMobile (mobile) {
      let mobileNumber = mobile + ''
      let number = mobileNumber.substring(3, 8)
      return mobileNumber.replace(number, '*****')
    }
  },
  methods: {
    _execAction (name, contentConfig) {
      if (actions[name]) {
        actions[name](contentConfig)
      }
    },
    changePage (page) {
      this.tableData.page = page
      this._getTableData()
    },
    changePageSize (pageSize) {
      this.tableData.size = pageSize
      this.tableData.page = 1
      this._getTableData()
    },
    // 获取表格数据
    _getTableData () {
      let page = this.tableData.page
      let size = this.tableData.size
      let status = this.searchValue.status
      let condition = this.searchValue.search
      this.tableData.loading = true
      this.$fetch('/user/userlist', {
        pageNumber: page,
        pageSize: size,
        status,
        condition
      })
       .then(res => {
         setTimeout(() => { this.tableData.loading = false }, 300)
         this.tableData.list = res.data.map((item, index) => {
           return {
             id: item.userId,
             locked: item.status === 1,
             username: item.userName,
             userAccount: item.userAccount,
             sex: item.sex === 0 ? '男' : '女', // 0男 1女
             mobile: item.mobile,
             telPhone: item.telphone,
             email: item.email,
             createTime: item.createdTime,
             lastLoginTime: item.lastLoginTime
           }
         })
         this.tableData.dataLength = Number(res.total)
       })
       .catch(err => {
         setTimeout(() => { this.tableData.loading = false }, 300)
         this.$message.error(err.data.error.message)
       })
    },
    // status 改变
    _toggleStatus (v) {
      this.searchValue.status = v
      this.tableData.page = 1
      this._getTableData()
    },
    // search值改变
    _handlerInputSearch () {
      this.searchValue.search = this.search
      this.tableData.page = 1
      this._getTableData()
    },
    // 新建用户
    _handlerCreateUser () {
      let $t = this.$t
      this._execAction('createUser', {
        type: 'new',
        title: '新建用户',
        reload: () => {
          this._getTableData()
        },
        $t
      })
    },
    // 编辑用户
    _handlerEditorUser (row) {
      let $t = this.$t
      this._execAction('createUser', {
        type: 'update',
        title: '编辑用户',
        row,
        reload: () => {
          this._getTableData()
        },
        $t
      })
    },
    // 删除用户
    _handlerDeleteUser (id, name) {
      this._execAction('gaveWaring', {
        title: '提示',
        reload: () => {
          this.$post(`/user/removeuser`, {userId: id})
            .then((res) => {
              this.$message.success('用户删除成功')
              setTimeout(() => {
                this._getTableData()
              }, 300)
            })
            .catch(err => {
              this.$message.error(err.data.error.message)
            })
        },
        content: `<span style="text-align: center">确定删除<span class='fontBule'> ${name} </span>用户？<br/>
                    <span style="color: #7F8FA4; font-size: 12px;">将会删除其用户数据，且不可恢复<span/>
                  </span>`
      })
    },
    // 重置密码
    _handlerResetPaswword (id, name) {
      this._execAction('gaveWaring', {
        title: '恢复初始密码',
        reload: () => {
          this.$post(`/user/resetpassword`, {userId: id})
            .then((res) => {
              this.$message.success('密码重置成功')
            })
            .catch(err => {
              this.$message.error(err.data.error.message)
            })
        },
        content: `确认对<span class='fontBule'>${name}</span>用户恢复初始密码？`
      })
    },
    // 启用/禁用
    _handlerStartUser (id, status, name) {
      if (status) {
        this.$confirm(`<span class="warningBoxContent">
          <span class="icon-ic_upload_fail_norma iconfont waringIcon"></span>
            确认启用 <span class="heighLigthText">${name}</span> 用户？ <br/>
         <span class="TipsText">启用用户权限，用户账号可登陆</span>
        </span>`, '启用用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'warningBox',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.$post(`/user/enableaccount`, {userId: id})
            .then((res) => {
              this.$message.success('启用成功')
            })
            .catch(err => {
              this.$message.error(err.data.error.message)
              this.tableData.list.forEach((item) => {
                if (id === item.id) {
                  item.locked = !status
                }
              })
            })
        }).catch(() => {
          this.tableData.list.forEach((item) => {
            if (id === item.id) {
              item.locked = !status
            }
          })
        })
      } else {
        this.$confirm(`<span class= "warningBoxContent">
          <span class="icon-ic_upload_fail_norma iconfont waringIcon"></span>
            确认禁用 <span class="heighLigthText">${name}</span> 用户？ <br/>
         <span class="TipsText" >禁用用户权限，用户账号不可登陆</span>
        </span>`, '禁用用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'warningBox',
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.$post(`/user/disableaccount`, {userId: id})
            .then((res) => {
              this.$message.success('禁用成功')
            })
            .catch(err => {
              this.$message.error(err.data.error.message)
              this.tableData.list.forEach((item) => {
                if (id === item.id) {
                  item.locked = !status
                }
              })
            })
        }).catch(() => {
          this.tableData.list.forEach((item) => {
            if (id === item.id) {
              item.locked = !status
            }
          })
        })
      }
    }
  },
  mounted () {
    this._getTableData()
  }
}
</script>

<style lang="less" scoped>
  @import '../../common/stylus/variable';
  .table_container {
    box-sizing: border-box;
    padding:20px;
    height: 100%;
    overflow: auto;
    .table_content {
      background-color: #FAFBFC;
      padding-bottom: 12px;
      .search_container{
        .statusActive {
          font-size: 16px;
          color: #2096EF;
        }
        text-align: left;
        .input-with-select{
          width: 400px;
        }
        .status_label{
          display: inline-block;
        }
        .el-checkbox-group{
          display: inline-block;
        }

      }
      .verbal_table{
        overflow: hidden;
        .myTable{
          border-right: 1px solid #E6EAEE;
          border-bottom: 1px solid #E6EAEE;
        }
      }
      .iconfont{
        margin-right: 10px;
      }
    }
  }
</style>

