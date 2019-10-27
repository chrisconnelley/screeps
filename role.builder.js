var shared = require('role.shared');

var roleBuilder = {
  run: function (creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
      creep.say('🚧 build');
    }

    if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: {
              stroke: '#ffffff'
            }
          });
        }
      }
    } else {
      var closest_energy = shared.findClosestEnergy(creep);
      var resultGather = shared.gatherEnergy(creep, closest_energy);
      
      if (resultGather == ERR_NOT_IN_RANGE) {
        creep.moveTo(closest_energy, {
          visualizePathStyle: {
            stroke: '#0000FF'
          }
        });
      }
      // var sources = creep.room.find(FIND_SOURCES);
      // var sourceNum = parseInt(creep.name.substring(creep.name.length - 1)) % sources.length;
      // console.log("Creep (" + creep.name + ") using source #" + sourceNum)
      
      // if (creep.harvest(sources[sourceNum]) == ERR_NOT_IN_RANGE) {
      //   creep.moveTo(sources[sourceNum], {
      //     visualizePathStyle: {
      //       stroke: '#ffaa00'
      //     }
      //   });
      // }
    }

    creep.room.visual.text('B', creep.pos, {
      color: '#0000FF',
      font: '10px',
      stroke: '#777777'
    })
  }
};

module.exports = roleBuilder;