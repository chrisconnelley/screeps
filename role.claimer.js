var util = require('util');
var shared = require('role.shared');

var roleClaimer = {
  run: function (creep) {
    const u = util;
    if (creep.spawning) return;
    shared.displayBadge(creep, '[]');

    u.log(`creep: ${creep}`);

    var controller = creep.room.controller;

    if (!controller.my) {
      this.claimController(creep, controller);
    }
  },
  claimController: function (creep, controller) {
    const u = util;
    u.log(`[role.claimer claimController] creep: ${creep} controller: ${controller}`);

    var resultClaim = creep.claimController(controller);

    u.log(`[role.claimer claimController] claimController action - resultClaim: ${resultClaim}`);
    if (resultClaim === ERR_GCL_NOT_ENOUGH) {
      resultClaim = creep.reserveController(controller);
      u.log(`[role.claimer claimController] reserveController action - resultClaim: ${resultClaim}`);
    }

    if (resultClaim === ERR_INVALID_TARGET) {
      resultClaim = creep.attackController(controller);
      u.log(`[role.claimer claimController] attackController action - resultClaim: ${resultClaim}`);
    }

    if (resultClaim === ERR_NOT_IN_RANGE) {
      creep.moveTo(controller, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    }

    return resultClaim;
  },

};

module.exports = roleClaimer;