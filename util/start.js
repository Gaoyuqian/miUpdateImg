const {uploadFile, uploadFileObj} = require('./fileDispose/fileUpload')
const {fileDisplay} = require('./fileDispose/fileDisplay')
const {searchFile, replaceProloadChunks} = require('./fileReplace/fileReplace')
const _globalVar = require('./global/global')

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
  const {fileUpdatePath} = _globalVar.getAll()
  // 先组装默认配置再加上用户配置
  _dep = fileDisplay(fileUpdatePath)
  Promise.all(_dep.get().map(el => uploadFile(el))).then(() => {
    _globalVar.setItem('result', uploadFileObj)
    if (
      _globalVar.getItem('batchType') === 'img'
    ) {
      searchFile(_globalVar.getItem('fileFindPath'))
    } else {
      replaceProloadChunks(_globalVar.getItem('outputName'))
    }
  }).then(() => {
    _globalVar.getItem('callback') && _globalVar.getItem('callback')()
  })
}

module.exports = {
  beginBatchProcess
}
