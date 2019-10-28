var shared = require('role.shared');
var util = require('util');

var roleHarvester = {
  displayBadge: function (creep) {
    creep.room.visual.text('H', creep.pos, {
      color: '#FF0000',
      font: '10px',
      stroke: '#FFFFFF'
    })
  },
  doesAnotherCreepWantResource: function (creepAsking, resource) {
    for (var nameCreep in Game.creeps) {
      if (nameCreep === creepAsking) continue;
      var creep = Game.creeps[nameCreep];

      if (creep.memory['resourceWanted'] === resource.id) {
        return true;
      }
    };

    return false;
  },
  markResource: function (resource) {
    Game.spawns['Spawn1'].room.visual.text('R', resource.pos, {
      color: '#FFFFFF',
      font: '12px',
      align: 'left'
    });
  },
  depositResource(creep) {
    containers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity() > 0);
      }
    });


    var idsInCreepStore = Object.keys(creep.store);

    // deposit all in container 
    var resultTransfer = creep.transfer(containers[0], idsInCreepStore[0]);
    if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
      console.log("resultTransfer (" + creep + ") to (" + containers[0] + "): " + util.errorCodeToDisplay(resultTransfer));
    }
    if (resultTransfer == ERR_NOT_IN_RANGE) {
      creep.moveTo(containers[0], {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    }
    // move to container if the container isn't close enough

  },
  run: function (creep) {
    this.displayBadge(creep);
    // This is the deciding logic for the harvester right now

    var idsInCreepStore = Object.keys(creep.store);

    if ((idsInCreepStore.length == 1 && idsInCreepStore[0] !== 'energy') || idsInCreepStore.length > 1) {
      console.log("Creep (" + creep + ") has stores of " + idsInCreepStore);
      this.depositResource(creep);
      return OK;
    }

    // If the creep still has capacity, collect energy
    if (creep.store.getUsedCapacity() < creep.store.getCapacity()) {
      var closest_energy = shared.findClosestEnergy(creep);
      var resultGather = shared.gatherEnergy(creep, closest_energy);

      if (resultGather == ERR_NOT_IN_RANGE) {
        creep.moveTo(closest_energy, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    } else {
      var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
      });

      var closest_target = null;

      // TODO: for each target, find the closest
      targets.forEach((target) => {
        if (closest_target === null) {
          closest_target = target;
        }
      });

      // Targets.length would be 0 if all of the other structures are full
      //   So, instead deposit it in a container.
      if (targets.length == 0) {
        // console.log("Spawn, extensions, and tower are full. Looking for containers.");
        targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity() > 0);
          }
        });

        if (targets.length === 0) {
          console.log("All containers are full!");
        }
        closest_target = targets[0];
      }

      if (closest_target) {
        var resultTransfer = creep.transfer(closest_target, RESOURCE_ENERGY);
        if (resultTransfer !== 0 && resultTransfer !== ERR_NOT_IN_RANGE) {
          console.log("resultTransfer (" + creep + ") to (" + closest_target + "): " + util.errorCodeToDisplay(resultTransfer));
        }
        if (resultTransfer == ERR_NOT_IN_RANGE) {
          creep.moveTo(closest_target, {
            visualizePathStyle: {
              stroke: '#ffffff'
            }
          });
        }
      }
    }

  }
};

module.exports = roleHarvester;