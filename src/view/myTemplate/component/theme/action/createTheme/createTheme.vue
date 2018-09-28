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
      <el-form-item prop='sort' label='序号值'>
         <el-select v-model="myForm.sort" placeholder="请选择" style="width: 280px">
            <el-option
              v-for="item in contentConfig.sortOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
      </el-form-item>
      
      <el-form-item prop='subjectName' label='主题名称'>
        <el-input
          v-model.trim="myForm.subjectName"
          auto-complete="off"
          placeholder="请输入版块名称"
        ></el-input>
         <el-input style='display:none'></el-input>
      </el-form-item>

      <el-form-item prop='intentId' label='意图选择'>
        <el-select v-model="myForm.intentId" filterable placeholder="请选择" style="width: 280px">
          <el-option
            v-for="item in intentOptions"
            :key="item.id"
            :label="item.intentionName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class='action-btn_container'>
      <el-button @click='handleClose' size="small">取消</el-button>
      <el-button type ='primary' @click="submit('myForm')" size="small">确定</el-button>
    </div>
</div>

</template>
<script>
// import Validator from '@/common/js/validator'
export default {
  data () {
    return {
      myForm: {
        subjectName: '',
        sort: this.contentConfig.initialSort,
        intentId: ''
      },
      intentOptions: [],
      myFormRules: {
        sort: [
          {required: true, message: '请选择序号值', trigger: 'change'}
        ],
        subjectName: [
          {required: true, message: '请输入主题名称', trigger: 'blur'}
        ],
        intentId: [
          {required: true, message: '请选择意图', trigger: 'change'}
        ]
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
    getIntentList () {
      let sceneId = this.contentConfig.sceneId
      this.$fetch('/template/intention', {
        sceneId: sceneId,
        intentType: 1
      })
        .then(res => {
          this.intentOptions = res.data
        })
        .catch(err => {
          this.$message.error(err.data.error.message)
        })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.myForm
          this.intentOptions.map(item => {
            if (item.id === params.intentId) {
              params.intentName = item.intentionName
            }
          })
          params.sampleId = this.contentConfig.sampleId
          params.intentType = 1
          this.commitPost(params)
        }
      })
    },
    commitPost (params) {
      let type = this.contentConfig.type
      let isSystem = this.contentConfig.isSystem
      let url = ''
      if (type === 'new') {
        if (isSystem) {
          url = '/sample/subject/create'
        } else {
          url = '/template/subject/create'
        }
      } else {
        if (isSystem) {
          url = '/sample/subject/update'
        } else {
          url = '/template/subject/update'
        }
      }
      this.$post(url, params)
        .then(res => {
          this.$message.success(res.message)
          this.handleClose()
          this.contentConfig.reload()
        })
        .catch(err => {
          this.$message.error(err.data.error.message)
        })
    }
  },
  mounted () {
    // 获取意图
    this.getIntentList()
    let type = this.contentConfig.type
    let initialData = this.contentConfig.initialData
    if (type === 'update') {
      this.myForm = {
        subjectName: initialData.subjectName,
        subjectId: initialData.subjectId,
        sort: this.contentConfig.initialSort,
        intentId: initialData.intentId
      }
    }
  },
  destroyed () {
  }
}
</script>
<style>

</style>


