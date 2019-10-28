var utilMemory = {
  forget: function(creep, keyMemory) {
    delete creep.ummemory[keyMemory];
  },
  getObject: function(creep, keyMemory) {
    var object = Game.getObjectById(creep.memory.um[keyMemory]);
    
    if (object === null) {
      this.forget(creep, keyMemory);
    };

    return object;
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

    return creep.memory.um[keyMemory] !== null;
  },
  remember: function(creep, keyMemory, valueMemory) {
    if (creep.memory.um === undefined) { 
      creep.memory.um = {};
    }

    creep.memory.um[keyMemory] = valueMemory;
  }
};

module.exports = utilMemory;