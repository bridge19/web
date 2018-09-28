
import {post, fetch, put} from '@/service/http'
import { fromJS } from 'immutable'
import Vue from 'vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)
// initial state
// keyWord 格式是字符串的拼接 ''

let initialTemplate = fromJS({
  'type': 0,
  'userId': 'null',
  'id': '', // 模板id
  'name': '',
  'plates': [{
    contexts: [{
      'dialogues': [{
        'videoName': '',
        'videoUrl': '',
        'word': ''
      }],
      sonContext: [], // 二级语境的情况
      pauseTime: '',
      nextType: '',
      keyWord: '',
      keyWordArray: [],
      type: 0 // 破题
    }],
    type: 0,
    keyWord: '',
    keyWordArray: [],
    nextPlateName: '结束对话',
    nextOpenDialogsFirst: '',
    showAddBtn: false,
    name: '输入流程名称',
    sort: 1
  }, {
    contexts: [{
      'dialogues': [{
        'videoName': '',
        'videoUrl': '',
        'word': ''
      }],
      type: 10,
      pauseTime: '',
      keyWord: '',
      keyWordArray: []
    }, {
      'dialogues': [{
        'videoName': '',
        'videoUrl': '',
        'word': ''
      }],
      type: 12,
      pauseTime: '',
      keyWord: '',
      keyWordArray: []
    }, {
      'dialogues': [{
        'videoName': '',
        'videoUrl': '',
        'word': ''
      }],
      type: 14,
      pauseTime: '',
      keyWord: '',
      keyWordArray: []
    }],
    type: 2,
    name: '结束对话',
    sort: 2,
    keyWord: '',
    keyWordArray: []
  }, {
    contexts: [{
      'dialogues': [{
        'videoName': '',
        'videoUrl': '',
        'word': ''
      }],
      keyWord: '',
      keyWordArray: [],
      pauseTime: '',
      type: 16
    }],
    type: 4,
    keyWord: '',
    keyWordArray: [],
    name: '挽回语境',
    sort: 3
  }, {
    contexts: [{
      'dialogues': [{
        'videoName': '',
        'videoUrl': '',
        'word': ''
      }],
      keyWord: '',
      keyWordArray: [],
      pauseTime: '',
      type: 18
    }],
    type: 6,
    name: '问题库',
    sort: 4,
    keyWord: '',
    keyWordArray: []
  }]
})

const state = {
  treeList: [], // 左边树的tree
  activeId: null, // 页面活动菜单id
  userInfo: { // 用户信息，用来判断是编辑模板还是全花话术模板
    type: 0,
    userId: 'null'
  },
  // 当前的模板信息
  userTemplate: initialTemplate.toJS()
}

