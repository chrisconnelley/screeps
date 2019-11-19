var util = require('util');
var um = require('util.memory');

var memoryCreep = {
  setStage: function(nameCreep, stage) {
    var creep = Game.creeps[nameCreep];
    um.remember(creep, 'stage', stage);
  },
  getStage: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    return um.getString(creep, 'stage');
  },
  getSource: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    return um.getObject(creep, 'source');
  },
  setSource(nameCreep, idSource) {
    var creep = Game.creeps[nameCreep];
    return um.remember(creep, 'source', idSource);
  },
  getStorageId: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    return um.getString(creep, 'idStorage');
  },
  setStorageId(nameCreep, idStorage) {
    var creep = Game.creeps[nameCreep];
    return um.remember(creep, 'idStorage', idStorage);
  },
  setRoom: function (nameCreep, nameRoom) {
    var creep = Game.creeps[nameCreep];
    return um.remember(creep, 'nameRoom', nameRoom);
  },
  getRoom: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    return um.getString(creep, 'nameRoom');
  }
};

module.exports = memoryCreep;