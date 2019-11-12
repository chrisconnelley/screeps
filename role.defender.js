var util = require('util');
var mc = require('util.memory.creep');
var shared = require('role.shared');

var roleDefender = {
  run: function (creep) {
    if (creep.spawning) return;
    shared.displayBadge(creep, 'Def');
    var stage = mc.getStage(creep.name);

    if (shared.checkRenew(creep.name, 'defending', mc.setStage, mc.getStage)) {
      return;
    } else {
      mc.setStage(creep.name, 'defending');
    }

    if (stage === 'defending') {
      var invader = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

      var resultAttack = creep.attack(invader);

      if (resultAttack == ERR_NOT_IN_RANGE) {
        creep.moveTo(invader, {
          visualizePathStyle: {
            stroke: '#ff0000'
          }
        });
      }
    };
  }
};

module.exports = roleDefender;