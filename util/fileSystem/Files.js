/*

  所有文件的父类 包含读写等功能

*/

const {fs} = require('../main')
const config = require('../global/global')

class Files {
  constructor (path) {
    this.file = path
    this.isExists = this.isExists()
    if (!this.isExists) {
      this.createFile()
    }
    this.content = this.readMyFile()
  };

  isExists () {
    return fs.existsSync(this.file)
  }
  createFile (content) {
    if (this.file) {
      const temp = this.file.split('/')
      const name = temp[temp.length - 1]
      fs.writeFileSync(this.file, JSON.stringify(global.__config[name] || config.__config[name]))
    }
  }
  readMyFile () {
    try {
      return JSON.parse(fs.readFileSync(this.file, 'utf-8'))
    } catch (e) {
      return fs.readFileSync(this.file, 'utf-8')
    }
  }
  writeMyFileAll (content) {
    /*

            预期为覆盖写入
            整个文件重新覆盖
            适合读取文件之后再写入

        */
    fs.writeFileSync(this.file, typeof content === 'object' ? JSON.stringify(content) : content)
  }

  writeMyFile (obj, sourceName) {
    this.content = this.readMyFile()
    /*

            替换写入
            只支持json文件格式的对象key替换
            主要是为了防止频繁的写入造成的性能消耗

            流程： 读取源文件内容，查找与源文件不同的内容 写入
            （不过如果有相同的文件期望写入 ，应该在display的时候就已经过滤掉了）

        */
    obj = typeof obj === 'object' ? obj : JSON.parse(obj)
    for (let item in obj) {
      if (!this.content[item]) {
        this.content[item] = obj[item]
      }
    }
    fs.writeFileSync(this.file, JSON.stringify(this.content))
  }
}
module.exports = {
  Files
}
