
var fs = require('fs')
var path = require('path')
var http = require('http')
var qs = require('querystring')
var filePath = path.resolve('./miuiUpdateImg')
var filePathTest = path.resolve('./miuiUpdateImg/share.png')

/* 变量 */
var fileAddArray = [];
function getFileMap(fileName){
    fileMap = {
        'js':"text/javascript",
        'jpg':'image/jpeg',
        'jpeg':'image/jpeg',        
        'json':"application/json",
        'png':"image/png"
    }
    const lastName = fileName.split('.')[1] //仅仅针对文件名不存在多个「.」的时候
    return fileMap[`${lastName}`];
}



function fileDisplay(filepath){
    disposeArg()
    fs.readdirSync(filepath,(err,files)=>{
        if(err){
            console.warn(err)
            return
        }else{
            files.forEach(filename=>{
                var filedir = path.join(filepath,filename)//得到完整的地址
                fs.stat(filedir,(err,stats)=>{
                    if(err){
                        // 推送给event事件函数 主要负责处理报错信息
                        return
                    }else{
                        var isFile = stats.isFile();
                        var isDir = stats.isDirectory();
                        if(isFile){
                        //    var content =  fs.readFileSync(filedir,'utf-8')
                           fileAddArray.push(filedir)
                        }else if(isDir){
                            fileDisplay(filedir)
                        }
                    }
                })
            })
        }
    })
    return Array.from(new Set(fileAddArray))
}


// 需要批处理过程 

// 需要文件识别过程

// 通过传参数判断是否是文件夹或者是多个文件

// 多个文件需要通过传数组作为参数 数组中是文件名的集合 如果参数是一个文件夹，则遍历文件夹中的所有文件


function uploadA(filepath){
    var options = {
        hostname:'file.market.miui.srv',
        port:8756,
        path:'/upload?channel=NccFgber',
        method:'POST',
    }
    const temp = filepath.split('/')
    const filename = temp[temp.length-1]

    var boundaryKey = '----' + new Date().getTime();    
    fs.readFile(filepath,(e,data)=>{
        var payload = '--' + boundaryKey + '\r\n' + 'Content-Disposition:form-data; name="file"; filename="'+filename+'"\r\n' + 'Content-Type:'+getFileMap(filepath)+'\r\n\r\n';
        payload += data;
        payload += '\r\n--' + boundaryKey + '--';
        var req = http.request(options,(res)=>{
            res.setEncoding('utf8');
            res.on('data',(chunk)=>{
                console.log('data:',chunk);
                // 返回值是chunk
            });
            res.on('error',(e)=>{
                // 推送给event事件函数 主要负责处理报错信息                
            })
        })
        req.setHeader('Content-Type', 'multipart/form-data; boundary='+boundaryKey+'');
        req.setHeader('Content-Length', Buffer.byteLength(payload, 'utf8'));
        req.write(payload);
        req.end();
    });
}

// fileDisplay(filePath)
uploadA(filePathTest);

console.log(getFileMap('share.jpg'))
// var filePromise= new Promise((res,rej)=>{
//     fileDisplay(filePath)
// })
// filePromise.then(()=>{
//     uploadA();
// })

