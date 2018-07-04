# Install
```
cnpm install @mipay/batch // v1.8.1
```

#Import
```
...
},
  "dependencies": {
    " @mipay/batch": "^1.8.1"
  }
...

npm install
```
* 参考 {wiki}/pages/viewpage.action?pageId=66660757

# Usage
如果你正在使用vue-cli  在vue.config.js中

```
const {Batch} = require('@mipay/batch')

configureWebpack:config=>{
  return  plugins: [new Batch()]
}
```

# Config

* 推荐预先设置参数来告诉脚本你需要做哪些工作或需要改变哪些目录用于针对目录不相同的前端工程

```

new Batch(['./public','./src']) //cli3.0
new Batch(['./static','./src']) //cli2.0
// 插件将默认使用deep模式进行覆盖上传
```

```

// start接受一个Object类型的参数，其可选的key包含
// deep: 开启deep模式 全量上传而非增量上传，如同名文件变更文件内容则必须使用deep模式上传
// config : 修改默认的配置参数 默认的配置参数如下

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

### >=v1.8.0
* 支持替换不同路径下的同名文件
* 改写替换方式，支持js文件替换
* 全文件https替换

### >=v1.7.0 
* 改写getImg方法的正则 使其可以匹配更多的非预期文件
* 支持匹配css文件内的路径
* 多个同名文件的地址会被覆盖(如有需求可酌情修复)
* 可替换.vue文件中的css样式图片和js字符串图片
* 若期望js字符串图片被替换，请使用$mi_${imgname}命名静态资源图片

### v1.6.0

* 重写忽略判断逻辑,提高循环效率,在大型项目中将有更优秀的性能
* 重写注释替换逻辑,现在可以在文件的任意位置使用注释来阻止脚本替换该文件
* 配置文件可以配置多个入口,这样做减少igonred文件的读取次数
* 支持手动更改配置文件,只需给start方法传入相应参数
* deep模式将支持更多覆盖功能
* 请规范图片文件的命名格式,禁止重复命名
* 目前支持手动和自动两种模式,不推荐在script标签下放置图片的相对路径,将有可能不会被脚本识别和替换
* 如必须在script标签下放置图片的相对路径,请使用手动替换功能