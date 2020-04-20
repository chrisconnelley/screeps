var um = require('util.memory');
var memoryCreep = {
  setStage: function(nameCreep, stage) {
    var creep = Game.creeps[nameCreep];
    um.remember(creep, 'stage', stage);
  },
  getStage: function(nameCreep) {
    var creep = Game.creeps[nameCreep];
    return um.getString(creep, 'stage');
  },
  getSource: function(nameCreep, isSecondary) {
    var key = isSecondary ? 'sourceB' : 'source';
    var creep = Game.creeps[nameCreep];
    return um.getObject(creep, key);
  },
  setSource: function(nameCreep, idSource, isSecondary) {
    var key = isSecondary ? 'sourceB' : 'source';
    var creep = Game.creeps[nameCreep];
    return um.remember(creep, key, idSource);
  },
  getMineral: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    return um.getObject(creep, 'mineral');
  },
  setMineral: function(nameCreep, idSource) {
    var creep = Game.creeps[nameCreep];
    return um.remember(creep, 'mineral', idSource);
  },
  getStorageId: function(nameCreep) {
    var creep = Game.creeps[nameCreep];
    return um.getString(creep, 'idStorage');
  },
  setStorageId: function(nameCreep, idStorage) {
    var creep = Game.creeps[nameCreep];
    return um.remember(creep, 'idStorage', idStorage);
  },
  setRoom: function(nameCreep, nameRoom) {
    var creep = Game.creeps[nameCreep];
    return um.remember(creep, 'nameRoom', nameRoom);
  },
  getRoom: function(nameCreep) {
    var creep = Game.creeps[nameCreep];
    return um.getString(creep, 'nameRoom');
  },
  setDestination: function(nameCreep) {
  },
  getDestination: function(nameCreep) {
  }
};
module.exports = memoryCreep;