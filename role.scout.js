var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');

var roleScout = {
  run: function (creep) {
    const u = util;
    if (creep.spawning) return;
    shared.displayBadge(creep, 'S');
    
    var nameRoomScout = mc.getRoom(creep.name);
   
    u.log(`creep: ${creep} nameRoomScout: ${nameRoomScout}`);

    var roomPositionScout = new RoomPosition(25, 25, nameRoomScout);
    creep.moveTo(roomPositionScout, {
      visualizePathStyle: {
        stroke: '#00FFFF'
      }
    }) 
  }
};

module.exports = roleScout;