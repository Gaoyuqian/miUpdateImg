const conf = require('../../../uploadPackage.json')
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
function getImgType(filename){
    return filename.split('.')[1]
}
function getImgWithText(option){

}

function getThumbnailAddr(filename,/*l,s,w,h,q*/option,https=false){
    const index = getRamdomNumber(0,addrArrayThumbnail.length-1)
    let addrPre 
    if(!conf[filename]){
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
        const sub = option.type?option.type:getImgType(filename)?getImgType(filename):'jpeg'
        return `${addrPre}${sub}/${fileParam}/${conf[filename]}`
    }catch(e){
        console.warn('必须设置裁剪参数,或使用getNativeAddr获取地址')
        return 
    }
}
function getNativeAddr(filename){
    const index = getRamdomNumber(0,addrArrayDownload.length-1)
    if(!conf[filename]){
        console.warn('该文件未上传----',filename)
    }
    return `${addrArrayDownload[index]}${conf[filename]}/a.jpg`
}
module.exports = {
    getNativeAddr,getThumbnailAddr
}