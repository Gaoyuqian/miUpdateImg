const {fs,path,chalk} = require('./../main')
const {isIgnoredFile,getFileMap} = require('./../fileUtil/util')


let fileResult
function fileDisplay(filepath,dep,deep,model){
    // deep 模式 会覆盖之前上传的所有同名文件
    if(!fileResult){
        fileResult = __file.readMyFile()
    }
    if(typeof filepath === 'object'){
      filepath.forEach(el=>{
        const files = fs.readdirSync(el)
        addDep(files,el,dep,deep,model)  
      })
      return 
    }
    const files = fs.readdirSync(filepath)
    addDep(files,filepath,dep,deep,model)  
 }
 function addDep(fileArray,filepath,Dep,deep,model){
    fileArray.forEach(filename =>{
        if(fileResult[filename.split('.')[0]]&&!deep){
            // console.log(chalk.yellow('该文件已在过去上传成功，如需覆盖原文件，请使用deep模式-------')+filename)            
        }else{
            const filedir = path.join(filepath,filename)
            const stats = fs.statSync(filedir)
            const isFile = stats.isFile();
            const isDir = stats.isDirectory();            
            if(isFile){          
                if(isIgnoredFile(filedir,false)==='single'){
                    // console.log(chalk.yellow('该文件已被忽略-------')+filedir)      
                    return              
                }
                if(model === 'find'){
                  // find模式下支持文件后缀检测 支持.vue文件和.html文件格式 使用正则匹配
                  if(isVueOrHtml(filedir)){
                    Dep.set(filedir) 
                  }
                }else{
                    if(getFileMap(filename)){
                        Dep.set(filedir)   
                    }else{
                    //  console.log(chalk.yellow('不支持该文件格式,如需支持,请在映射中添加该文件对应的参数值-------')+filedir)   
                    }
                }
            }else if(isDir){                
                if(isIgnoredFile(filedir,true)==='all'){
                    // console.log(chalk.yellow('该路径已被忽略-------')+filedir)                    
                    return
                }else{
                    fileDisplay(filedir,Dep,deep,model)                    
                }
            }
        }
    })
}
    function isVueOrHtml(name){
        const reg = /(\.vue$)|(\.html$)/
        return reg.test(name)
    }
module.exports ={
    fileDisplay
}