
import {post, fetch} from '@/service/http'
import { situationTypeSort } from '@/view/myTemplate/config'
import Vue from 'vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// initialState
// let initialTemplate = {
//   'subjectId': 1,
//   theme: [{
//     'id': '1',
//     initialAuestionContent: '111',
//     'questionContent': '111',
//     'wordClass': 0,
//     'showAddBtn': false,
//     'sonModel': [{
//       'id': '2',
//       initialAuestionContent: '222',
//       'questionContent': '222',
//       'wordClass': 10,
//       'showAddBtn': false,
//       'sonModel': [{
//         'parentId': 0,
//         'id': '3',
//         initialAuestionContent: '333',
//         'questionContent': '333',
//         'wordClass': 10,
//         'showAddBtn': false
//       }]
//     }]
//   }, {
//     'id': '4',
//     initialAuestionContent: '999',
//     'questionContent': '999',
//     'wordClass': 10,
//     'showAddBtn': false,
//     'parentId': 0,
//     'sonModel': [{
//       'id': '5',
//       initialAuestionContent: 'ttt',
//       'questionContent': 'ttt',
//       'wordClass': 12,
//       'showAddBtn': false,
//       'sonModel': [{
//         'id': '6',
//         initialAuestionContent: 'ttt',
//         'questionContent': 'ttt',
//         'wordClass': 10,
//         'showAddBtn': false
//       }]
//     }]
//   }]
// }

// let treeList = [{
//   'intentId': null,
//   'intentName': null,
//   'sort': 1,
//   'subjectId': 1,
//   'subjectName': '开场白',
//   'subjectType': 1
// }, {
//   'intentId': 1,
//   'intentName': '黄金糕',
//   'sort': 2,
//   'subjectId': 2,
//   'subjectName': '11',
//   'subjectType': 'task'
// }, {
//   'intentId': null,
//   'intentName': null,
//   'sort': 3,
//   'subjectId': 3,
//   'subjectName': '开场白',
//   'subjectType': 3
// }]
const state = {
  templateId: null, // 当前模版的ID
  type: 0, // 0 全局  1 非全局
  templateStatus: 10, // 模版状态，默认待录入
  treeList: [], // 目录树
  // 当前的模板信息
  activeTreeItem: {
  }, // 左边操作树 activeTree
  subjectTemplate: {
    subjectId: null,
    theme: []
  },
  hasDeletedList: []   // 删除的ID集合
}

// getters
const getters = {
}

