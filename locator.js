var util = require('util');
var mc = require('util.memory.creep');

var locator = {
  findAssignedTransportRemote(nameRoom) {
    const u = util;
    var memoryRoomForeign = Memory.colony.rooms[nameRoom];
    var memorySpawnClosest = this.findSpawnOwnedClosest(nameRoom);

    var nameTransportRemote = memoryRoomForeign.nameTransportRemote;

    u.log(`findAssignedTransportRemote (${nameRoom}): nameTransportRemote: ${nameTransportRemote} memorySpawnClosest: ${memorySpawnClosest}`)
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

      u.log(`Generating remote transport: ${nameTransportRemoteNew} with ${parts} parts`);

      var resultSpawn;
      var resultSpawn = control.spawnShort(memorySpawnClosest.name, nameTransportRemoteNew, {
        'move': parts,
        'carry': parts 
      }, 'transport-remote');
      u.log(`${nameTransportRemoteNew} resultSpawn: ${resultSpawn}`);

      if (resultSpawn === OK) {
        memoryRoomForeign.nameTransportRemote = nameTransportRemoteNew;
        u.log(`resultSpawn inside: ${resultSpawn}`);

        var resultSet;
        resultSet = mc.setRoom(nameTransportRemoteNew, nameRoom);
        u.log(`Result of assigning Room (${nameRoom}) to transport remote ${nameTransportRemoteNew}: ${resultSet}`);
      }
    }
  },
  findAssignedScout: function (nameRoom) {
    const u = util;
    var memoryRoomForeign = Memory.colony.rooms[nameRoom];
    var memorySpawnClosest = this.findSpawnOwnedClosest(nameRoom);

    var nameScout = memoryRoomForeign.nameScout;

    u.log(`findAssignedScout (${nameRoom}): nameScout: ${nameScout} memorySpawnClosest: ${memorySpawnClosest}`)
    if (nameScout) {
      var creep = Game.creeps[nameScout];

      if (!creep) {
        memoryRoomForeign.nameScout = null;
      }
    }

    if (!nameScout && memorySpawnClosest) {
      var nameScoutNew = 'Scout' + nameRoom + Game.time;

      var resultSpawn;
      var resultSpawn = control.spawnShort(memorySpawnClosest.name, nameScoutNew, {
        'move': 1
      }, 'scout');
      u.log(`${nameScoutNew} resultSpawn: ${resultSpawn}`);

      if (resultSpawn === OK) {
        memoryRoomForeign.nameScout = nameScoutNew;
        u.log(`resultSpawn inside: ${resultSpawn}`);

        var resultSet;
        resultSet = mc.setRoom(nameScoutNew, nameRoom);
        u.log(`Result of assigning Room (${nameRoom}) to scout ${nameScoutNew}: ${resultSet}`);
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
  findBestResource: function(creep) {
    var resources = creep.room.find(FIND_DROPPED_RESOURCES);
    if (resources.length > 0) {
      var resourceLargestForCreep = resources[0];
      for (var i = 1; i < resources.length; i++) {
        var resource = resources[i];
        if (resource.amount > resourceLargestForCreep.amount) {
          resourceLargestForCreep = resource;
        }
      }
      return resourceLargestForCreep;
    }

    return null;
  },
  findClosestEnergy: function (creep) {
    var energyClosestFound = null;

    energyClosestFound = this.findAssignedSource(creep);
    if (energyClosestFound) {
      // util.log("Using assigned source " + energyClosestFound);
      return energyClosestFound;
    }

    var batteries = creep.pos.findInRange(FIND_MY_CREEPS, 10, {
      filter: (creep) => {
        return (
          creep.memory.role === 'battery' &&
          creep.store[RESOURCE_ENERGY] > 0
        );
      }
    });

    if (batteries.length > 0) {
      // util.log(creep + " found battery " + batteries[0]);
      return batteries[0];
    }

    var resources = creep.room.find(FIND_DROPPED_RESOURCES);
    if (resources.length > 0) {
      for (var i = 0; i < resources.length; i++) {
        var resource = resources[i];
        // util.log("Ruin with energy: " + ruin.store['energy']);
        if (resource.amount > 0) {
          return resource;
        }
      }
    }

    if (creep.memory.role !== 'harvester') {
      var container = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return ((
              structure.structureType === STRUCTURE_STORAGE || structure.structureType === STRUCTURE_LINK) &&
            structure.store.energy > 0)
        }
      });
      if (container) return container;
    }

    var tombstones = creep.room.find(FIND_TOMBSTONES);
    util.log(tombstones);
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
        // util.log("Ruin with energy: " + ruin.store['energy']);
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
  findClosestStore: function (creep) {
    var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return ((structure.structureType == STRUCTURE_STORAGE ||
            structure.structureType == STRUCTURE_CONTAINER) &&
          structure.store.energy > 0)
      }
    });

    return source;
  },
  findContainerRemote: function(creep) {
    var containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_CONTAINER &&
          structure.pos.getRangeTo(creep.room.controller) > 15 &&
          structure.store.getUsedCapacity() > 0;
      }
    });

    return containers[0];
  },
  findEnergyTarget: function (creep) {
    var closest_target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
      }
    });

    // Targets.length would be 0 if all of the other structures are full
    //   So, instead deposit it in a container.
    if (closest_target === null || closest_target === undefined) {
      var targetsStores = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return ((structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_STORAGE
          ) && structure.store.getFreeCapacity() > 0);
        }
      });

      if (targetsStores.length === 0) {
        util.log("All containers are full!");
      } else {
        closest_target = targetsStores[0];
      }
    }

    return closest_target;
  },
  findRefuelSpawn: function (creep) {
    var closest_target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType === STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
      }
    });
    return closest_target;
  },
  findRefuelExtension: function (creep) {
    var closest_target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity;
      }
    });
    return closest_target;
  },
  findRefuelTower: function (creep) {
    var closest_target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
      }
    });
    return closest_target;
  },
  findResource: function (creep) {
    var resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    return resource;
  },
  findSource: function (creep) {
    return creep.pos.findClosestByPath(FIND_SOURCES);
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
  findTombstoneWithResources: function (creep) {
    var tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES);

    return tombstone;
  },
}


module.exports = locator;