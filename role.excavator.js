var mc = require('util.memory.creep');
var shared = require('role.shared');

var roleExcavator = {
  badge: {
    character: 'X',
    colorOfText: '#FF0000',
    colorOfStroke: '#00FF00',
    size: '10px'
  },
  run: function (creep) {
    if (shared.checkRecycle(creep.name, mc.getStage, mc.setStage)) return;

    shared.displayBadge(creep, this.badge.character, this.badge.size, this.badge.colorOfText, this.badge.colorOfStroke);
    this.perform(creep.name); 
  },
  perform: function(nameCreep) {
    try {
      var creep = Game.creeps[nameCreep];

      var sourceA = mc.getSource(nameCreep);
      var sourceB = mc.getSource(nameCreep, true);

      if (!sourceA && !sourceB) return;

      var source = sourceA.energy === 0 ? sourceB : sourceA;

      this.harvestSource(creep, source);
    } catch (ex) {
      console.log(`ex: ${ex}`);
    }
  },
  harvestSource: function(creep, source) {
    if (!source) return;
    var hasSourceEnergy = source.energy > 0;
    if (hasSourceEnergy) {
      var resultHarvest = creep.harvest(source);

        if (resultHarvest === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: {
            stroke: '#00FF00'
          }
        })
      }
    }
  }
};

module.exports = roleExcavator;