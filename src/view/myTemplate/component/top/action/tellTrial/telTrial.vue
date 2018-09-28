<template>
  <div class="telTrialConent">
    <div class="numberConent">
      <el-form class="telInput" :rules="Myrules" :model="formValue" ref="MyForm">
        <el-form-item  prop="telNumber">
          <el-input
            placeholder="请输入固话/手机号码"
            v-model="formValue.telNumber"
            clearable>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="BtnContent">
      <el-button class="telBtn" type="primary" @click="_handleTeling('MyForm')">拨打</el-button>
    </div>
  </div>
</template>

<script>
    import tellingAction from './telIng/index'
    export default {
      name: 'telTrial',
      props: {
        handleClose: {
          type: Function,
          default: () => {
          }
        },
        contentConfig: {
          type: Object,
          required: true
        }
      },
      data () {
        return {
          formValue: {
            telNumber: ''
          },
          Myrules: {
            telNumber: [{required: true, validator: this.checkTel, trigger: 'blur'}]
          }
        }
      },
      methods: {
        checkTel (rule, value, callback) {
          if (!value) {
            callback(new Error('请输入固话或手机号码'))
          } else if (!((/^1(3|4|5|7|8)\d{9}$/.test(value)) || (/^0\d{2,3}-?\d{7,8}$/.test(value)))) {
            callback(new Error('请输入正确的手机或固话号码'))
          } else {
            callback()
          }
        },
        _handleTeling (formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let templateId = this.contentConfig.templateId
              let phone = this.formValue.telNumber
              this.$post(`/voice/test`, {templateId, phone})
                .then((res) => {
                  this.handleClose()
                  setTimeout(() => {
                    tellingAction({
                      templateId: this.contentConfig.templateId,
                      telNumber: this.formValue.telNumber,
                      reload: this.contentConfig.reload
                    })
                  }, 0)
                })
                .catch(err => {
                  this.$message.error(err.data.error.message)
                })
            } else {
              return false
            }
          })
        }
      },
      destroyed () {
        this.contentConfig.reload()
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../../../../common/stylus/variable";
  .telTrialConent{
    height: 196px;
    .numberConent{
      height: 119px;
      border-bottom: 1px solid @border;
      .telInput{
        display: inline-block;
        width: 400px;
        margin: 36px 0 0 50px;
      }
    }
    .BtnContent{
      height: 75px;
      .telBtn{
        width: 80px;
        margin: 19px 0 0 400px;
      }
    }
  }
</style>