// getters
const getters = {
  // 页面活动菜单Name
  activeName: (state, getters) => {
    let activeId = state.activeId
    let treeList = state.treeList
    let obj = {}
    treeList.map(item => {
      item.templateAlls.map((v) => {
        obj[v.id] = v.name
      })
    })
    return obj[activeId]
  },
  hasTemplate: (state, getters) => {
    let treeList = state.treeList
    let flag = false
    treeList.map(item => {
      if (item.templateAlls.length > 0) {
        flag = true
      }
    })
    return flag
  }
}
// actions
const actions = {
  // 获取全局文件夹树目录
  getTreeList ({commit, state, rootState}, payload) {
    return new Promise((resolve, reject) => {
      let userInfo = state.userInfo
      let url = ''
      if (userInfo.type === 0) {
        url = '/industryTreeList'
      } else {
        url = '/industry/CompanyTreeList'
      }
      post(url, userInfo)
        .then(res => {
          if (res.code === '200') {
            let userId = userInfo.userId
            let treeList = res.data
            if (userId !== 'null') {
              treeList = treeList.map(item => {
                item.industryName = item.folderName
                item.templateAlls = item.list
                return item
              })
            }
            commit({
              type: 'set-folder-list',
              list: treeList
            })
            resolve(treeList)
          }
        })
        .catch(err => {
          let count = rootState.count
          count++
          let message = err.data.error.message || '服务器错误'
          let msg = {
            count,
            type: 'error',
            message
          }
          commit({
            type: 'set-msg',
            msg
          }, {root: true})
          reject(err)
        })
    })
  },
  // 获取模板
  getTemplate ({commit, state, rootState}, payload) {
    return new Promise((resolve, reject) => {
      let templateId = payload.templateId
      let type = state.userInfo.type
      let url = ''
      if (type === 0) {
        url = `/template/query/${templateId}`
      } else {
        url = `/template/user/query/${templateId}`
      }
      fetch(url, {templateId})
        .then((res) => {
          if (res.code === '200') {
            let template = res.data
            if (template.plates.length === 0) {
              template.plates = initialTemplate.toJS().plates
            } else {
              // 对kewWorld 做一下格式的转换
              // sort 应该修改下
              let plates = template.plates
              template.plates = formatPlate(plates)
            }
            commit({
              type: 'set-initial-template',
              template: template
            })
            resolve(template)
          }
        }).catch(err => {
          let count = rootState.count
          count++
          let message = err.data.error.message || '服务器错误'
          let msg = {
            count,
            type: 'error',
            message
          }
          commit({
            type: 'set-msg',
            msg
          }, {root: true})
          reject(err)
        })
    })
  },
  // 提交模板
  saveTemplate ({commit, state, rootState}, payload) {
    return new Promise((resolve, reject) => {
      let template = state.userTemplate
      let userId = state.userInfo.userId
      let type = state.userInfo.type
      let url = ''
      if (type === 0) {
        url = '/template/currentTime/save'
      } else {
        url = '/template/user/currentTime/save'
      }
      let params = {
        template,
        userId,
        type
      }
      put(url, params)
        .then((res) => {
          if (res.code === '200') {
            let template = res.data
            if (template.plates.length === 0) {
              template.plates = initialTemplate.toJS().plates
            } else {
              // 对kewWorld 做一下格式的转换
              // sort 应该修改下
              let plates = template.plates
              template.plates = formatPlate(plates)
            }
            commit({
              type: 'set-initial-template',
              template: template
            })
            resolve(template)
          }
        })
        .catch((err) => {
          let count = rootState.count
          count++
          let message = err.data.error.message || '服务器错误'
          let msg = {
            count,
            type: 'error',
            message
          }
          commit({
            type: 'set-msg',
            msg
          }, {root: true})
          reject(err)
        })
    })
  }
}

