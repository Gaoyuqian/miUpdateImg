const {uploadFile} = require('./fileDispose/fileUpload')
const {myFile} = require('./fileSystem/outputFile')
const {fileDisplay,getDep,getFileNameArray} = require('./fileDispose/fileDisplay')
const {path,fs,conf}=require('./main')
const {getAddress,getNativeImgAddr} = require('./getImgAdd/getImgAdd')


// 准备  读取配置文件
function start(){
    global.__file = new myFile(conf['output'])    
    fileDisplay(conf['filepath'])
    getDep().forEach(element => {
        uploadFile(element)     
    }); 
}

module.exports = {
    getAddress,getNativeImgAddr,start
}
/*
    待开发List
*/