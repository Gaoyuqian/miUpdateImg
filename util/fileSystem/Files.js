const {fs,chalk,path} = require('../main')

const __default = {
        'miuiFile.json':{
            "fileUpdatePath": "./static",
            "output": "uploadPackage.json",
            "ignored": "./ignored",
            "httpsOption": {
                "hostname": "file.market.miui.srv",
                "port": 8756,
                "path": "/upload?channel=NccFgber",
                "method": "POST"
            },
            "fileFindPath": "./src"
        },
        'uploadPackage.json':{}
    }
class Files {
    constructor(path){
        this.file = path
        this.content = this.readMyFile(path)                
    };
    isExists(){
        return fs.existsSync(this.file)
    }
    createFile(content){
        if(this.file){
            const temp = this.file.split('/')
            const name = temp[temp.length-1]
            fs.writeFileSync(this.file,JSON.stringify(__default[name]));            
        }
    }
    readMyFile(){
        if(!this.isExists()){
            this.createFile()
        }
        try{
            return JSON.parse(fs.readFileSync(this.file,'utf-8'))            
        }catch(e){
            return fs.readFileSync(this.file,'utf-8')
        }
    }
    writeMyFileAll(content){
        /*
        
            预期为覆盖写入
            整个文件重新覆盖
            适合读取文件之后再写入

        */
        if(typeof content === 'object'){
            fs.writeFileSync(this.file,JSON.stringify(content))   
        }else{
            fs.writeFileSync(this.file,content)  
        }
        this.content = this.readMyFile()
    }

    writeMyFile(obj,sourceName){
        /*

            替换写入
            只支持json文件格式的对象key替换
            主要是为了防止频繁的写入造成的性能消耗

            流程： 读取源文件内容，查找与源文件不同的内容 写入
            （不过如果有相同的文件期望写入 ，应该在display的时候就已经过滤掉了）
        
        */
        obj = typeof obj ==='object'?obj:JSON.parse(obj)
        for(let item in obj){
            if(!this.content[item]){
                this.content[item] = obj[item]
            }
        }
        fs.writeFileSync(this.file,JSON.stringify(this.content))
        console.log(sourceName,'--------上传成功')
        this.content = this.readMyFile()        
    }
}
module.exports = {
    Files
}