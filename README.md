# Install
```
cnpm install @mipay/batch // v1.7.1
```

#Import
```
...
},
  "dependencies": {
    " @mipay/batch": "^1.7.1"
  }
...

npm install
```
* 参考 {wiki}/pages/viewpage.action?pageId=66660757

# Usage
```
npm run replace
```
如果你正在使用vue-cli 可以在build脚本中添加相应命令执行batch包

# Config

* 你需要预先配置被依赖的配置文件来告诉脚本你需要做哪些工作或需要改变哪些目录用于针对目录不相同的前端工程
* 所以我始终推荐方法调用的形式来执行batch包
```

const miui = require('PACKAGENAME')  
miui.start({deep:true})

// 推荐使用deep模式重新上传所有待上传文件
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

// 禁止修改配置文件的key值以避免不必要的错误，config的值将全部覆盖该配置文件

```

### Tips 
* 如果你了解batch包的默认配置且符合你的基本需求 可以使用npm script的形式调用此包

```
npm run replace
```
* 就像使用webpack一样

# function 

* 可替换 img标签中 src所指向的相对撸几个
* 若期望js字符串图片被替换，请使用$mi_${imgname}命名静态资源图片
* 可替换 css文件中 所有url()包裹的相对路径
* 由于miui文件系统对于相同名字的文件采取覆盖上传模式，所以所有替换格式和路径长度无关 只和文件名有关
* 自动生成ignored文件 可以像使用gitignored一样忽略你不想遍历的文件夹或忽略某个特定文件来降低遍历深度提高性能



# Log

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


# future
* 更精准的替换! 使用文件名与hash命名上传文件，使不同路径的同名文件可以更好的匹配替换