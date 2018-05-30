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


function start(deep=false){
    global.__conf = new Files('./miuiFile.json').content;    
    global.__file = new Files(__conf['output'])
    fileDisplay(__conf['fileUpdatePath'],uploadDep,deep)
    uploadDep.get().forEach(el=>{
        PromiseArr.set(uploadFile(el,deep))
    })
    Promise.all(PromiseArr.get()).then(()=>{
        // console.log(uploadDep)
        if(deep){
            __file.writeMyFileAll(JSON.stringify(uploadFileObj),__file.file)                    
        }else{
            __file.writeMyFile(JSON.stringify(uploadFileObj),__file.file)                    
        }
        searchFile(__conf['fileFindPath'])        
    }).catch((e)=>{
        console.log(e)
    })
}


start()
module.exports = {
    getNativeAddr,getThumbnailAddr,start
}