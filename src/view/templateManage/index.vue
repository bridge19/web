<template>
  <div class='table_container userManage'>
    <div class='table_content'>
      <div class='search_container'>
        <div class='borderB paddingT20 paddingB20 paddingR20 paddingL20' >
          <el-input
            clearable
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
          <el-button
            class='floatR'
            type='primary'
            size='medium'
            icon="icon-ic_add_dialing_normal iconfont"
            @click='_handlerCreateT'>
            新建模版</el-button>
        </div>

        <div class='paddingT20 paddingB20 paddingR20 paddingL20' >
          <span class='status_label marginR30 fontSubTitle fontBold'>话术状态:</span>
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
          ref="userTable"
          header-align="left"
          align="center"
          :data="tableData.list"
          stripe
          tooltip-effect="dark"
          class="templateManageTable"
          style="width: 100%">
          <el-table-column
            align="left"
            prop="name"
            label="模版名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- 试用中 -->
              <span v-if='scope.row.s===20'>{{ scope.row.sampleName }}</span>
              <!-- 未使用中 -->
              <span v-else>
                <router-link :to="{name:'globalTemplate',params:{ id:scope.row.sampleId,name:scope.row.sampleName,type:'0' },query:{
                  sceneId:scope.row.industryId
                }}">{{ scope.row.sampleName }}</router-link>
              </span>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="s"
            label="模板状态"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag class="tag"
              :type="statuClass[scope.row.status]">
                {{ scope.row.s | formatStatus }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="industry"
            label="行业"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span >{{ scope.row.industryName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="200"
            align='center'
          >
            <template slot-scope="scope" class="operation">
              <span @click='_handlerEditorT(scope.row)' v-if='scope.row.s!==20'>
                <i class='icon-ic_edit_normal iconfont'></i>
              </span>
              <span @click='_handlerCopyT(scope.row)'>
                <i class='icon-icon_department_orga iconfont'></i>
              </span>
              <span v-if='scope.row.s!==10 && scope.row.s!==0'>
                <el-switch
                  class='table_switch'
                  v-model="scope.row.is_on"
                  active-color="#15A82D"
                  inactive-color="#B7C0CD"
                  disabled
                  @click.native="_handlerStartT(scope.row)"
                >
                </el-switch>
              </span>
              <span
                v-if='scope.row.s!==20'
                @click='_handlerDeleteT(scope.row)'>
                <i class='icon-ic_delete_normal iconfont'></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <my-pagination
          :tableTotal="tableData.dataLength"
          @currentPage="changePage"
          @everyPageNum="changePageSize"
          style="margin: 20px 0; float:right"
          needTotal=true
          needJumper=true
          :page='tableData.page'
        ></my-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import MyPagination from '@/components/MyPagination'
import actions from './actions/index'
import { sampleStatus } from '@/common/js/enumeration'
export default {
  name: 'userManage',
  components: { MyPagination },
  data () {
    return {
      statuClass: {
        0: 'warning',
        10: '',
        20: 'success',
        90: 'danger'
      },
      search: '',
      searchValue: {
        search: '',
        label: '话术名称/企业名称',
        status: 'null'
      },
      statusOptions: [{
        label: '全部',
        value: 'null'
      }, {
        label: '待发布',
        value: 10
      }, {
        label: '使用中',
        value: 20
      }, {
        label: '已停用',
        value: 90
      }],
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
      }
      // tableHeaders: [
      //   {label: '模版名称', value: 'name', custom: false},
      //   {label: '模版状态', value: 'status', custom: false, needFormat: true},
      //   {label: '行业', value: 'industry', custom: false}
      // ]
    }
  },
  filters: {
    formatStatus (status) {
      let flag = sampleStatus[status]
      return flag
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
      let search = this.searchValue.search
      this.tableData.loading = true
      this.$post('/sample/get/list', {
        pageNum: page,
        pageSize: size,
        status,
        search
      })
       .then(res => {
         setTimeout(() => { this.tableData.loading = false }, 300)
         let list = res.data
         list = list.map(item => {
           let status = item.status
           item.s = status
           if (status === 10) {
             item.is_on = null
           } else if (status === 20) {
             item.is_on = true
           } else if (status === 90) {
             item.is_on = false
           } else if (status === 0) {
             item.is_on = null
           }
           return item
         })
         this.tableData.list = list
         this.tableData.dataLength = parseInt(res.total)
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
    // 新建模版
    _handlerCreateT () {
      let $t = this.$t
      this._execAction('createT', {
        type: 'new',
        title: '新建模版',
        reload: () => {
          this._getTableData()
        },
        $t
      })
    },
    // 编辑模版
    _handlerEditorT (row) {
      let $t = this.$t
      this._execAction('createT', {
        type: 'update',
        title: '编辑模版',
        row,
        reload: () => {
          this._getTableData()
        },
        $t
      })
    },
    // 复制模版
    _handlerCopyT (row) {
      let $t = this.$t
      this._execAction('createT', {
        type: 'copy',
        title: '复制模版',
        row,
        reload: () => {
          this._getTableData()
        },
        $t
      })
    },
    // 删除模版
    _handlerDeleteT (row) {
      this._execAction('gaveWaring', {
        title: '提示',
        reload: () => {
          this.$post(`/sample/delete`, {
            sampleId: row.sampleId
          })
            .then((res) => {
              this.$message.success(res.message)
              setTimeout(() => {
                this._getTableData()
              }, 300)
            })
            .catch(err => {
              this.$message.error(err.data.error.message)
            })
        },
        content: `确定删除模版<span class='fontBule'>${row.sampleName}</span>`
      })
    },
    // 启用/禁用
    _handlerStartT (row) {
      // console.log(status)
      let s = row.s
      let url = ''
      let content = ''
      if (s === 20) {
        // 使用中需要停用
        url = '/sample/dead'
        content = `您将停用<span class='fontBule'>${row.sampleName}</span>模版？`
      } else {
        url = '/sample/active'
        content = `您将启用<span class='fontBule'>${row.sampleName}</span>模版？`
      }
      this._execAction('gaveWaring', {
        title: '提示',
        reload: () => {
          this.$post(url, {
            sampleId: row.sampleId
          })
            .then((res) => {
              this.$message.success(res.message)
              setTimeout(() => {
                this._getTableData()
              }, 300)
            })
            .catch(err => {
              this.$message.error(err.data.error.message)
            })
        },
        content: content
      })
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
    .table_content {
      background-color: #fff;
      padding-bottom: 12px;
      //height: 100%;
      height: ~"calc(100vh - 120px)";
      min-height: ~"calc(100vh - 120px)";
      overflow-y: scroll;
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
      .iconfont{
        margin-right: 10px;
      }
    }
    .templateManageTable{
      border-right: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
    }
  }
</style>