// actions
const actions = {
  // 获取全局文件夹树目录
  getTreeList ({commit, state, rootState}, payload) {
    return new Promise((resolve, reject) => {
      let type = state.type
      let url = ''
      if (type === 0) {
        url = 'sample/subject/get/list '
      } else {
        url = '/template/subject/get/list'
      }
      let params = {
        sampleId: state.templateId
      }
      post(url, params)
      .then(res => {
        if (res.code === '200') {
          let treeList = res.data
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
  // 获取各个主题的信息
  getSubjectTemplate ({commit, state, rootState}, payload) {
    return new Promise((resolve, reject) => {
      let subjectId = state.activeTreeItem.subjectId
      let type = state.type
      let url = ''
      if (type === 0) {
        url = `/sample/subject/get/policy`
      } else {
        url = `/template/subject/get/policy`
      }
      post(url, {subjectId})
        .then((res) => {
          if (res.code === '200') {
            let template = res.data
            template = formatTheme(template)
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
  // 获取模版当前的状态
  getTemplateStatus ({commit, state, rootState}, payload) {
    let type = state.type
    if (type === 0) {
      return false
    }
    return new Promise((resolve, reject) => {
      let url = ''
      let templateId = state.templateId
      url = '/template/status'
      fetch(url, {
        templateId: templateId
      })
        .then((res) => {
          if (res.code === '200') {
            let status = res.data
            commit({
              type: 'set-template-status',
              templateStatus: status
            })
            resolve(res)
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
  }
}
// 提交模板

// mutations
const mutations = {
  // setInitialstate

  'set-initial-state': (state, payload) => {
    state.treeList = []
    state.activeTreeItem = {}
    state.subjectTemplate = {
      subjectId: null,
      theme: []
    }
    state.hasDeletedList = []
    state.templateStatus = 0 // 模版初始状态
  },
  // 设置全局文件夹树目录
  'set-folder-list': (state, payload) => {
    state.treeList = payload.list
  },
  // 设置当前模板Id
  'set-templateId': (state, payload) => {
    state.templateId = payload.templateId
  },
  // 设置当前是否为全局
  'set-type': (state, payload) => {
    state.type = payload.type
  },
  // 设置当前模版的主题Id
  'set-activeTreeItem': (state, payload) => {
    state.activeTreeItem = payload.activeTreeItem
  },
  //  设置删除的词性ID
  'set-delete-ID': (state, payload) => {
    state.hasDeletedList.push(payload.id)
  },
  // 清空ID 数组
  'celear-ID': () => {
    state.hasDeletedList = []
  },
  // 设置当前模版状态
  'set-template-status': (state, payload) => {
    state.templateStatus = payload.templateStatus
  },
  // 设置初始模板信息
  'set-initial-template': (state, payload) => {
    state.subjectTemplate = {
      subjectId: state.activeTreeItem.subjectId,
      theme: payload.template
    }
  },
  // 增加一级词性
  'add-first-situation': (state, payload) => {
    let content = payload.content
    let theme = state.subjectTemplate.theme
    theme.push(content)
    state.subjectTemplate.theme = sortByWordClass(theme)
    //
  },
  // 删除一级词性
  'delete-first-situation': (state, payload) => {
    let firstIndex = payload.firstIndex
    let theme = state.subjectTemplate.theme
    theme.splice(firstIndex, 1)
  },

  // 设置模板一级对话中的内容
  'set-first-word': (state, payload) => {
    let firstIndex = payload.firstIndex
    let value = payload.value
    let theme = state.subjectTemplate.theme
    theme[firstIndex].questionContent = value
  },

  // 设置模版一级对话中是否转人工
  'set-first-isCallManage': (state, payload) => {
    let firstIndex = payload.firstIndex
    let isCallManager = payload.isCallManager
    let theme = state.subjectTemplate.theme
    theme[firstIndex].isCallManager = isCallManager
  },

  // 设置模版一级中 show 按钮
  'set-first-addBtn-show': (state, payload) => {
    let firstIndex = payload.firstIndex
    let show = payload.show
    let theme = state.subjectTemplate.theme
    theme[firstIndex].showAddBtn = show
  },

  // 增加二级词性
  'add-second-situation': (state, payload) => {
    let firstIndex = payload.firstIndex
    let content = payload.content
    let theme = state.subjectTemplate.theme
    let sonModel = theme[firstIndex].sonModel
    sonModel.push(content)
    theme[firstIndex].sonModel = sortByWordClass(sonModel)
  },
  // 删除二级词性
  'delete-second-situation': (state, payload) => {
    let firstIndex = payload.firstIndex
    let secondIndex = payload.secondIndex
    let theme = state.subjectTemplate.theme
    theme[firstIndex].sonModel.splice(secondIndex, 1)
  },

  // 设置二级对话中的内容
  'set-second-word': (state, payload) => {
    let firstIndex = payload.firstIndex
    let secondIndex = payload.secondIndex
    let value = payload.value
    let theme = state.subjectTemplate.theme
    theme[firstIndex].sonModel[secondIndex].questionContent = value
  },

  // 设置模版二级对话中是否转人工
  'set-second-isCallManage': (state, payload) => {
    let firstIndex = payload.firstIndex
    let secondIndex = payload.secondIndex
    let isCallManager = payload.isCallManager
    let theme = state.subjectTemplate.theme
    theme[firstIndex].sonModel[secondIndex].isCallManager = isCallManager
  },

  // 设置模版二级中 show 按钮
  'set-second-addBtn-show': (state, payload) => {
    let firstIndex = payload.firstIndex
    let secondIndex = payload.secondIndex
    let show = payload.show
    let theme = state.subjectTemplate.theme
    theme[firstIndex].sonModel[secondIndex].showAddBtn = show
  },
  // 增加三级词性
  'add-third-situation': (state, payload) => {
    let firstIndex = payload.firstIndex
    let secondIndex = payload.secondIndex
    let content = payload.content
    let theme = state.subjectTemplate.theme
    let sonModel = theme[firstIndex].sonModel[secondIndex].sonModel
    sonModel.push(content)
    theme[firstIndex].sonModel[secondIndex].sonModel = sortByWordClass(sonModel)
  },
  // 删除三级词性
  'delete-third-situation': (state, payload) => {
    let firstIndex = payload.firstIndex
    let secondIndex = payload.secondIndex
    let thirdIndex = payload.thirdIndex
    let theme = state.subjectTemplate.theme
    theme[firstIndex].sonModel[secondIndex].sonModel.splice(thirdIndex, 1)
  },

  // 设置三级对话中的内容
  'set-third-word': (state, payload) => {
    let firstIndex = payload.firstIndex
    let secondIndex = payload.secondIndex
    let thirdIndex = payload.thirdIndex
    let value = payload.value
    let theme = state.subjectTemplate.theme
    theme[firstIndex].sonModel[secondIndex].sonModel[thirdIndex].questionContent = value
  },
  // 设置三级对话中的内容
  'set-third-isCallManage': (state, payload) => {
    let firstIndex = payload.firstIndex
    let secondIndex = payload.secondIndex
    let thirdIndex = payload.thirdIndex
    let isCallManager = payload.isCallManager
    let theme = state.subjectTemplate.theme
    theme[firstIndex].sonModel[secondIndex].sonModel[thirdIndex].isCallManager = isCallManager
  }
}

// 对 template 格式进行修改
function formatTheme (template) {
  let res = template.map(item => {
    item.showAddBtn = false
    item.initialQuestionContent = item.questionContent
    item.initialIsCallManager = item.isCallManager
    if (!item.sonModel) {
      item.sonModel = []
    }
    if (item.sonModel && item.sonModel.length > 0) {
      item.sonModel = item.sonModel.map(v => {
        v.showAddBtn = false
        v.initialQuestionContent = v.questionContent
        v.initialIsCallManager = v.isCallManager
        if (!v.sonModel) {
          v.sonModel = []
        }
        if (v.sonModel && v.sonModel.length > 0) {
          v.sonModel = v.sonModel.map(j => {
            j.showAddBtn = false
            j.initialQuestionContent = j.questionContent
            j.initialIsCallManager = j.isCallManager
            return j
          })
        }
        return v
      })
    }
    return item
  })
  return res
}

// 重新排序
function sortByWordClass (arr) {
  if (!arr) {
    return []
  }
  var compare = function (obj1, obj2) { // 比较函数
    var val1 = obj1.sortBy
    var val2 = obj2.sortBy
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
  let res = arr.map(item => {
    let wordClass = item.wordClass
    item.sortBy = situationTypeSort[wordClass]
    return item
  })
  res = res.sort(compare)
  return res
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
