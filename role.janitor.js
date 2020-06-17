var shared = require('role.shared');
var locator = require('locator');
var mc = require('util.memory.creep');

var roleJanitor = {
  run: function (creep) {
    shared.displayBadge(creep, 'J');
    if (shared.checkRenew(creep.name, 'clean')) return;
   
    if (mc.getStage(creep.name) === 'clean') {
      this.clean(creep);
    } else {
      this.deliver(creep);
    }
  },
  clean: function(creep) {
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
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      mc.setStage(creep.name, 'clean');
      return;
    }

    var target;
    target = locator.findClosestStoreDeliver(creep);

    if (!target) {
      target = locator.findRefuelTarget(creep);
    }

    if (target) {
      var resultTransfer = shared.transfer(creep, target);
      if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
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