const {fs,chalk} = require('./../main')

class myFile {
    constructor(path){
        this.file = path
        this.content = this.readMyFile(path)                
    };
    readMyFile(){
        let fileName = fs.existsSync(this.file)
        if(!fileName){
            fs.writeFileSync(this.file,'{}')
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