var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleTransportRemote = {
  run: function (creep) {
    const u = util;
    if (creep.spawning) return;
    shared.displayBadge(creep, 'TR');
    
    var nameRoomTransport = mc.getRoom(creep.name);
    var stage = mc.getStage(creep.name);
   
    if (!stage && creep.pos.roomName == nameRoomTransport) {
      mc.setStage(creep.name, 'gathering');
    }

    u.log(`stage: ${stage}`);

    if (stage === 'gathering') {
      this.gather(creep);
    } else if (stage === 'delivering') { 
      this.deliver(creep);
    } else {
      var roomPositionTransport = new RoomPosition(25, 25, nameRoomTransport);
      creep.moveTo(roomPositionTransport, {
        visualizePathStyle: {
          stroke: '#00FFFF'
        }
      })
    }

    
    u.log(`nameRoomTransport: ${nameRoomTransport}`);
  },
  gather: function(creep) {
    const u =  util;
    var closest_energy; 
    closest_energy = locator.findBestResource(creep);
    
    if (!closest_energy) closest_energy = locator.findClosestEnergy(creep);
    var resultGather = shared.gatherEnergy(creep, closest_energy);

    if (resultGather == ERR_NOT_IN_RANGE) {
      creep.moveTo(closest_energy, {
        visualizePathStyle: {
          stroke: '#ffaa00'
        }
      });
    }

    if (creep.store.getFreeCapacity() === 0 ||
      closest_energy[RESOURCE_ENERGY] === 0) {
        mc.setStage(creep.name, 'delivering');
    }
  },
  deliver: function(creep) {
    const u = util;

    var idStorage = mc.getStorageId(creep.name);

    if (!idStorage) {
      const storageFound = locator.findStorageOwnedClosest(creep.room.roomName);
      mc.setStorageId(creep.name, storageFound.id);
      idStorage = storageFound.id;
    }

    var storage = Game.getObjectById(idStorage);

    u.log(`${creep.name} found storage: ${storage} ${idStorage}`);

    shared.transferEnergyOrMoveTo(creep, storage);

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      mc.setStage(creep.name, null);
    }
  }
};

module.exports = roleTransportRemote;