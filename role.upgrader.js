var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function (creep) {
    var roomSpawn = Game.spawns['Spawn1'].room;

    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      // creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      // creep.say('⚡ upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(roomSpawn.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(roomSpawn.controller, {
          visualizePathStyle: {
            stroke: '#00ff00'
          }
        });
      }
    } else {
      var source;
      if (creep.memory.sourceId) {
        source = Game.getObjectById(creep.memory.sourceId);
      } else {
        var sources = creep.room.find(FIND_SOURCES);

        var sourceNum = parseInt(creep.name.substring(creep.name.length - 1)) % sources.length;

        source = sources[sourceNum];
      }

      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    }

    creep.room.visual.text('U', creep.pos, {
      color: '#00FF00',
      font: '10px',
      stroke: '#AA0000'
    });

  }
};

module.exports = roleUpgrader;