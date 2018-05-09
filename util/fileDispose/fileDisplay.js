const {fs,path,chalk} = require('./../main')
const {isIgnoredFile,getFileMap} = require('./../fileUtil/util')
const {myFile} = require('./../fileSystem/outputFile')



let fileResult
let Dep = []

function fileDisplay(filepath,deep=false){
    // deep 模式 会覆盖之前上传的所有同名文件
    if(!fileResult){
        fileResult = __file.content
    }
    const files = fs.readdirSync(filepath)
    addDep(files,filepath,deep)  
 }
 function addDep(fileArray,filepath,deep){
    fileArray.forEach(filename =>{
        if(fileResult[filename.split('.')[0]]&&!deep){
            console.log(chalk.yellow('该文件已在过去上传成功，如需覆盖原文件，请使用deep模式-------')+filename)            
        }else{
            const filedir = path.join(filepath,filename)
            const stats = fs.statSync(filedir)
            const isFile = stats.isFile();
            const isDir = stats.isDirectory();
            if(isFile){
                if(isIgnoredFile(filedir,false)==='single'){
                    console.log(chalk.yellow('该文件已被忽略-------')+filedir)      
                    return              
                }
                if(getFileMap(filename)){
                    Dep.push(filedir)                            
                }else{
                 console.log(chalk.yellow('不支持该文件格式,如需支持,请在映射中添加该文件对应的参数值-------')+filedir)   
                }
            }else if(isDir){
                if(isIgnoredFile(filedir,true)==='all'){
                    console.log(chalk.yellow('该路径已被忽略-------')+filedir)                    
                    return
                }else{
                    fileDisplay(filedir,deep)                    
                }
            }
        }
    })
}

function getDep(){
    return Dep
}
module.exports ={
    fileDisplay,addDep,getDep
}