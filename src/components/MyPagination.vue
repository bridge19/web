<template>
  <div class="block">
    <el-pagination
      background
      class="verbal_pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage1"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="size"
      :layout="layout"
      :total="tableTotal">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'MyPagination',
  data () {
    return {
      size: 10
    }
  },
  computed: {
    layout () {
      if (this.needTotal && this.needJumper) {
        return 'total, sizes, prev, pager, next, jumper'
      } else if (this.needTotal) {
        return 'total, sizes, prev, pager, next'
      } else if (this.needJumper) {
        return 'sizes, prev, pager, next, jumper'
      } else {
        return 'sizes, prev, pager, next'
      }
    },
    currentPage1 () {
      return this.page
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('everyPageNum', val)
    },
    handleCurrentChange (val) {
      this.$emit('currentPage', val)
    }
  },
  mounted () {
  },
  props: ['tableTotal', 'needTotal', 'page', 'needJumper', 'needTotal']
}
</script>

<style scoped>
</style>
