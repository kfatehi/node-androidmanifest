var _ = require('lodash');

module.exports = {
  pushUniqueElement: function(owner, key, obj) {
    var obj = { _Attribs: obj }
    var arr = owner[key] || [];
    if (_.isArray(arr)) {
      var existing = _.find(arr, obj);
      if (existing) return existing;
      arr.push(obj);
    } else if(_.isObject(arr)) {
      var arr = [arr];
      arr.push(obj);
    } else {
      throw new Error('unhandled code path');
    }
    return owner[key] = arr;
  },
  findOrCreate: function(parentNode, key, ident, matchExisting){
    var node = parentNode[key];
    if (_.isArray(node)) {
      node = _.find(node, ident);
      if (node) return node;
      parentNode[key] = ident;
      return parentNode[key];
    } else if (_.isObject(node) && matchExisting(node)) {
      return node;
    } else {
      parentNode[key] = ident;
      return parentNode[key];
    }
  },
  findOrCreateByAndroidName: function(parentNode, key, name, filter) {
    var ident = { _Attribs: { "android:name": name } };
    return this.findOrCreate(parentNode, key, ident, function(node) {
      if (filter) return filter(node);
      return node._Attribs && node._Attribs['android:name'] === name
    })
  }
}
