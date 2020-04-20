var shared = require('role.shared');

var roleClaimer = {
  run: function (creep) {
    shared.displayBadge(creep, '[]');

    var controller = creep.room.controller;

    if (!controller.my) {
      this.claimController(creep, controller);
    }
  },
  claimController: function (creep, controller) {
    var resultClaim = creep.claimController(controller);

    if (resultClaim === ERR_GCL_NOT_ENOUGH) {
      resultClaim = creep.reserveController(controller);
    }

    if (resultClaim === ERR_INVALID_TARGET) {
      resultClaim = creep.attackController(controller);
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