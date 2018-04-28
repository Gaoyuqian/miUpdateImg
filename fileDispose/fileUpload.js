const {fs,http} =  require('./../main')
const {getFileMap} = require('./../fileUtil/util')
let uploadFileObj = {}
module.exports = {
    uploadFile : (filepath)=>{
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
            // if(!data){console.log(`${filepath}未找到`);return false}
            // if(!getFileMap(filepath)){console.log(`上传失败，该文件不是必要的可上传文件 如有需要 请在映射中添加 ${filepath}`);return false}
            const req = http.request(options,(res)=>{
                res.setEncoding('utf8');
                res.on('data',(chunk)=>{
                    const  writeContext = JSON.parse(chunk)[0].exloc
                    uploadFileObj[filename] = writeContext;
                    fs.writeFileSync('./uploadPackage.json',JSON.stringify(uploadFileObj))
                    console.log('end')
                })
            })
    
            let payload = '\r\n------' + boundaryKey + '\r\n' +
            'Content-Disposition: form-data; name="file"; filename="'+filename+'"\r\n' +
            'Content-Type: '+getFileMap(filename)+'\r\n\r\n';
            const enddata = '\r\n------' + boundaryKey + '--';
            let fileSt = fs.readFileSync(filepath)       
            req.setHeader('Content-Type', 'multipart/form-data;boundary=----' + boundaryKey);
            req.setHeader('Content-Length', Buffer.byteLength(payload)+Buffer.byteLength(enddata)+fs.statSync(filepath).size);
            req.write(payload);
            req.write(fileSt);
            req.end(enddata)
        });
    }
}