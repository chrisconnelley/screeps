var brainTowers = require('brain.towers');

var brainBase = {
  displaySpawning: (nameSpawn) => {
    var spawn = Game.spawns[nameSpawn];
    console.log(nameSpawn);
    if (spawn.spawning) {
      var spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y, {
          align: 'left',
          opacity: 0.8
        });
    }
  },
  spawnExcavator: function(nameSpawn, sourceId) {

  },
  run: function (nameSpawn) {
    var spawn = Game.spawns[nameSpawn];
    
    this.displaySpawning(nameSpawn);
    brainTowers.run(nameSpawn);
    this.thoughtProcessRenew(spawn);
    
    // // Process links
    // var linksReadyWithEnergy = spawn.room.find(FIND_MY_STRUCTURES, {
    //   filter: (structure) => {
    //     return (
    //         structure.structureType == STRUCTURE_LINK && 
    //         structure.pos.inRangeTo(spawn.room.controller, 20) && 
    //         structure.energy === structure.energyCapacity &&
    //         structure.cooldown === 0);
    //   }
    // });

    // var linksReadyToReceiveEnergy = spawn.room.find(FIND_MY_STRUCTURES, {
    //   filter: (structure) => {
    //     return (
    //         structure.structureType == STRUCTURE_LINK &&
    //         structure.energy < structure.energyCapacity);
    //   }
    // });
    
    // var linkReadyToReceiveEnergy = linksReadyToReceiveEnergy[0];

    // linksReadyWithEnergy.forEach((link) => {
    //   link.transferEnergy(linkReadyToReceiveEnergy);
    // });
  },
  remember_creepToRenew: function (spawn, creep) {
    if (!spawn.memory.creepsToRenew) {
      spawn.memory.creepsToRenew = [];
    }

    if (spawn.memory.creepsToRenew.includes(creep.name)) {
      return;
    }

    console.log("remembering : " + creep);
    spawn.memory.creepsToRenew.push(creep.name);
  },
  forget_creepToRenew: function (spawn, nameCreep) {
    spawn.memory.creepsToRenew = spawn.memory.creepsToRenew.filter((value) => value !== nameCreep);
  },
  thoughtProcessRenew: function (spawn) {
    // Find all creeps with less than 200 time to live

    var creepsWithShortLives = spawn.room.find(FIND_MY_CREEPS, {
      filter: (creep) => {
        return creep.ticksToLive < 200;
      }
    });

    creepsWithShortLives.forEach((creep) => {
      this.remember_creepToRenew(spawn, creep);
    });

    if (spawn.energy > 0 &&
      spawn.memory.creepsToRenew &&
      spawn.memory.creepsToRenew.length > 0) {
      var creepsToRenewCopy = Array.from(spawn.memory.creepsToRenew);
      creepsToRenewCopy.forEach((creepName) => {
        var creep = Game.creeps[creepName];

        if (!creep || creep.ticksToLive > 1200) {
          this.forget_creepToRenew(spawn, creepName);
        } else {
          console.log("Creep (" + creep + ") with only " + creep.ticksToLive + " ticks left to live.");
          var resultRenew = spawn.renewCreep(creep);
          
          if (resultRenew === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn, {
              visualizePathStyle: {
                stroke: '#ff00ff'
              }
            });
          } else if (resultRenew === ERR_NOT_ENOUGH_ENERGY) {
            // Spawn had enough energy but now doesn't - forget this creep
            this.forget_creepToRenew(spawn, creep.name);
          }
        }



      })
    }
  }
}

module.exports = brainBase;