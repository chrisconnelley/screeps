var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleRefueler = {
  role: 'refueler',
  /* memory:
    consumers: array of ids of Spawn/extensions
    idSource: id of source Structure
    stage: loading or unloading
    isRecharging: true
  */

  controlCommand: function(nameCreep, command) {
    util.log("controlCommand" + command);
    eval(command); // uses nameCreep
  },
  run: function (creep) {
    if (creep.spawning) return;
    shared.displayBadge(creep,'R');
    
    if (shared.checkRenew(creep.name, 'reloading',mc.setStage, mc.getStage)) return;
    
    this.perform(creep.name); 
  },
  perform: function(nameCreep) {
    var u = console;
    var creep = Game.creeps[nameCreep];
    
    u.log("refueler (" + creep + ") energy: " + creep.store[RESOURCE_ENERGY]);
    if (mc.getStage(nameCreep) === undefined || creep.store[RESOURCE_ENERGY] === 0) {
      mc.setStage(nameCreep, "reloading");
    }

    u.log("refueler (" + creep + ") energy: " + creep.store[RESOURCE_ENERGY]);
    if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()) {
      mc.setStage(nameCreep, 'delivering');
    }

    if (mc.getStage(nameCreep) === 'delivering') {
      var target = locator.findRefuelSpawn(creep);
       u.log(`Refueler (${creep.name} looking for spawn: ${target})`);
      
      if (!target) {
        target = locator.findRefuelExtension(creep);
         u.log(`Refueler (${creep.name} looking for closest extension: ${target})`);
      }
      if (!target) {
        target = locator.findRefuelTower(creep);
         u.log(`Refueler (${creep.name} looking for closest tower: ${target})`);
      }
      if (!target) {
        // target = locator.findClosestStore(creep);
        // If can't find targets, reload.
        mc.setStage(nameCreep, 'reloading');
        u.log(`Refueler (${creep.name} reloading due to lack of targets.`);
      }

      u.log(`Refueler (${creep.name} attempting transfer to : ${target})`);
      var result = shared.transferEnergyOrMoveTo(creep, target);
    } else {        
      var resultRetrieveEnergy = shared.retrieveEnergy(creep);

      u.log("refueler creep " + creep + " attempted to retrieve energy with result of " + util.errorCodeToDisplay(resultRetrieveEnergy));
    }    
  }
};

module.exports = roleRefueler;