# Install

```
cnpm install @mipay/batch // v2.1.3
```

# Import

```
...
},
  "dependencies": {
    "@mipay/batch": "^2.1.3"
  }
...

npm install
```

- 参考 {wiki} http://wiki.n.miui.com/pages/viewpage.action?pageId=5833076
- git 地址 http://v9.git.n.xiaomi.com/mifi-fe/mifi-mp-batch.git

# Usage

- 如果你正在使用 vue-cli

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

- 推荐预先设置参数来告诉脚本你需要做哪些工作或需要改变哪些目录用于针对目录不相同的前端工程

```
/*
  插件需要的参数：

  staticSrc         当采用某种特殊写法时，文件路径指向打包后的静态资源目录，该属性为插件打包后的静态资源目录名
                    称，当脚本在正常路径下找不到相应文件时，会自动从该路径获取资源。（必填）
  fileUpdatePath    所有待上传文件的目录集合，多个目录请使用数组。（必填）
  size              单位 byte  当文件大小小于size的时 将不会被替换，使用webpack自带的loader通过base64形式
                    加载出来。默认值为10000byte（选填）
  preload           type: Boolean  是否添加preload插件 若添加 则会替换preload，prefetch文件 默认为true
  host              静态资源替换路径前缀 一般为服务器地址
  assetsDir         静态资源存放地址 插件会将该路径的文件上传至cdn 用于替换
  ignoredImg,ignoredFile 分别负责过滤不同格式的文件，在图片替换时请使用img，在文件替换时请使用file
*/

// example
  plugins: [new Batch({
    'fileUpdatePath': ['./public', './src'],
    'staticSrc': 'public',
    'size':1,
    'ignoredImg':[],
    'ignoredFile':[]
  })]
//
```

```
// 禁止修改配置文件的key值以避免不必要的错误，目前只推荐修改fileUpdatePath路径
```
