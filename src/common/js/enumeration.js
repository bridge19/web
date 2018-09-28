const industry = [{
  value: 'A',
  label: '农、牧、林、渔业'
}, {
  value: 'B',
  label: '采矿和采石'
}, {
  value: 'C',
  label: '制造业'
}, {
  value: 'D',
  label: '电、煤气、蒸汽和空调供应'
}, {
  value: 'E',
  label: '供水、污水处理、废物管理和补旧'
}, {
  value: 'F',
  label: '建筑业'
}, {
  value: 'G',
  label: '批发和零售业；汽车和摩托车修理'
}, {
  value: 'H',
  label: '运输与存储'
}, {
  value: 'I',
  label: '食宿服务'
}, {
  value: 'J',
  label: '信息和通信'
}, {
  value: 'K',
  label: '金融和保险'
}, {
  value: 'L',
  label: '房地产'
}, {
  value: 'M',
  label: '专业、科学和通信'
}, {
  value: 'N',
  label: '行政和辅助'
}, {
  value: 'O',
  label: '公共管理与国防；强制性社会保障'
}, {
  value: 'P',
  label: '教育'
}, {
  value: 'Q',
  label: '人体健康和社会工作'
}, {
  value: 'R',
  label: '艺术、娱乐和文娱'
}, {
  value: 'S',
  label: '其他服务'
}, {
  value: 'T',
  label: '家庭作为雇主的；家庭自用、未加区分的物品生产和服务'
}, {
  value: 'U',
  label: '国际机构组织'
}]

let industryObj = {}
industry.map((item) => {
  industryObj[item.value] = item.label
})

// 模版的状态值
const templateStatus = {
  'null': '全部',
  0: '创建',
  1: '可提交',
  5: '可文字试用',
  10: '可文字试用通过',
  11: '可录音通过',
  15: '可语音试用',
  20: '可语音试用通过',
  21: '可发布',
  30: '已发布'
}

// 模版的状态值
const templateStatusTable = {
  'null': '全部',
  0: '待录入',
  1: '待录入',
  5: '待文字试用',
  10: '待文字试用',
  11: '待录音',
  15: '待语音试用',
  20: '待语音试用',
  21: '待发布',
  30: '使用中'
}

// 样板的状态值
const sampleStatus = {
  'null': '全部',
  10: '待发布',
  20: '使用中',
  90: '已停用'
}

export {
  industry,
  industryObj,
  templateStatus,
  templateStatusTable,
  sampleStatus
}
