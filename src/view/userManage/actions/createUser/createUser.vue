<template>
<div class='my-form_container'>
  <el-form
        label-position="left"
        label-width="100px"
        :model="myForm"
        ref='myForm'
        :rules='myFormRules'
        class='my-form'
      >
      <el-form-item label='账号' v-if="isUpdate">
        <el-input
          v-model="myForm.userAccount"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item prop='userAccount' label='账号' v-else>
        <el-input
          v-model="myForm.userAccount"
          auto-complete="off"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop='userName' label='姓名'>
        <el-input
          v-model="myForm.userName"
          auto-complete="off"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item prop='sex' label='性别'>
        <el-radio-group v-model="myForm.sex">
          <el-radio :label= '0'>男</el-radio>
          <el-radio :label= '1'>女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label='手机号' v-if="isUpdate">
        <el-input
          v-model="myForm.mobile"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item prop='mobile' label='手机号' v-else>
        <el-input
          v-model="myForm.mobile"
          auto-complete="off"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item prop='telphone' label='固话'>
        <el-input
          v-model="myForm.telphone"
          auto-complete="off"
          placeholder="请输入固话"
        ></el-input>
      </el-form-item>
      <el-form-item prop='email' label='邮箱'>
        <el-input
          v-model="myForm.email"
          auto-complete="off"
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class='action-btn_container'>
      <el-button @click='handleClose' size="small">取消</el-button>
      <el-button type ='primary' @click="submit('myForm')" size="small">确定</el-button>
    </div>
</div>

</template>
<script>
import Validator from '@/common/js/validator'
export default {
  data () {
    let $t = this.contentConfig.$t
    let validateUserAccount = (rule, value, callback) => {
      return Validator.account(rule, value, callback, $t)
    }
    let validateUserName = (rule, value, callback) => {
      return Validator.character(rule, value, callback, $t)
    }
    let validateMobile = (rule, value, callback) => {
      return Validator.mobile(rule, value, callback, $t)
    }
    let validateTel = (rule, value, callback) => {
      return Validator.tel(rule, value, callback, $t)
    }
    let validateMail = (rule, value, callback) => {
      return Validator.email(rule, value, callback, $t)
    }
    return {
      myForm: {
        userId: '',
        userName: '',
        userAccount: '',
        sex: '',
        mobile: '',
        telphone: '',
        email: ''
      },
      myFormRules: {
        userAccount: [
          {required: true, message: '请输入账户', trigger: 'blur'},
          {validator: validateUserAccount, trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {validator: validateUserName, trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: validateMobile, trigger: 'blur'}
        ],
        telphone: [
          {validator: validateTel, trigger: 'blur'}
        ],
        email: [
          {validator: validateMail, trigger: 'blur'}
        ]
      },
      isUpdate: false // 判断当前是否为编辑模式
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
      if (this.contentConfig.type === 'update') {
        this.$refs[formName].validate((valid) => {
          let params = {...this.myForm}
          if (valid) {
            this.$post(`/user/modifyuser`, params)
              .then((res) => {
                this.$message.success('编辑成功')
                this.handleClose()
                this.contentConfig.reload()
              })
              .catch((err) => {
                this.$message.error(err.data.error.message)
              })
          }
        })
      } else if (this.contentConfig.type === 'new') {
        this.$refs[formName].validate((valid) => {
          let params = {...this.myForm}
          if (valid) {
            this.$post(`/user/createuser`, params)
              .then((res) => {
                this.$message.success('新建成功')
                this.handleClose()
                this.contentConfig.reload()
              })
              .catch((err) => {
                this.$message.error(err.data.error.message)
              })
          }
        })
      }
    }
  },
  mounted () {
    if (this.contentConfig.type === 'update') {
      let row = this.contentConfig.row
      this.isUpdate = true
      this.myForm = {
        userId: row.id,
        userName: row.username,
        userAccount: row.userAccount,
        sex: row.sex === '男' ? 0 : 1,
        mobile: row.mobile,
        telphone: row.telPhone,
        email: row.email
      }
    }
  }
}
</script>
<style>

</style>



