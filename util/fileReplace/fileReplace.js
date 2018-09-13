const { fileDisplay } = require('./../fileDispose/fileDisplay.js')
const { getNativeAddr, getNativeFile } = require('./../../getImgAddr/getImgAddr')
const { Files } = require('./../../util/fileSystem/Files')
const { path } = require('./../../util/main')
const _globalVar = require('../global/global')

function replaceMapSource(result) {
  // 替换 打包后的 mapsource文件
  const replaceChunks = result.filter(item => new RegExp(/\.js$/).test(item))
  const mapReg = /(sourceMappingURL=)[a-zA-Z0-9\u4e00-\u9fa5_./\-*&%$#@!~]*(\.map$)/g
  replaceChunks.forEach(item => {
    const file = new Files(item)
    let content = file.content
    if (typeof content === 'string') {
      content.match(mapReg) &&
        content.match(mapReg).forEach(items => {
          let replaceItem = items.replace('sourceMappingURL=', '')
          const result = getNativeFile(replaceItem)
          content = content.replace(items, `sourceMappingURL=${result}`)
        })
      file.writeMyFileAll(content)
    }
  })
  return replaceChunks || []
}

function chunkVendorResourcePath(assetsDir, result) {
  if (!assetsDir) {
    return []
  }
  const replaceChunks = result.filter(item => new RegExp('chunk-vendor').test(item))
  const fontReg = /(\/static\/web\/fonts\/)[a-zA-Z0-9\u4e00-\u9fa5_./\-*&%$#@!~]*(\.(woff2?|eot|ttf|otf)(\?#iefix)?)/gi
  replaceChunks.forEach(item => {
    const file = new Files(item)
    let content = file.content
    if (typeof content === 'string') {
      content.match(fontReg) &&
        content.match(fontReg).forEach(items => {
          const result = getNativeFile(items)
          content = content.replace(items, result)
        })
      file.writeMyFileAll(content)
    }
  })
  return replaceChunks || []
}
function replaceProloadChunks(addr) {
  const { fileUpdatePath, chunksPath } = _globalVar.getAll()
  const file = new Files(path.join(fileUpdatePath, addr))
  let resultHref = file.content.match(/=[/|.][a-zA-Z0-9\u4e00-\u9fa5_./\-*&%$#@!~]*/g)
  let content = file.content
  chunksPath.forEach(item => {
    const newReg = new RegExp(item)
    resultHref &&
      resultHref
        .filter(items => {
          return newReg.test(items)
        })
        .forEach(info => {
          const result = getNativeFile(item, info, true)
          content = content.replace(info, result)
        })
  })
  file.writeMyFileAll(content)
}

//  需要先分块获取 然后判断位置是在某个模块里
function searchFile(addr, model = 'find') {
  const replaceRegPng = /(?:['|"])[a-zA-Z0-9\u4e00-\u9fa5_\-*&%$#@!\/\\\\.]+(\.png|\.jpg|\.jpeg){1}(?:['|"])/g
  const replaceDep = fileDisplay(addr, model)
  const cssReg = /(\.css$)|(\.scss$)|(\.less$)/
  const dep = replaceDep.get()
  dep.forEach(element => {
    const file = new Files(element)
    const fileContent = file.readMyFile()
    const temp = fileContent.split('')
    const isCss = cssReg.test(element)
    const pointDep = getCommentsDepHtml(fileContent, isCss)
    file.writeMyFileAll(
      findMatch(
        fileContent,
        temp,
        fileContent.match(replaceRegPng),
        pointDep,
        path.parse(element).dir,
        element
      )
    )
  })
}

function aliasReplace(el) {
  // 替换别名
  let _$ = false
  const { alias, context } = _globalVar.getAll()
  if (Object.keys(alias).length !== '0') {
    for (let i in alias) {
      const reg = new RegExp(i + '(?=/)')
      const _el = el.replace(reg, alias[i])
      if (_el !== el) {
        _$ = _el.replace(context + '/', '').replace(/(\"|\')/, '')
      }
    }
  }
  return _$
}

function findMatch(str, strArr, matchArray, pointDep, dir, element) {
  // 替换主函数
  const cutNameReg = /[a-zA-Z0-9\u4e00-\u9fa5_\-*&%$#@!\\]*(?=\.png|\.jpg|\.jpeg){1}/g
  const cutFormReg = /(\.png$|\.jpe?g$)/g
  const matchDep = []
  let start = 0
  let end = 0
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
      strArr.splice(item.start, item.elLength, addr ? quota + addr + quota : item.el)
    }
  }
  return strArr.join('')
}

function getCommentsDepHtml(str) {
  // 返回注释的点阵区间
  const pointDep = []
  let strStart = 0
  let strEnd = 0
  const matchHtml = str.match(/<!--/gm)
  const matchCss = str.match(/\/\*/gm)
  const matchJs = str.match(/\/\/\s{1}/gm)
  const endLenHtml = 3
  const endLenCss = 2
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
    ;(strStart = 0), (strEnd = 0)
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
    ;(strStart = 0), (strEnd = 0)
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

function isComments(start, end, pointDep) {
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
  searchFile,
  replaceProloadChunks,
  chunkVendorResourcePath,
  replaceMapSource
}
