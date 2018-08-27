const { fs, path } = require('./../main')
const { isIgnoredFile, canBeMap, isReplaceableFile } = require('./../fileUtil/util')
const Dep = require('./../fileSystem/depend')
const _globalVar = require('../global/global.js')
const smallFileDep = new Dep()

function fileDisplay(filepath, model, dep) {
  let _dep = dep || new Dep()
  if (Array.isArray(filepath)) {
    filepath.forEach(el => {
      const files = fs.readdirSync(el)
      addDep(files, el, _dep, model)
    })
  } else {
    const files = fs.readdirSync(filepath)
    addDep(files, filepath, _dep, model)
  }
  // 检测收集到的依赖是否都是chunks
  return _dep
}

function addDep(fileArray, filepath, Dep, model) {
  fileArray.forEach(filename => {
    const filedir = path.join(filepath, filename)
    const stats = fs.statSync(filedir)
    const isFile = stats.isFile()
    const isDir = stats.isDirectory()
    if (isFile) {
      if (isIgnoredFile(filedir, false) === 'single') {
        // console.log(chalk.yellow('该文件已被忽略-------')+filedir)
        return
      }
      if (model === 'find') {
        // find模式下支持文件后缀检测 支持.vue文件和.html文件格式 使用正则匹配
        if (isReplaceableFile(filedir)) {
          Dep.set(filedir)
        }
      } else {
        if (canBeMap(filename)) {
          if (stats.size > _globalVar.getItem('size')) {
            Dep.set(filedir)
          } else {
            // 备用
            smallFileDep.set(filedir)
          }
        } else {
          // console.log('不支持该文件格式,如需支持,请在映射中添加该文件对应的参数值-------' + filedir)
        }
      }
    } else if (isDir) {
      if (isIgnoredFile(filedir, true) === 'all') {
        // console.log(chalk.yellow('该路径已被忽略-------')+filedir)
      } else {
        fileDisplay(filedir, model, Dep)
      }
    }
  })
}

module.exports = {
  fileDisplay,
  smallFileDep,
  addDep
}