// mutations
const mutations = {
  // 设置全局文件夹树目录
  'set-folder-list': (state, payload) => {
    state.treeList = payload.list
  },

  // 设置当前模板的活动Id
  'set-activeId': (state, payload) => {
    state.activeId = payload.activeId
  },

  // 设置用户信息
  'set-userInfo': (state, payload) => {
    state.userInfo = payload.userInfo
  },

  // 设置初始模板信息
  'set-initial-template': (state, payload) => {
    state.userTemplate = payload.template
  },
  // 增加一级语境
  'add-first-situation': (state, payload) => {
    let mainIndex = payload.mainIndex
    let content = payload.content
    let plates = state.userTemplate.plates
    plates[mainIndex].contexts.push(content)
  },
  // 删除一级语境
  'delete-first-situation': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let plates = state.userTemplate.plates
    plates[mainIndex].contexts.splice(contextsIndex, 1)
  },
  // 增加二级语境
  'set-second-situation': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let content = payload.content
    let plates = state.userTemplate.plates
    plates[mainIndex].contexts[contextsIndex].sonContext.push(content)
  },
  // 删除二级语境
  'delete-second-situation': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let sonContextsIndex = payload.sonContextsIndex
    let plates = state.userTemplate.plates
    plates[mainIndex].contexts[contextsIndex].sonContext.splice(sonContextsIndex, 1)
  },
  // 增加版块
  'add-plate': (state, payload) => {
    let mainIndex = payload.mainIndex
    let plates = state.userTemplate.plates
    let name = payload.name
    let content = {
      contexts: [{
        'dialogues': [{
          'videoName': '',
          'videoUrl': '',
          'word': ''
        }],
        sonContext: [], // 二级语境的情况
        pauseTime: '',
        nextType: '',
        keyWord: '',
        keyWordArray: [],
        type: 0 // 破题
      }],
      type: 0,
      keyWord: '',
      keyWordArray: [],
      showAddBtn: false,
      nextPlateName: '结束对话',
      name,
      sort: 1
    }
    plates.splice(mainIndex + 1, 0, content)
    // 重新排序，修改sort, 修改nextPlateName
    let length = plates.length
    for (let i = 0; i < length; i++) {
      plates[i].sort = i + 1
      if (i < length - 1) {
        plates[i].nextPlateName = plates[i + 1].name
      }
    }
  },
  // 删除版块
  'delete-plate': (state, payload) => {
    let mainIndex = payload.mainIndex
    let plates = state.userTemplate.plates
    plates.splice(mainIndex, 1)
    let length = plates.length
    // 重新排序，修改sort, 修改nextPlateName
    for (let i = 0; i < length; i++) {
      plates[i].sort = i + 1
      if (i < length - 1) {
        plates[i].nextPlateName = plates[i + 1].name
      }
    }
  },
  // 编辑关键词
  'editor-plate-keyWord': (state, payload) => {
    let mainIndex = payload.mainIndex
    let keyWordArray = payload.keyWordArray
    let plates = state.userTemplate.plates
    plates[mainIndex].keyWordArray = keyWordArray
    plates[mainIndex].keyWord = keyWordArray.join(',')
  },
  // 修改大版块添加语境按钮是否出现
  'editor-plate-addBtn-show': (state, payload) => {
    let mainIndex = payload.mainIndex
    let show = payload.show
    let plates = state.userTemplate.plates
    plates[mainIndex].showAddBtn = show
  },

  // 修改一级语境中 添加语境按钮是否出现
  'editor-first-addBtn-show': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let show = payload.show
    let plates = state.userTemplate.plates
    plates[mainIndex].contexts[contextsIndex].showAddBtn = show
  },
  // 编辑一级语境关键词
  'editor-first-keyWord': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let keyWordArray = payload.keyWordArray
    let plates = state.userTemplate.plates
    let contexts = plates[mainIndex].contexts[contextsIndex]
    contexts.keyWordArray = keyWordArray
    contexts.keyWord = keyWordArray.join(',')
  },

  //  编辑二级语境关键词
  'editor-second-keyWord': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let sonContextIndex = payload.sonContextIndex
    let keyWordArray = payload.keyWordArray
    let plates = state.userTemplate.plates
    let contexts = plates[mainIndex].contexts[contextsIndex].sonContext[sonContextIndex]
    contexts.keyWordArray = keyWordArray
    contexts.keyWord = keyWordArray.join(',')
  },

  // 重命名版块名称
  'rename-plate': (state, payload) => {
    let oldIndex = payload.oldIndex
    let newIndex = payload.newIndex
    let newName = payload.newName
    let plates = state.userTemplate.plates
    plates[oldIndex].name = newName
    // 修改plateName
    let length = plates.length
    for (let i = 0; i < length; i++) {
      if (i < length - 1) {
        plates[i].nextPlateName = plates[i + 1].name
      }
    }
    plates = sortByAuto(plates, oldIndex, newIndex)
    // 重新排序
  },
  // 设置模板的停顿时间pauseTime 只有一级
  'set-template-pauseTime': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let value = payload.value
    let plates = state.userTemplate.plates
    plates[mainIndex].contexts[contextsIndex].pauseTime = value
  },

  // 设置模板一级对话中的内容
  'set-template-first-word': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let dialoguesIndex = payload.dialoguesIndex
    let value = payload.value
    let plates = state.userTemplate.plates
    let dialogues = plates[mainIndex].contexts[contextsIndex].dialogues
    dialogues[dialoguesIndex].word = value
  },

  // 添加 一级dialogues
  'add-first-dialogues': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let plates = state.userTemplate.plates
    plates[mainIndex].contexts[contextsIndex].dialogues.push({
      'videoName': '',
      'videoUrl': '',
      'word': ''
    })
  },
  // 删除一级dialogues
  'delete-first-dialogues': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let dialoguesIndex = payload.dialoguesIndex
    let plates = state.userTemplate.plates
    let dialogues = plates[mainIndex].contexts[contextsIndex].dialogues
    dialogues.splice(dialoguesIndex, 1)
  },
  // 上传一级录音
  // 一级语境4中语境中nextType 修改
  'set-first-next-type': (state, payload) => {
    // 需要重新设置 里面的值
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let nextType = payload.nextType
    let level = 1
    let plates = state.userTemplate.plates
    let contexts = plates[mainIndex].contexts[contextsIndex]
    setNextTypeChange(contexts, nextType, level)
  },
  // 二级语境的所有操作
  // 设置模板二级对话中的内容
  'set-template-second-word': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let sonContextIndex = payload.sonContextIndex
    let dialoguesIndex = payload.dialoguesIndex
    let value = payload.value
    let plates = state.userTemplate.plates
    let dialogues = plates[mainIndex].contexts[contextsIndex].sonContext[sonContextIndex].dialogues
    dialogues[dialoguesIndex].word = value
  },
  // 添加二级dialogues
  'add-second-dialogues': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let sonContextIndex = payload.sonContextIndex
    let plates = state.userTemplate.plates
    plates[mainIndex].contexts[contextsIndex].sonContext[sonContextIndex].dialogues.push({
      'videoName': '',
      'videoUrl': '',
      'word': ''
    })
  },
  // 删除二级dialogues
  'delete-second-dialogues': (state, payload) => {
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let sonContextIndex = payload.sonContextIndex
    let dialoguesIndex = payload.dialoguesIndex
    let plates = state.userTemplate.plates
    let dialogues = plates[mainIndex].contexts[contextsIndex].sonContext[sonContextIndex].dialogues
    dialogues.splice(dialoguesIndex, 1)
  },
  // 二级语境4中语境中nextType 修改
  'set-second-next-type': (state, payload) => {
    // 需要重新设置 里面的值
    let mainIndex = payload.mainIndex
    let contextsIndex = payload.contextsIndex
    let sonContextIndex = payload.sonContextIndex
    let nextType = payload.nextType
    let plates = state.userTemplate.plates
    let contexts = plates[mainIndex].contexts[contextsIndex].sonContext[sonContextIndex]
    let level = 2
    setNextTypeChange(contexts, nextType, level)
  }
}

