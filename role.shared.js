var util = require('util');
var locator = require('locator');
var mc = require('util.memory.creep');
var shared = {
  displayBadge: function (creep, characterBadge, size = '10px', color = '#00FF00', stroke = '#AA0000') {
    creep.room.visual.text(characterBadge, creep.pos, {
      color: color,
      font: size,
      stroke: stroke,
    });
  },
  displayBadgeOld: function (creep, characterBadge, size = '10px', color = '#00FF00', stroke = '#AA0000') {
    creep.room.visual.text(characterBadge, creep.pos, {
      color: color,
      font: size,
      stroke: stroke,
    });
  },
  displayBadgeNew: function (creep, badge) {
    this.displayBadge(creep, badge.character, badge.size, badge.colorOfText, badge.colorOfStroke);
  },
  transfer: function (creep, target) {
    var typeResources = Object.keys(creep.store);
    return creep.transfer(target, typeResources[0]);
  },
  depositResource: function (creep) {
    container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TERMINAL || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity() > 0;
      },
    });

    var idsInCreepStore = Object.keys(creep.store);

    // deposit all in container
    var resultTransfer = creep.transfer(container, idsInCreepStore[0]);
    if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
    }
    if (resultTransfer == ERR_NOT_IN_RANGE) {
      creep.moveTo(container, {
        visualizePathStyle: {
          stroke: '#ffffff',
        },
      });
    }
  },
  checkShouldDeposit: function (creep) {
    var idsInCreepStore = Object.keys(creep.store);
    if ((idsInCreepStore.length == 1 && idsInCreepStore[0] !== 'energy') || idsInCreepStore.length > 1) {
      this.depositResource(creep);
      return true;
    }

    return false;
  },
  retrieveEnergy: function (creep) {
    var closest_energy = locator.findClosestStoreEnergy(creep);
    if (!closest_energy) {
      closest_energy = locator.findClosestEnergy(creep);
    }
    var resultGather = this.gatherEnergy(creep, closest_energy);

    if (resultGather == ERR_NOT_IN_RANGE) {
      creep.moveTo(closest_energy, {
        visualizePathStyle: {
          stroke: '#0000FF',
        },
      });
    }

    return resultGather;
  },
  upgradeController: function (creep) {
    var roomSpawn = creep.room;
    var controller = roomSpawn.controller;
    var resultUpgrade = creep.upgradeController(controller);

    if (resultUpgrade == ERR_NOT_IN_RANGE) {
      creep.moveTo(roomSpawn.controller, {
        visualizePathStyle: {
          stroke: '#00ff00',
        },
      });
    }
  },
  deliverResource: function (creep, target, typeResource, amount) {
    //
    var targetObject = Game.getObjectById(target);

    if (creep.pos.isNearTo(targetObject)) {
      var result = creep.transfer(targetObject, typeResource, parseInt(amount));
      //       return result;
    } else {
      creep.moveTo(targetObject, {
        visualizePathStyle: {
          fill: 'transparent',
          stroke: '#0000ff',
          lineStyle: 'solid',
          strokeWidth: 0.35,
          opacity: 0.5,
        },
      });
      return ERR_NOT_IN_RANGE;
    }
  },
  depositResources: function (creep) {
    containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_STORAGE && structure.store.getFreeCapacity() > 0;
      },
    });
    var idsInCreepStore = Object.keys(creep.store);

    // deposit all in container
    var resultTransfer = creep.transfer(containers[0], idsInCreepStore[0]);
    if (resultTransfer == ERR_NOT_IN_RANGE) {
      creep.moveTo(containers[0], {
        visualizePathStyle: {
          stroke: '#ffffff',
        },
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
            stroke: '#ffffff',
          },
        });
      }

      return resultBuild;
    } else {
      return null;
    }
  },
  gatherEnergy: function (creep, source) {
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
      }
    }

    if (result !== OK && result !== ERR_NOT_IN_RANGE) {
    }

    return result;
  },
  checkRecycle: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    if (creep.ticksToLive < 100) {
      mc.setStage(nameCreep, 'recycle');
    }
  },
  recycleStage: function (nameCreep) {
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
          stroke: '#ffffff',
        },
      });
      desc = `Move creep ${creep} to spawn ${spawnRenew}`;
    }

    return {
      result: result,
      code: util.errorCodeToDisplay(result),
      desc: desc,
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
      if (creep.ticksToLive > 1400 || spawnRenew.energy < 10 || spawnRenew.spawning) {
        mc.setStage(nameCreep, nameStageAfterRenew);
        return false;
      }
      creep.moveTo(spawnRenew, {
        visualizePathStyle: {
          stroke: '#ffffff',
        },
      });
      return true;
    }

    return false;
  },
  transferEnergyOrMoveTo: function (creep, target) {
    var resultTransfer = creep.transfer(target, RESOURCE_ENERGY);

    if (resultTransfer !== OK && resultTransfer !== ERR_NOT_IN_RANGE) {
    }
    if (resultTransfer == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: {
          stroke: '#ffffff',
        },
      });
    }
  },
};

module.exports = shared;
