function Dep(){
    this.Dep = []
}
Dep.prototype.get = function(){
    return this.Dep
}
Dep.prototype.set = function(item){
    this.Dep.push(item)
}
Dep.prototype.equals = function(item){
    this.Dep = item
}
module.exports = {
    Dep
}