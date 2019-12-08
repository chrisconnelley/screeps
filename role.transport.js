var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

var roleTransport = {
  role: 'transport',
  /* memory:
    consumers: array of ids of Spawn/extensions
    idSource: id of source Structure
    stage: loading or unloading
    isRecharging: true
  */

  controlCommand: function (nameCreep, command) {
    // util.log("controlCommand" + command);
    eval(command); // uses nameCreep
  },
  run: function (creep) {
    const u = util;
    if (creep.spawning) return;

    shared.displayBadge(creep, 'T');

    if (shared.checkRenew(creep.name, 'reloading', mc.setStage, mc.getStage)) 
    {
      u.log(`[role.transport run] creep (${creep}) renewing`);

      return;
    }

    this.runInternal(creep.name);
  },
  runInternal: function (nameCreep) {
    this.perform(nameCreep);
  },
  perform: function (nameCreep) {
    const u = util;
    var creep = Game.creeps[nameCreep];
    var stage = mc.getStage(nameCreep);
    u.log(nameCreep + " " + this.role + " " + stage);

    if (stage === undefined) {
      stage = "reloading";
    }

    if (stage === 'delivering') {
      var target = locator.findEnergyTarget(creep);
      var result = shared.transferEnergyOrMoveTo(creep, target);

      u.log(nameCreep + " " + " delivering");

      if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
        mc.setStage(nameCreep, "reloading");
      }

      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 &&
        creep.store.getUsedCapacity() > 0
      ) {
        u.log(`[role.transport perform] depositing resources`);
        shared.depositResource(creep);
      }

      return;
    }

    if (stage === 'reloading') {
      var resultReload;
      // Move non-energy resources to Storage
      var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_CONTAINER &&
            structure.store.getUsedCapacity() !== structure.store.energy);
        }
      });

      var resultReload;
      if (container) {
        var resourceTypes = Object.keys(container.store);
        resultReload = creep.withdraw(container, resourceTypes[0]);
      } else {
        container = locator.findContainerRemote(creep);
        
        if (!container) {
          container = locator.findResource(creep);
        }
        
        if (!container) {
          mc.setStage(nameCreep, "delivering");
          return;
        }
        resultReload = shared.gatherEnergy(creep, container);
      };

      u.log(this.role + " result gather: " + resultReload);
      if (resultReload == ERR_NOT_IN_RANGE) {
        u.log(creep.name + " moving to " + container );
        creep.moveTo(container, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    }

    if (creep.store.getFreeCapacity() === 0 || container === null) {
      u.log(this.role + " has no free capacity");

      mc.setStage(nameCreep, "delivering");
    }
  }
};

module.exports = roleTransport;