var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleHarvester = {
  init: function(creep) {
    mc.setStage(creep.name, 'harvest');
  },
  run: function (creep) {
    if (creep.spawning) {
      this.init(creep);
      return;
    };

    shared.displayBadge(creep, 'H');
    if (shared.checkShouldDeposit(creep)) return;
    if (shared.checkRenew(creep.name, 'harvest',mc.setStage, mc.getStage)) return;
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
  
    closest_energy = locator.findAssignedSource(creep);
  
    if (!closest_energy) closest_energy = locator.findClosestEnergy(creep);

    if (!closest_energy) closest_energy = locator.findClosestMineral(creep);
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
    // //
    if (creep.store[RESOURCE_ENERGY] === 0) {
      // //
      mc.setStage(creep.name, 'harvest');
      return;
    }

    var target;
    target = locator.findRefuelTarget(creep);
    //  = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    //   filter: (structure) => {
    //     return (
    //       structure.structureType == STRUCTURE_EXTENSION ||
    //       structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
    //   }
    // });

    // //
    // Targets.length would be 0 if all of the other structures are full
    //   So, instead deposit it in a container.
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_STORAGE
             && structure.store.getFreeCapacity() > 0);  
        }
      });
      // //
      // if (!target) {
      //   //
      // }
    }

    if (target) {
      var resultTransfer = creep.transfer(target, RESOURCE_ENERGY);
      // if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
      //   //
      // }
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