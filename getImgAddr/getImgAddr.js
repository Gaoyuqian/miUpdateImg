const { path } = require('./../util/main')
const { smallFileDep } = require('../util/fileDispose/fileDisplay.js')
const _globalVar = require('../util/global/global.js')

function getNativeAddr (addr, el, name, form) {
  if (!addr) return false
  const {result, staticSrc} = _globalVar.getAll()
  const content = result
  const detailSrc = 'https://ts.market.mi-img.com/thumbnail/png/q80/'
  const isSmall = smallFileDep.get().some((item) => {
    return item === addr
  })
  if (isSmall) return false
  return content[addr] ? `${detailSrc}${content[addr]}` : el ? getNativeAddr(path.join(`${staticSrc}/images/`, `${name}${form}`)) : false
}

function getNativeFile (el) {
  const {result} = _globalVar.getAll()
  let resultText = ''
  Object.keys(result).forEach((items, index) => {
    let newReg = new RegExp(el)
    if (newReg.test(items)) {
      resultText = result[items]
    } else {
      const temp = el.split('/')
      const tempName = temp[temp.length - 1]
      newReg = new RegExp(tempName)
      if (newReg.test(items)) {
        resultText = result[items]
      }
    }
  })
  return `=https://ts.market.mi-img.com/download/${resultText}`
}
// 在依赖则添加到chunks里
// 模糊查询写成一个单独的函数吧  每次查询不到的时候 执行模糊查询函数 获取返回值
module.exports = {
  getNativeAddr, getNativeFile
}
