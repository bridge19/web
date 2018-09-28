// 语境类型
import { arrayFind } from '@/common/js/util'
const SituationType = {
  0: '破题',
  1: '肯定',
  2: '中性',
  3: '否定',
  4: '拒绝',
  5: '特殊',
  6: '问题忽略',
  7: '问题统一回答',
  8: '超时0.5秒',
  9: '超时4秒',
  10: '其他任何',
  // 11: '挽回不成功结束',
  12: '成功结束',
  13: '中性结束',
  14: '自定义结束'
}

const SituationType1 = [
  {
    value: 1,
    label: '肯定'
  },
  {
    value: 2,
    label: '中性'
  }, {
    value: 3,
    label: '否定'
  }, {
    value: 4,
    label: '拒绝'
  }, {
    value: 5,
    label: '特殊'
  }, {
    value: 6,
    label: '问题忽略'
  }, {
    value: 7,
    label: '问题统一回答'
  }, {
    value: 8,
    label: '超时0.5秒'
  }, {
    value: 9,
    label: '超时4秒'
  }, {
    value: 10,
    label: '其他任何'
  }
]

const plateType = {
  0: '问候',
  2: '开场白',
  4: '邀约',
  6: '结束',
  8: '标准板块'
}

function setNextType (nextPlateName) {
  return {
    1: `当前板块内判断`,
    2: '进入挽回',
    0: `进入标准板块`,
    3: '进入邀约',
    4: '结束',
    // 5: '进入下一板块',
    6: '挂断'
  }
}
const setNextType1 = [
  {
    value: '进入挽回',
    label: '2'
  }, {
    value: '进入标准板块',
    label: '0'
  },
  {
    value: '当前板块内判断',
    label: '1'
  },
  {
    value: '进入邀约',
    label: '3'
  },
  {
    value: '结束',
    label: '4'
  },
  {
    value: '挂断',
    label: '6'
  }
]
// 设置 AI 流程 radio
function showNextType0 (situationType) {
  let type = Number(situationType)
  if (type === 2 || type === 4 || type === 6) {
    return true
  } else {
    return false
  }
}
function showNextType2 (situationType) {
  let type = Number(situationType)
  if (type === 2 || type === 4 || type === 6) {
    return true
  } else {
    return false
  }
}
function showNextType4 (situationType) {
  let type = Number(situationType)
  if (type === 2) {
    return false
  } else {
    return true
  }
}
function showNextType6 (situationType) {
  let type = Number(situationType)
  if (type === 2) {
    return false
  } else {
    return true
  }
}
function showNextType8 (situationType) {
  let type = Number(situationType)
  if (type === 8) {
    return true
  } else {
    return false
  }
}
// 判断是不是出现添加对话按钮
function showAddDialogues (nextType) {
  let flag = true
  switch (nextType) {
    case 0 :
      flag = false
      break
    case 2:
      flag = false
      break
    case 4:
      flag = false
      break
    case 6:
      flag = true
      break
    case 8:
      flag = false
      break
    default:
      flag = true
      break
  }
  return flag
}
// 判断关键词是不是超过16个字

// 判断是否可以点击添加dialogues
function canAddDialogues (dialoguesArr) {
  let flag = true
  let length = dialoguesArr.length
  if (length > 0) {
    for (let i = 0; i < length; i++) {
      if (!dialoguesArr[i].word) {
        flag = false
        break
      }
    }
  }
  return flag
}

// 找出所有的关键词,要把相同的剔除
function findAllKeyWord (keyWordArr, index) {
  if (!(keyWordArr instanceof Array)) {
    return []
  }
  let arr = []
  keyWordArr.map((item, i) => {
    if (i !== index) {
      arr = arr.concat(item.keyWordArray)
    }
  })
  return arr
}

// 判断关键词是否重复
function isRepeated (newArr, oldArr) {
  if (
    !(oldArr instanceof Array) ||
    !(newArr instanceof Array)
  ) {
    return false
  }
  let flag = false
  let length = newArr.length
  if (length > 0) {
    for (let i = 0; i++; i < length) {
      // 找到一个相同的就不行
      if (arrayFind(newArr[i], oldArr)) {
        flag = true
        break
      }
    }
  }
  return flag
}

// 判断 各种语境中 nextType 选项的出现与否
function computedNextType (plateType, situationType, nextType) {
  nextType = parseInt(nextType)
  if (plateType !== 4) {
    // 邀约的情况
    if (situationType === 1 || situationType === 2) {
      if (nextType === 6) {
        return false
      } else {
        if (nextType === 0 || nextType === 3) {
          return true
        } else {
          return false
        }
      }
    } else if (situationType === 3 || situationType === 4) {
      if (nextType === 6 || nextType === 1) {
        return false
      } else {
        return true
      }
    } else {
      if (nextType === 6) {
        return false
      } else {
        return true
      }
    }
  } else {
    // 标准板块/开场白
    if (nextType === 0 || nextType === 1 || nextType === 3) {
      return false
    } else {
      if (situationType === 1 || situationType === 2) {
        if (nextType === 2) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }
  }
}

// 获取结束板块的所有选项
function getFinishOptions (plates) {
  // let plates = this.plates
  let contexts = plates[plates.length - 1].contexts
  let arr = []
  contexts.map(item => {
    let id = (item.id)
    let name = SituationType[item.type]
    let res = {
      label: name,
      value: id
    }
    arr.push(res)
  })
  return arr
}

// 获取 标准板块的所有选项
function getStandardOptions (plates) {
  let arr = []
  plates.map(item => {
    if (item.type === 8) {
      let id = (item.id)
      let name = item.name
      let res = {
        label: name,
        value: id
      }
      arr.push(res)
    }
  })
  return arr
}

export {
  SituationType,
  SituationType1,
  plateType,
  setNextType,
  setNextType1,
  showNextType0,
  showNextType2,
  showNextType4,
  showNextType6,
  showNextType8,
  showAddDialogues,
  canAddDialogues,
  findAllKeyWord,
  isRepeated,
  computedNextType,
  getFinishOptions,
  getStandardOptions
}
