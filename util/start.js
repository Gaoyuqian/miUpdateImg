const {uploadFile,uploadFileObj} = require('./fileDispose/fileUpload')
const {Files} = require('./fileSystem/Files')
const {fileDisplay} = require('./fileDispose/fileDisplay')
const {searchFile} = require('./fileReplace/fileReplace')
const {Dep} = require('./fileSystem/depend')
const {_config} = require('./global/global')
const PromiseArr = new Dep();    

function start(param={}){
    const {config,deep,alias,context,fileUpdatePath,callback,staticSrc,size} = param 

    global.__config = config||_config
    global.__conf = new Files('./miuiFile.json') 
    global.__file = new Files(__conf.content['output'])
    global.__staticSrc = staticSrc||'static'
    global.__size = size||10000
    global.__smallFileDep = new Dep()
    // 定义全局变量结束 开始设置系统参数

    if(fileUpdatePath){
      __conf.content['fileUpdatePath'] = fileUpdatePath
      __conf.writeMyFileAll(__conf.content)
      // 修改默认配置为用户设置的参数结束 准备开始执行脚本
    }
    const display = fileDisplay(__conf.content['fileUpdatePath'],deep)
    // 收集所有图片依赖结束 准备上传文件

    // console.log(display.get(),__smallFileDep.get())
    display.get().forEach( el =>{
      PromiseArr.set(uploadFile(el,deep))        
    }) 
    // 所有图片上传结束 准备写入文件

    Promise.all(PromiseArr.get()).then(()=>{
        if(deep){
            __file.writeMyFileAll(JSON.stringify(uploadFileObj),__file.file)                    
        }else{
            __file.writeMyFile(JSON.stringify(uploadFileObj),__file.file)                    
        }
        // 写入文件结束 开始替换

        searchFile(__conf.content['fileFindPath'],alias,context)
        // 替换完毕 继续webpack打包

        callback()
    }).catch((e)=>{
        // 报错 终止打包
        console.log(e)
    }) 
}

module.exports = {
  start
}