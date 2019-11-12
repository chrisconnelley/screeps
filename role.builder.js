var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');

var roleBuilder = {
  run: function (creep) {
    if (creep.spawning) return;
    shared.displayBadge(creep, 'B');
    var stage = mc.getStage(creep.name);

    if (shared.checkRenew(creep.name, 'gathering',mc.setStage, mc.getStage)) return;

    if (stage == 'building' && creep.carry.energy == 0) {
      mc.setStage(creep.name,'gathering');
    }

    if (stage != 'building' && creep.carry.energy == creep.carryCapacity) {
      mc.setStage(creep.name,'building');
    }

    if (stage == 'building') {
      var result = shared.build(creep.name);
      if (result === null) {
        creep.memory.role = 'harvester';
      }
    } else {
      shared.retrieveEnergy(creep);
    }
  },

};

module.exports = roleBuilder;