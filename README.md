#
基于vue-cli下的图片文件批量上传模块

###
1.项目根目录下创建uploadPackage.json文件 内容为{} (v1.1.0以下的版本都需要手动创建该文件)
2.在dev-server下 引入此包  const miui = require('miuibatchupload')  并调用start方法
3.npm run dev （v1.1.0以下的版本每次dev均会执行批量脚本）
4.注册Vue全局方法  在需要的地方调用 this.getAddress,或者this.getNativeImgAddr 获取已上传的图片地址
    第一个参数均为带文件后缀的文件名字符串
    getAddress需要指定图片的裁剪规格 详情参照MIUI文件服务使用指南  
    http://wiki.n.miui.com/pages/viewpage.action?pageId=5833076
