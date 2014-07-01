'use strict';

var fs   = require('fs');
var path = require('path');
var util = require('util');
var _    = require('lodash');

module.exports = Blender;

function Blender() {
  this._methods = [];
  this._flavors = [];
  this.generator = {
    'initializing' : {},
    'prompting'    : {},
    'configuring'  : {},
    'default'      : {},
    'writing'      : {},
    'install'      : {},
    'end'          : {}
  };
}

var proto = Blender.prototype;

proto.blend = function() {
  this._mergeMethods();
  this._mergeFlavors();
  return this.generator;
};

proto.methods = function(methods) {
  this._methods = methods;
  this._checkMethods();
};

proto.flavors = function(flavors) {
  this._flavors = flavors;
  this._checkFlavors();
};

proto._checkMethods = function() {
  if (!_.isArray(this._methods)) this._methods = [this._methods];
  this._methods.forEach(function(mixin) {
    if (!_.isPlainObject(mixin)) throw new Error(util.format('%j must be a plain object', mixin));
  }, this);
};

proto._checkFlavors = function() {
  if (!_.isArray(this._flavors)) this._flavors = [this._flavors];
  this._flavors.forEach(function(flavor) {
    if (!fs.existsSync(path.resolve(flavor))) {
      throw new Error(util.format('Flavor directory "%s" does not exists.', flavor));
    }
  }, this);
};

proto._mergeMethods = function() {
  this._methods.forEach(function(mixin) {
    _.merge(this.generator, mixin);
  }, this);
};

proto._mergeFlavors = function() {
  Object.keys(this.generator).forEach(function(queue) {
    this._flavors.forEach(function(flavor) {
      var file = path.join(path.resolve(flavor), util.format('%s.js', queue));
      if (fs.existsSync(file)) _.merge(this.generator[queue], require(file));
    }, this);
  }, this);
};
