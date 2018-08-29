const { path } = require('./../util/main')
const { smallFileDep } = require('../util/fileDispose/fileDisplay.js')
const _globalVar = require('../util/global/global.js')

function getNativeAddr(addr, el, name, form) {
  const { result, staticSrc } = _globalVar.getAll()
  if (!addr) return false
  const content = result
  const detailSrc = 'https://ts.market.mi-img.com/thumbnail/png/q80/'
  const isSmall = smallFileDep.get().some(item => {
    return item === addr
  })
  if (isSmall) return false
  return content[addr]
    ? `${detailSrc}${content[addr]}`
    : el
      ? getNativeAddr(path.join(`${staticSrc}/images/`, `${name}${form}`))
      : false
}

function getNativeFile(el, info, equals) {
  const { result, base64List, host } = _globalVar.getAll()
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
    return `http://${host}${el}`
  }
  return resultText
    ? `${equals ? '=' : ''}https://ts.market.mi-img.com/download/${resultText}/a.${
        type === 'map' ? 'js.map' : type
      }`
    : info
}

module.exports = {
  getNativeAddr,
  getNativeFile
}
