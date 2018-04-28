const {fs,path} = require('./../main')
const {isIgnoredFile,getFileMap} = require('./../fileUtil/util')
const filePath = path.resolve('./..')
var Dep = []
// function main(res){
//     fileDisplay(filePath);
//     console.log(Dep)
//  }
function fileDisplay(filepath){
    var files = fs.readdirSync(filepath)
    addDep(files,filepath)  
 }
 function addDep(fileArray,filepath){
    fileArray.forEach(filename =>{
        const filedir = path.join(filepath,filename)
        const stats = fs.statSync(filedir)
        const isFile = stats.isFile();
        const isDir = stats.isDirectory();
        if(isFile){
            if(!isIgnoredFile(filepath)&&getFileMap(filename)){
                Dep.push(filedir)                            
            }else{
                console.log('该路径已被忽略或不支持该文件格式-------'+filepath)
            }
        }else if(isDir){
            fileDisplay(filedir)
        }
    })
}

function getDep(){
    return Dep
}
//  main();
module.exports ={
    fileDisplay,addDep,getDep
}
// module.exports ={
//     fileDisplay:(filepath,cb)=>{
//    /*
//         param:{
//             filepath:文件路径 //所有的相对路径会被替换成文件的绝对路径
//             cb : 文件处理函数 //暂时使用cb作为名字
//         }
//         return null
//          主要是将该路径下的所以非忽略文件进行cb处理
//     */
    
//     // 递归遍历文件夹下的所有文件
//      fs.readdir(filepath,(err,files)=>{
//         if(err){
//             console.warn(err)
//             return
//         }else{
//             files.forEach(filename=>{
//                 const filedir = path.join(filepath,filename)//得到完整的地址
//                 fs.stat(filedir,(err,stats)=>{
//                     if(err){
//                         console.log(err)
//                         return
//                     }else{
//                         var isFile = stats.isFile();
//                         var isDir = stats.isDirectory();
//                         if(isFile){
//                            if(!isIgnoredFile(filedir)){
//                             cb(filedir,filename,filepath)
//                            }else{
//                             console.log('已忽略文件'+filedir)
//                            }
//                         }else if(isDir){
//                             fileDisplay(filedir)
//                         }
//                     }
//                 })
//             })
//         }
//     })
//     }
// }
// async function fileDisplay(filepath,cb){ 
//     /*
//         param:{
//             filepath:文件路径 //所有的相对路径会被替换成文件的绝对路径
//             cb : 文件处理函数 //暂时使用cb作为名字
//         }
//         return null
//          主要是将该路径下的所以非忽略文件进行cb处理
//     */
    
//     // 递归遍历文件夹下的所有文件
//     await fs.readdir(filepath,(err,files)=>{
//          if(err){
//              console.warn(err)
//              return
//          }else{
//              files.forEach(filename=>{
//                  const filedir = path.join(filepath,filename)//得到完整的地址
//                  fs.stat(filedir,(err,stats)=>{
//                      if(err){
//                          console.log(err)
//                          return
//                      }else{
//                          var isFile = stats.isFile();
//                          var isDir = stats.isDirectory();
//                          if(isFile){
//                             if(!isIgnoredFile(filedir)){
//                              cb()
//                              cb(filedir,filename,filepath)
//                             }else{
//                              console.log('已忽略文件'+filedir)
//                             }
//                          }else if(isDir){
//                              fileDisplay(filedir)
//                          }
//                      }
//                  })
//              })
//          }
//      })
//  }