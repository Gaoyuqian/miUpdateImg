// const {uploadFile} = require('./util/fileDispose/fileUpload')
const {Files} = require('./util/fileSystem/Files')
const {beginDisplay} = require('./util/fileDispose/fileDisplay')
const {path,fs,chalk} = require('./util/main')
const {getNativeAddr,getThumbnailAddr} = require('./getImgAddr/getImgAddr')
const {searchFile} = require('./util/fileReplace/fileReplace')

// 准备  读取配置文件

function start(deep=false){
    global.__conf = new Files('./miuiFile.json').content;    
    global.__file = new Files(__conf['output'])
    // global.__upload = new Files(__conf['output'])
    
    beginDisplay(__conf['fileUpdatePath'],true)   
    console.log(__file.content)
    searchFile(__conf['fileFindPath'])

    // var p = new Promise((res,rej)=>{
    //     beginDisplay(__conf['fileUpdatePath'],true)         
    // })
}


start()
module.exports = {
    getNativeAddr,getThumbnailAddr,start
}