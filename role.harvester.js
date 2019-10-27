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
  run: function (creep) {
    if (creep.carry.energy < creep.carryCapacity) {
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

      targets.forEach((target) => {
        if (closest_target === null) {
          closest_target = target;
        }
      });

      if (targets.length == 0) {
        console.log("no container targets");
        targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER);
          }
        });

        closest_target = targets[0];
      }

      if (targets.length > 0) {
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

    this.displayBadge(creep);
  }
};

module.exports = roleHarvester;