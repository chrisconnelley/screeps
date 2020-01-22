var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleJanitor = {
  init: function(creep) {
    mc.setStage(creep.name, 'clean');
  },
  run: function (creep) {
    const u = util;
    u.log(`[role.janitor run] creep: ${creep}`);
    if (creep.spawning) {
      this.init(creep);
      return;
    };

    shared.displayBadge(creep, 'J');
    
    if (shared.checkRenew(creep.name, 'clean')) return;
   
    if (mc.getStage(creep.name) === 'clean') {
      u.log(`[role.janitor run] creep: ${creep} clean`);
      this.clean(creep);
    } else {
      u.log(`[role.janitor run] creep: ${creep} deliver`);
      this.deliver(creep);
    }
  },
  clean: function(creep) {
    const u = util;

    if (creep.store.getFreeCapacity() === 0) {
      mc.setStage(creep.name, 'deliver');
      this.deliver(creep);
    }

    /*

      Search order:
      1 - Dropped resources
      2 - Tombstones
      3 - Ruins
      4 - Containers

    */
    var target = locator.findBestResource(creep);

    if (!target) target = locator.findClosestEnergy(creep);

    u.log(`[role.janitor clean] creep: ${creep} target: ${target}`);
    var resultGather = shared.gatherEnergy(creep, target);
    if (resultGather == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: {
          stroke: '#ffaa00'
        }
      });
    }

    if (creep.store.getFreeCapacity() === 0) {
        mc.setStage(creep.name, 'deliver');
        this.deliver(creep);
      }
  },
  deliver: function(creep) {      
    const u = util;
    u.log(`[role.janitor deliver]: creep ${creep}`);

    if (creep.store.getUsedCapacity() === 0) {
      u.log(`Janitor (${creep}) is empty. Switching to clean`);
      mc.setStage(creep.name, 'clean');
      return;
    }

    var target;
    // target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    //   filter: (structure) => {
    //     return (
    //       (structure.structureType === STRUCTURE_STORAGE)  && structure.store.getFreeCapacity() > 0
    //       );  
    //   }
    // });
    // u.log(`Janitor looking for storage to deliver to: ${target}`);
    target = locator.findClosestStoreDeliver(creep);

    if (!target) {
      target = locator.findRefuelTarget(creep);
    }

    if (!target) {
      u.log("Room storage is full!");
    }    

    if (target) {
      var resultTransfer = shared.transfer(creep, target);
      if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
        u.log(`resultTransfer (${creep}) to ${target}: ${util.errorCodeToDisplay(resultTransfer)}`);
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

module.exports = roleJanitor;