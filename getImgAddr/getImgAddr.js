const {path} = require('./../util/main')

function getNativeAddr(name, el) {
  const content = __file.readMyFile()
  const detailSrc = 'https://ts.market.mi-img.com/thumbnail/jpeg/q80/'
  if (!name) return false
  return content[name] ? `${detailSrc}${content[name]}` : el ? getNativeAddr(path.join(__staticSrc, el)) : false
}

module.exports = {
  getNativeAddr
}