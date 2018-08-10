const {fileDisplay} = require('./../fileDispose/fileDisplay.js')
const {getNativeAddr, getNativeFile} = require('./../../getImgAddr/getImgAddr')
const {Files} = require('./../../util/fileSystem/Files')
const {path} = require('./../../util/main')
const _globalVar = require('../global/global')

function replaceProloadStatic (addr) {
  const {fileUpdatePath} = _globalVar.getAll()
  const file = new Files(path.join(fileUpdatePath, addr))
  let resultHref = file.content.match(/=[/|.][a-zA-Z0-9\u4e00-\u9fa5_./\-*&%$#@!~]*/g)
  let content = file.content
  resultHref && resultHref.forEach((item) => {
    const len = item.split('/').length
    const result = getNativeFile(item.split('/')[len - 1])
    content = content.replace(item, result)
  })
  file.writeMyFileAll(content)
}

function replaceProloadChunks (addr) {
  const {fileUpdatePath, chunksPath} = _globalVar.getAll()
  const file = new Files(path.join(fileUpdatePath, addr))
  let resultHref = file.content.match(/=\/[a-zA-Z0-9\u4e00-\u9fa5_\-*&%$#@!/\\\\.]*/g)
  let content = file.content
  chunksPath.forEach((item) => {
    const newReg = new RegExp(item)
    resultHref && resultHref.filter((items) => {
      return newReg.test(items)
    }).forEach((info) => {
      const result = getNativeFile(item)
      content = content.replace(info, result)
    })
  })
  file.writeMyFileAll(content)
  replaceProloadStatic(addr)
}

//  需要先分块获取 然后判断位置是在某个模块里
function searchFile (addr, model = 'find') {
  const replaceRegPng = /(?:['|"])[a-zA-Z0-9\u4e00-\u9fa5_\-*&%$#@!\/\\\\.]+(\.png|\.jpg|\.jpeg){1}(?:['|"])/g
  const replaceDep = fileDisplay(addr, false, model)
  const cssReg = /(\.css$)|(\.scss$)|(\.less$)/
  const dep = replaceDep.get()
  dep.forEach(element => {
    const file = new Files(element)
    const fileContent = file.readMyFile()
    const temp = fileContent.split('')
    const isCss = cssReg.test(element)
    const pointDep = getCommentsDepHtml(fileContent, isCss)
    file.writeMyFileAll(
      findMatch(fileContent, temp, fileContent.match(replaceRegPng), pointDep, path.parse(element).dir, element)
    )
  })
}

function aliasReplace (el) {
  // 替换别名
  let _$ = false
  const { alias, context } = _globalVar.getAll()
  if (Object.keys(alias).length !== '0') {
    for (let i in alias) {
      const reg = new RegExp(i + '(?=\/)')
      const _el = el.replace(reg, alias[i])
      if (_el !== el) {
        _$ = _el.replace(context + '/', '').replace(/(\"|\')/, '')
      }
    }
  }
  return _$
}

function findMatch (str, strArr, matchArray, pointDep, dir, element) {
  // 替换主函数
  const cutNameReg = /[a-zA-Z0-9\u4e00-\u9fa5_\-*&%$#@!\\]*(?=\.png|\.jpg|\.jpeg){1}/g
  const cutFormReg = /(\.png|\.jpg|\.jpeg)/g
  const matchDep = []
  let start = 0,
    end = 0
  matchArray &&
    matchArray.forEach(el => {
      const matchAddr = aliasReplace(el) || path.join(dir, path.normalize(el.replace(/['|"]/g, '')))
      const elLength = el.length
      start = str.indexOf(el)
      for (let point of matchDep) {
        if (point.addr === matchAddr) {
          // 如果重复 则从下一个开始找
          start = str.indexOf(el, point.end)
        }
      }
      end = start + elLength
      const isCom = isComments(start, end, pointDep)
      matchDep.push({
        addr: matchAddr,
        start: start,
        end: end,
        isCom: isCom,
        elLength: elLength,
        el: el,
        file: element,
        name: el.match(cutNameReg)[0],
        form: el.match(cutFormReg)[0]
      })
    })
  for (let item of matchDep.reverse()) {
    const quota = /\'/.test(item.el) ? `'` : `"`
    if (!item.isCom) {
      const addr = getNativeAddr(item.addr, item.el, item.name, item.form)
      strArr.splice(
        item.start,
        item.elLength,
        addr ? quota + addr + quota : item.el
      )
    }
  }
  return strArr.join('')
}

function getCommentsDepHtml (str) {
  // 返回注释的点阵区间
  const pointDep = []
  let strStart = 0,
    strEnd = 0
  const matchHtml = str.match(/<!--/gm)
  const matchCss = str.match(/\/\*/gm)
  const matchJs = str.match(/\/\/\s{1}/gm)
  const endLenHtml = 3,
    endLenCss = 2
  if (matchHtml) {
    for (let item of matchHtml) {
      const startIndex = str.substring(strEnd).indexOf('<!--')
      const endIndex = str.substring(strEnd).indexOf('-->')
      strStart = startIndex + strEnd
      strEnd += endIndex + endLenHtml
      pointDep.push({
        start: strStart,
        end: strEnd
      })
    }
  }
  if (matchCss) {
    strStart = 0, strEnd = 0
    for (let item of matchCss) {
      const startIndex = str.substring(strEnd).indexOf('/*')
      const endIndex = str.substring(strEnd).indexOf('*/')
      strStart = startIndex + strEnd
      strEnd += endIndex + endLenCss
      pointDep.push({
        start: strStart,
        end: strEnd
      })
    }
  }
  //  由于/n 并不是紧跟着 // 一起出现 所以造成差异
  if (matchJs) {
    strStart = 0, strEnd = 0
    for (let item of matchJs) {
      const startIndex = str.substring(strEnd).indexOf('// ')
      // startIndex 是注释的开头坐标 基于上一个注释的结尾坐标获取的
      // endIndex 是从注释开头的坐标到该注释结尾的坐标 基于注释开头坐标获取的
      // 注释结尾是相对于注释开头坐标计算长度
      const endIndex = str.substring(startIndex + strEnd).indexOf('\n')
      strStart = startIndex + strEnd
      strEnd = endIndex + startIndex + strEnd
      pointDep.push({
        start: strStart,
        end: strEnd
      })
    }
  }
  return pointDep
}

function isComments (start, end, pointDep) {
  // 判断是否是注释中的
  if (pointDep.length !== 0) {
    for (let item of pointDep) {
      if (start > item.start && end < item.end) {
        return true
      }
    }
  }
  return false
}

module.exports = {
  searchFile, replaceProloadChunks
}
