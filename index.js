const {uploadFile} = require('./util/fileDispose/fileUpload')
const {myFile} = require('./util/fileSystem/outputFile')
const {fileDisplay,getDep,getFileNameArray} = require('./util/fileDispose/fileDisplay')
const {path,fs,chalk} = require('./util/main')
const {getNativeAddr,getThumbnailAddr} = require('./getImgAddr/getImgAddr')
// 准备  读取配置文件
function start(deep=false){
    global.__conf = new myFile('./miuiFile.json').content;    
    global.__file = new myFile(__conf['output'])
    fileDisplay(__conf['filepath'],deep)
    getDep().forEach(element => {
        uploadFile(element)     
    }); 
}
module.exports = {
    getNativeAddr,getThumbnailAddr,start
}