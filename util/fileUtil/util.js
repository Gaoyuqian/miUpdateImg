const {fs} = require('../main.js')

module.exports = {
    isIgnoredFile: (name,isDir)=>{  //判断文件是否在ignored中被忽略
        /*
            param:{
                name //文件路径
            }
            
            return: 返回Boolean 表示该文件路径是否在配置文件中被标记为可忽略文件
            
            tip: 被标记为可忽略文件的文件夹下的所有文件均不会被添加依赖
        */
        try{
            const res = fs.readFileSync(__conf['ignored'],'utf-8')
            if(res!=='undefined'){
                const resource =res.split('\n')
                const willIgnoreArray = resource.map(el=>{
                    return el.replace(/\*/,'')
                })
                for(let item of willIgnoreArray){
                    if(isDir){
                        name+='/'
                    }
                    if(name.indexOf(item)!='-1'){
                        if(/\/$/.test(name)){
                            return 'all'
                        }
                        return 'single'
                    }
                }
            }
            return 'none'            
        }catch(e){
            fs.writeFileSync(__conf['ignored'],'')
        }
    },
    getFileMap:(fileName)=>{ // 选择请求体中的type字段 
        /*
            param :{
                fileName // 文件名或者文件路径（包含拓展名）
            }
            return: 返回对应的fileMap中的映射字符串
        */
        fileMap = {
            'jpg':'image/jpeg',
            'jpeg':'image/jpeg',        
            'png':"image/png"
        }
        let lastName = fileName.split('.')
        lastName = fileName.split('.')[lastName.length-1]
        return fileMap[`${lastName}`];
    }
    
}