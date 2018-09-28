<template>
  <el-table
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.6)"
    :data="memberList"
    class="verbal_table"
    style="width: 100%;font-weight: 600">
    <el-table-column
      align="left"
      type="index"
      :index="tableindex"
      label="序号"
      width="80">
    </el-table-column>
    <el-table-column
      align="left"
      prop="templateName"
      label="话术名称"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <router-link style="color:#2096EF;" :to="{ name: 'userTemplate', params: {id: scope.row.templateId, name: scope.row.templateName},query:{sceneId:scope.row.industryId}}">{{scope.row.templateName}}</router-link>
        <!-- <span v-if="scope.row.status===30">{{scope.row.templateName}}</span> -->
      </template>
    </el-table-column>
    <el-table-column
      align="left"
      prop="status"
      label="话术状态">
      <template slot-scope="scope">
        <el-tag class="tag" :type="statuClass[scope.row.status]">{{templateStatusTable[scope.row.status]}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      align="left"
      prop="updatedTime"
      label="最新发布时间">
      <template slot-scope="scope">
        {{formatDate(scope.row.lastDeployedTime)}}
      </template>
    </el-table-column>
    <el-table-column
      align="left"
      prop="industryName"
      label="行业"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      align="left"
      prop="companyName"
      label="企业名"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      align="left"
      prop="contactPerson"
      label="联系姓名">
    </el-table-column>
    <el-table-column
      align="left"
      prop="phone"
      label="电话">
    </el-table-column>
    <el-table-column
      align="left"
      prop="email"
      label="邮箱"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      align="left"
      label="操作">
      <template slot-scope="scope">
        <span @click="_toggleItemStatu(scope.row,'delete')" v-if='scope.row.status!==30&&scope.row.isDeployed!==1'>
            <i class='icon-ic_delete_normal iconfont marginR10'></i>
        </span>
        <span @click='openchange(scope.row)'>
          <i class='icon-ic_edit_normal iconfont marginR10'></i>
        </span>
        <span @click='opencopy(scope.row)'>
          <i class='icon-icon_department_orga iconfont marginR10'></i>
        </span>
        <span v-if="scope.row.status===80 || scope.row.status===90">
          <el-switch
            class='table_switch'
            v-model="scope.row.status"
            active-color="#15A82D"
            inactive-color="#B7C0CD"
            disabled
            @click.native="_toggleItemStatu(scope.row)"
            :active-value="80"
            :inactive-value="90"
          >
          </el-switch>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import actions from '../action/modalAction/index'
import { templateStatusTable } from '@/common/js/enumeration'
import {formatDate} from '@/common/js/filters'

export default {
  name: 'my-verbalManageTable',
  data () {
    return {
      test: 1,
      statuClass: {
        0: 'warning',
        1: 'warning',
        5: 'better',
        10: 'better',
        11: 'warning',
        15: 'better',
        20: 'better',
        21: 'prime',
        30: 'success'
      }
    }
  },
  props: {
    memberList: {
      type: Array
    },
    tableindex: {
      type: Number
    },
    loading: {
      type: Boolean
    }
  },
  mounted: function () {
    /* this.execAction('editVerbal', {
      title: '编辑模板'
    }) */
  },
  computed: {
    templateStatusTable () {
      return templateStatusTable
    }
  },
  methods: {
    openchange (row) {
      this.execAction('editVerbal', {title: '编辑模板', data: row, reload: this.handleclose})
    },
    opencopy (row) {
      this.execAction('editVerbal', {title: '复制模板', data: row, reload: this.handleclose})
    },
    execAction (name, item, callback) {
      if (actions[name]) {
        actions[name](
          item,
          callback)
      }
    },
    formatDate (time) {
      if (time) {
        return formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
      } else {
        return ''
      }
    },
    handleclose () {
      this.$emit('popClose')
    },
    _deleteitem (item) {
      item.reload = res => {
        this.$emit('popClose', res)
      }
      item.toggle = '删除'
      this.execAction('toggleItemStatu', item)
    },
    _toggleItemStatu (item, isdelete) {
      let _this = this
      item.reload = function (res) {
        _this.$emit('popClose', res)
      }
      if (isdelete === 'delete') {
        item.toggle = '删除'
      } else if (item.status === '90') {
        item.toggle = '启用'
      } else if (item.status === 70) {
        item.toggle = '停用'
      }
      this.execAction('toggleItemStatu', item)
    }
  }
}
</script>

<style lang='less' rel='stylesheet/less'>
.tag{
  width: 90px;
  height: 26px;
  text-align: center;
  line-height: 24px;
}
</style>
