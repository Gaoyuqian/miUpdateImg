function Batch(option) {
  this.option = option || false
}

// 准备重构
//  几个要点  梳理代码逻辑，去掉不必要的逻辑，去掉全局变量 改为局部对象的key值，简化参数个数 使逻辑更清晰 期望工厂函数
// 改写函数

Batch.prototype.apply = function (compiler) {
  let filepath = ''
  let chunksPath = ''
  let html = ''
  let fileBlacklist = [/\.map/]
  let outputName = ''
  compiler.plugin('compilation', function (compilation, options) {
    compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData) => {
      filepath = compilation.options.output.path
      outputName = htmlPluginData.outputName
      const initialChunkGroups = compilation.chunkGroups.filter(chunkGroup => chunkGroup.isInitial())
      const initialChunks = initialChunkGroups.reduce((initialChunks, {
        chunks
      }) => {
        return initialChunks.concat(chunks)
      }, [])
      const tempChunks = initialChunks.map((chunks) => chunks.files).reduce((prev, curr) => prev.concat(curr), []).filter((item) => !needIgnored(item))
      let extractedChunks = compilation.chunks.filter(chunk => {
        return initialChunks.indexOf(chunk) < 0
      })
      extractedChunks = extractedChunks.filter(chunk => {
        const rootChunksHashs = Object.values(htmlPluginData.assets.chunks).map(({
          hash
        }) => hash)
        const rootChunkGroups = compilation.chunkGroups.reduce((groups, chunkGroup) => {
          const isRootChunkGroup = chunkGroup.chunks.reduce((flag, chunk) => {
            return flag ||
              rootChunksHashs.indexOf(chunk.renderedHash) > -1
          }, false)
          if (isRootChunkGroup) groups.push(chunkGroup)
          return groups
        }, [])
        return Array.from(chunk.groupsIterable).reduce((flag, chunkGroup) => {
          return flag ||
            doesChunkGroupBelongToHTML(chunkGroup, rootChunkGroups, {})
        }, false)
      })
      chunksPath = extractedChunks = extractedChunks.map((chunks) => chunks.files).reduce((prev, curr) => prev.concat(curr), []).filter((item) => !needIgnored(item))
      chunksPath = chunksPath.concat(tempChunks)
    })
  })
  compiler.plugin('run', (compilation, callback) => {
    beginBatchProcess({
      fileUpdatePath: this.option.fileUpdatePath,
      size: this.option.size || null,
      staticSrc: this.option.staticSrc,
      batchType: 'img',
      context: compilation.options.context,
      alias: compilation.options.resolve.alias,
      callback: callback
    })
  })
  const needIgnored = (item) => {
    for (let reg of fileBlacklist) {
      if (reg.test(item)) {
        return true
      }
    }
    return false
  }
  const doesChunkGroupBelongToHTML = (chunkGroup, rootChunkGroups, visitedChunks) => {
    if (visitedChunks[chunkGroup.groupDebugId]) {
      return false
    }
    visitedChunks[chunkGroup.groupDebugId] = true

    for (const rootChunkGroup of rootChunkGroups) {
      if (rootChunkGroup.groupDebugId === chunkGroup.groupDebugId) {
        return true
      }
    }

    for (const parentChunkGroup of chunkGroup.getParents()) {
      if (doesChunkGroupBelongToHTML(parentChunkGroup, rootChunkGroups, visitedChunks)) {
        return true
      }
    }

    return false
  }

  compiler.plugin('done', function (comp, callback) {
    beginBatchProcess({
      chunksPath: chunksPath,
      fileUpdatePath: filepath,
      callback: callback,
      outputName: outputName,
      batchType: 'file',
      fileList: [/\.js$/, /\.css/, /\.ico/],
    })
  })
}

module.exports = Batch

const {
  beginBatchProcess
} = require('./util/start')