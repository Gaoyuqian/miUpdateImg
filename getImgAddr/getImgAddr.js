const { path } = require('./../util/main')

function getNativeAddr(name, el) {
  if (!name) return false
  const content = __file.readMyFile()
  const detailSrc = 'https://ts.market.mi-img.com/thumbnail/jpeg/q80/'
  const isSmall = __smallFileDep.get().some((item) => {
    return item === name
  })
  if (isSmall) return false
  return content[name] ? `${detailSrc}${content[name]}` : el ? getNativeAddr(path.join(__staticSrc, el)) : false
}

module.exports = {
  getNativeAddr
}