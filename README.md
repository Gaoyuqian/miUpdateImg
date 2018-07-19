# Install
```
cnpm install @mipay/batch // v1.9.3
```

#Import
```
...
},
  "dependencies": {
    "@mipay/batch": "^1.9.3"
  }
...

npm install
```
* 参考 {wiki} http://wiki.n.miui.com/pages/viewpage.action?pageId=5833076

# Usage
*如果你正在使用vue-cli  

```
// cli 3.0
const Batch = require('@mipay/batch')

configureWebpack:config=>{
  return  plugins: [new Batch(option)]
}

// 其他
plugins: [
  new Batch(option)
]
```

# Config

* 推荐预先设置参数来告诉脚本你需要做哪些工作或需要改变哪些目录用于针对目录不相同的前端工程

```
/*
  插件需要的参数：
  
  staticSrc         当采用某种特殊写法时，文件路径指向打包后的静态资源目录，该属性为插件打包后的静态资源目录名                      称，当脚本在正常路径下找不到相应文件时，会自动从该路径获取资源。（必填）
  fileUpdatePath    所有待上传文件的目录集合，多个目录请使用数组。（必填）
  size              单位 byte  当文件大小小于size的时 将不会被替换，使用webpack自带的loader通过base64形式                     加载出来。默认值为10000byte（选填）
  deep              是否使用deep模式  非deep模式会比对所有依赖文件是否曾经被上传成功过 减少http请求数
                    deep模式会将所有依赖文件重新上传。 默认值为false(选填)
*/

// example
  plugins: [new Batch({
    'fileUpdatePath': ['./public', './src'],
    'staticSrc': 'public',
    'size':1,
    'deep':false
  })]

```

```

/*
{
'miuiFile.json':{
        "fileUpdatePath": "./static", // 待上传文件目录
        "output": "uploadPackage.json", // 待上传文件地址输出路径
        "ignored": "./ignored", //可选的忽略文件
        "httpsOption": {
            "hostname": "",// 域名
            "port": , // 端口
            "path": "", //路径
            "method":'POST'
        },
        "fileFindPath": "./src"  // 待替换文件的路径
    },
    'uploadPackage.json':{}
}
*/

// 禁止修改配置文件的key值以避免不必要的错误，目前只推荐修改fileUpdatePath路径

```