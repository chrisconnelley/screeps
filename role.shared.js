var util = require('util');
var locator = require('locator');


var shared = {
  displayBadge: function (creep, characterBadge, size = '10px', color = '#00FF00', stroke = '#AA0000') {
    creep.room.visual.text(characterBadge, creep.pos, {
      color: color,
      font: size,
      stroke: stroke
    });
  },  
  pave: function(creep) {
    if (creep.fatigue && creep.pos.lookFor(LOOK_STRUCTURES).length === 0) {
      creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
    } 
  },
  retrieveEnergy: function (creep) {
    var closest_energy = locator.findClosestStore(creep);
    if (!closest_energy) {
      closest_energy = locator.findClosestEnergy(creep);
    }
    var resultGather = this.gatherEnergy(creep, closest_energy);

    if (resultGather == ERR_NOT_IN_RANGE) {
      creep.moveTo(closest_energy, {
        visualizePathStyle: {
          stroke: '#0000FF'
        }
      });
    }

    return resultGather;
  },
  upgradeController: function(creep) {
    var roomSpawn = creep.room;
    var controller = roomSpawn.controller;
    var resultUpgrade = creep.upgradeController(controller);

    if (resultUpgrade == ERR_NOT_IN_RANGE) {
      creep.moveTo(roomSpawn.controller, {
        visualizePathStyle: {
          stroke: '#00ff00'
        }
      });
    }
  },
  forgetSource: function (creep) {
    creep.memory.sourceId = null;

    return "forgot source for " + creep
  },
  depositResource: function (creep) {
    containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return ((structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity() > 0);
      }
    });


    var idsInCreepStore = Object.keys(creep.store);

    // deposit all in container 
    var resultTransfer = creep.transfer(containers[0], idsInCreepStore[0]);
    if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
      // util.log("resultTransfer (" + creep + ") to (" + containers[0] + "): " + util.errorCodeToDisplay(resultTransfer));
    }
    if (resultTransfer == ERR_NOT_IN_RANGE) {
      creep.moveTo(containers[0], {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    }
    // move to container if the container isn't close enough

  },
  build: function (nameCreep) {
    var creep = Game.creeps[nameCreep];

    target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);

    if (target) {
      var resultBuild = creep.build(target);

      if (resultBuild == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: {
            stroke: '#ffffff'
          }
        });
      }

      return resultBuild;

    } else {
      return null;
    }
  },
  gatherEnergy: function (creep, source) {
    var result;
    result = creep.harvest(source);

    if (result === ERR_INVALID_TARGET || result === ERR_NO_BODYPART) {
      result = creep.pickup(source);
    }

    if (result === ERR_INVALID_TARGET || result === ERR_NO_BODYPART) {
      result = creep.withdraw(source, RESOURCE_ENERGY);
      util.log(creep.memory.role + " " + creep.name + " withdraw from " + source + " with result " + util.errorCodeToDisplay(result));
    }

    if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      util.log("Gather attempt by " + creep + " from " + source + " result: " + util.errorCodeToDisplay(result));
    }

    return result;
  },
  checkRecycle: function (nameCreep, stage, setStage) {
    var creep = Game.creeps[nameCreep];
    var spawnRenew = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

    if (!creep || !spawnRenew) {
      return false;
    }

    if (creep.ticksToLive < 100) {
      setStage(nameCreep, 'recycle');
      this.displayBadge(creep, '💀');

      creep.transfer(spawnRenew, RESOURCE_ENERGY);
    }

    if (stage(nameCreep) === 'recycle') {
      creep.moveTo(spawnRenew, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
      return true;
    }
  },
  checkRenew: function (nameCreep, nameStageAfterRenew, setStage, stage) {
    var creep = Game.creeps[nameCreep];
    var spawnRenew = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

    if (!creep || !spawnRenew) {
      return false;
    }

    if (creep.ticksToLive < 300 && spawnRenew.energy > 0) {
      setStage(nameCreep, 'renew');
      this.displayBadge(creep, '💀');

      creep.transfer(spawnRenew, RESOURCE_ENERGY);

    }

    if (stage(nameCreep) === 'renew') {
      if (creep.ticksToLive > 1400 || spawnRenew.energy < 10) {
        setStage(nameCreep, nameStageAfterRenew);
        return false;
      }
      creep.moveTo(spawnRenew, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
      return true;
    }
  },
  transferEnergyOrMoveTo: function (creep, target) {
    const u = util;
    var resultTransfer = creep.transfer(target, RESOURCE_ENERGY);
    
    u.log(`resultTransfer ${creep.name} to ${target}: ${resultTransfer}`);
    
    if (resultTransfer !== OK && resultTransfer !== ERR_NOT_IN_RANGE) {
      util.log("resultTransfer (" + creep + ") to (" + target + "): " + util.errorCodeToDisplay(resultTransfer));
    }
    if (resultTransfer == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    }
  }
}

module.exports = shared;