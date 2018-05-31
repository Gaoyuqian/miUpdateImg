const __config = {
  
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
module.exports = {
  __config
}