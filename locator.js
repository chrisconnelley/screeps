var util = require('util');
var mc = require('util.memory.creep');
var config = require('config');

var locator = {
  getAmountDroppedEnergy: function (nameRoom) {
    return getAmountDroppedResources(nameRoom);
  },
  getAmountDroppedResources: function (nameRoom) {
    var resources = Game.rooms[nameRoom].find(FIND_DROPPED_RESOURCES);
    var amountTotal = 0;

    _.forIn(resources, (resource, idResource) => {
      if (resource.resourceType == RESOURCE_ENERGY) {
        amountTotal += resource.amount;
      }
    });

    return amountTotal;
  },
  getAmountStoredEnergyInRoom: function (nameRoom) {
    var structures = Game.rooms[nameRoom].find(FIND_STRUCTURES);

    var amountTotal = 0;

    _.forIn(structures, (structure, idStructure) => {
      if (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) {
        amountTotal += structure.store[RESOURCE_ENERGY];
      }
    });

    return amountTotal;
  },
  findAssignedTransportRemote: function (nameRoom) {
    var memoryRoomForeign = Memory.colony.rooms[nameRoom];
    var memorySpawnClosest = this.findSpawnOwnedClosest(nameRoom);

    var nameTransportRemote = memoryRoomForeign.nameTransportRemote;

    if (nameTransportRemote) {
      var creep = Game.creeps[nameTransportRemote];

      if (!creep) {
        memoryRoomForeign.nameTransportRemote = null;
      }
    }

    if (!nameTransportRemote && memorySpawnClosest) {
      var nameTransportRemoteNew = 'TR' + nameRoom + Game.time;
      var memoryRoomSpawn = Memory.colony.rooms[memorySpawnClosest.pos.roomName];
      var energyAvailable = memoryRoomSpawn.energyAvailable;
      var parts = energyAvailable / 100;

      if (parts < 10) return;

      var resultSpawn;
      var resultSpawn = control.spawnShort(
        memorySpawnClosest.name,
        nameTransportRemoteNew,
        {
          move: parts,
          carry: parts,
        },
        'transport-remote'
      );
      if (resultSpawn === OK) {
        memoryRoomForeign.nameTransportRemote = nameTransportRemoteNew;
        var resultSet;
        resultSet = mc.setRoom(nameTransportRemoteNew, nameRoom);
      }
    }
  },
  findAssignedScout: function (nameRoom) {
    var memoryRoomForeign = Memory.colony.rooms[nameRoom];
    var memorySpawnClosest = this.findSpawnOwnedClosest(nameRoom);

    var nameScout = memoryRoomForeign.nameScout;

    if (nameScout) {
      var creep = Game.creeps[nameScout];

      if (!creep) {
        memoryRoomForeign.nameScout = null;
      }
    }

    if (!nameScout && memorySpawnClosest) {
      var nameScoutNew = 'Scout' + nameRoom + Game.time;

      var resultSpawn;
      var resultSpawn = control.spawnShort(
        memorySpawnClosest.name,
        nameScoutNew,
        {
          move: 1,
        },
        'scout'
      );
      if (resultSpawn === OK) {
        memoryRoomForeign.nameScout = nameScoutNew;
        var resultSet;
        resultSet = mc.setRoom(nameScoutNew, nameRoom);
      }
    }
  },
  findAssignedSource: function (creep) {
    // If creep has been assigned a sourceId go there instead
    if (creep.memory.sourceId) {
      var sourceMemory = Game.getObjectById(creep.memory.sourceId);

      if (sourceMemory === null) {
        creep.memory.sourceId = null;
      } else {
        energyClosestFound = sourceMemory;
        return energyClosestFound; // If it was assigned, use this energy
      }
    }
  },
  findBestResource: function (creep) {
    var resources = creep.room.find(FIND_DROPPED_RESOURCES);
    if (resources.length > 0) {
      var resourceLargestForCreep;
      for (var i = 0; i < resources.length; i++) {
        var resource = resources[i];
        if (resource.amount > 200 && (!resourceLargestForCreep || resource.amount > resourceLargestForCreep.amount)) {
          resourceLargestForCreep = resource;
        }
      }
      return resourceLargestForCreep;
    }

    return null;
  },
  findClosestMineral: function (creep) {
    var minerals = creep.room.find(FIND_MINERALS, {
      filter: (mineral) => {
        return false;
      },
    });

    return null;
  },
  findClosestEnergy: function (creep) {
    var energyClosestFound = null;

    energyClosestFound = this.findAssignedSource(creep);
    if (energyClosestFound) {
      return energyClosestFound;
    }

    // if (creep.memory.role !== 'harvester') {
    //   //
    //   var container = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
    //     filter: (structure) => {
    //       return ((
    //           structure.structureType === STRUCTURE_STORAGE || structure.structureType === STRUCTURE_LINK) &&
    //         structure.store.energy > 0)
    //     }
    //   });
    //   if (container) return container;
    // }

    var resources = creep.room.find(FIND_DROPPED_RESOURCES);
    if (resources.length > 0) {
      for (var i = 0; i < resources.length; i++) {
        var resource = resources[i];
        if (resource.amount > 100 && resource.resourceType === RESOURCE_ENERGY) {
          return resource;
        }
      }
    }

    var tombstones = creep.room.find(FIND_TOMBSTONES);
    if (tombstones.length > 0) {
      for (var i = 0; i < tombstones.length; i++) {
        var tombstone = tombstones[i];
        if (tombstone.store.getUsedCapacity() > 0) {
          return tombstone;
        }
      }
    }

    var ruins = creep.room.find(FIND_RUINS);
    if (ruins.length > 0) {
      for (var i = 0; i < ruins.length; i++) {
        var ruin = ruins[i];
        // //
        if (ruin.store['energy'] > 0) {
          return ruin;
        }
      }
    }

    var sources = creep.room.find(FIND_SOURCES);
    var sourceNum = parseInt(creep.name.substring(creep.name.length - 1)) % sources.length;
    var foundSource = sources[sourceNum];

    if (foundSource.energy === 0) {
      sources.forEach((source) => {
        if (source.energy > 0) {
          foundSource = source;
        }
      });
    }

    return foundSource; // Game.getObjectById('5bbcad419099fc012e636f58');
  },
  findClosestStoreEnergy: function (creep) {
    var u = util;

    var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
      },
    });

    return source;
  },
  findClosestStoreDeliver: function (creep) {
    // var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    //   filter: (structure) => {
    //     return ((structure.structureType == STRUCTURE_STORAGE ||
    //         structure.structureType == STRUCTURE_CONTAINER) &&
    //       structure.store.getFreeCapacity() > 0)
    //   }
    // });

    // return source;
    var u = util;

    var storage = creep.room.storage;
    var terminal = creep.room.terminal;

    let source;
    source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        //   //
        if (structure.structureType === STRUCTURE_CONTAINER) {
        }
        return structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity() >= creep.store[RESOURCE_ENERGY] && structure.store.getFreeCapacity() > 0 && creep.store[RESOURCE_ENERGY] > 0;
      },
    });
    if (!source && storage) source = storage;

    if (source && source.store.getFreeCapacity() === 0) {
      if (terminal) source = terminal;
    }

    return source;
  },
  findContainer: function (creep) {
    var containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity() > 0;
      },
    });

    return containers[0];
  },
  findContainerRemote: function (creep) {
    var containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_CONTAINER && structure.pos.getRangeTo(creep.room.controller) > 15 && structure.store.getUsedCapacity() > 0;
      },
    });

    return containers[0];
  },
  findEnergyTarget: function (creep) {
    var closest_target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
      },
    });

    // Targets.length would be 0 if all of the other structures are full
    //   So, instead deposit it in a container.
    if (closest_target === null || closest_target === undefined) {
      var targetsStores = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity() > 0;
        },
      });

      if (targetsStores.length === 0) {
      } else {
        closest_target = targetsStores[0];
      }
    }

    return closest_target;
  },
  findRefuelTarget: function (creep) {
    var target;

    if (config.shouldRefuelTowers && !target) {
      target = locator.findRefuelTower(creep);
    }

    if (!target) {
      target = locator.findRefuelSpawn(creep);
    }

    if (!target) {
      target = locator.findRefuelExtension(creep);
    }

    return target;
  },
  findRefuelSpawn: function (creep) {
    var closest_target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_SPAWN && structure.energy < structure.energyCapacity;
      },
    });
    return closest_target;
  },
  findRefuelExtension: function (creep) {
    var closest_target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;
      },
    });
    return closest_target;
  },
  findRefuelTower: function (creep) {
    var energyCreep = creep.store.energy;

    // var towers = creep.room.find(FIND_MY_STRUCTURES, {
    //   filter: (structure) => {
    //     return structure.structureType === STRUCTURE_TOWER;
    //   }
    // });

    // if (towers.length === 0) return;

    // var closest_target = towers[0];
    // var closest_distance = util.distanceCheapest(creep, closest_target);

    // if (towers.length === 1) return closest_target;

    // for (let i = 1; i < towers.length; i++) {
    //   let x = Math.abs(closest_target.pos.x - creep.pos.x);
    //   let y = Math.abs(closest)
    //   if (util.distanceCheapest(towersclosest_target.pos.x)
    // }
    var closest_target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        // if (structure.structureType === STRUCTURE_TOWER) {
        // //
        return structure.structureType === STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.75;
        // }
        // return false;
      },
    });

    return closest_target;
  },
  findResource: function (creep) {
    var resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    return resource;
  },
  findSourcesWithEnergy: function (creep) {
    const sources = Memory.colony.rooms[creep.room.name].sources;
    let sourceWithEnergyAndClosest = undefined;
    let distanceToClosestSource = 9999;

    Object.keys(sources).forEach((idSource) => {
      let source = Game.getObjectById(idSource);

      if (source) {
        const distanceToSource = util.distanceCheapestByPosition(creep.pos, source.pos);

        if (source.energy > 0) {
          if (!sourceWithEnergyAndClosest) {
            sourceWithEnergyAndClosest = source;
            distanceToClosestSource = distanceToSource;
          } else {
            if (distanceToSource < distanceToClosestSource) {
              sourceWithEnergyAndClosest = source;
              distanceToClosestSource = distanceToSource;
            }
          }
        }
      }
    });

    return sourceWithEnergyAndClosest;
  },
  findSource: function (creep) {
    return creep.pos.findClosestByRange(FIND_SOURCES);
  },
  findDeposit: function (creep) {
    const deposit = creep.room.find(FIND_MINERALS)[0];
  
    // console.log(`[findDeposit] ${JSON.stringify(deposit.mineralAmount)}`);

    if (deposit && deposit.mineralAmount && this.hasExtractor(deposit)) {
      return deposit;
    }

    return null;
  },
  hasExtractor: function(deposit) {
    // console.log(`[hasExtractor] ${deposit}`);
    if (!deposit) return false;

    var structure = deposit.pos.lookFor(LOOK_STRUCTURES)[0];
    
    if (!structure) return false;

    return (structure.structureType === STRUCTURE_EXTRACTOR);
  },
  findStorageOwnedClosest: function (nameRoom) {
    var storageClosest = null;
    var distanceClosest = 0;

    _.forIn(Game.rooms, (room, nameRoom) => {
      if (!room.controller || !room.controller.my) return;

      var storage = room.storage;

      if (!storage) return;

      if (!storageClosest) {
        storageClosest = storage;
        distanceClosest = util.getRoomDistance(nameRoom, storage.pos.roomName);
      } else {
        var distance = util.getRoomDistance(nameRoom, storage.pos.roomName);
        if (distance < distanceClosest) {
          storageClosest = storage;
          distanceClosest = distance;
        }
      }
    });

    return storageClosest;
  },
  findSpawnOwnedClosest: function (nameRoom) {
    var spawnClosest = null;
    var distanceClosest = 0;

    _.forIn(Game.spawns, (spawn, nameSpawn) => {
      if (spawn.spawning) return;
      if (!spawnClosest) {
        spawnClosest = spawn;
        distanceClosest = util.getRoomDistance(nameRoom, spawn.pos.roomName);
      } else {
        var distance = util.getRoomDistance(nameRoom, spawn.pos.roomName);
        if (distance < distanceClosest) {
          spawnClosest = spawn;
          distanceClosest = distance;
        }
      }
    });

    return spawnClosest;
  },
  findSpawnThatIsAvailableForSpawning: function(nameRoom) {
    let spawnFoundForSpawning = null;

    _.forIn(Game.spawns, (spawn, nameSpawn) => {
      // console.log(`[locator.findSpawnThatIsAvailableForSpawning] spawn: ${spawn} nameRoom: ${nameRoom} ${spawn.room.name} ${spawn.room === nameRoom}`)
      if (spawn.room.name === nameRoom && !spawn.spawning) spawnFoundForSpawning = spawn;
    });

    console.log(`[locator.findSpawnThatIsAvailableForSpawning] spawn: ${spawnFoundForSpawning} nameRoom: ${nameRoom}`)
    return spawnFoundForSpawning;
  },
  findTombstoneWithResources: function (creep) {
    var tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES);

    return tombstone;
  },
};
module.exports = locator;
