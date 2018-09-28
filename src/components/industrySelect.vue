<template>
  <div>
    <div style="display:none;">
    {{value2}}</div>
  <el-select v-model="value1" @change="handlechange" :disabled="disable" filterable placeholder="可输入行业名称筛选选项，或直接选择">
    <el-option
      v-for="item in provs"
      :key="item.id"
      :label="item.sceneName"
      :value="item.id">
    </el-option>
  </el-select>
  </div>
</template>


<script>
export default {
  data () {
    return {
      value1: null,
      provs: [],
      props: {
        value: 'industryId',
        label: 'industryName',
        children: 'sonIndustry'
      }
    }
  },
  computed: {
    value2: function () {
      this.value1 = this.value
      return this.value
    }
  },
  mounted () {
    this.$fetch('/template/scene')
      .then(res => {
        this.provs = res.data
      })
  },
  methods: {
    handlechange (value) {
      let obj = {}
      obj = this.provs.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.id === value// 筛选出匹配数据
      })
      this.$emit('change', obj)
    }
  },
  props: {
    value: {
      type: Number
    },
    disable: {
      type: Boolean
    }
  }
}
</script>
