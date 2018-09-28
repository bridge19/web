<template>
  <div>
    <el-container>
      <el-aside width='240px'>
        <left-tree
        :isSystem='isSystem'
        ></left-tree>
      </el-aside>
      <el-main class='app-right'>
        <right-theme
        :isSystem='isSystem'
        ></right-theme>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import LeftTree from './leftTree'
import RightTheme from './rightTheme'
export default {
  name: 'theme-view',
  data () {
    return {

    }
  },
  computed: {
    vTState () {
      return this.$store.state.verbalTemplate
    },
    isSystem () {
      let type = this.vTState.type
      if (type === 0) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    LeftTree,
    RightTheme
  }
}
</script>

