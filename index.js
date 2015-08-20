module.exports = AndroidManifest;
var _ = require('lodash');
var fs = require('fs');
var XML = require('pixl-xml');
var utils = require('./utils');
var ChildNode = require('./child-node');

function AndroidManifest() { this.data = {} }

AndroidManifest.prototype.toXML = function() {
  return XML.stringify(this.data, 'manifest');
}

AndroidManifest.prototype.toJSON = function() {
  return JSON.stringify(this.data, null, 2);
}

AndroidManifest.prototype.writeFile = function(path) {
  var xmlString = this.toXML();
  fs.writeFileSync(path, xmlString);
  return this;
}

AndroidManifest.prototype.readFile = function(path) {
  var xml = fs.readFileSync(path).toString();
  this.data = XML.parse(xml, { preserveAttributes: true })
  return this;
}

AndroidManifest.prototype.usesPermission = function(name) {
  utils.pushUniqueElement(this.data, 'uses-permission', { 'android:name': name });
  return this;
}

AndroidManifest.prototype.subclass = function(name) {
  var appNode = this.data['application'];
  appNode._Attribs['android:name'] = name;
  return this;
}

AndroidManifest.prototype.receiver = function(name) {
  var ident = { _Attribs: { "android:name": name } };
  return new ChildNode(utils.findOrCreate(this.data['application'], 'receiver', ident, function(node) {
    return node._Attribs && node._Attribs['android:name'] === name
  }))
}

AndroidManifest.prototype.service = function(name) {
  var ident = { _Attribs: { "android:name": name } };
  return new ChildNode(utils.findOrCreate(this.data['application'], 'service', ident, function(node) {
    return node._Attribs && node._Attribs['android:name'] === name
  }))
}

AndroidManifest.prototype.activity = function(name) {
  var ident = { _Attribs: { "android:name": name } };
  return new ChildNode(utils.findOrCreate(this.data['application'], 'activity', ident, function(node) {
    return node._Attribs && node._Attribs['android:name'] === name
  }))
}
