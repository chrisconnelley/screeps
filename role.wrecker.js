var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleWrecker = {
  init: function(creep) {
    mc.setStage(creep.name, 'wreck');
  },
  run: function (creep) {
    const u = util;
    u.log(`[role.wrecker run] creep: ${creep}`);
    if (creep.spawning) {
      this.init(creep);
      return;
    };

    shared.displayBadge(creep, 'W');
    
    if (shared.checkRenew(creep.name, 'wreck')) return;
   
    if (mc.getStage(creep.name) === 'wreck') {
      u.log(`[role.wrecker run] creep: ${creep} wreck`);
      this.wreck(creep);
    }
  },
  wreck: function(creep) {
    const u = util;
    u.log(`[role.wrecker wreck]`);

    result = this.wreckTarget(creep, FIND_HOSTILE_STRUCTURES);
    
    return result;
  },
  wreckTarget: function(creep, FIND_TYPE) {
    // find target
    var target = creep.pos.findClosestByRange(FIND_TYPE);

    if (target) {
      var result = creep.dismantle(target);
    
      if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: {
            stroke: '#ff0000'
          }
        });
      }
      return result;
    }

    return ERR_NOT_FOUND;
  }
}

module.exports = roleWrecker;