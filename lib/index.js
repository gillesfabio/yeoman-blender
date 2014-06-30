'use strict';

module.exports = function createBlender() {
  return new (require('./blender'))();
};
