<template>
  <div class ='recoverBg plate_content'>
    <div class='plate-header'>
      <div class='p-header__left'>
        <el-tag>{{plates.sort}}</el-tag>
        <span class='title'>挽回</span>
        <i class='icon-ic_edit_normal iconfont'  v-if='false'></i>
      </div>
      <div class='p-header__right'>
        <span class='p_action marginR10 add_question'>添加问题库</span>
        <i class='icon-ic_delete_normal iconfont' v-if='false'></i>
      </div>
    </div>
    <div class='plate-list'
    v-for = '(item,index) in plates.contexts'
    :key='index'
    >
      <div class='plate-list__right'>
        <div class='plate-list__container'>
          <div class ='plate-list__title recoverBg-inner'>
            <div>挽回</div>
          </div>
          <div class='plate-list_body'>
            <div class='plate-list__editor'>
              <div class='plate-delete'>
                <i class='icon-ic_delete_normal iconfont'></i>
              </div>
              <div class ='p_l_e__contaienr'>
                <div class='p-header__middle'>
                  <div class='width50'>关键词:</div>
                    <div class='plate_keyword'>
                      <el-tag
                        v-for = '(value,ii) in item.keyWord'
                        :key='ii'
                      >{{value}}</el-tag>
                    </div>
                    <div class='p_action width40'>编辑</div>
                </div>
              </div>
            </div>
            <div class='plate-list__dialog' style='padding-top:20px'>
              <div class='p-l-d_left'>
                AI:
              </div>
              <div class='p-l-d_right'>
                <div class = 'p-l-d__world'
                  v-for='(v, i) in item.dialogues'
                  :key='i'
                >
                  <el-input
                    type="textarea"
                    autosize
                    v-model.trim="v.word"
                    @change="_handlerWordChange(index,i,$event)"
                    placeholder="请输入内容">
                  </el-input>
                  <div class='p-l-d__action'>
                    <i class='icon-ic_error_normal iconfont marginL10' v-if='item.dialogues.length>1'></i>
                    <span class='audition marginL10' v-if='!isSystem'>试听</span>
                    <span class='upload_record marginL10' v-if='!isSystem'>上传录音</span>
                  </div>
                </div>
                <div class = 'p-l-d__edtior'>
                  <span><i class='icon-ic_add_ iconfont fontSubTitle marginR5'></i>添加对话</span>
                  <!-- <span class='fontBlue add-subcontent'><i class='icon-ic_add_ iconfont fontBlue marginR5'></i>添加二级语境</span> -->
                  <span class='p_pause add-subcontent'>停顿时间
                    <el-input-number
                      v-model.trim="item.pauseTime"
                      :controls='false'
                      :min="0"
                      @change='_handlerNumberChange(index,$event)'
                      label="描述文字">
                    </el-input-number>秒
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'finish-situation',
  data () {
    return {
    }
  },
  watch: {
    num1 (curVal, oldVal) {
    }
  },
  methods: {
    ...mapMutations({
      _setPauseTime: 'verbalTemplate/set-template-pauseTime',
      _setWord: 'verbalTemplate/set-template-word'
    }),
    _handlerNumberChange (index, value) {
      let mainIndex = this.plates.sort - 1
      let contextsIndex = index
      this._setPauseTime({
        mainIndex,
        contextsIndex,
        value
      })
    },
    _handlerWordChange (index, i, value) {
      let mainIndex = this.plates.sort - 1
      let contextsIndex = index
      let dialoguesIndex = i
      this._setWord({
        mainIndex,
        contextsIndex,
        dialoguesIndex,
        value
      })
    }
  },
  props: {
    plates: {
      required: true
    },
    isSystem: {
      required: true
    }
  }
}
</script>
<style scoped lang='less' rel='stylesheet/less'>
  .marginR70{
    padding-right: 70px
  }
</style>

