const { fs, http } = require('../main')
const { getFileMap } = require('../fileUtil/util')
const _globalVar = require('../global/global.js')

let uploadFileObj = {}
// 写入的时候 先读取配置文件中的对象然后
// 对不同的地方进行修改 对新的对象进行添加 对旧属性保持不变
async function uploadFile(filepath) {
  return new Promise((resolve, reject) => {
    const options = _globalVar.getItem('httpsOption')
    const temp = filepath.split('/')
    const filename = temp[temp.length - 1].split('.')[0]
    const boundaryKey = '----' + new Date().getTime()
    const req = http.request(options, res => {
      res.setEncoding('utf8')
      res.on('data', chunk => {
        const writeContext = JSON.parse(chunk)[0].exloc
        uploadFileObj[filepath] = writeContext
        resolve()
      })
    })
    let payload =
      '\r\n------' +
      boundaryKey +
      '\r\n' +
      'Content-Disposition: form-data; name="file"; filename="' +
      filename +
      '"\r\n' +
      'Content-Type: ' +
      getFileMap(filename) +
      '\r\n\r\n'
    const enddata = '\r\n------' + boundaryKey + '--'
    let fileSt = fs.readFileSync(filepath)
    req.setHeader('Content-Type', 'multipart/form-data;boundary=----' + boundaryKey)
    req.setHeader(
      'Content-Length',
      Buffer.byteLength(payload) + Buffer.byteLength(enddata) + Buffer.byteLength(fileSt)
    )
    req.write(payload)
    req.write(fileSt)
    req.end(enddata)
  })
}
module.exports = {
  uploadFile,
  uploadFileObj
}
