const { start } = require('./util/start')

function Batch(option) {
  this.option = option || false
}
Batch.prototype.apply = function (compiler) {
  compiler.plugin('run', (compilation, callback) =>{
    start({
      fileUpdatePath:this.option.fileUpdatePath,
      size:this.option.size||null,
      staticSrc:this.option.staticSrc,
      deep: true,
      context: compilation.options.context,
      alias: compilation.options.resolve.alias,
      callback:callback
    })
  })
}
module.exports = Batch