const {uploadFile} = require('./util/fileDispose/fileUpload')
const {Files} = require('./util/fileSystem/Files')
const {fileDisplay,getDep,getFileNameArray} = require('./util/fileDispose/fileDisplay')
const {path,fs,chalk} = require('./util/main')
const {getNativeAddr,getThumbnailAddr} = require('./getImgAddr/getImgAddr')
const {searchFile1,searchFile} = require('./util/fileReplace/fileReplace')

// 准备  读取配置文件

function start(deep=false){
    global.__conf = new Files('./miuiFile.json').content;    
    global.__file = new Files(__conf['output'])
    searchFile()

    // fileDisplay(__conf['filepath'],deep)
    // getDep().forEach(element => {
    //     uploadFile(element)     
    // }); 
    /*
        将要支持特殊路径的查找  比如 @/等
        支持css文件的替换
        支持vue文件的替换
    */
}


start()
module.exports = {
    getNativeAddr,getThumbnailAddr,start
}