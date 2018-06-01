# Install
```
npm install miuibatchupload // 1.5.0
OR
cnpm install @mipay/batch  //1.6.0
```

# APi
```
start({deep:true:config:{}})

getThumbnailAddr(filename,/*l,s,w,h,q*/option,https=false) //获取按尺寸裁切图片

option={
    type:{type:String,default:'jpeg'}
    param:{type:String,default:'null'}
}
//el
getThumbnailAddr('logo.png',{type:'png',param:'h120'}

------------------------------------

getNativeAddr(filename) //获取原图

```

# Use

## node

在需要时调用start方法即可执行批量上传和指定文件的替换功能

所有配置文件会自动创建为默认配置，可自行修改。


## web
### 不建议使用
项目根目录下创建uploadPackage.json文件 内容为{}
tips:目前版本由于运行在前端工程中,所有都需要手动创建该文件,若之后需要运行于node环境下 则需要更改配置文件中output的路径信息，并同步到index.js文件中,改写getImgAdd文件中的方法使其路径一致

手动引入此包
```

const miui = require('PACKAGENAME')  
miui.start()
npm run dev

```
如果想覆盖原有文件重新上传 请使用deep模式重新上传所有待上传文件(推荐始终使用deep模式)


## config

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
手动注册全局方法
```

import { getThumbnailAddr,getNativeAddr } from 'miuibatchupload'
Vue.prototype.$getThumbnailAddr = getThumbnailAddr;
Vue.prototype.$getNativeAddr = getNativeAddr

```

#### 裁剪功能具体参数请参照MIUI文件服务使用指南
#### addr : {wiki}/pages/viewpage.action?pageId=5833076

# Log

### v1.6.0

* 重写忽略判断逻辑,提高循环效率,在大型项目中将有更优秀的性能
* 重写注释替换逻辑,现在可以在文件的任意位置使用注释来阻止脚本替换该文件
* 配置文件可以配置多个入口,这样做减少igonred文件的读取次数
* 支持手动更改配置文件,只需给start方法传入相应参数
* deep模式将支持更多覆盖功能
* 请规范图片文件的命名格式,禁止重复命名
* 目前支持手动和自动两种模式,不推荐在script标签下放置图片的相对路径,将有可能不会被脚本识别和替换
* 如必须在script标签下放置图片的相对路径,请使用手动替换功能