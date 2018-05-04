## 基于vue-cli下的图片文件批量上传模块

```
USE

* 项目根目录下创建uploadPackage.json文件 内容为{} (v1.2.0以下的版本都需要手动创建该文件)
* 在dev-server下 引入此包  const miui = require('miuibatchupload')  并调用start方法
* npm run dev （v1.2.0以下的版本每次dev均会执行批量脚本,但会根据该文件是否已上传来区别上传文件）
* 如果想覆盖原有文件重新上传 请使用deep模式重新上传所有待上传文件
* 注册Vue全局方法  在需要的地方调用 this.getAddress,或者this.getNativeImgAddr 获取已上传的图片地址
* 第一个参数均为带文件后缀的文件名字符串 getAddress需要指定图片的裁剪规格 详情参照MIUI文件服务使用指南  
* addr : {wiki}/pages/viewpage.action?pageId=5833076
```
```
v1.2.0

1.支持批量上传小图片（大图片未测试）
2.获取文件路径 return String
```
```
v1.3.0（预期）



1.优化文件忽略逻辑，重写正则表达式
2.更好的支持裁切系统，降低裁切参数的复杂度
3.支持大文件图片上传
4.增加删除文件功能
```

```
v1.4.0(预期)




1.支持视频流文件上传
2.支持图片和文字结合，并获取合成后的图片
3.支持自定义文件名上传
```