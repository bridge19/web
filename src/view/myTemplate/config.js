// 语境类型
// import { arrayFind } from '@/common/js/util'

const situationType = {
  '0': '破题',
  '10': '肯定',
  '11': '中性',
  '12': '否定',
  '13': '拒绝',
  '19': '其他',
  '20': '查询',
  '30': '挽回',
  '31': '结束', // 返回不成功
  '32': '一次', // 自己定义的
  '33': '二次' // 自己定义的
}

// 页面中各种词性的排列顺序

const situationTypeSort = {
  '0': 1,
  '10': 2,
  '11': 3,
  '12': 4,
  '13': 5,
  '30': 6,
  '19': 7,
  '20': 8
}
const themeType = {
  1: '开场白',
  2: 'task',
  3: '邀约'
}
// 添加语境的时候，判断是否可以添加该语境
function canAddSituation (arr, wordClass) {
  let flag = true
  arr.map(item => {
    if (item.wordClass === wordClass) {
      flag = false
    }
  })
  return flag
}
export {
  situationType,
  themeType,
  canAddSituation,
  situationTypeSort
}
