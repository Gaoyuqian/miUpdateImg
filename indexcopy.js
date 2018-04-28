const {uploadFile} = require('./fileDispose/fileUpload')
const {fileDisplay,getDep,getFileNameArray} = require('./fileDispose/fileDisplay')
const {path}=require('./main')
const filePath = path.resolve('.')

fileDisplay(filePath)
getDep().forEach(element => {
    uploadFile(element)     
});