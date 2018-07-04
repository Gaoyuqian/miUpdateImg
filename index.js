const { start } = require('./util/start')

function Batch(option) {
  this.option = option || false
}
Batch.prototype.apply = function (compiler) {
  compiler.plugin('run', (compilation, callback) =>{
    start({
      fileUpdatePath:this.option,
      deep: true,
      context: compilation.options.context,
      alias: compilation.options.resolve.alias
    })
    callback()
  })
}
module.exports = {
  Batch
}