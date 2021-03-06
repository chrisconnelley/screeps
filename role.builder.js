var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleBuilder = {
  badge: {
    character: 'B',
    colorOfText: '#CCCCFF',
    colorOfStroke: '#4444FF',
    size: '10px',
  },
  run: function (creep) {
    shared.displayBadgeNew(creep, this.badge);
    var stage = mc.getStage(creep.name);

    if (shared.checkShouldDeposit(creep)) return;
    if (shared.checkRenew(creep.name, 'gathering', mc.setStage, mc.getStage)) return;

    if (stage == 'building' && creep.carry.energy == 0) mc.setStage(creep.name, 'gathering');
    if (stage != 'building' && creep.carry.energy == creep.carryCapacity) mc.setStage(creep.name, 'building');

    if (stage == 'building') {
      var result = shared.build(creep.name);
      if (result === null) {
        creep.memory.role = 'harvester';
      }
    } else {
      this.harvest(creep);
    }
  },
  harvest: function (creep) {
    var closest_energy;

    if (!closest_energy) closest_energy = locator.findClosestStoreEnergy(creep);
    if (!closest_energy) closest_energy = locator.findClosestEnergy(creep);
    if (!closest_energy) closest_energy = locator.findClosestMineral(creep);

    var resultGather = shared.gatherEnergy(creep, closest_energy);

    if (resultGather == ERR_NOT_IN_RANGE) {
      creep.moveTo(closest_energy, {
        visualizePathStyle: {
          stroke: '#ffaa00',
        },
      });
    }

    if (creep.store.getFreeCapacity() === 0 || closest_energy[RESOURCE_ENERGY] === 0) {
      mc.setStage(creep.name, 'building');
    }
  },
};

module.exports = roleBuilder;
