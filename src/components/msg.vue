<template>
  <div id="msg-dependencies" v-if="msgCount == 0">
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    computed: {
      msgCount () {
        let count = this.$store.state.msg.count
        var msg = this.$store.state.msg
        this.$message({
          type: msg.type,
          message: msg.message
        })
        return count
      }
    }
  }
</script>