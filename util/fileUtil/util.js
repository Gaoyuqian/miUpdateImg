const { fs, _mime } = require('../main.js')
const _globalVar = require('../global/global.js')

module.exports = {
  debuggerConsole(...arg) {
    if (_globalVar.getItem('debugger')) {
      console.log.apply(this, arg)
    }
  },
  isIgnoredFile: (name, isDir) => {
    // 判断文件是否在ignored中被忽略
    /*
        param:{
            name //文件路径
        }

        return: 返回Boolean 表示该文件路径是否在配置文件中被标记为可忽略文件

        tip: 被标记为可忽略文件的文件夹下的所有文件均不会被添加依赖
    */
    try {
      const res = fs.readFileSync(_globalVar.getItem('ignored'), 'utf-8')
      if (res !== 'undefined' && res !== '') {
        const resource = res.split('\n')
        const willIgnoreArray = resource.map(el => {
          return el.replace(/\*/, '')
        })
        for (let item of willIgnoreArray) {
          if (isDir) {
            name += '/'
          }
          if (~name.indexOf(item)) {
            if (/\/$/.test(name)) {
              return 'all'
            }
            return 'single'
          }
        }
      }
      return 'none'
    } catch (e) {
      // fs.writeFileSync(_globalVar.getItem('ignored'), '')
    }
  },

  canBeMap: name => {
    const fileList = _globalVar.getItem('fileList')
    if (Array.isArray(fileList)) {
      return fileList.some(item => item.test(name))
    } else {
      return fileList.test(name)
    }
  },

  getFileMap: fileName => {
    // 选择请求体中的type字段
    /*
        param :{
            fileName // 文件名或者文件路径（包含拓展名）
        }
        return: 返回对应的fileMap中的映射字符串
    */
    return _mime.getType(fileName)
  },
  isReplaceableFile: name => {
    const reg = /(\.vue$)|(\.html$)|(\.css$)|(\.scss$)|(\.less$)|(\.js$)/
    return reg.test(name)
  }
}
