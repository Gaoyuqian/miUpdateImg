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
        let fileContent = file.content
        let temp = fileContent.split('')
        let matchArray = fileContent.match(replaceREG)
        const commentsDep = new Dep();
        console.log(matchArray)
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

function isComments(str,start,end,dep){
    /*

        str:文件内容
        以文件为基准
        start:截取起始点
        end:截取结束点
        
        fn:判断所截取的长度是否为注释内容

        return true OR false

    */

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
        for(let item of pointDep){
            if(start>item.start&&end<item.end){
                console.log(start,end,str.substring(start,end),'被忽略')
                arr.push(str.substring(start,end))
                return true
            }
        }
    }
    return false
}
module.exports = {
    isComments,searchFile
}