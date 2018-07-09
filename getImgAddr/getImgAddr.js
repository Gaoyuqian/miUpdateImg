const { path } = require('./../util/main')

function getNativeAddr(addr, el,name,form) {
  if (!addr) return false
  const content = __file.readMyFile()
  const detailSrc = 'https://ts.market.mi-img.com/thumbnail/jpeg/q80/'
  const isSmall = __smallFileDep.get().some((item) => {
    return item === addr
  })
  console.log(path.join(`${__staticSrc}/images/`, `${name}${form}`))
  if (isSmall) return false
  return content[addr] ? `${detailSrc}${content[addr]}` : el ? getNativeAddr(path.join(`${__staticSrc}/images/`, `${name}${form}`)) : false
}

module.exports = {
  getNativeAddr
}