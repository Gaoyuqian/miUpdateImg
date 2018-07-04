const {uploadFile,uploadFileObj} = require('./fileDispose/fileUpload')
const {Files} = require('./fileSystem/Files')
const {fileDisplay} = require('./fileDispose/fileDisplay')
const {searchFile} = require('./fileReplace/fileReplace')
const {Dep} = require('./fileSystem/depend')
const {_config} = require('./global/global')
const PromiseArr = new Dep();    

function start(param={}){
    const {config,deep,alias,context,fileUpdatePath} = param 
    global.__config = config||_config
    global.__conf = new Files('./miuiFile.json') 
    global.__file = new Files(__conf.content['output'])
    if(fileUpdatePath){
      __conf.content['fileUpdatePath'] = fileUpdatePath
      __conf.writeMyFileAll(__conf.content)
    }
    const display = fileDisplay(__conf.content['fileUpdatePath'],deep)
    display.get().forEach( el =>{
      PromiseArr.set(uploadFile(el,deep))        
    })
    Promise.all(PromiseArr.get()).then(()=>{
        if(deep){
            __file.writeMyFileAll(JSON.stringify(uploadFileObj),__file.file)                    
        }else{
            __file.writeMyFile(JSON.stringify(uploadFileObj),__file.file)                    
        }
        searchFile(__conf.content['fileFindPath'],alias,context)
    }).catch((e)=>{
        console.log(e)
    }) 
}

module.exports = {
  start
}