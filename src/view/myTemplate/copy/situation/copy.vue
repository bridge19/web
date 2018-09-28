<template>
  <div class ='plate-finish plate_content'>
    <div class='plate-header'>
      <div class='palte_btn__group'>
        <el-button
        >
          肯定语境
        </el-button>
        <el-button >
          中性语境
        </el-button>
        <el-button>
          否定语境
        </el-button>
        <el-button>
          拒绝语境
        </el-button>
      </div>

      <div class='p-header__left'>
          <el-tag>11</el-tag>
          <span class='title'>fsdffdsfdsffffffffffffffd</span>
          <i class='icon-ic_edit_normal iconfont'></i>
        </div>
        <div class='p-header__middle'>
          <div class='width50'>关键词:</div>
          <div class='plate_keyword'>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
            <el-tag>1fffffffff</el-tag>
          </div>
          <div class='p_action width40'>编辑</div>
        </div>
         <div class='p-header__right'>
           <span class='p_action marginR10'>添加语境</span>
           <i class='icon-ic_delete_normal iconfont'></i>
        </div>
    </div>
    <div class='plate-list'>
      <div class='plate-list__left' v-if='false'>
        <div class='plate-list_top__border'></div>
        <div class='plate-list_bottom__border'></div>
      </div>
      <div class='plate-list__right'>
        <div class='plate-list__container'>
          <div class ='plate-list__title finishBg-inner'>
            <div>成功结束</div>
          </div>
          <div class='plate-list_body'>
            <div class='plate-delete'></div>
            <div class='plate-list__editor'>
              <div class ='p_l_e__contaienr'>
                <div class='p-header__middle'>
                  <div class='width50'>关键词:</div>
                    <div class='plate_keyword'>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                    </div>
                    <div class='p_action width40'>编辑</div>
                </div>
              </div>
            </div>
            <div class='plate-list__dialog'>
              <div class='p-l-d_left'>
                AI:
              </div>
              <div class='p-l-d_right'>
                <div class = 'p-l-d__radioGroup'>
                  <el-radio-group v-model='radio'>
                    <el-radio :label="3">备选项</el-radio>
                    <el-radio :label="6">备选项</el-radio><br/>
                    <el-radio :label="9">备选项</el-radio>
                  </el-radio-group>
                </div>
                <div class = 'p-l-d__world'>
                  <el-input
                    type="textarea"
                    autosize
                    v-model="input"
                    placeholder="请输入内容">
                  </el-input>
                  <div class='p-l-d__action'>
                    <i class='icon-ic_error_normal iconfont marginR10'></i>
                    <span class='audition marginR10'>试听</span>
                    <span class='upload_record marginR10'>上传录音</span>
                  </div>
                </div>
                <div class = 'p-l-d__world'>
                  <el-input
                    type="textarea"
                    autosize
                    v-model="input"
                    placeholder="请输入内容">
                  </el-input>
                  <div class='p-l-d__action'>
                    <i class='icon-ic_error_normal iconfont marginR10'></i>
                    <span class='audition marginR10'>试听</span>
                    <span class='upload_record marginR10'>上传录音</span>
                  </div>
                </div>
                <div class = 'p-l-d__edtior'>
                  <span><i class='icon-ic_add_ iconfont fontSubTitle marginR5'></i>添加对话</span>
                  <span class='fontBlue add-subcontent'><i class='icon-ic_add_ iconfont fontBlue marginR5'></i>添加二级语境</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='plate-list'>
      <div class='plate-list__left'>
        <div class='plate-list_top__border'></div>
        <div class='plate-list_bottom__border'></div>
      </div>
      <div class='plate-list__right'>
        <div class='plate-list__container'>
          <div class ='plate-list__title finishBg-inner'>
            <div>成功结束</div>
          </div>
          <div class='plate-list_body'>
            <div class='plate-delete'></div>
            <div class='plate-list__editor'>
              <!-- 删除按钮 -->
              <div class='plate-delete'>
                <i class='icon-ic_delete_normal iconfont'></i>
              </div>
              <!-- 关键字按钮 -->
              <div class ='p_l_e__contaienr'>
                <div class='p-header__middle'>
                  <div class='width50'>关键词:</div>
                    <div class='plate_keyword'>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                    </div>
                    <div class='p_action width40'>编辑</div>
                </div>
              </div>
            </div>
            <div class='plate-list__dialog'>
              <div class='p-l-d_left'>
                AI:
              </div>
              <div class='p-l-d_right'>
                <div class = 'p-l-d__radioGroup'>
                  <el-radio-group v-model='radio'>
                    <el-radio :label="3">备选项</el-radio>
                    <el-radio :label="6">备选项</el-radio><br/>
                    <el-radio :label="9">备选项</el-radio>
                  </el-radio-group>
                </div>
                <div class = 'p-l-d__world' >
                  <el-input
                    type="textarea"
                    autosize
                    v-model="input"
                    placeholder="请输入内容">
                  </el-input>
                  <div class='p-l-d__action'>
                    <i class='icon-ic_error_normal iconfont marginL10'></i>
                    <span class='audition marginL10'>试听</span>
                    <span class='upload_record marginL10'>上传录音</span>
                  </div>
                </div>
                <div class = 'p-l-d__world'>
                  <el-input
                    type="textarea"
                    autosize
                    v-model="input"
                    placeholder="请输入内容">
                  </el-input>
                  <div class='p-l-d__action'>
                    <i class='icon-ic_error_normal iconfont marginL10'></i>
                    <span class='audition marginL10 '>试听</span>
                    <span class='upload_record marginL10'>上传录音</span>
                  </div>
                </div>
                <div class = 'p-l-d__edtior'>
                  <span><i class='icon-ic_add_ iconfont fontSubTitle marginR5'></i>添加对话</span>
                  <!-- <span class='fontBlue add-subcontent'><i class='icon-ic_add_ iconfont fontBlue marginR5'></i>添加二级语境</span> -->
                  <span class='p_pause add-subcontent'>停顿时间
                    <el-input-number
                      v-model="num1"
                      :controls='false'
                      :min="0"
                      :max="10"
                      :precision="1"
                      :step="0.1"
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
     <div class='plate-list'>
      <div class='plate-list__left'>
        <div class='plate-list_top__border'></div>
        <div class='plate-list_bottom__border'></div>
      </div>
      <div class='plate-list__right'>
        <div class='plate-list__container'>
          <div class ='plate-list__title finishBg-inner'>
            <div>成功结束</div>
          </div>
          <div class='plate-list_body'>
            <div class='plate-list__editor'>
              <!-- 删除按钮 -->
              <div class='plate-delete'>
                <i class='icon-ic_delete_normal iconfont'></i>
              </div>
              <!-- 关键字-->
              <div class ='p_l_e__contaienr'>
                <div class='p-header__middle'>
                  <div class='width50'>关键词:</div>
                    <div class='plate_keyword'>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                      <el-tag>1fffffffff</el-tag>
                    </div>
                    <div class='p_action width40'>编辑</div>
                </div>
              </div>
            </div>
            <div class='plate-list__dialog'>
              <div class='p-l-d_left'>
                AI:
              </div>
              <div class='p-l-d_right'>
                <div class = 'p-l-d__radioGroup'>
                  <el-radio-group v-model='radio'>
                    <el-radio :label="3">备选项</el-radio>
                    <el-radio :label="6">备选项</el-radio><br/>
                    <el-radio :label="9">备选项</el-radio>
                  </el-radio-group>
                </div>
                <div class = 'p-l-d__world'>
                  <el-input
                    type="textarea"
                    autosize
                    v-model="input"
                    placeholder="请输入内容">
                  </el-input>
                  <div class='p-l-d__action'>
                    <i class='icon-ic_error_normal iconfont marginL10'></i>
                    <span class='audition marginL10'>试听</span>
                    <span class='upload_record marginL10'>上传录音</span>
                  </div>
                </div>
                <div class = 'p-l-d__world'>
                  <el-input
                    type="textarea"
                    autosize
                    v-model="input"
                    placeholder="请输入内容">
                  </el-input>
                  <div class='p-l-d__action'>
                    <i class='icon-ic_error_normal iconfont marginL10'></i>
                    <span class='audition marginL10'>试听</span>
                    <span class='upload_record marginL10'>上传录音</span>
                  </div>
                </div>
                <div class = 'p-l-d__edtior'>
                  <div class='palte_btn__group sub-btn__group'>
                    <el-button
                    >
                      肯定语境
                    </el-button>
                    <el-button >
                      中性语境
                    </el-button>
                    <el-button>
                      否定语境
                    </el-button>
                    <el-button>
                      拒绝语境
                    </el-button>
                  </div>
                  <span><i class='icon-ic_add_ iconfont fontSubTitle marginR5'></i>添加对话</span>
                  <span class='fontBlue add-subcontent'><i class='icon-ic_add_ iconfont fontBlue marginR5'></i>添加二级语境</span>
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
export default {
  name: 'finish-situation',
  data () {
    return {
      radio: '',
      input: '我师父似懂非懂是佛挡杀佛IDS返回恢复开机后短时间发货的方式的缴费范德萨范德萨交话费好久放多久刷复活点计划发动机是符合和电视剧都很费劲的收费环境的符合绝对是'
    }
  }
}
</script>
<style scoped lang='less' rel='stylesheet/less'>
  .marginR70{
    padding-right: 70px
  }
</style>

