var util = require('util');
var mc = require('util.memory.creep');
var shared = require('role.shared');
var map = require('map');

var roleExcavator = {
  controlCommand: function(nameCreep, command) {
    util.log("controlCommand" + command);
    eval(command); // uses nameCreep
  },
  run: function (creep) {
    if (creep.spawning) return;

    if (shared.checkRecycle(creep.name, mc.getStage, mc.setStage)) return;

    shared.displayBadge(creep,'X','10px','#FF0000','#000000');
    this.perform(creep.name); 
  },
  perform: function(nameCreep) {
    const u = util;
    var creep = Game.creeps[nameCreep];
    var source = mc.getSource(nameCreep);
    u.log(`source: ${source}`);

    if (!source) return;
    
    var hasSourceEnergy = source.energy > 0;
    
    u.log(`source.energy: ${source.energy}`);
    if (hasSourceEnergy) {
      var resultHarvest = creep.harvest(source);

      u.log(`resultHarvest: ${resultHarvest}`);
      if (resultHarvest === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: {
            stroke: '#00FF00'
          }
        })
      } else if (resultHarvest === ERR_NOT_OWNER) {
        map.markRoomHostile(creep.pos.roomName);
      }
    }
  }
};

module.exports = roleExcavator;