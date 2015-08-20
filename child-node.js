var utils = require('./utils');

module.exports = ChildNode;

function ChildNode(node) {
  this.node = node;
}

ChildNode.prototype.intentFilter = function(name) {
  return new ChildNode(utils.findOrCreateByAndroidName(this.node, 'intent-filter', name, function(node) {
    var node = node.action;
    return node && node._Attribs && node._Attribs['android:name'] === name
  }))
}

ChildNode.prototype.attr = function(key, val) {
  this.node._Attribs[key] = val;
  return this;
}

ChildNode.prototype.findOrCreateChild = function(tagName, attributes) {
  var cn = new ChildNode(utils.pushUniqueElement(this.node, tagName, attributes));
  console.log('WTF', cn);
  return cn;
}
