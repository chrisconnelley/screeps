var utilMemory = {
  forget: function(creep, keyMemory) {
    delete creep.ummemory[keyMemory];
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
    return creep.memory.um[keyMemory];
  },
  getInt: function(creep, keyMemory) {
    return parseInt(creep.memory.um[keyMemory]);
  },
  getString: function(creep, keyMemory) {
    return creep.memory.um[keyMemory];
  },
  hasMemory: function(creep, keyMemory) {
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    };

    var valueMemory = creep.memory.um[keyMemory];

    // console.log("hasMemory: " + creep + " " + keyMemory + ": " + valueMemory + " " + (valueMemory !== undefined));
    return valueMemory !== undefined;
  },
  remember: function(creep, keyMemory, valueMemory) {
    // console.log("remember " + creep + " [" + keyMemory + ":" + valueMemory + "]");
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    }

    creep.memory.um[keyMemory] = valueMemory;
  },
  rememberInArray(creep, keyMemory, valueMemory) {
    // console.log("rememberInArray " + creep + " [" + keyMemory + ":" + valueMemory + "]");
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
      console.log("forgetting in array. " + creep + " " + keyMemory + " " + valueMemory);
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