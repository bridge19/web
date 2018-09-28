import { arrayFind } from './util'
// function ValidatePasswordReg (v) {
//   let regNumber = /\d+/
//   let regLetter = /[a-zA-z]+/
//   var specialCharacters = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？_ -]")
//   if (!regNumber.test(v)) {
//     return false
//   }
//   if (!regLetter.test(v)) {
//     return false
//   }
//   if (!specialCharacters.test(v)) {
//     return false
//   }
//   if (!specialCharacters.test(v)) {
//     return false
//   }
//   let all = new RegExp('[\\s\\n\\t]')
//   if (all.test(v)) {
//     return false
//   }
//   return true
// }

let Vadilator = function () {}
Vadilator.prototype = {
  initConfig: {
    password: 'LANG1',
    integer: 'LANG4',
    positiveInt: 'LANG5',
    URL: 'LANG6',
    tel: 'LANG7',
    email: 'LANG8'
  },
  // 密码
  password (rule, value, callback, $t, myCallback) {
    if (!value) {
      return callback()
    } else if (value && (value.length < 8 || value.length > 16)) {
      return callback(new Error($t('LANG2')))
    } else if (value && !/([a-zA-Z0-9])/.test(value)) {
      return callback(new Error($t('LANG1')))
    }
    typeof myCallback === 'function' && myCallback()
    return callback()
  },
  // 密码
  confirmPassword (rule, value, callback, $t, value2) {
    if (!value || (value && value === value2)) {
      return callback()
    } else {
      return callback(new Error($t('LANG13')))
    }
  },
  // 整数
  integer: function (rule, value, callback, $t) {
    if (!value || (value && /^-?[0-9]\d*$/.test(value))) {
      return callback()
    } else {
      return callback(new Error($t('LANG4')))
    }
  },
  // 正整数
  positiveInt (rule, value, callback, $t) {
    if (!value || (value && /^[0-9]\d*$/.test(value))) {
      return callback()
    } else {
      return callback(new Error($t('LANG3')))
    }
  },
  // URL
  URL (rule, value, callback, $t) {
    let re = /^[a-zA-z]+:\/\/[^\s]*$/
    if (!value || (value && re.test(value))) {
      return callback()
    } else {
      return callback(new Error($t('LANG5')))
    }
  },
  // tel
  mobile (rule, value, callback, $t) {
    if (!value) {
      return callback()
    } else if (value.length !== 11) {
      return callback(new Error($t('LANG6')))
    } else if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
      return callback(new Error($t('LANG7')))
    }
    return callback()
  },
  // 固定电话
  tel (rule, value, callback, $t) {
    if (!value || /^0\d{2,3}-?\d{7,8}$/.test(value)) {
      return callback()
    } else {
      return callback(new Error($t('LANG15')))
    }
  },
  // email
  email (rule, value, callback, $t) {
    if (!value) {
      return callback()
    } else {
      let emailStr = value.split('@')[0]
      if (emailStr.length < 1 || emailStr.length > 18) {
        return callback(new Error($t('LANG9')))
      } else if (!/^([a-zA-Z0-9_])+@([a-zA-Z0-9_])+\.([a-zA-Z0-9_])+$/.test(value)) {
        return callback(new Error($t('LANG8')))
      }
    }
    return callback()
  },
  // account
  account (rule, value, callback, $t) {
    if (!value) {
      return callback()
    } else if (value.length < 8 || value.length > 16) {
      return callback(new Error($t('LANG11')))
    } else if (!/^([\\.a-zA-Z0-9_-])+$/.test(value)) {
      return callback(new Error($t('LANG10')))
    }
    return callback()
  },
    // companyName
  companyName (rule, value, callback, $t) {
    if (!value || (value && value.length < 32)) {
      return callback()
    } else {
      return callback(new Error($t('LANG12')))
    }
  },
  // 版块名称不能重复
  plateName (rule, value, callback, $t, comparedPlateNameArr) {
    let flag = arrayFind(comparedPlateNameArr, value)
    if (!value || !flag) {
      return callback()
    } else {
      return callback(new Error($t('LANG14')))
    }
  },
  // 英文汉字和数字可为空
  character (rule, value, callback) {
    if (!value) {
      return callback()
    } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value)) {
      return callback(new Error('只能输入英文，汉字，数字'))
    }
    return callback()
  }
}
export default new Vadilator()
