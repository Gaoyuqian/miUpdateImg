const {fs,path} =require('./../main.js')
const {fileDisplay,getDep} =require('./../fileDispose/fileDisplay.js')
const {getNativeAddr,getThumbnailAddr} = require('./../../getImgAddr/getImgAddr')
const {Files} = require('./../../util/fileSystem/Files')


function searchFile1(){
    const replaceREG = /src=(['|"](.*)['|"])\s/g    
    const http = /http|https/    
    fileDisplay(__conf['fileFindPath'],'find')
    getDep().forEach(el=>{
        // 对于每一个匹配到的文件进行处理
        const file = new Files(el)
        const fileContent = file.content        
        const matchArr = fileContent.match(replaceREG)
        console.log(matchArr)
        matchArr&&matchArr.reverse().forEach((el)=>{
            if(!http.test(el)){

            }
        })
    })
    // 再获取地址的时候只去拿最后的文件名和格式  不考虑路径问题
}
function searchFile(){

    /*
    
        fn:读取将被替换的文件文件 获取src的位置 进行替换

        return undef
        TODO:优化正则 将不会替换http或http开头的文件
        不支持同一页面多个相同文件的替换(后续支持)
        第二次替换时 要根据temp来替换  因为替换后的位置会发生变化
    */
    const replaceREG = /src=(['|"](.*)['|"])\s/g    
    const http = /http|https/

    fileDisplay(__conf['fileFindPath'],'find')    
    getDep().forEach(element => {
        let file = new Files(element) 
        let fileContent = file.content
        let temp = fileContent.split('')
        let matchArray = fileContent.match(replaceREG)
        matchArray&&matchArray.reverse().forEach(el=>{
            const startTem = temp.join('').indexOf(el)
            const startFile = fileContent.indexOf(el)
            const endTem = el.length
            const endFile =startFile+ el.length
            if(!http.test(el)&&!isComments(fileContent,startFile,endFile)){
                console.log(el,11222)
                var addr = getNativeAddr(el)
                temp.splice(startTem,endTem,addr?'src="'+addr+'" ':el)   
            }
        })
            file.writeMyFileAll(temp.join(''))
    });
    
}

function isComments(str,start,end){
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
    // let start = /<!--/mg
    // let end = /-->/mg
    let strStart = 0,strEnd = 0,i=0;
    let endLen = 3,startLen = 4,arr = str.match(/<!--/mg);
    for(let item of arr){
        let startIndex = str.substring(strEnd).indexOf('<!--')
        let endIndex = str.substring(strEnd).indexOf('-->');
        strStart = startIndex+strEnd
        strEnd += endIndex+endLen
        pointDep.push({'start':strStart,'end':strEnd})
    }
    for(let item of pointDep){
        if(start>item.start&&end<item.end){
            // console.log(str.substring(start,end),'被忽略')
            return true
        }
    }
    return false
}
module.exports = {
    searchFile1,isComments,searchFile
}