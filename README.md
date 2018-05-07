#### APi
```

```
 getThumbnailAddr(filename,/*l,s,w,h,q*/option,https=false) //获取按尺寸裁切的图片
 option={
     type:{type:String,default:'jpeg'}
     param:{type:String,default:'null'}
 }
    getThumbnailAddr('logo.png',{type:'png',param:'h120'}
    建议param中的规格参数不大于图片的本身尺寸


 getNativeAddr(filename) //获取原图
```
USE

npm install miuibatchupload

* 项目根目录下创建uploadPackage.json文件 内容为{} (目前版本由于运行在前端工程中,所有都需要手动创建该文件,若之后需要运行于node环境下 则需要更改配置文件中output的路径信息，并同步到index.js文件中,改写getImgAdd文件中的方法使其路径一致)
* 在dev-server下 引入此包  
const miui = require('miuibatchupload')  
并调用start方法
* npm run dev （v1.2.0以下的版本每次dev均会执行批量脚本,但会根据该文件是否已上传来区别上传文件）
* 如果想覆盖原有文件重新上传 请使用deep模式重新上传所有待上传文件
* 注册Vue全局方法,在需要的地方调用this.getThumbnailAddr,或者this.getNativeAddr获取已上传的图片地址
* 第一个参数均为带文件后缀的文件名字符串,getThumbnailAddr需要指定图片的裁剪规格 详情参照MIUI文件服务使用指南  
* addr : {wiki}/pages/viewpage.action?pageId=5833076
```
```
v1.2.0



1.支持批量上传小图片（大图片未测试）
2.获取文件路径 支持裁切和缩略图模式
```
```
v1.3.0（预期）



1.优化文件忽略逻辑，重写正则表达式
2.更好的支持裁切系统，降低裁切参数的复杂度
3.支持大文件图片上传
4.增加删除文件功能


done{
    1.优化忽略逻辑，若一个文件夹被忽略，则不会递归遍历该文件夹下的所有文件了。
    现在会自动创建一个新的忽略文件在工程根目录下名字是{{ignored}}
    如需要改用其他名字 请到包目录下的miuifile.json 进行配置
    2.更改暴露出的方法名，使语义更明显
    3.现在有更多的默认裁剪系数被提供,并且支持了更好的错误反馈机制
}
```

```
v1.4.0(预期)



1.支持视频流文件上传
2.支持图片和文字结合，并获取合成后的图片
3.支持自定义文件名上传
```