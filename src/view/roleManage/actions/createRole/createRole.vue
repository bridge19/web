<template>
<div id="createRole" class='my-form_container'>
    <el-form
        label-position="left"
        label-width="100px"
        :model="myForm"
        ref='myForm'
        :rules='myFormRules'
        class='my-form'
      >
      <el-form-item prop='remarks' label='角色名称'>
        <el-input
          v-model="myForm.role"
          auto-complete="off"
          placeholder="请输入角色名称"
          style="width: 180px"
        ></el-input>
      </el-form-item>
      <el-form-item prop='remark' label='备注'>
        <el-input
          v-model="myForm.remark"
          auto-complete="off"
          placeholder="请输入备注"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <div class="my-form-fotter">
        <div class="authorityTitle">请分配角色权限<b>*</b></div>
        <authority></authority>
      </div>
    </el-form>
    <div class='action-btn_container'>
      <el-button @click='handleClose' size="small">取消</el-button>
      <el-button type ='primary' @click="submit('myForm')" size="small">确定</el-button>
    </div>
</div>

</template>
<script>
// import Validator from '@/common/js/validator'
import authority from '@/components/authority'
export default {
  components: { authority },
  data () {
    // let $t = this.contentConfig.$t
    return {
      myForm: {
        name: '',
        remark: '',
        id: undefined
      },
      myFormRules: {
        role: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ]
      },
      authorityInfo: {
        verbalManageInfo: {},
        verbalTemplateInfo: {},
        systemManageInfo: []
      }
    }
  },
  props: {
    contentConfig: {
      type: Object
    },
    handleClose: {
      type: Function,
      required: true
    }
  },
  methods: {
    submit (formName) {
      // let userInfo = this.contentConfig.userInfo
      this.$refs[formName].validate((valid) => {
        let params = this.myForm
        if (valid) {
          this.$post(`/saveRole`, params)
            .then((res) => {
              this.$message.success(res.message)
              this.handleClose()
              this.contentConfig.reload()
            })
            .catch((err) => {
              this.$message.error(err.data.error.message)
            })
        }
      })
    }
  },
  created () {
    if (this.contentConfig.model === 'editorRole') {
      let row = this.contentConfig.row
      this.myForm = {
        role: row.role,
        remarks: row.remarks,
        id: row.id
      }
    } else if (this.contentConfig.model === 'createRole') {
    }
  }
}
</script>
<style scoped lang="less">
  .my-form_container{
    .my-form-fotter{
      overflow: hidden;
      .authorityTitle{
        margin-bottom: 12px;
      }
    }
  }


</style>



