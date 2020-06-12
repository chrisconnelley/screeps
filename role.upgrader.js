var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var roleUpgrader = {  
  badge: {
    character: 'U',
    colorOfText: '#FFFF00',
    colorOfStroke: '#777700',
    size: '10px'
  },
  run: function (creep) {
    shared.displayBadgeNew(creep, this.badge);
    var stage = mc.getStage(creep.name);
    if (shared.checkShouldDeposit(creep)) return;
    if (shared.checkRenew(creep.name, 'gathering', mc.setStage, mc.getStage)) return;

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
  }
//   ,
//   setStage(nameCreep, stage) {
//     var creep = Game.creeps[nameCreep];
//     utilMemory.remember(creep, 'stage', stage);
//   },
//   stage: function (nameCreep) {
//     var creep = Game.creeps[nameCreep];
//     return utilMemory.getString(creep, 'stage');
//   },
};
module.exports = roleUpgrader;