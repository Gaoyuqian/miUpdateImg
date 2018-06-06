const { fileDisplay } = require('./../fileDispose/fileDisplay.js')
const {
  getNativeAddr,
  getThumbnailAddr
} = require('./../../getImgAddr/getImgAddr')
const { Files } = require('./../../util/fileSystem/Files')
// const { Dep } = require('./../fileSystem/depend')

//  需要先分块获取 然后判断位置是在某个模块里
function searchFile(addr, model = 'find') {
  const replaceRegHtml = /[^\:]src=['|"](\S*)['|"]/g
  const replaceRegCss = /['|"](.*[^\.css|\.scss|\.less|\{\}\$])['|"]/g
  const replaceDep = fileDisplay(addr, false, model)  
  const cssReg = /(\.css$)|(\.scss$)|(\.less$)/
  const dep = replaceDep.get()
  dep.forEach(element => {
    const file = new Files(element)
    const fileContent = file.readMyFile()
    const temp = fileContent.split('')
    const isCss = cssReg.test(element)    
    const matchArray =!isCss? fileContent.match(replaceRegHtml):fileContent.match(replaceRegCss)
    const pointDep = getCommentsDepHtml(fileContent,isCss)
    file.writeMyFileAll(
      findMatch(fileContent, temp, matchArray, pointDep,isCss)
    )
  })
}

function findMatch(str, strArr, matchArray, pointDep,isCss) {
  const http = /http\:|https\:/
  const matchDep = []
  let start = 0,
    end = 0
  matchArray &&
    matchArray.forEach(el => {
      const elLength = el.length
      start = str.indexOf(el)
      for (let point of matchDep) {
        if (point.name == el) {
          start = str.indexOf(el, point.end)
        }
      }
      if (matchDep.length == 0) {
        start = str.indexOf(el)
      }
      end = start + elLength
      const isCom = isComments(start, end, pointDep)
      matchDep.push({
        name: el,
        start: start,
        end: end,
        isCom: isCom,
        elLength: elLength
      })
    })
  for (let item of matchDep.reverse()) {
    if (!http.test(item.name) && !item.isCom) {
      const addr = getNativeAddr(item.name)
      
      strArr.splice(
        item.start,
        item.elLength,
        addr ? !isCss?' src="' + addr + '" ' : `'${addr}'` : item.name
      )
    }
  }
  return strArr.join('')
}

function getCommentsDepHtml(str,isCss) {
  // 返回注释的点阵区间
  const pointDep = []
  const matchHtml = str.match(/<!--/gm)
  let strStartHtml = 0,strEndHtml = 0
  const endLenHtml = 3,startLenHtml = 4
  const matchCss = str.match(/\/\*/gm)
  let strStartCss = 0,strEndCss = 0
  const endLenCss = 2,startLenCss = 2
  if (matchHtml) {
    for (let item of matchHtml) {
      const startIndex = str.substring(strEndHtml).indexOf('<!--')
      const endIndex = str.substring(strEndHtml).indexOf('-->')
      strStartHtml = startIndex + strEndHtml
      strEndHtml += endIndex + endLenHtml
      pointDep.push({
        start: strStartHtml,
        end: strEndHtml
      })
    }
  }
  if(matchCss){
    for (let item of matchCss) {
      const startIndex = str.substring(strEndCss).indexOf('/*')
      const endIndex = str.substring(strEndCss).indexOf('*/')
      strStartCss = startIndex + strEndCss
      strEndCss += endIndex + endLenCss
      pointDep.push({
        start: strStartCss,
        end: strEndCss
      })
    }
  }
  return pointDep
}

function isComments(start, end, pointDep) {
  if (pointDep.length!==0) {
    for (let item of pointDep) {
      if (start > item.start && end < item.end) {
        return true
      }
    }
  }
  return false
}

module.exports = {
  searchFile
}
