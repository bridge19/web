
<template>
  <div class='checkbox_container fontSubTitle'>
    <div class='checkbox_title'>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="_handleCheckAllChange">
        <span >{{list.industryName}}</span>
        </el-checkbox>
      </div>
    <el-checkbox-group
      v-model="checkedList"
      class='checkbox_group'
      @change="_handleCheckedTemplateChange"
    >
      <el-checkbox
        :key='v.id'
        v-for='v in listOptions'
        :label='v.id'>
        {{v.name}}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  name: 'checkbox',
  data () {
    return {
      checkAll: false,
      isIndeterminate: false,
      checkedList: []
    }
  },
  methods: {
    // 获取所有选项的id
    _getAllCheckedOptions () {
      return this.listOptions.map(v => {
        return v.id
      })
    },
    // 获取发送出去的选项
    _getEmitCheckedData () {
      let parentId = this.list.id
      let checkedList = this.checkedList
      return {
        [parentId]: checkedList
      }
    },
    _handleCheckAllChange (val) {
      let AllCheckedOptions = this._getAllCheckedOptions()
      this.checkedList = val ? AllCheckedOptions : []
      this.isIndeterminate = false
      // 把数据发送给父组件
      let emitCheckedData = this._getEmitCheckedData()
      this.$emit('emitChecked', emitCheckedData)
    },
    _handleCheckedTemplateChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.listOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listOptions.length
       // 把数据发送给父组件
      let emitCheckedData = this._getEmitCheckedData()
      this.$emit('emitChecked', emitCheckedData)
    }
  },
  computed: {
    listOptions () {
      return this.list.templateAlls
    }
  },
  props: {
    list: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang='less' rel='stylesheet/less'>
@import '../common/stylus/variable';
@import '../common/stylus/mixin';
.checkbox_container{
  float:left;
  margin-left:20px;
  margin-bottom: 20px;
  width:200px;
  height:360px;
  min-height: 360px;
  box-sizing: border-box;
  .el-checkbox__label{
    color:@SubTitle;
    display: inline-block;
    width:130px;
    height: auto;
    vertical-align: text-top;
    white-space: normal;
    word-break: break-all;
  }
  .checkbox_title{
    background-color: #E6EAEE;
    width: 100%;
    height: 42px;
    line-height: 42px;
    padding: 0px 20px;
    box-sizing: border-box;
    border-radius: 4px 4px 0 0;
    .el-checkbox__label{
      font-weight:700;
    }
  }
  .checkbox_group{
    background-color: #F3F5F7 ;
    padding: 10px 20px;
    min-height: 318px;
    height: 318px;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    border-radius: 0 0 4px 4px;
    .el-checkbox{
      line-height: 28px;
      margin-left:0px
    }
  }
}
</style>


