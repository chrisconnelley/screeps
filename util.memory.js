var util = require('util');

var utilMemory = {
  forget: function(creep, keyMemory) {
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    };
    delete creep.memory.um[keyMemory];
  },
  getArray: function(creep, keyMemory) {
    var arrayMemory = creep.memory.um[keyMemory];
    return arrayMemory;
  },
  getObject: function(creep, keyMemory) {
    var object = Game.getObjectById(creep.memory.um[keyMemory]);
    
    if (object === null) {
      this.forget(creep, keyMemory);
    };
    return object;
  },
  getBoolean: function(creep, keyMemory) {
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    };
    return creep.memory.um[keyMemory];
  },
  getInt: function(creep, keyMemory) {
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    };
    return parseInt(creep.memory.um[keyMemory]);
  },
  getString: function(creep, keyMemory) {
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    };
    return creep.memory.um[keyMemory];
  },
  hasMemory: function(creep, keyMemory) {
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    };
    var valueMemory = creep.memory.um[keyMemory];
    // //
    return valueMemory !== undefined;
  },
  remember: function(creep, keyMemory, valueMemory) {
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    }
    creep.memory.um[keyMemory] = valueMemory;
    return creep.memory.um[keyMemory];
  },
  rememberInArray(creep, keyMemory, valueMemory) {
    // //
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    }
    if (creep.memory.um[keyMemory] === undefined) {
      creep.memory.um[keyMemory] = [];
    }
    creep.memory.um[keyMemory].push(valueMemory);
  },
  forgetInArray(creep, keyMemory, valueMemory) {
    if (creep.memory.um == undefined) {
      creep.memory.um = {};
    }
    if (creep.memory.um[keyMemory] === undefined) {
      creep.memory.um[keyMemory] = [];
    }
    if (creep.memory.um[keyMemory].contains[valueMemory]) {
      //
    }
  },
  forgetInArrayByIndex(creep, keyMemory, index) {
    if (creep.memory.um == undefined) {
      creep.memory.um = {};
    }
    if (creep.memory.um[keyMemory] === undefined) {
      creep.memory.um[keyMemory] = [];
    }
    var valueMemory = creep.memory.um[keyMemory][index];
    this.forgetInArray(creep, keyMemory, valueMemory);
  }
};
module.exports = utilMemory;