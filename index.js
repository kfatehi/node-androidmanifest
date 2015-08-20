module.exports = AndroidManifest;
var _ = require('lodash');
var fs = require('fs');
var pd = require('pretty-data2').pd;
var cheerio = require('cheerio');

function AndroidManifest() { this.data = {} }

AndroidManifest.prototype.toXML = function() {
  return pd.xml(this.$.xml());
}

AndroidManifest.prototype.writeFile = function(path) {
  var xmlString = this.toXML();
  fs.writeFileSync(path, xmlString);
  return this;
}

AndroidManifest.prototype.readFile = function(path) {
  var xml = fs.readFileSync(path).toString();
  this.$ = cheerio.load(xml, { xmlMode: true });
  return this;
}

AndroidManifest.prototype.usesPermission = function(name) {
  var perms = this.$('uses-permission')
  var dupe = _.find(perms, { attribs: { 'android:name': name } });
  if (!dupe) {
    var elem = this.$('<uses-permission>').attr('android:name', name);
    this.$('manifest').append(elem);
  }
  return this;
}

AndroidManifest.prototype.subclass = function(name) {
  this.$('application').attr('android:name', name);
  return this;
}

AndroidManifest.prototype.findOrCreateByAndroidName = function(parent, tag, name) {
  var manifest = this;
  var $ = manifest.$;
  var nodes = $(parent).find(' > '+tag);
  var dupe = _.find(nodes, { attribs: { 'android:name': name } });
  if (dupe) return $(dupe);
  else {
    var elem = $('<'+tag+'>').attr('android:name', name);
    $(parent).append(elem);
    return $(elem);
  }
}

AndroidManifest.prototype.receiver = function(name) {
  return this.findOrCreateByAndroidName('application', 'receiver', name);
}

AndroidManifest.prototype.service = function(name) {
  return this.findOrCreateByAndroidName('application', 'service', name);
}

AndroidManifest.prototype.activity = function(name) {
  return this.findOrCreateByAndroidName('application', 'activity', name);
}
