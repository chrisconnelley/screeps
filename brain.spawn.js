var util = require('util');
var brainTowers = require('brain.towers');

var brainBase = {
  updateSpawnMap: function (nameSpawn) {
    var spawn = Game.spawns[nameSpawn];
    var memoryRoom = Memory.colony.rooms[spawn.room.name];

    if (!memoryRoom.spawns) {
      memoryRoom.spawns = {};
    }

    var memorySpawn = memoryRoom.spawns[nameSpawn];
    if (!memorySpawn) {
      memoryRoom.spawns[nameSpawn] = {};
      memoryRoom.spawns[nameSpawn] = Object.assign({},spawn);
      delete memoryRoom.spawns[nameSpawn].room;      
      if (memoryRoom.spawns[nameSpawn].energy) {
        delete memoryRoom.spawns[nameSpawn].energy;
        delete memoryRoom.spawns[nameSpawn].energyCapacity;
      }
      memoryRoom.spawns[nameSpawn].tickCreated = Game.time;
      memoryRoom.spawns[nameSpawn].tickUpdated = Game.time;
      return;
    }
 
    // Update values that change
    memorySpawn.store = spawn.store;
    memorySpawn.spawning = spawn.spawning;
    memorySpawn.owner = spawn.owner;
    memorySpawn.my = spawn.my;
    memorySpawn.hits = spawn.hits;
    memorySpawn.hitsMax = spawn.hitsMax;

    memorySpawn.tickUpdated = Game.time;
  },
  run: function (nameSpawn) {
    var spawn = Game.spawns[nameSpawn];

    this.updateSpawnMap(nameSpawn);

    // this.displaySpawning(nameSpawn);
    brainTowers.run(nameSpawn);
    this.recycleCreeps(spawn);
    this.renewCreepWithLowestTTL(spawn);
  },
  renewCreepWithLowestTTL: function (spawn) {
    var creeps = spawn.room.find(FIND_MY_CREEPS, {
      filter: (creep) => {
        return creep.pos.getRangeTo(spawn) < 2 &&
          creep.memory.um &&
          creep.memory.um.stage === 'renew'
      }
    });

    if (creeps.length > 0) {
      var sortTTL = function (a, b) {
        return a.ticksToLive - b.ticksToLive
      };
      creeps.sort(sortTTL);

      util.log(spawn.name + " finding creep with lowest TTL: " + creeps[0] + " TTL: " + creeps[0].ticksToLive + " Creep Count: " + creeps.length);
      var resultRenew = spawn.renewCreep(creeps[0]);
    }
  },
  recycleCreeps: function(spawn) {
    var creeps = spawn.room.find(FIND_MY_CREEPS, {
      filter: (creep) => {
        return creep.pos.getRangeTo(spawn) < 2 &&
          creep.memory.um &&
          creep.memory.um.stage === 'recycle'
      }
    });

    creeps.forEach((creep) => {
      spawn.recycleCreep(creep);
    })

  }
}

module.exports = brainBase;