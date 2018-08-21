const { path, chalk } = require('./../util/main')
const { smallFileDep } = require('../util/fileDispose/fileDisplay.js')
const _globalVar = require('../util/global/global.js')
const {getFileMap} = require('../util/fileUtil/util')
function getNativeAddr (addr, el, name, form) {
  const {result, staticSrc} = _globalVar.getAll()
  if (!addr) return false
  const content = result
  const detailSrc = 'https://ts.market.mi-img.com/thumbnail/png/q80/'
  const isSmall = smallFileDep.get().some((item) => {
    return item === addr
  })
  if (isSmall) return false
  return content[addr] ? `${detailSrc}${content[addr]}` : el ? getNativeAddr(path.join(`${staticSrc}/images/`, `${name}${form}`)) : false
}

function getNativeFile (el, info, equals) {
  const {result, base64List} = _globalVar.getAll()
  let resultText = ''
  const typeTemp = el.split('.')
  const type = typeTemp[typeTemp.length - 1]
  Object.keys(result).forEach(items => {
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
  if (base64List && base64List.some(item => new RegExp(item).test(type))) {
    const src = `https://ts.market.mi-img.com/download/${resultText}/a.${type}`
    return `${JSON.stringify(`data:${getFileMap(type) || ''};base64,${Buffer.from(src).toString('base64')}`)}`
  }
  return resultText ? `${equals ? '=' : ''}https://ts.market.mi-img.com/download/${resultText}/a.${type}` : info
}
// 在依赖则添加到chunks里
// 模糊查询写成一个单独的函数  每次查询不到的时候 执行模糊查询函数 获取返回值
module.exports = {
  getNativeAddr, getNativeFile
}
