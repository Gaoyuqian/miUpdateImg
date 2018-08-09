// 定义一些伪全局变量 防止循环引用

class GlobalVar {
  constructor (options) {
    this.options = options
    this.batchObject = {}
  }
  isNull (item) {
    return this.batchObject[item] === void 0 || this.batchObject[item] === null
  }
  setItem (name, val) {
    if (this.isNull(name)) {
      this.batchObject[name] = val
      return this.batchObject
    }
  }
  getItem (name) {
    return this.batchObject[name]
  }
  getAll () {
    return this.batchObject
  }
  deleteItem (name) {
    delete this.batchObject[name]
    return this.batchObject
  }
}

const _globalVar = new GlobalVar()

module.exports = _globalVar
