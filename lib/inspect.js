'use strict';
var util = require('util');
module.exports = function (object, depth) {
  depth = depth || null;
  return util.inspect(object, {depth: depth, colors: true});
};
