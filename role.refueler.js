var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleRefueler = {
  role: 'refueler',
  controlCommand: function (nameCreep, command) {
    util.log("controlCommand" + command);
    eval(command); // uses nameCreep
  },
  run: function (creep) {
    if (creep.spawning) return;
    shared.displayBadge(creep, 'R');

    if (shared.checkRenew(creep.name, 'reloading', mc.setStage, mc.getStage)) return;

    this.perform(creep.name);
  },
  perform: function (nameCreep) {
    var u = util;
    var creep = Game.creeps[nameCreep];

    // if (nameCreep == 'B13340439') u = console;

    u.log("refueler (" + creep + ") energy: " + creep.store[RESOURCE_ENERGY]);
    if (mc.getStage(nameCreep) === undefined || creep.store[RESOURCE_ENERGY] === 0) {
      mc.setStage(nameCreep, "reloading");
    }

    u.log("refueler (" + creep + ") energy: " + creep.store[RESOURCE_ENERGY]);
    if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()) {
      mc.setStage(nameCreep, 'delivering');
    }

    if (mc.getStage(nameCreep) === 'delivering') {
      var target = locator.findRefuelTarget(creep);

      if (!target) {
        mc.setStage(nameCreep, 'reloading');
        u.log(`Refueler (${creep.name} reloading due to lack of targets.`);
      }

      u.log(`Refueler (${creep.name} attempting transfer to : ${target})`);
      var result = shared.transferEnergyOrMoveTo(creep, target);
    } else {
      var resultRetrieveEnergy;
      resultRetrieveEnergy = shared.retrieveEnergy(creep);

      u.log("refueler creep " + creep + " attempted to retrieve energy with result of " + util.errorCodeToDisplay(resultRetrieveEnergy));
    }
  }
};

module.exports = roleRefueler;