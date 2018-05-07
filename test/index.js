const fs = require('fs')
var ig =ign= fs.readFileSync('./../history/ignored','utf-8')

const testUse = {
    a:'.git/',
    b:'.git/*',
    c:'*/.git/*',
    d:'*/.git/',
    e:'*/.git',
    f:'.git/*',
    g:'.git*',
    h:'dsafa.git'
}
const file = {
    a:'aaaa/.git/git/aaaaa',
    b:'aaaa/.git/aaaa',
    c:'aaaa/.git/git',
}
/* 
1读取所有忽略文件内容
2先使用正则匹配相关内容 得到exec后匹配相关文件 对比array[1] 若相等，则忽略

二
只要把所有的*忽略  则可以通过indexof的方式对每一个地址进行检测
*/
// var reg1 = /^[\.]?[A-Za-z0-9]*[\/|\*]{0,2}$/
var reg2 = /^[\.]?[A-Za-z0-9]*[\/]{1}[\*]?/  //匹配要被忽略的文件夹
var reg3 = /^[\/]?[A-Za-z0-9\.]*\*$/ //匹配要被忽略的其中带有X字段的所有文件
var reg4 = /([\/][A-Za-z0-9\.]*)[\/|\*]?/
var reg5 = /^[A-Za-z0-9\/\.\*]*([[A-Za-z0-9].)/
// for(let item in testUse){
//     console.log(item,testUse[item],reg3.test(testUse[item]),3)
//     console.log(item,testUse[item],reg2.test(testUse[item]),2)
//     console.log(item,testUse[item],reg4.exec(testUse[item]),2)
// }
// for(let itema in file){
//     console.log(itema,file[itema],reg4.exec(file[itema]))
// }


function ignored(filename){
    var abcde = ign.split('\n')
    // 去星号 
    var _reg = /\*/g
    const a = abcde.map(el => {
        return el.replace(/\*/,'')
    });
    console.log(a)
    for(let item of a){
        if(filename.indexOf(item)!=='-1'){
            //忽略
            if(/\/$/.test(item)){
                console.log(item);
                return 'allfiles'
                //忽略该文件夹下的所有文件
            }
            return 'singlefile'
            //仅忽略当前文件
        }
        return 'nofile'
        // 该文件不被忽略
        console.log(filename.indexOf(item),item,filename)
    }
}
console.log(ignored(file.a))