module.exports = AndroidManifest;
var _ = require('lodash');
var fs = require('fs');
var XML = require('pixl-xml');

function AndroidManifest() {}

AndroidManifest.prototype.writeFile = function(path) {
  var xmlString = XML.stringify(this.data, 'manifest');
  fs.writeFileSync(path, xmlString);
  return this;
}

AndroidManifest.prototype.readFile = function(path) {
  var xml = fs.readFileSync(path).toString();
  this.data = XML.parse(xml, { preserveAttributes: true })
  return this;
}

AndroidManifest.prototype.usesPermission = function(name) {
  function setArrayNode(owner, key, obj) {
    var obj = { _Attribs: obj }
    var arr = owner[key] || [];
    if (!_.find(arr, obj)) arr.push(obj);
    return owner[key] = arr;
  }
  setArrayNode(this.data, 'uses-permission', { 'android:name': name });
  return this;
}

AndroidManifest.prototype.subclass = function(name) {
  var appNode = this.data['application'];
  appNode._Attribs['android:name'] = name;
  return this;
}

AndroidManifest.prototype.findOrCreateChild = function(parentNode, key, ident, matchExisting){
  var node = parentNode[key];
  if (_.isArray(node)) {
    node = _.find(node, ident);
    if (node) return new ChildNode(node);
    parentNode['receiver'] = ident;
    return new ChildNode(parentNode[key]);
  } else if (_.isObject(node) && matchExisting(node)) {
    return new ChildNode(node);
  } else {
    parentNode[key] = ident;
    return new ChildNode(parentNode[key]);
  }
}

AndroidManifest.prototype.receiver = function(name) {
  var ident = { _Attribs: { "android:name": name } };
  return this.findOrCreateChild(this.data['application'], 'receiver', ident, function(node) {
    return node._Attribs && node._Attribs['android:name'] === name
  });
}

AndroidManifest.prototype.service = function(name) {
  var ident = { _Attribs: { "android:name": name } };
  return this.findOrCreateChild(this.data['application'], 'service', ident, function(node) {
    return node._Attribs && node._Attribs['android:name'] === name
  });
}

AndroidManifest.prototype.activity = function(name) {
  var ident = { _Attribs: { "android:name": name } };
  return this.findOrCreateChild(this.data['application'], 'activity', ident, function(node) {
    return node._Attribs && node._Attribs['android:name'] === name
  });
}


var ChildNode = function(node) {
  this.node = node;
}

ChildNode.prototype.intentFilter = function(name) {
  return this.node['intent-filter'] = {
    action: { _Attribs: { 'android:name': name } }
  }
}

ChildNode.prototype.attr = function(key, val) {
  this.node._Attribs[key] = val;
  return this;
}
