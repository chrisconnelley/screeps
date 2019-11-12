var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleHarvester = {
  depositResource: function(creep) {
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
      util.log("resultTransfer (" + creep + ") to (" + container + "): " + util.errorCodeToDisplay(resultTransfer));
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
      util.log("Harvester (" + creep + ") should deposit resources");
      this.depositResource(creep);
    }
  },
  init: function(creep) {
    mc.setStage(creep.name, 'harvest');
  },
  run: function (creep) {
    if (creep.spawning) 
    {
      this.init(creep);
      return;
    };

    shared.displayBadge(creep, 'H');
    
    if (shared.checkRenew(creep.name, 'harvest',mc.setStage, mc.getStage)) return;
    
    this.checkShouldDeposit(creep);

    var sitesConstruction = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (sitesConstruction.length > 0) {
      creep.memory.role = 'builder';
    }

    if (mc.getStage(creep.name) === 'harvest') {
      this.harvest(creep);
    } else {
      this.deliver(creep);
    }
  },
  harvest: function(creep) {
    var closest_energy; 
  
    
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
        mc.setStage(creep.name, 'deliver');
    }
  },
  deliver: function(creep) {      
    if (creep.store[RESOURCE_ENERGY] === 0) {
      util.log("Harvester (" + creep + ") is empty. Switching to harvest");
      mc.setStage(creep.name, 'harvest');
      return;
    }
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
      }
    });

    // Targets.length would be 0 if all of the other structures are full
    //   So, instead deposit it in a container.
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return ((structure.structureType == STRUCTURE_CONTAINER || 
            structure.structureType == STRUCTURE_STORAGE
            ) && structure.store.getFreeCapacity() > 0);  
        }
      });

      if (!target) {
        util.log("All containers are full!");
      }
    }

    if (target) {
      var resultTransfer = creep.transfer(target, RESOURCE_ENERGY);
      if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
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
};

module.exports = roleHarvester;