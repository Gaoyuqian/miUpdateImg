const {fs,http,path} = require('./main')
const {isIgnoredFile,getFileMap} = require('./fileUtil/util')

var filePath = path.resolve('.')
var filePathShare = path.resolve('./name.jpeg')

var hasUploadFile = [];
var test = {}
var Dep = []


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
                console.log('该路径已被忽略-------'+filepath)
            }
        }else if(isDir){
            fileDisplay(filedir)
        }
    })    
}

function main(res){
   fileDisplay(filePath);
   console.log(Dep)
}
main();


//------------------------------------------------------------
// fileDisplayA(filepath)
// 需要配置一些静态变量
/* 变量 */
// function getFileMap(fileName){ // 选择请求体中的type字段 
//     fileMap = {
//         'jpg':'image/jpeg',
//         'jpeg':'image/jpeg',        
//         'png':"image/png"
//     }
//     let lastName = fileName.split('.')
//     lastName = fileName.split('.')[lastName.length-1]
//     return fileMap[`${lastName}`];
// }

// async function fileDisplay(filepath){  // 递归遍历文件夹下的所有文件
//    await fs.readdir(filepath,(err,files)=>{
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
//                             uploadA(filedir,filename,filepath)
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
// }

//方案1
//  function isIgnoredFile(name){  //判断文件是否在ignored中被忽略
//     const reg = /\.\w*[\/]?/
//     const ignored = reg.exec(name)
//     const resS = fs.readFileSync('./ignored').toString()
//     return reg.exec(name)&&resS.indexOf(ignored[0])!==-1
// }

 function uploadA(filepath,fileName){  // 上传功能
    const options = {
        hostname:'file.market.miui.srv',
        port:8756,
        path:'/upload?channel=NccFgber',
        method:'POST',
    }
    let serverAdd = ''
    const temp = filepath.split('/')
    const filename = temp[temp.length-1]
    const boundaryKey = '----' + new Date().getTime();    
    fs.readFile(filepath,(e,data)=>{
        if(!data){console.log(`${filepath}未找到`);return false}
        if(!getFileMap(filepath)){console.log(`上传失败，该文件不是必要的可上传文件 如有需要 请在映射中添加 ${filepath}`);return false}
        hasUploadFile.push(filepath)            
        const req = http.request(options,(res)=>{
            res.setEncoding('utf8');
            res.on('data',(chunk)=>{
                const  writeContext = JSON.parse(chunk)[0].exloc
                test[fileName] = writeContext;
                fs.writeFileSync('./uploadPackage.json',JSON.stringify(test))
                // 写入json
                console.log(chunk)
            })
        })

        var payload = '\r\n------' + boundaryKey + '\r\n' +
        'Content-Disposition: form-data; name="file"; filename="'+fileName+'"\r\n' +
        'Content-Type: '+getFileMap(fileName)+'\r\n\r\n';
        var enddata = '\r\n------' + boundaryKey + '--';
        var fileSt = fs.readFileSync(filepath)       
        console.log(payload,'payload') 
        req.setHeader('Content-Type', 'multipart/form-data;boundary=----' + boundaryKey);
        req.setHeader('Content-Length', Buffer.byteLength(payload)+Buffer.byteLength(enddata)+fs.statSync(filepath).size);
        req.write(payload);
        req.write(fileSt);
        req.end(enddata)
    });
}

// fileDisplay(filePath)
// uploadA(filePathShare,'filename')