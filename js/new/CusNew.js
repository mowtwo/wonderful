'use strict'
// 还不完善
function class_new(ClassCtor, ...args) {
  if (typeof ClassCtor !== 'function') {
    return {}
  }
  const _this = {}
  const _proto = ClassCtor.prototype
  for (const p in _proto) {
    _this[p] = _proto[p]
  }
  ClassCtor.call(_this, ...args)
  return _this
}
function class_extends(SuperClass, ClassCtor) {
  const _superProto = SuperClass.prototype
  const _proto = ClassCtor.prototype
  const _superThis = {}
  for (const p in _superProto) {
    _superThis[p] = _superProto[p]
  }
  for (const p in _proto) {
    _superThis[p] = _proto[p]
  }
  const _super = function (...args) {
    SuperClass.call(_superThis, ...args)
  }
  const _this = {}
  return function (...args) {
    for (const p in _superThis) {
      _this[p] = _superThis[p]
    }
    _this._super = _super
    ClassCtor.call(_this)
    delete _this._super
    return _this
  }
}

function F(name) {
  this.name = name
}
F.prototype.getName = function () {
  return this.name
}

const N = class_extends(F, function (age) {
  this._super('mowtwo')
  this.age = age
})

const n = new N(23)
console.log(n.getName())