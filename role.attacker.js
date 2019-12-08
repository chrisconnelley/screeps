var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleAttacker = {
  init: function(creep) {
    mc.setStage(creep.name, 'attack');
  },
  run: function (creep) {
    const u = util;
    u.log(`[role.attacker run] creep: ${creep}`);
    if (creep.spawning) {
      this.init(creep);
      return;
    };

    shared.displayBadge(creep, 'A');
    
    if (shared.checkRenew(creep.name, 'attack')) return;
   
    if (mc.getStage(creep.name) === 'attack') {
      u.log(`[role.attacker run] creep: ${creep} attack`);
      this.attack(creep);
    }
  },
  attack: function(creep) {
    const u = util;
    u.log(`[role.attacker attack]`);

    var result = this.attackTarget(creep, FIND_HOSTILE_CREEPS);
    if (result === ERR_NOT_FOUND) {
      result = this.attackTarget(creep, FIND_HOSTILE_STRUCTURES);
    }

    return result;
  },
  attackTarget: function(creep, FIND_TYPE) {
    // find target
    var target = creep.pos.findClosestByPath(FIND_TYPE, {
      filter: (attackTarget) => {
        if (attackTarget.structureType) {
          if (attackTarget.structureType === 'storage' || attackTarget.structureType === 'controller') return false;
          // if (attackTarget.structureType === )
        }

        return true;
      }
    });
    if (target) {
      var result = creep.attack(target);
    
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

module.exports = roleAttacker;