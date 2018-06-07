const { fileDisplay } = require('./../fileDispose/fileDisplay.js')
const {
  getNativeAddr,
  getThumbnailAddr
} = require('./../../getImgAddr/getImgAddr')
const { Files } = require('./../../util/fileSystem/Files')

//  需要先分块获取 然后判断位置是在某个模块里
function searchFile(addr, model = 'find') {
  const replaceRegHtml = /[^\:]src=['|"](\S*)['|"]/g
  const replaceRegCss = /url\(['|"](.*[^\.css|\.scss|\.less|\{\}\$])['|"]\)/g
  const replaceDep = fileDisplay(addr, false, model)  
  const cssReg = /(\.css$)|(\.scss$)|(\.less$)/
  const dep = replaceDep.get()
  dep.forEach(element => {
    const file = new Files(element)
    // const pointDep = new dep()
    const fileContent = file.readMyFile()
    const temp = fileContent.split('')
    const isCss = cssReg.test(element) 
    const matchHtml = fileContent.match(replaceRegHtml)
    const matchCss = fileContent.match(replaceRegCss)
    const matchJs = fileContent.match(replaceRegJs)
    // if(fileContent.match(replaceRegHtml)){
    //   if(fileContent.match(replaceRegCss)){
    //     matchHtml = fileContent.match(replaceRegHtml).concat(fileContent.match(replaceRegCss))
    //   }else{
    //     matchHtml = fileContent.match(replaceRegHtml)
    //   }
    // }else{
    //   matchHtml = fileContent.match(replaceRegCss)
    // }
    // const temp1 = fileContent.match(replaceRegHtml)?fileContent.match(replaceRegCss)?:fileContent.match(replaceRegHtml).concat(fileContent.match(replaceRegCss)):fileContent.match(replaceRegCss)
    // const temp1 = fileContent.match(replaceRegHtml)?fileContent.match(replaceRegHtml).concat(fileContent.match(replaceRegCss)):fileContent.match(replaceRegCss)
    // const matchArray =!isCss? matchHtml : fileContent.match(replaceRegCss)
    // console.log(matchArray,element)
    const pointDep = getCommentsDepHtml(fileContent,isCss)
    file.writeMyFileAll(
      findMatch(fileContent, temp, matchArray, pointDep,isCss)
    )
  })
}
/*
 *
 * 
 * vue css文件可以同时获取所有的注释点阵
 * 期望vue文件也可以替换写在style标签内和script标签内的指定格式的图片文件 
 * 
 * 得把css样式替换的内容和html替换的内容分开替换！！！！
 * 则不应该使用一个matchArray
 * 
 */

function getCommentsHtml(){
  const matchHtml = str.match(/<!--/gm)  
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
  return pointDep  
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
          // 如果重复 则从下一个开始找
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
      //或者不判断iscss 而判断匹配出来的是否是css格式的
      strArr.splice(
        item.start,
        item.elLength,
        addr ? !isCss?' src="' + addr + '" ' : `'${addr}'` : item.name
      )
    }
  }
  return strArr.join('')
}

function getCommentsDepHtml(str) {
  // 返回注释的点阵区间
  const pointDep = []
  let strStart = 0,strEnd = 0
  const matchHtml = str.match(/<!--/gm)  
  const matchCss = str.match(/\/\*/gm)
  const matchJs = str.match(/\/\/\s{1}/gm)  
  const endLenHtml = 3,endLenCss = 2
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
  if(matchCss){
    strStart = 0,strEnd = 0
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
  if(matchJs){
    strStart = 0,strEnd = 0
    for (let item of matchJs) {
      const startIndex = str.substring(strEnd).indexOf('// ')
      // startIndex 是注释的开头坐标 基于上一个注释的结尾坐标获取的
      // endIndex 是从注释开头的坐标到该注释结尾的坐标 基于注释开头坐标获取的 
      // 注释结尾是相对于注释开头坐标计算长度
      const endIndex = str.substring(startIndex+strEnd).indexOf('\n')

      strStart = startIndex + strEnd
      strEnd = endIndex + startIndex + strEnd
      // console.log(strStart,strEnd,startIndex,endIndex)
      pointDep.push({
        start: strStart,
        end: strEnd
      })
    }
  }
  // pointDep.forEach( el => {
  //     console.log(str.substring(el.start,el.end))
  // })
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
