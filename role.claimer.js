var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');

var roleClaimer = {
  run: function (creep) {
    var u = console;
    if (creep.spawning) return;
    shared.displayBadge(creep, '[]');

    u.log(`creep: ${creep}`);

    var controller = creep.room.controller;

    if (!controller.my) {
      this.claimController(creep, controller);
    }
  },
  claimController: function (creep, controller) {
    var resultClaim = creep.claimController(controller);

    if (resultClaim == ERR_GCL_NOT_ENOUGH) {
      return creep.reserveController(controller);
    }

    if (resultClaim == ERR_INVALID_TARGET) {
      return creep.attackController(controller);
    }

    if (resultClaim == ERR_NOT_IN_RANGE) {
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