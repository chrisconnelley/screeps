var util = require('util');
var locator = require('locator');
var mc = require('util.memory.creep')


var shared = {
  displayBadge: function (creep, characterBadge, size = '10px', color = '#00FF00', stroke = '#AA0000') {
    creep.room.visual.text(characterBadge, creep.pos, {
      color: color,
      font: size,
      stroke: stroke
    });
  },  
  pave: function(creep) {
    // if (creep.fatigue && creep.pos.lookFor(LOOK_STRUCTURES).length === 0) {
    //   creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
    // } 
  },
  transfer: function(creep, target) {
    const u = util;
    u.log(`[role.shared transfer] creep: ${creep} target: ${target}`);

    u.log(`[role.shared transfer] creep.store ${JSON.stringify(creep.store)}`);

    var typeResources = Object.keys(creep.store);
    
    u.log(`typeResources ${typeResources}`);
    
    return creep.transfer(target, typeResources[0]);
  },
  depositResource: function(creep) {
    const u = util;
    container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return ((structure.structureType == STRUCTURE_CONTAINER || 
          structure.structureType == STRUCTURE_STORAGE
          ) && structure.store.getFreeCapacity() > 0);
      }
    });

    var idsInCreepStore = Object.keys(creep.store);

    // deposit all in container 
    var resultTransfer = creep.transfer(container, idsInCreepStore[0]);
    if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
      u.log("resultTransfer (" + creep + ") to (" + container + "): " + util.errorCodeToDisplay(resultTransfer));
    }
    if (resultTransfer == ERR_NOT_IN_RANGE) {
      creep.moveTo(container, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    }
    // move to container if the container isn't close enough

  },
  checkShouldDeposit: function(creep) {
    var idsInCreepStore = Object.keys(creep.store);
    if ((idsInCreepStore.length == 1 && idsInCreepStore[0] !== 'energy') || idsInCreepStore.length > 1) {
      util.log("Creep (" + creep + ") should deposit resources");
      this.depositResource(creep);  
      return true;
    }

    return false;  
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
    const u = util;
    
    if (!creep || !source) return;
    
    var result;
    result = creep.harvest(source);

    if (result === ERR_INVALID_TARGET || result === ERR_NO_BODYPART) {
      result = creep.pickup(source);
    }

    if (result === ERR_INVALID_TARGET || result === ERR_NO_BODYPART) {
        if (source.store) {
              var typeResources = Object.keys(source.store);
              result = creep.withdraw(source, typeResources[0]);
              u.log(`creep.memory.role ${creep.name} withdraw ${typeResources[0]} from ${source} with result ${util.errorCodeToDisplay(result)}`);
        }
    }

    if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      u.log(`Gather attempt by ${creep} from ${source} result: ${util.errorCodeToDisplay(result)}`);
    }

    return result;
  },
  checkRecycle: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    
    if (creep.ticksToLive < 100) {
      mc.setStage(nameCreep, 'recycle');
    }
  },
  recycleStage: function(nameCreep) {
    var creep = Game.creeps[nameCreep];
    var spawnRenew = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

    if (!creep || !spawnRenew) {
      return false;
    }

    this.displayBadge(creep, '💀');

    var result = creep.transfer(spawnRenew, RESOURCE_ENERGY);
    var desc = `Transfer from creep ${creep} to spawn ${spawnRenew}`;

    if (result === ERR_NOT_IN_RANGE) {
      result = creep.moveTo(spawnRenew, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
      desc = `Move creep ${creep} to spawn ${spawnRenew}`;
    }

    return { 
      result: result,
      code: util.errorCodeToDisplay(result),
      desc: desc
    };
  },
  checkRenew: function (nameCreep, nameStageAfterRenew) {
    // return;
    var creep = Game.creeps[nameCreep];
    // var spawnRenew = util.pickRandom(creep.room.find(FIND_MY_SPAWNS));
    var spawnRenew = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
    
    if (!creep || !spawnRenew) {
      return false;
    }

    if (creep.ticksToLive < 300 && spawnRenew.energy > 0) {
      mc.setStage(nameCreep, 'renew');
      this.displayBadge(creep, '💀');

      creep.transfer(spawnRenew, RESOURCE_ENERGY);

    }

    if (mc.getStage(nameCreep) === 'renew') {
      if (creep.ticksToLive > 1400 || spawnRenew.energy < 10) {
        mc.setStage(nameCreep, nameStageAfterRenew);
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