# Install
```
cnpm install @mipay/batch // v1.8.3
```

#Import
```
...
},
  "dependencies": {
    " @mipay/batch": "^1.8.3"
  }
...

npm install
```
* 参考 {wiki}/pages/viewpage.action?pageId=66660757

# Usage
如果你正在使用vue-cli  

```
// cli 3.0
const {Batch} = require('@mipay/batch')

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
// 推荐配置
{
// 'fileUpdatePath': ['./static', './src'],// 所有被依赖的图片资源路径 cli 2.0
// 'fileUpdatePath': ['./public', './src'],// 所有被依赖的图片资源路径 cli 3.0
'staticSrc': 'static' // 期望的静态资源路径 所有的未被正常替换的文件将从这里寻找
}
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

# function 
* 自动替换html,js,css文件中，可识别的图片资源文件路径，目前支持(png,jpg,jpeg)三种格式
* 自动生成ignored文件 可以像使用gitignored一样忽略你不想遍历的文件夹或忽略某个特定文件来降低遍历深度提高性能
* 使用完整路径代表一个图片，避免出现路径缺失导致的无法替换现象
* 支持不同目录下的同名文件替换



# Log
### v1.8.3
* 优化替换逻辑
* 适配eslint
* 增加二级匹配方式

### >=v1.8.0
* 支持替换不同路径下的同名文件
* 改写替换方式，支持js文件替换
* 全文件https替换
