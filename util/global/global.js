// 定义一些伪全局变量 防止循环引用
const __config = {
    'miuiFile.json':{
        "fileUpdatePath": ["./publish","./src"],
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
module.exports = {
  __config
}