function setNextTypeChange (contexts, nextType, level) {
  switch (nextType) {
    case 0:
      contexts.dialogues = []
      contexts.nextType = nextType
      break
    case 2:
      contexts.dialogues = [{
        'videoName': '',
        'videoUrl': '',
        'word': ''
      }]
      contexts.nextType = nextType
      break
    case 4:
      contexts.dialogues = []
      contexts.nextType = nextType
      break
    case 6:
      contexts.dialogues = [{
        'videoName': '',
        'videoUrl': '',
        'word': ''
      }]
      contexts.nextType = nextType
      break
    case 8:
      contexts.dialogues = []
      contexts.nextType = nextType
      break
  }
  if (level === 1) {
    contexts.sonContext = []
  }
}

function formateKeyWord (plates) {
  plates = plates.map((item) => {
    item.keyWordArray = []
    if (item.keyWord) {
      item.keyWordArray = item.keyWord.split(',')
    }
    if (item.contexts && item.contexts.length > 0) {
      item.contexts = item.contexts.map((v) => {
        v.keyWordArray = []
        if (v.keyWord) {
          v.keyWordArray = v.keyWord.split(',')
        }
        if (v.sonContext && v.sonContext.length > 0) {
          v.sonContext = v.sonContext.map((value) => {
            value.keyWordArray = []
            if (value.keyWord) {
              value.keyWordArray = value.keyWord.split(',')
            }
            return value
          })
        }
        return v
      })
    }
    return item
  })
  return plates
}

function formatPlate (plates) {
  // 对kewWorld 做一下格式的转换
  // sort 应该修改下
  plates = formateKeyWord(plates)
  let length = plates.length
  for (let i = 0; i < length; i++) {
    plates[i].sort = i + 1
    if (i < length - 1) {
      plates[i].nextPlateName = plates[i + 1].name
      // 下一个版块破题是什么字
      plates[i].showAddBtn = false
      if (plates[i + 1].contexts[0].dialogues.length > 0) {
        plates[i].nextOpenDialogsFirst = plates[i + 1].contexts[0].dialogues[0].word || ''
      } else {
        plates[i].nextOpenDialogsFirst = ''
      }
    }
    if (plates[i].contexts) {
      let len = plates[i].contexts.length
      for (let j = 0; j < len; j++) {
        plates[i].contexts[j].showAddBtn = false
      }
    }
  }
  return plates
}
// 对版块重新排序
function sortByAuto (arr, initialSort, newSort) {
  let value = arr[initialSort]
  if (initialSort < newSort) {
    arr.splice(initialSort, 1)
    arr.splice(newSort, 0, value)
  } else if (initialSort > newSort) {
    arr.splice(initialSort, 1)
    arr.splice(newSort, 0, value)
  }
  arr = arr.map((item, index) => {
    item.sort = index + 1
  })
  return arr
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
