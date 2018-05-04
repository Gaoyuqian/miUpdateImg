const {uploadFile} = require('./fileDispose/fileUpload')
const {myFile} = require('./fileSystem/outputFile')
const {fileDisplay,getDep,getFileNameArray} = require('./fileDispose/fileDisplay')
const {path,fs,conf,chalk}=require('./main')
const {getAddress,getNativeImgAddr} = require('./getImgAdd/getImgAdd')
const miuiFile = require('./miuiFile.json')


// 准备  读取配置文件
function check(){
    try{
        const confFile = fs.readFileSync(miuiFile['output'],'utf-8')
        }catch(e){
            console.log(chalk.red('未找到相应配置文件,正在创建...'))
            fs.writeFileSync(miuiFile['output'],'{}')
        }
    console.log(chalk.blue('配置文件检查完毕...'))
}
function start(){
    // 配置文件检测
    check()
    // 检测结束
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