const {uploadFile,uploadFileObj} = require('./util/fileDispose/fileUpload')
const {Files} = require('./util/fileSystem/Files')
const {fileDisplay} = require('./util/fileDispose/fileDisplay')
const {path,fs,chalk} = require('./util/main')
const {getNativeAddr,getThumbnailAddr} = require('./getImgAddr/getImgAddr')
const {searchFile} = require('./util/fileReplace/fileReplace')
const {Dep} = require('./util/fileSystem/depend')


// 准备  读取配置文件

const uploadDep = new Dep();    
const PromiseArr = new Dep();    

function start(param={}){
    const config = param.config||{}
    const deep = param.deep||false  
    global.__config = config
    global.__conf = new Files('./miuiFile.json') 
    global.__file = new Files(__conf.content['output'])
    fileDisplay(__conf.content['fileUpdatePath'],uploadDep,deep)
    uploadDep.get().forEach(el=>{
        PromiseArr.set(uploadFile(el,deep))
    })
    Promise.all(PromiseArr.get()).then(()=>{
        if(deep){
            __file.writeMyFileAll(JSON.stringify(uploadFileObj),__file.file)                    
        }else{
            __file.writeMyFile(JSON.stringify(uploadFileObj),__file.file)                    
        }
        searchFile(__conf.content['fileFindPath'])        
    }).catch((e)=>{
        console.log(e)
    }) 
}
// start({deep:true})
module.exports = {
    getNativeAddr,getThumbnailAddr,start
}