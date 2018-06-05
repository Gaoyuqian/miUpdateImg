
const addrArrayDownload  = [
    "http://t1.market.mi-img.com/download/",
    "http://t2.market.mi-img.com/download/",
    "http://t3.market.mi-img.com/download/",
    "http://t4.market.mi-img.com/download/",
    "http://t5.market.mi-img.com/download/",
    "http://t1.market.xiaomi.com/download/",
    "http://t2.market.xiaomi.com/download/",
    "http://t3.market.xiaomi.com/download/",
    "http://t4.market.xiaomi.com/download/",
    "http://t5.market.xiaomi.com/download/",
]
const addrArrayThumbnail = [
    "http://t1.market.xiaomi.com/thumbnail/",
    "http://t2.market.xiaomi.com/thumbnail/",
    "http://t3.market.xiaomi.com/thumbnail/",
    "http://t4.market.xiaomi.com/thumbnail/",
    "http://t5.market.xiaomi.com/thumbnail/",
    "http://t1.market.mi-img.com/thumbnail/",
    "http://t2.market.mi-img.com/thumbnail/",
    "http://t3.market.mi-img.com/thumbnail/",
    "http://t4.market.mi-img.com/thumbnail/",
    "http://t5.market.mi-img.com/thumbnail/"
]

function getRamdomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getThumbnailAddr(filename,/*l,s,w,h,q*/option,https=false){
    const index = getRamdomNumber(0,addrArrayThumbnail.length-1)
    let addrPre 
    const preName = filename.split('.')[0]
    const lastName = filename.split('.')[1]
    const content = __file.readMyFile()    
    if(!content[preName]){
        console.warn('该文件未上传----',filename)
        return 
    }
    if(https){
        addrPre = 'https://ts.market.mi-img.com/thumbnail/'
    }else{
        addrPre = `${addrArrayThumbnail[index]}`
    }
    try{
        const fileParam = typeof option === 'string'?option:option.param
        const sub = option.type?option.type:lastName?lastName:'jpeg'
        return `${addrPre}${sub}/${fileParam}/${content[preName]}`
    }catch(e){
        console.warn('必须设置裁剪参数,或使用getNativeAddr获取地址')
        return 
    }
}


function getNativeAddr(filename){
    const index = getRamdomNumber(0,addrArrayDownload.length-1)
    filename = detailSrc(filename)
    const content = __file.readMyFile()
    

    if(!content[filename]){
        console.warn('该文件未上传----',filename)
        return
    }
    return `${addrArrayDownload[index]}${content[filename]}/a.jpg`
}


function detailSrc(srcArr){
    /*
    
        将匹配到的所有路径处理成只有文件名+后缀的形式
    
    */
   const Reg1 = /[a-zA-Z0-9\u4e00-\u9fa5\-_@!#$%1^&()]+(?=[\.]{1}[a-zA-Z]+)/g
  //  const Reg1 = /(^[\/][\S])+(?=[\.]{1}[a-zA-Z]+)/g
  
   if(Array.isArray(srcArr)){
    srcArr = srcArr.map((el)=>{
        return srcArr.match(Reg1)[0]?srcArr.match(Reg1)[0]:srcArr
    })
   }else{
        return srcArr.match(Reg1)[0]?srcArr.match(Reg1)[0]:srcArr
   }
}
module.exports = {
    getNativeAddr,getThumbnailAddr
}