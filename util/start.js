const { uploadFile, uploadFileObj } = require('./fileDispose/fileUpload')
const { fileDisplay } = require('./fileDispose/fileDisplay')
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
  ignored: './ignored',
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
      _globalVar.setItem('result', uploadFileObj)
    })
    .then(() => {
      Promise.all(chunkVendorResourcePath(assetsDir, _dep.get()).map(el => uploadFile(el))).then(
        () => {
          if (batchType === 'img') {
            searchFile(fileFindPath)
          } else {
            replaceProloadChunks(outputName)
          }
        }
      )
    })
    .then(() => {
      _globalVar.getItem('callback') && _globalVar.getItem('callback')()
    })
}

module.exports = {
  beginBatchProcess
}
