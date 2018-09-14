const {fileDisplay} =require('./../fileDispose/fileDisplay.js')
const {getNativeAddr,getThumbnailAddr} = require('./../../getImgAddr/getImgAddr')
const {Files} = require('./../../util/fileSystem/Files')
const {Dep} = require('./../fileSystem/depend')
var arr = []
function searchFile(addr,model='find'){
    const replaceDep = new Dep();
    /*
    
        fn:读取将被替换的文件文件 获取src的位置 进行替换

        return undef
    */   
    // const replaceREG = /src=(['|"](.*)['|"])\s/g    
    const replaceREG = /[^\:]src=(['|"](.*)['|"])\s/g    

    const http = /http|https/
    fileDisplay(addr,replaceDep,false,model)
    const dep = replaceDep.get();
    dep.forEach(element => {
        let file = new Files(element) 
        let fileContent = file.readMyFile()
        let temp = fileContent.split('')
        let matchArray = fileContent.match(replaceREG)
        const commentsDep = new Dep();
        matchArray&&matchArray.reverse().forEach(el=>{
            let startTem = temp.join('').indexOf(el)
            let endTem = el.length
            if(!http.test(el)){
                if(!isComments(temp.join(''),startTem,startTem+endTem,commentsDep)){
                    var addr = getNativeAddr(el)
                    temp.splice(startTem,endTem,addr?' src="'+addr+'" ':el)   
                    // 由于splice所填充进数组的值 只在数组中占一个地址 所以需要重新转化
                    temp = temp.join('').split('') 
                }
            }
        })
        file.writeMyFileAll(temp.join(''))         
    });
    
}

//  需要先分块获取 然后判断位置是在某个模块里
function test(addr,model='find'){
  const replaceDep = new Dep();
  
  const replaceREG = /[^\:]src=(['|"](.*)['|"])\s/g    

  const http = /http|https/
  fileDisplay(addr,replaceDep,false,model)
  const dep = replaceDep.get();
  dep.forEach(element => {
      let file = new Files(element) 
      let fileContent = file.readMyFile()
      let temp = fileContent.split('')
      let matchArray = fileContent.match(replaceREG)
      const commentsDep = new Dep();
      console.log(matchArray)
      let total = 0
      findMatch1(temp.join(''),commentsDep,temp,matchArray)
      matchArray&&matchArray.forEach(el=>{
        // // console.log(temp.join(''))
        // let start = temp.join('').indexOf(el)
        // let end = el.length
        // total = end+start+total                
        // // console.log(el,start,temp.join('').substring(total))
        // temp = temp.slice(0,total)
        // console.log(temp.join(''))
        // // 贪婪检索
        // findMatch1(temp.join(''),el,commentsDep,temp,matchArray)
        // console.log(findMatch(temp.join(''),el,temp,commentsDep),el)
        // if(!isComments(temp.join(''),start,total,commentsDep)){

        // }
      })
})
}

// function test(str){
//   let startIndex = str.substring(strEnd).indexOf('<!--')
//   let endIndex = str.substring(strEnd).indexOf('-->');
//   strStart = startIndex+strEnd
//   strEnd += endIndex+endLen
// }
function findMatch1(str,commentsDep,strArr,matchArray){
  let pointDep = []
  let start = 0,end=0
  matchArray&&matchArray.forEach(el=>{
    let elLength = el.length   
    start =str.indexOf(el)
    for(let point of pointDep){
      if(point.name == el){
        start=str.indexOf(el,point.end)
      }
    }
    if(pointDep.length==0){
      start=str.indexOf(el)      
    }
    end =start+elLength    
    let isCom = isComments(str,start,end,commentsDep)
    pointDep.push({name:el,start:start,end:end,isCom:isCom,elLength:elLength})
  })  
  // console.log(pointDep)
  for(let item of pointDep.reverse()){
    if(!item.isCom){
      var addr = getNativeAddr(item.name)
      strArr.splice(item.start,item.elLength,addr?' src="'+addr+'" ':el)
    }
  }
  console.log(strArr.join(''))
}
function findMatch(str,el,staticArr,commentsDep,start=0,total=0,preStr = ''){

  // 一直查找，即使找到了也要从接下来的子串中继续查找，直到为-1为止 返回上一个查找的坐标
  /*
    思路1
    循环查找，每次找到了都判断是否在注视内，如在 则记录找到的坐标 从该坐标直接进行下一次查找 如不再 则替换并进行下一次查找
    思路2
    所有的都在原字符串进行查找，


  
  */
  let end = el.length
  if(str.indexOf(el)!==-1){
    // 如果在注释内  则返回上一个的数据
    preStart = start
    start = str.indexOf(el)
    
    if(isComments(staticArr.join(''),start,end,commentsDep)){
      console.log(el,'在注视内',preStart,start)
    }
    start = str.indexOf(el)
    total += start+end
    return findMatch(str.substring(start+end),el,staticArr,commentsDep,start,total,str)
  }else{
    // 正向检测时 将数据记录为数组或对象 用以比对  
    //替换
    // console.log(staticStr.substring(total-end,total),start,total,123) 
    if(!isComments(staticArr.join(''),total-end,total,commentsDep)){
      var addr = getNativeAddr(el)
      staticArr.splice(total-end,end,addr?' src="'+addr+'" ':el)
      // 由于splice所填充进数组的值 只在数组中占一个地址 所以需要重新转化
      staticArr = staticArr.join('').split('')
  }   
  // console.log(staticArr.join(''),start,total-end)
    // staticStr.split('').splice(total-end,total,addr?' src="'+addr+'" ':el)   
    // console.log(staticArr.splice(total-end,end,1))
    // console.log(22,staticStr.split('').splice(total-end,end,1231312).join(''),12312312)
    // staticStr = staticStr.join('').split('') 
                    // 由于splice所填充进数组的值 只在数组中占一个地址 所以需要重新转化
    // return  temp.join('').split('') 
    // str.split('').splice(start,end,'123123')
    // return {start,end,total}
  }
}


function isComments(str,start,end,dep){
    /*

        str:文件内容
        以文件为基准
        start:截取起始点
        end:截取结束点
        
        fn:判断所截取的长度是否为注释内容

        return true OR false

    */

    // 过于重了，只需要一个函数抓到所有的注释区间  再通过一个函数判断输入的值是否在区间内即可
    // 目前只支持 <!-- * -->格式 后续会支持//*格式
    let pointDep = [];
    let strStart = 0,strEnd = 0,i=0;
    let endLen = 3,startLen = 4;
    
    if(dep.get()&&dep.get().length===0){
        dep.equals(str.match(/<!--/mg))
    }
    if(dep.get()){
        for(let item of dep.get()){
            let startIndex = str.substring(strEnd).indexOf('<!--')
            let endIndex = str.substring(strEnd).indexOf('-->');
            strStart = startIndex+strEnd
            strEnd += endIndex+endLen
            pointDep.push({'start':strStart,'end':strEnd})
        }
        // console.log(pointDep)
        for(let item of pointDep){
            if(start>item.start&&end<item.end){
                // console.log(start,end,str.substring(start,end),'被忽略')
                arr.push(str.substring(start,end))
                return true
            }
        }
    }
    return false
}
module.exports = {
    isComments,searchFile,test
}



  // const replaceRegHtml = /[^\:]src=['|"](\S*)['|"]/g
  // const replaceRegCss = /url\(['|"]?(.*[^\.css|\.scss|\.less|\{\}\$])['|"]?\)/g
  // const replaceRegJs = /\$mi_[a-zA-Z0-9]*\:[\s]?['|"](\S*)['|"]/g