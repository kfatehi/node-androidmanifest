var utils = require('./utils');

module.exports = ChildNode;

function ChildNode(node) {
  this.node = node;
}

ChildNode.prototype.intentFilter = function(name) {
  var ident = { _Attribs: { "android:name": name } };
  return new ChildNode(utils.findOrCreate(this.node, 'intent-filter', ident, function(filter) {
    var node = filter.action;
    return node && node._Attribs && node._Attribs['android:name'] === name
  }))
}

ChildNode.prototype.attr = function(key, val) {
  this.node._Attribs[key] = val;
  return this;
}

ChildNode.prototype.setCategory = function(tagName, name) {
  utils.pushUniqueElement(this.node, tagName, { 'android:name' : name });
  return this;
}
