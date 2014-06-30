'use strict';

var fs   = require('fs');
var path = require('path');
var util = require('util');
var _    = require('lodash');

var Blender = module.exports = function() {
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
};

Blender.prototype.blend = function() {
  this._mergeMethods();
  this._mergeFlavors();
  return this.generator;
};

Blender.prototype.methods = function(methods) {
  this._methods = methods;
  this._checkMethods();
};

Blender.prototype.flavors = function(flavors) {
  this._flavors = flavors;
  this._checkFlavors();
};

Blender.prototype._checkMethods = function() {
  if (!_.isArray(this._methods)) this._methods = [this._methods];
  this._methods.forEach(function(mixin) {
    if (!_.isPlainObject(mixin)) throw new Error(util.format('%j must be a plain object', mixin));
  }, this);
};

Blender.prototype._checkFlavors = function() {
  if (!_.isArray(this._flavors)) this._flavors = [this._flavors];
  this._flavors.forEach(function(flavor) {
    if (!fs.existsSync(path.resolve(flavor))) {
      throw new Error(util.format('Flavor directory "%s" does not exists.', flavor));
    }
  }, this);
};

Blender.prototype._mergeMethods = function() {
  this._methods.forEach(function(mixin) {
    _.merge(this.generator, mixin);
  }, this);
};

Blender.prototype._mergeFlavors = function() {
  Object.keys(this.generator).forEach(function(queue) {
    this._flavors.forEach(function(flavor) {
      var file = path.join(path.resolve(flavor), util.format('%s.js', queue));
      if (fs.existsSync(file)) _.merge(this.generator[queue], require(file));
    }, this);
  }, this);
};
