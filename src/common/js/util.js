/**
 * 判断某项是否存在数组内
 *
 * @param array 数组
 * @param val 要检查的项(只支持基本)
 * @returns {boolean}
 */
function arrayFind (array, val) {
  window.a = array
  if (
    array === undefined ||
    array === null ||
    val === undefined ||
    val === null ||
    !(array instanceof Array)
  ) {
    return false
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i] === val) {
      return true
    }
  }
  return false
}

function setCookie (cname, cvalue) { // cname 名字 // cvalue 值 // 存储cookie
  let d = new Date()
  let oneDay = 86399 * 1000 // 23:59:59
  let todayZero = new Date(new Date().toLocaleDateString()).getTime() + oneDay // 今天23:59:59
  d.setTime(todayZero)
  let expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/'
  // console.log(d)
}

function getCookie (cname) { // 获取cookie
  let name = cname + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(name) !== -1) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export {
  arrayFind,
  setCookie,
  getCookie
}

/**
 * 判断某项是否存在数组内
 *
 * @param array 数组
 * @param val 要检查的项(只支持基本)
 * @returns {boolean}
 */
