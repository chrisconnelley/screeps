var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');

var roleUpgrader = {
  run: function (creep) {
    if (creep.spawning) return;
    shared.displayBadge(creep, 'U');
    var stage = mc.getStage(creep.name);

    if (shared.checkRenew(creep.name, 'gathering', mc.setStage, mc.getStage)) return;
    // if (shared.checkRecycle(creep.name, mc.getStage, mc.setStage)) return;

    if (stage == 'upgrading' && creep.carry.energy == 0) {
      mc.setStage(creep.name,'gathering');
    }

    if (stage != 'upgrading' && creep.carry.energy == creep.carryCapacity) {
      mc.setStage(creep.name,'upgrading');
    }

    if (stage == 'upgrading') {
      shared.upgradeController(creep);
    } else {
      shared.retrieveEnergy(creep);
    }
  },
  setStage(nameCreep, stage) {
    var creep = Game.creeps[nameCreep];
    utilMemory.remember(creep, 'stage', stage);
  },
  stage: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    return utilMemory.getString(creep, 'stage');
  },
};

module.exports = roleUpgrader;