function Batch (option) {
  this.option = option || false
}

// 准备重构
//  几个要点  梳理代码逻辑，去掉不必要的逻辑，去掉全局变量 改为局部对象的key值，简化参数个数 使逻辑更清晰 期望工厂函数
// 改写函数
// 方向1 找到原始的html？ 可行性比较低
// 方向2 找到转换后的html 匹配所有src和icon 可行性比较高

Batch.prototype.apply = function (compiler) {
  let filepath = ''
  let chunksPath = ''
  let fileBlacklist = [/\.map/]
  let outputName = ''
  let tempChunks = []
  let staticChunks = []
  compiler.plugin('compilation', (compilation, options) => {
    compilation.plugin('html-webpack-plugin-before-html-processing', (compil) => {
      // indexHtml = compil.html
      const html = compil.html
      const staticReg = /src=['|"][a-zA-Z0-9\u4e00-\u9fa5_./\-*&%$#@!~]*/g // 添加静态src资源
      // 添加icon资源
      const iconReg = /href=[a-zA-Z0-9\u4e00-\u9fa5_./\-*&%$#@!~'"]*(.ico)/g
      let staticRes = html.match(staticReg)
      let iconRes = html.match(iconReg)
      console.log(iconRes,html)
      if (Array.isArray(staticRes)) {
        staticRes = staticRes.map(item => {
          return item.replace(/src=['|"]/, '')
        }).filter(item => {
          return !/^http/.test(item)
        })
      }
      if (Array.isArray(iconRes)) {
        iconRes = iconRes.map(item => {
          return item.replace(/href=['|"]/, '')
        })
      }
      staticChunks = staticChunks.concat(iconRes).concat(staticRes)
    })
    compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData) => {
      filepath = compilation.options.output.path
      outputName = htmlPluginData.outputName
      const initialChunkGroups = compilation.chunkGroups.filter(chunkGroup => chunkGroup.isInitial())
      const initialChunks = initialChunkGroups.reduce((initialChunks, {
        chunks
      }) => {
        return initialChunks.concat(chunks)
      }, [])
      tempChunks = initialChunks.map((chunks) => chunks.files).reduce((prev, curr) => prev.concat(curr), []).filter((item) => !needIgnored(item))
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
      tempChunks = tempChunks.concat(staticChunks)
      if (this.option.preload) {
        // 默认不替换
        // tempChunks 是默认的app文件 不含preload文件
        tempChunks = tempChunks.concat(chunksPath)
      }
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

  compiler.plugin('done', (comp, callback) => {
    // chunks去重
    tempChunks = Array.from(new Set(tempChunks))
    console.log(tempChunks)
    beginBatchProcess({
      chunksPath: tempChunks,
      fileUpdatePath: filepath,
      callback: callback,
      outputName: outputName,
      batchType: 'file',
      fileList: [/\.js$/, /\.css/, /\.ico/],
      preload: this.option.preload
    })
  })
}

module.exports = Batch

const {
  beginBatchProcess
} = require('./util/start')
