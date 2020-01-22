var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleRefueler = {
  role: 'refueler',
  badge: 'R',
  run: function (creep) {
    if (creep.spawning) return;
    shared.displayBadge(creep, this.badge);

    if (shared.checkRenew(creep.name, 'reloading', mc.setStage, mc.getStage)) return;

    if (shared.checkShouldDeposit(creep)) return;

    this.perform(creep.name);
  },
  perform: function (nameCreep) {
    var creep = Game.creeps[nameCreep];

    if (mc.getStage(nameCreep) === undefined || creep.store[RESOURCE_ENERGY] === 0) {
      mc.setStage(nameCreep, "reloading");
    }

    if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()) {
      mc.setStage(nameCreep, 'delivering');
    }

    if (mc.getStage(nameCreep) === 'delivering') {
      var target = locator.findRefuelTarget(creep);

      if (!target) {
        mc.setStage(nameCreep, 'reloading');
      }

      var result = shared.transferEnergyOrMoveTo(creep, target);
    } else {
      var resultRetrieveEnergy;
      resultRetrieveEnergy = shared.retrieveEnergy(creep);
    }
  }
};

module.exports = roleRefueler;