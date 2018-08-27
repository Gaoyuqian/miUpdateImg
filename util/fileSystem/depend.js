function Dep() {
  this.Dep = []
}
Dep.prototype.get = function() {
  return this.Dep
}
Dep.prototype.set = function(item) {
  this.Dep.push(item)
}
Dep.prototype.equals = function(item) {
  this.Dep = item
}
Dep.prototype.checkRepeat = function(item) {
  return !!this.Dep.find(val => {
    return val === item
  })
}

module.exports = Dep
//  理论上应该为所有依赖的父类
