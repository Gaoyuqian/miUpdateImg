const {fs,path,chalk} = require('./../main')
const {isIgnoredFile,getFileMap} = require('./../fileUtil/util')
const { Dep } = require('./../fileSystem/depend')


let fileResult

//  期望是收集和添加依赖解耦
//  理想状态是 我经过一系列操作 获取了我需要的dep 然后执行处理文件函数即可
//  need:  filePath model 
//  尽量不使用递归
//  return : dep 
function fileDisplay(filepath,deep,model,dep){
    // deep 模式 会覆盖之前上传的所有同名文件
    let _dep = dep ? dep : new Dep()    
    if(!fileResult){
        fileResult = __file.readMyFile()
    }
    if(Array.isArray(filepath)){
      filepath.forEach(el=>{
        const files = fs.readdirSync(el)
        addDep(files,el,_dep,deep,model)  
      })
      return _dep
    }
    const files = fs.readdirSync(filepath)
    addDep(files,filepath,_dep,deep,model)  
    return _dep
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
                  if(isReplaceableFile(filedir)){
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
                    fileDisplay(filedir,deep,model,Dep)
                }
            }
        }
    })
}

    function isReplaceableFile(name){
        const reg = /(\.vue$)|(\.html$)|(\.css$)|(\.scss$)|(\.less$)/
        return reg.test(name)
    }
module.exports ={
    fileDisplay
}