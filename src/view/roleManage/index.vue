<template>
  <div class='table_container'>
    <div class='marginB20  clearfix'>
      <div class='floatR'>
        <el-button
        type='primary'
        size='medium'
        icon="icon-ic_add_dialing_normal iconfont"
        @click='_handlerCreateRole'> 新建角色</el-button>
      </div>
    </div>
    <div class='table_content'>
      <div class='search_container'>
        <div class='paddingT20 paddingB20 paddingR20 paddingL20' >
          <el-input
            :placeholder="searchValue.label"
            v-model.trim="search"
            prefix-icon=""
            class="input-with-select"
            @keyup.enter.native="_handlerInputSearch"
          >
          <el-button
            slot='append'
            @click='_handlerInputSearch'
            type="primary"
          >搜索</el-button>
          </el-input>
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
          style="width: 100%">
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
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <span @click='_handlerEditorRole(scope.row)'>
                <i class='icon-ic_edit_normal iconfont'></i>
              </span>
              <span @click='_handlerDeleteRole(scope.row.id,scope.row.role)'>
                <i class='icon-ic_delete_normal iconfont'></i>
              </span>
            </template>
          </el-table-column>

        </el-table>
        <my-pagination
          :tableTotal="tableData.dataLength"
          @currentPage="changePage"
          @everyPageNum="changePageSize"
          style="margin: 10px 0;float: right"
          needTotal=true
          needJumper=true
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
  data () {
    return {
      search: '',
      searchValue: {
        search: '',
        label: '角色名称/创建用户'
      },
      // 跟表格有关的字段
      tableData: {
        loading: false,
        dataLength: 1, // 所有的数据总和
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
        {label: '角色名称', value: 'role', custom: false},
        // {label: '创建用户', value: 'createName', custom: false},
        {label: '创建时间', value: 'createTime', custom: false, needFiters: true},
        { label: '备注', value: 'remarks', custom: false }
      ]
    }
  },
  filters: {
    formatDate (time) {
      if (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy/MM/dd hh:mm')
      } else {
        return ''
      }
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
      let pageNum = this.tableData.page
      let pageSize = this.tableData.size
      let searchName = this.searchValue.search || null
      let params = {
        pageNum,
        pageSize,
        searchName
      }
      this.tableData.loading = true
      this.$post('/role/list', params)
        .then((res) => {
          setTimeout(() => { this.tableData.loading = false }, 300)
          this.tableData.list = res.data.list
          this.tableData.dataLength = res.data.total
        })
        .catch(err => {
          setTimeout(() => { this.tableData.loading = false }, 300)
          this.$message.error(err.data.error.message)
        })
    },
    _handlerInputSearch (v) {
      this.searchValue.search = this.search
      this.tableData.page = 1
      this._getTableData()
    },
    // 新建用户
    _handlerCreateRole () {
      let $t = this.$t
      this._execAction('createRole', {
        reload: () => {
          this._getTableData()
        },
        title: '新建角色',
        model: 'createRole',
        $t
      })
    },
    // 编辑用户
    _handlerEditorRole (row) {
      console.log(row)
      let $t = this.$t
      this._execAction('createRole', {
        reload: () => {
          this._getTableData()
        },
        title: '编辑角色',
        model: 'editorRole',
        row,
        $t
      })
    },
    // 删除用户
    _handlerDeleteRole (id, name) {
      this._execAction('gaveWaring', {
        title: '提示',
        reload: () => {
          this.$delete(`/delete/${id}`)
            .then((res) => {
              this._getTableData()
            })
            .catch(err => {
              this.$message.error(err.data.error.message)
            })
        },
        roleId: id,
        content: `确定删除用户<span class='fontBule'>${name}</span>`
      })
    }
  },
  mounted () {
    this._getTableData()
  },
  components: { MyPagination }
}
</script>

<style lang="less" scoped>
  .table_container {
    padding:20px;
    .table_content {
      height: ~"calc(100vh - 168px)";
      min-height: ~"calc(100vh - 168px)";
      box-sizing: border-box;
      background-color: #fff;
      overflow: hidden;
      // padding:20px;
      .search_container{
        text-align: left;
        .input-with-select{
          // display: inline-block;
          width: 400px;
        }
        .status_label{
          display: inline-block;
        }
        .el-checkbox-group{
          display: inline-block;
        }
      }
    }
    .icon-ic_delete_normal{
      margin-left: 20px;
    }
  }
</style>

