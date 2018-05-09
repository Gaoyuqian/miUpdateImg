const {fs,chalk,path} = require('../main')

class myFile {
    constructor(path){
        this.file = path
        this.content = this.readMyFile(path)                
    };
    readMyFile(){
        let fileName = fs.existsSync(this.file)
        if(!fileName){
            console.log(chalk.red('未创建配置文件，正在创建默认的配置文件'))
            const __default = {
                    "filepath":"./static",
                    "output":"uploadPackage.json",
                    "ignored":"./ignored",
                    "httpsOption":{
                        "hostname":"file.market.miui.srv",
                        "port":8756,
                        "path":"/upload?channel=NccFgber",
                        "method":"POST"
                    }
            }
            fs.writeFileSync(this.file,JSON.stringify(__default));
            console.log(chalk.red('配置文件创建完毕'))  
        }
        let result = JSON.parse(fs.readFileSync(this.file,'utf-8'))   
            return result
    }
    writeMyFile(obj,sourceName){
        obj = typeof obj ==='object'?obj:JSON.parse(obj)
        for(let item in obj){
            if(!this.content[item]){
                this.content[item] = obj[item]
            }
        }
        fs.writeFileSync(this.file,JSON.stringify(this.content))
        console.log(chalk.green(sourceName,'--------上传成功'))
    }
}
module.exports = {
    myFile
}