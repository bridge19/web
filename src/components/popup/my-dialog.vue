<template>
  <div id='el-dialog'>
    <el-dialog :title="title"
      :width="width"
      :visible="show"
      ref="ele-dialog"
      :custom-class='customClass'
      @close='handleClose'
      top="20vh"
    >
      <slot name='content'>
        <span>
          这是一个提示
        </span>
      </slot>
    </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'my-dialog',
  data: () => {
    return {
      dialogVisible: true
    }
  },
  props: {
    show: {
      required: true,
      type: Boolean
    },
    title: {
      // required: true,
      default: '提示'
    },
    customClass: {
      default: 'customClass'
    },
    width: {
      // required: true,
      default: '800px'
    },
    handleClose: {
      type: Function,
      default: () => {
        console.log('关闭实例')
      }
    }
  }
}
</script>
<style>

</style>
