var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleHarvester = {
  init: function(creep) {
    mc.setStage(creep.name, 'harvest');
  },
  run: function (creep) {
    // const u = util;
    // u.log(`[role.harvester run] creep: ${creep}`);
    if (creep.spawning) {
      this.init(creep);
      return;
    };

    shared.displayBadge(creep, 'H');
    
    if (shared.checkShouldDeposit(creep)) return;
    if (shared.checkRenew(creep.name, 'harvest',mc.setStage, mc.getStage)) return;
    
    var sitesConstruction = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (sitesConstruction.length > 0) {
      // u.log(`[role.harvester run] creep: ${creep} found construction sites (${sitesConstruction.length} swithching to builder)`);
      creep.memory.role = 'builder';
    }

    if (mc.getStage(creep.name) === 'harvest') {
      // u.log(`[role.harvester run] creep: ${creep} harvest`);
      this.harvest(creep);
    } else {
      // u.log(`[role.harvester run] creep: ${creep} deliver`);
      this.deliver(creep);
    }
  },
  harvest: function(creep) {
    // const u =  util;
    var closest_energy; 
  
    if (!closest_energy) closest_energy = locator.findClosestEnergy(creep);
    // u.log(`harvest: ${closest_energy}`);
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
    // const u =  util;
    if (creep.store[RESOURCE_ENERGY] === 0) {
      // u.log("Harvester (" + creep + ") is empty. Switching to harvest");
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

    // u.log(`Harvester looking for structures to deliver to: ${target}`);
    // Targets.length would be 0 if all of the other structures are full
    //   So, instead deposit it in a container.
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_STORAGE
             && structure.store.getFreeCapacity() > 0);  
        }
      });
      // u.log(`Harvester looking for storage to deliver to: ${target}`);
    
      // if (!target) {
      //   u.log("All containers are full!");
      // }
    }

    if (target) {
      var resultTransfer = creep.transfer(target, RESOURCE_ENERGY);
      // if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
      //   util.log("resultTransfer (" + creep + ") to (" + target + "): " + util.errorCodeToDisplay(resultTransfer));
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