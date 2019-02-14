function preloadImgOver() {
  const result = _globalVar.getItem('result')
  console.log(result)
  const resultArray = Object.keys(result).map(item => result[item])
  Promise.all(resultArray.map(item => pre(item))).then(() => {
    new Promise.resolve()
  })
}
function pre(item) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = item
    img.onload = () => {
      resolve()
    }
    img.error = () => {
      reject()
    }
  })
}
module.exports = {
  preloadImgOver
}
