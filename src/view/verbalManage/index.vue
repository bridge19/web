
<template>
  <div class='app-content cont'>
    <el-container>
      <el-main class='verbalManageMain'>
        <div class="searchbar">
          <div class="width400 searchform marginB20">
            <el-input placeholder="话术名称/企业名称" v-model="keywords" v-model.trim="keywords">
              <template slot="append"><el-button class="leftNoRadius searchPrimary" v-on:click="fetch(1)" type="primary">搜索</el-button></template>
            </el-input>
          </div>
          <el-button type='primary' class="floatR" @click="execAction('editVerbal', {title: '新建模板',reload:backFromModal})"><i class="iconfont icon-ic_add_dialing_normal marginR5"></i>新建话术</el-button>
        </div>
        <div class="srarchFormLine"></div>
        <div class="searchform marginB20 marginT20 textL">
          <label class="marginR30">
            模版状态：
          </label>
          <a class="marginR30 cursorP" v-on:click="toggleSearchStatus()" v-bind:class="{statusActive:statu===null}">全部</a>
          <a class="marginR30 cursorP" v-on:click="toggleSearchStatus(0)" v-bind:class="{statusActive:statu===0}">待录入</a>
          <a class="marginR30 cursorP" v-on:click="toggleSearchStatus(5)" v-bind:class="{statusActive:statu===5}">待文字试用</a>
          <a class="marginR30 cursorP" v-on:click="toggleSearchStatus(11)" v-bind:class="{statusActive:statu===11}">待录音</a>
          <a class="marginR30 cursorP" v-on:click="toggleSearchStatus(15)" v-bind:class="{statusActive:statu===15}">待语音试用</a>
          <a class="marginR30 cursorP" v-on:click="toggleSearchStatus(21)" v-bind:class="{statusActive:statu===21}">待发布</a>
          <a class="marginR30 cursorP" v-on:click="toggleSearchStatus(30)" v-bind:class="{statusActive:statu===30}">使用中</a>
          <!-- <a class="marginR30 cursorP" v-on:click="toggleSearchStatus(90)" v-bind:class="{statusActive:statu===90}">已停用</a> -->
        </div>

          <verbal-manage-table class="box verbal_table" v-bind:member-list="memberList" :tableindex="tableindex"  v-bind:loading="loading" v-on:popClose="fetch(page)">

          </verbal-manage-table>
          <my-pagination
          class="floatR paddingT20 paddingB20 paddingR10"
          v-bind:table-total="totalCount"
          v-bind:page="page"
          needJumper="true"
          need-total="true"
          v-on:everyPageNum="fetchList"
          v-on:currentPage="fetch">
          </my-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import actions from './action/modalAction/index'
import verbalManageTable from './component/verbalManageTable'
import MyPagination from '@/components/MyPagination'
export default {
  name: 'my-verbalTemplate',
  data () {
    return {
      memberList: [],
      page: 1,
      keywords: '',
      totalCount: 0,
      pagesize: 10,
      statu: null,
      istest: false,
      loading: false
    }
  },
  mounted: function () {
    this.fetch(1)
  },
  methods: {
    execAction (name, item, callback) {
      if (actions[name]) {
        actions[name](
          item,
          callback)
      }
    },
    backFromModal (res) {
      this.$message({
        message: res.message,
        type: 'success'
      })
      this.fetch(this.page)
    },
    fetch: function (page) {
      let _this = this
      this.loading = true
      this.$post('/template/get/list', {
        pageNum: page,
        pageSize: this.pagesize,
        search: this.keywords,
        status: this.statu
      })
        .then(res => {
          setTimeout(() => { _this.loading = false }, 300)
          this.memberList = res.data
          this.totalCount = parseInt(res.total)
          this.page = page
        })
        .catch(err => {
          this.memberList = []
          this.totalCount = 0
          this.page = 1
          setTimeout(() => { _this.loading = false }, 300)
          this.$message({
            type: 'error',
            message: err.data.error.message
          })
        })
    },
    fetchList: function (size) {
      let _this = this
      this.loading = true
      if (size) {
        this.pagesize = size
      }
      this.$post('/template/get/list', {
        pageNum: 1,
        pageSize: this.pagesize,
        search: this.keywords,
        status: this.statu
      })
        .then(res => {
          setTimeout(() => { _this.loading = false }, 300)
          if (res.code === '200') {
            if (!res.data) {
              this.memberList = []
              this.totalCount = 0
              this.page = 1
              return
            }
            this.memberList = res.data
            this.totalCount = parseInt(res.total)
            this.page = 1
          } else {
            this.memberList = []
            this.totalCount = 0
            this.page = 1
            this.$message({
              type: 'err',
              message: res.message
            })
          }
        })
        .catch(err => {
          setTimeout(() => { _this.loading = false }, 300)
          this.$message({
            type: 'error',
            message: err.data.error.message
          })
        })
    },
    toggleSearchStatus (statu) {
      if (statu === 0) {
        this.statu = statu
      } else {
        this.statu = statu || null
      }

      this.fetchList()
    }
  },
  components: {verbalManageTable, MyPagination},
  computed: {
    tableindex: function () {
      return ((this.page - 1) * this.pagesize) + 1
    }
  }
}
</script>

<style lang="less" rel='stylesheet/less'>
.verbalManageMain{
  background-color: #fff;
  .el-input-group__append button.el-button.searchPrimary{
    border:1px solid #dcdfe6;
  }
  a{
    color: #7F8FA4;
  }
  .statusActive{
    font-size: 16px;
    color: #2096EF;
  }
}
.verbalManageMain>.searchform:first-child{
  padding:15px 20px!important;
  padding-bottom: 0!important;
}
.verbalManageMain>.box{
  padding:0 10px!important;
}
.verbalManageMain>.searchform{
  padding:0 20px!important;
}
.searchbar{
  padding: 20px;
  display: block;
  overflow: hidden;
  .searchform{
    float: left;
  }
}

.srarchFormLine{
  width: 100%;
  height: 0;
  border-top: 1px solid #E6EAEE;
}
.cont{
 height: ~"calc(100vh - 110px)";
 overflow: auto;
}
.paddingB20{
  padding-bottom: 20px;
}
.paddingR10{
  padding-right: 10px;
}
</style>


