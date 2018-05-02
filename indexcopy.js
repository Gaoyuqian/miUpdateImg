const {uploadFile} = require('./fileDispose/fileUpload')
const {myFile} = require('./fileSystem/outputFile')
const {fileDisplay,getDep,getFileNameArray} = require('./fileDispose/fileDisplay')
const {path,fs}=require('./main')

const conf = JSON.parse(fs.readFileSync('./configuration.json'))

// 准备  读取配置文件
// 如果没有 output 创建该文件并直接写入一个空对象
global.__file = new myFile(conf.output)
fileDisplay(conf.filepath)
getDep().forEach(element => {
    uploadFile(element)     
});