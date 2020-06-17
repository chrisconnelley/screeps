const brainTasks = require('brain.tasks');

var brainSpawn = {
  spawn: function (nameSpawn, nameCreep, bodyParts, role, energyRequired) {
    var spawn = Game.spawns[nameSpawn];
    if (!spawn) {
      console.log(`Spawn [${nameSpawn}] doesn't exist!`);
      return;
    }

    const energySourcesForSpawn = this.findSpawnEnergy(spawn.room.name, energyRequired);
    // console.log(`Found ${energySourcesForSpawn.length} extensions`);

    var result = spawn.spawnCreep(bodyParts, nameCreep, {
      memory: {
        role: role,
      },
      energyStructures: energySourcesForSpawn,
    });

    if (result === OK) {
      var energyLeft = energyRequired;
      energySourcesForSpawn.forEach((extension) => {
        const updatedExtension = Game.getObjectById(extension.id);
        const energyExtension = updatedExtension.store.getUsedCapacity(RESOURCE_ENERGY);

        const energyToRefuel = energyExtension > energyLeft ? energyLeft : energyExtension;

        energyLeft = energyLeft - energyToRefuel;

        // console.log(`Extension [${updatedExtension.id}] energy: ${updatedExtension.store.getUsedCapacity(RESOURCE_ENERGY)}`);
        brainTasks.createTaskRefuel(extension.id, energyToRefuel);
      });
    }

    return result;
  },
  //
  // Returns an array of spawns & extensions to use the energy
  //   required for a creep spawn
  //
  findSpawnEnergy: function (nameRoom, energyNeeded) {
    var energyGathered = 0;
    const arrayEnergySources = [];
    const roomSpawn = Game.rooms[nameRoom];

    // TODO: Look at the memoryRoom and the extensions and spawns stored therein
    const extensions = roomSpawn.find(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_EXTENSION;
      },
    });
    extensions.forEach((extension) => {
      const energyExtension = extension.store.getUsedCapacity(RESOURCE_ENERGY);
      // console.log(`Gathered: ${energyGathered} Needed: ${energyNeeded} ${energyExtension}`);
      if (energyGathered >= energyNeeded || energyExtension === 0) return;
      arrayEnergySources.push(extension);

      energyGathered += energyExtension;
    });

    // console.log(arrayEnergySources);
    return arrayEnergySources;
  },
  run: function (nameSpawn) {
    var spawn = Game.spawns[nameSpawn];

    this.recycleCreeps(spawn);
    this.renewCreepWithLowestTTL(spawn);
  },
  renewCreepWithLowestTTL: function (spawn) {
    var creeps = spawn.room.find(FIND_MY_CREEPS, {
      filter: (creep) => {
        return creep.pos.getRangeTo(spawn) < 2 && creep.memory.um && creep.memory.um.stage === 'renew';
      },
    });

    if (creeps.length > 0) {
      var sortTTL = function (a, b) {
        return a.ticksToLive - b.ticksToLive;
      };
      creeps.sort(sortTTL);

      var resultRenew = spawn.renewCreep(creeps[0]);
      //   console.log(`Spawn ${spawn.name} renewing ${creeps[0].name} `);
    }
  },
  recycleCreeps: function (spawn) {
    var creeps = spawn.room.find(FIND_MY_CREEPS, {
      filter: (creep) => {
        return creep.pos.isNearTo(spawn) && creep.memory.um && creep.memory.um.stage === 'recycle';
      },
    });

    creeps.forEach((creep) => {
      spawn.recycleCreep(creep);
    });
  },
};

module.exports = brainSpawn;
