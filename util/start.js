const { uploadFile, uploadFileObj } = require('./fileDispose/fileUpload')
const { fileDisplay } = require('./fileDispose/fileDisplay')
const { preload } = require('./preloadImg/preloadImg')

const {
  searchFile,
  replaceProloadChunks,
  chunkVendorResourcePath
} = require('./fileReplace/fileReplace')
const _globalVar = require('./global/global')
const config = {
  size: 1,
  staticSrc: 'static',
  fileList: [/\.png$/, /\.jpg$/, /\.gif$/, /\.ico$/],
  fileUpdatePath: ['./static', './src'],
  output: 'uploadPackage.json',
  httpsOption: {
    hostname: 'file.market.miui.srv',
    port: 8756,
    path: '/upload?channel=ZvsvZc',
    method: 'POST'
  },
  debugger: false,
  fileFindPath: './src',
  ignoredArray: []
}

function beginBatchProcess(param = {}) {
  let _dep = ''
  Object.assign(_globalVar.getAll(), config, param)
  const { fileUpdatePath, fileFindPath, outputName, assetsDir, batchType } = _globalVar.getAll()
  _dep = fileDisplay(fileUpdatePath)
  Promise.all(_dep.get().map(el => uploadFile(el)))
    .then(() => {
      // 获取结果集合
      _globalVar.setItem('result', uploadFileObj)
    })
    .then(() => {
      Promise.all(chunkVendorResourcePath(assetsDir, _dep.get()).map(el => uploadFile(el))).then(
        () => {
          // 开始替换对应chunks中的对应文件路径
          if (batchType === 'img') {
            searchFile(fileFindPath)
          } else {
            replaceProloadChunks(outputName)
          }
        }
      )
    })
    .then(() => {
      // img preload 相关工作 默认preload所有可收集图片 暴露出一个对应方法
      preloadImg()
    })
    .then(() => {
      // 结束
      _globalVar.getItem('callback') && _globalVar.getItem('callback')()
    })
}

module.exports = {
  beginBatchProcess
}
