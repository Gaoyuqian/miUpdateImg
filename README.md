# Install
```
npm install miuibatchupload
```

# APi
```
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

-------当前版本暂不支持web端获取图片地址-------

项目根目录下创建uploadPackage.json文件 内容为{}
tips:目前版本由于运行在前端工程中,所有都需要手动创建该文件,若之后需要运行于node环境下 则需要更改配置文件中output的路径信息，并同步到index.js文件中,改写getImgAdd文件中的方法使其路径一致

在dev-server下 引入此包
```

const miui = require('miuibatchupload')  
miui.start()
npm run dev

```
如果想覆盖原有文件重新上传 请使用deep模式重新上传所有待上传文件(推荐始终使用deep模式)
```

miui.start(deep)

```
注册全局方法
```

import { getThumbnailAddr,getNativeAddr } from 'miuibatchupload'
Vue.prototype.$getThumbnailAddr = getThumbnailAddr;
Vue.prototype.$getNativeAddr = getNativeAddr

```

#### 裁剪功能具体参数请参照MIUI文件服务使用指南
#### addr : {wiki}/pages/viewpage.action?pageId=5833076

# Log


### v1.2.0

#### 支持批量上传小图片
#### 获取文件路径,同时支持裁切和缩略图模式

### v1.3.0
#### 优化文件忽略逻辑，重写正则表达式
若一个文件夹被忽略，则不会递归遍历该文件夹下的所有文件了。
#### 更好的支持裁切系统，降低裁切参数的复杂度
现在有更多的默认裁剪系数被提供,并且支持了更好的错误反馈机制
#### 更改暴露出的方法名，使语义更明显
#### 增加删除文件功能(Node)

### v1.3.5
#### miuiFile.json 暴露在项目根目录下 通过fs读取内容 如果不存在 自动创建默认的文件
#### 支持视频流文件上传(Node)
#### 支持图片和文字结合，并获取合成后的图片(Node)
#### 支持自定义文件名上传 (Node)

### v1.4.0

#### 继续优化忽略逻辑
#### 支持纯node环境的路径替换功能（原有手动获取路径功能依然可用）
#### 支持被替换文件后缀名的配置项

### v1.4.5

#### 优化忽略逻辑 将不会替换http或https开头的路径
#### 支持同一页面下多个相同的路径替换
#### 不会替换任何位于注释中的图片资源（目前仅支持<!-- * -->格式的注释）

### v1.5.0
#### 改写http请求为同步请求 所有资源上传结束之后才开始替换
#### 目前支持两种替换方式分别为自动和手动。
#### 注释问题需要解决（将每个匹配到的字符块均需要一个自己在文档中的位置）
