const { fileDisplay } = require('./../fileDispose/fileDisplay.js')
const {
  getNativeAddr,
  getThumbnailAddr
} = require('./../../getImgAddr/getImgAddr')
const { Files } = require('./../../util/fileSystem/Files')
const { Dep } = require('./../fileSystem/depend')

//  需要先分块获取 然后判断位置是在某个模块里
function searchFile(addr, model = 'find') {
  const replaceDep = new Dep()
  const replaceREG = /[^\:]src=(['|"](.*)['|"])\s/g
  fileDisplay(addr, replaceDep, false, model)
  const dep = replaceDep.get()
  dep.forEach(element => {
    const file = new Files(element)
    const fileContent = file.readMyFile()
    const temp = fileContent.split('')
    const matchArray = fileContent.match(replaceREG)
    const commentsDep = new Dep()
    const pointDep = getCommentsDep(fileContent, commentsDep)
    file.writeMyFileAll(
      findMatch(fileContent, commentsDep, temp, matchArray, pointDep)
    )
  })
}

function findMatch(str, commentsDep, strArr, matchArray, pointDep) {
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
      const isCom = isComments(start, end, commentsDep, pointDep)
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
        addr ? ' src="' + addr + '" ' : item.name
      )
    }
  }
  return strArr.join('')
}

function getCommentsDep(str, dep) {
  const pointDep = []
  let strStart = 0,strEnd = 0
  const endLen = 3,startLen = 4
  if (dep.get() && dep.get().length === 0) {
    dep.equals(str.match(/<!--/gm))
  }
  if (dep.get()) {
    for (let item of dep.get()) {
      const startIndex = str.substring(strEnd).indexOf('<!--')
      const endIndex = str.substring(strEnd).indexOf('-->')
      strStart = startIndex + strEnd
      strEnd += endIndex + endLen
      pointDep.push({
        start: strStart,
        end: strEnd
      })
    }
  }
  return pointDep
}

function isComments(start, end, dep, pointDep) {
  if (dep.get()) {
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
