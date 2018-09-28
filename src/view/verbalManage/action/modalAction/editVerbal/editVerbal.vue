<template>
<div class='my-form_container'>
  <div class="action-form_container">
    <div class="el-formbox">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="企业">
        <el-select
          v-show="contentConfig.title!=='编辑模板'"
          v-model="form.tenantId"
          filterable
          remote
          @change="downten"
          :remote-method="fatchcompany"
          placeholder="请输入查询企业名称，并选择">
          <el-option
            v-for="item in companyList"
            :key="item.tenantId"
            :label="item.companyName"
            :value="item.tenantId">
          </el-option>
        </el-select>
        <span v-show="contentConfig.title==='编辑模板'">{{form.companyName}}</span>
      </el-form-item>
      <el-form-item label="话术名称">
        <el-input v-model="form.templateName" placeholder="请输入话术名称，同一企业的话术名称不能重复"></el-input>
      </el-form-item>
      <el-form-item label="地区">
        <city-select :cities="form.cities" @change="pushcity"></city-select>
      </el-form-item>
      <el-form-item label="行业">
        <industry-select  :disable="contentConfig.title!=='新建模板'" :value="form.industryId" @change="fatchtemp"></industry-select>
      </el-form-item>
      <el-form-item label="选取模板" v-show="contentConfig.title==='新建模板'">
        <el-select
          ref="tempselect"
          v-model="form.template"
          :clearable="true"
          filterable
          placeholder="可输入模版名称筛选选项，或直接选择">
          <el-option
            v-for="item in templist"
            :key="item.sampleId"
            :label="item.sampleName"
            :value="item.sampleId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    </div>
  </div>
  <div class='action-btn_container'>
    <el-button @click='handleClose'>取消</el-button>
    <el-button type='primary' @click="submit(contentConfig)">确定</el-button>
  </div>
</div>

</template>
<script>
import {BASE_URL} from '@/common/config'
import citySelect from '@/components/citySelect'
import industrySelect from '@/components/industrySelect'
export default {
  data () {
    return {
      companyList: [],
      form: {
        temptype: '选取模板'
      },
      templist: [],
      fileList: []
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
  computed: {
    BASE_URL () {
      return BASE_URL
    }
  },
  methods: {
    submit () {
      if (this.checkstatus() === false) {
        return
      }
      let params
      let url = ''
      if (this.contentConfig.title === '编辑模板') {
        url = '/template/update'
        params = {
          city: this.form.city,
          templateName: this.form.templateName,
          province: this.form.province,
          templateId: this.form.templateId
        }
      } else if (this.contentConfig.title === '新建模板') {
        url = '/template/create'
        params = {
          city: this.form.city,
          industryId: this.form.industryId,
          templateName: this.form.templateName,
          sampleId: this.form.template,
          tenantId: this.form.tenantId,
          province: this.form.province,
          contactPerson: this.form.contactPerson,
          tenantName: this.form.tenantName,
          email: this.form.email,
          industryName: this.form.industryName,
          phone: this.form.phone
        }
      } else if (this.contentConfig.title === '复制模板') {
        url = '/template/copy'
        params = {
          city: this.form.city,
          industryId: this.form.industryId,
          templateName: this.form.templateName,
          industryName: this.form.industryName,
          sampleId: this.form.template,
          tenantId: this.form.tenantId,
          province: this.form.province,
          contactPerson: this.form.contactPerson,
          tenantName: this.form.tenantName,
          email: this.form.email,
          phone: this.form.phone,
          templateId: this.form.templateId
        }
      }
      let _this = this
      this.$post(url, params)
        .then(res => {
          this.$message({
            type: 'success',
            message: this.contentConfig.title + '成功'
          })
          _this.contentConfig.reload(res)
          _this.handleClose()
        })
        .catch(err => {
          _this.$message({
            type: 'error',
            message: err.data.error.message
          })
        })
    },
    checkstatus () {
      if (!this.form.tenantId) {
        this.$message({
          type: 'error',
          message: '请选择企业'
        })
        return false
      } else if (!this.form.templateName) {
        this.$message({
          type: 'error',
          message: '请输入话术名称'
        })
        return false
      } else if (!this.form.city) {
        this.$message({
          type: 'error',
          message: '请选择地区'
        })
        return false
      } else if (!this.form.industryId) {
        this.$message({
          type: 'error',
          message: '请选择行业'
        })
        return false
      } else if (!this.form.tenantId) {
        this.$message({
          type: 'error',
          message: '请选取模板'
        })
        return false
      } else {
        return true
      }
    },
    fatchcompany (value) {
      this.$fetch('template/tenantInfo', {
        search: value
      })
        .then(res => {
          this.companyList = res.data
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.data.error.message
          })
        })
    },
    pushcity (value) {
      this.form.province = value[0]
      this.form.city = value[1]
    },
    fatchtemp (value) {
      if (value.id) {
        this.form.industryId = value.id
        this.form.industryName = value.sceneName
      } else {
        return
      }
      this.$post('/template/get/sample', {
        industryId: this.form.industryId
      })
        .then(res => {
          this.templist = res.data
          if (this.form.template) {
            this.form.template = ''
          }
          // this.$refs.tempselect.clear()
        })
        .catch(err => {
          if (this.contentConfig.title !== '编辑模板') {
            if (this.form.template && this.templist.length) {
              this.form.template = ''
            }
            this.templist = []
            this.$message({
              type: 'error',
              message: err.data.error.message
            })
          }
        })
    },
    downten (value) {
      let obj = {}
      obj = this.companyList.find((item) => {
        return item.tenantId === value
      })
      this.form.contactPerson = obj.contactPerson
      this.form.tenantName = obj.companyName
      this.form.email = obj.email
      this.form.phone = obj.phone
    }
  },
  mounted () {
    if (this.contentConfig.data) {
      this.form = JSON.parse(JSON.stringify(this.contentConfig.data))
      this.form.cities = [this.contentConfig.data.province, this.contentConfig.data.city]
      this.fatchtemp({id: this.contentConfig.data.industryId, sceneName: this.contentConfig.data.industryName})
      if (this.contentConfig.title === '复制模板') {
        this.form.templateName += '（2）'
      }
    }
  },
  components: {citySelect, industrySelect}
}
</script>
<style lang="less">

.action-form_container{
  .el-formbox{
    width: 520px;
    margin: 20px auto;
  }
  .el-select{
    width: 100%;
  }
  .el-cascader{
    width: 100%;
  }
}
</style>
