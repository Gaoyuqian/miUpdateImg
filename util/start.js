const {uploadFile, uploadFileObj} = require('./fileDispose/fileUpload')
const {fileDisplay} = require('./fileDispose/fileDisplay')
const {searchFile, replaceProloadChunks, chunkVendorResourcePath} = require('./fileReplace/fileReplace')
const _globalVar = require('./global/global')
// const {File} = require('./fileSystem/File')

const config = {
  'size': 1,
  'staticSrc': 'static',
  'fileList': [/\.png$/, /\.jpg$/, /\.gif$/, /\.ico$/],
  'fileUpdatePath': ['./static', './src'],
  'output': 'uploadPackage.json',
  'ignored': './ignored',
  'httpsOption': {
    'hostname': 'file.market.miui.srv',
    'port': 8756,
    'path': '/upload?channel=ZvsvZc',
    'method': 'POST'
  },
  'fileFindPath': './src',
  'preload': true
}

function beginBatchProcess (param = {}) {
  let _dep = ''
  Object.assign(_globalVar.getAll(), config, param)
  const {fileUpdatePath, fileFindPath, outputName, assetsDir, batchType} = _globalVar.getAll()
  // 先组装默认配置再加上用户配置
  _dep = fileDisplay(fileUpdatePath)
  chunkVendorResourcePath(assetsDir)
  // dep的时候进行替换 然后上传
  Promise.all(_dep.get().map(el => uploadFile(el))).then(() => {
    _globalVar.setItem('result', uploadFileObj)
    if (batchType === 'img') {
      searchFile(fileFindPath)
    } else {
      replaceProloadChunks(outputName)
    }
  }).then(() => {
  }).then(() => {
    _globalVar.getItem('callback') && _globalVar.getItem('callback')()
  })
}

module.exports = {
  beginBatchProcess
}
