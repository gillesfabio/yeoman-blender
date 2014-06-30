/*jshint expr: true*/
/*global describe, it, beforeEach */
'use strict';

var path   = require('path');
var chai   = require('chai');
var _      = require('lodash');
var expect = chai.expect;

var generator = {
  'initializing' : {},
  'prompting'    : {},
  'configuring'  : {},
  'default'      : {},
  'writing'      : {},
  'install'      : {},
  'end'          : {}
};

describe('blender', function() {

  beforeEach(function() {
    this.generator = _.cloneDeep(generator);
    this.blender = require('../../')();
  });

  describe('#methods', function() {
    it('should throw error if methods are not plain object', function() {
      var M = function() {};
      var m = new M();
      expect(this.blender.methods.bind(null, m)).to.throw;
      expect(this.blender.methods.bind(null, m.prototype)).to.throw;
    });
    it('should add methods as object', function() {
      var methods = {hello: 'hello'};
      _.merge(this.generator, methods);
      this.blender.methods(methods);
      expect(this.blender.blend()).to.deep.equal(this.generator);
    });
    it('should add methods as array', function() {
      var methods = [{hello: 'hello'}, {world: 'world'}];
      _.merge(this.generator, {hello: 'hello', world: 'world'});
      this.blender.methods(methods);
      expect(this.blender.blend()).to.deep.equal(this.generator);
    });
  });

  describe('#flavors', function() {
    it('should handle wrong flavor path', function() {
      var flavors = path.join(__dirname, '..', 'fixtures', 'flavorssss', 'base');
      expect(this.blender.flavors.bind(null, flavors)).to.throw;
    });
    it('should add flavors as string', function() {
      var flavors = path.join(__dirname, '..', 'fixtures', 'flavors', 'base');
      this.blender.flavors(flavors);
      expect(this.blender.blend()).to.have.deep.property('initializing.base');
    });
    it('should add flavors as array', function() {
      var flavors = [
        path.join(__dirname, '..', 'fixtures', 'flavors', 'base'),
        path.join(__dirname, '..', 'fixtures', 'flavors', 'css')
      ];
      this.blender.flavors(flavors);
      expect(this.blender.blend()).to.have.deep.property('initializing.base');
      expect(this.blender.blend()).to.have.deep.property('initializing.css');
      expect(this.blender.blend()).to.have.deep.property('writing.css');
    });
  });

});
