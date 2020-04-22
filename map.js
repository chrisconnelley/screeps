var util = require('util');

var map = {
  addAdjacentRooms: function (nameRoom) {
    var room = Game.rooms[nameRoom];

    if (!room || !room.controller || room.controller.my) return;

    var exits = Game.map.describeExits(nameRoom);
    var memoryRooms = Memory.colony.rooms;

    _.forIn(exits, (exitRoomName, exitDirection) => {
      if (!memoryRooms[exitRoomName]) {
        memoryRooms[exitRoomName] = {};
      }
    });
  },
  createInitialColonyMap: function () {
    if (!Memory.colony) {
      Memory.colony = {};
    }

    var memoryColony = Memory.colony;

    if (!memoryColony.rooms) {
      memoryColony.rooms = {};
    }
  },
  mapRoom: function (nameRoom) {
    
    var memoryRooms = Memory.colony.rooms;
    var memoryRoom = memoryRooms[nameRoom];

    var room = Game.rooms[nameRoom];

    // If a room doesn't exist, set up all the default properties
    if (!memoryRoom) {
      memoryRooms[nameRoom] = {};
      memoryRooms[nameRoom] = Object.assign({}, room);
      memoryRooms[nameRoom].tickCreated = Game.time;
      memoryRooms[nameRoom].tickUpdated = Game.time;

      if (!memoryRooms[nameRoom].sources) {
        memoryRooms[nameRoom].sources = {};
      }

      if (!memoryRooms[nameRoom].minerals) {
        memoryRooms[nameRoom].minerals = {};
      }
      return;
    }

    if (memoryRoom.controller) {
      var nameClaimer = memoryRoom.controller.nameClaimer;
      var nameUpgrader = memoryRoom.controller.nameUpgrader;
      var arrayProgress = memoryRoom.controller.arrayProgress;

      memoryRoom.controller = room.controller;

      memoryRoom.controller.nameUpgrader = nameUpgrader;
      memoryRoom.controller.nameClaimer = nameClaimer;
      memoryRoom.controller.arrayProgress = arrayProgress;
    }

    memoryRoom.energyAvailable = room.energyAvailable;
    memoryRoom.energyCapacityAvailable = room.energyCapacityAvailable;
    memoryRoom.tickUpdated = Game.time;
  },
  mapSource: function (source) {
    var nameRoom = source.pos.roomName;

    var memoryRooms = Memory.colony.rooms;
    var memoryRoom = memoryRooms[nameRoom];

    if (!memoryRoom.sources) return;

    var memorySource = memoryRoom.sources[source.id];
    if (!memorySource) {
      memoryRoom.sources[source.id] = {};
      memoryRoom.sources[source.id] = Object.assign({}, source);
      delete memoryRoom.sources[source.id].room;
      memoryRoom.sources[source.id].tickCreated = Game.time;
      memoryRoom.sources[source.id].tickUpdated = Game.time;
      return;
    }

    // Update values that change
    memorySource.energy = source.energy;
    memorySource.energyCapacity = source.energyCapacity;
    memorySource.ticksToRegeneration = source.ticksToRegeneration;
    memorySource.tickUpdated = Game.time;
  },
  mapMineral: function (mineral) {
    var nameRoom = mineral.pos.roomName;

    var memoryRooms = Memory.colony.rooms;
    var memoryRoom = memoryRooms[nameRoom];

    if (!memoryRoom.minerals) {
      memoryRoom.minerals = {};
    };

    var memoryMineral = memoryRoom.minerals[mineral.id];
    if (!memoryMineral) {
      memoryRoom.minerals[mineral.id] = {};
      memoryRoom.minerals[mineral.id] = Object.assign({}, mineral);
      delete memoryRoom.minerals[mineral.id].room;
      memoryRoom.minerals[mineral.id].tickCreated = Game.time;
      memoryRoom.minerals[mineral.id].tickUpdated = Game.time;
      return;
    }

    if (Game.time % 101 === 0) {
      var structures = mineral.pos.lookFor(LOOK_STRUCTURES);

      var hasExtractor = false;
      structures.forEach((structure) => {
        hasExtractor = structure.my && structure.structureType === 'extractor'
      });

      memoryMineral.hasExtractor = hasExtractor;
    }

    // Update values that change
    memoryMineral.mineralAmount = mineral.mineralAmount;
    memoryMineral.ticksToRegeneration = mineral.ticksToRegeneration;
    memoryMineral.tickUpdated = Game.time;
  },
  mapController: function (idController) {

  },
  mapSpawn: function (nameSpawn) {

  },
  setRoomControllerProgress: function(nameRoom, arrayProgress) {
    var memoryController = _.get(Memory, `colony.rooms.${nameRoom}.controller`);
    memoryController.arrayProgress = arrayProgress;
  },
  getRoomControllerProgress: function(nameRoom) {
    var memoryArrayProgress = _.get(Memory, `colony.rooms.${nameRoom}.controller.arrayProgress`);
  
    return memoryArrayProgress;
  },
  markRoomHostile: function (nameRoom) {
    var memoryColony = this.getOrCreateMemoryObject(Memory, 'colony');
    var memoryRooms = this.getOrCreateMemoryObject(memoryColony, 'rooms');
    var memoryRoom = this.getOrCreateMemoryObject(memoryRooms, nameRoom);
    var memoryRoomHostile = this.getOrCreateMemoryBoolean(memoryRoom, 'hostile');

    memoryRoomHostile = true;

    return false;
  },
  getOrCreateMemory: function(keyMemoryParent, keyMemoryChild) {
  },
  getOrCreateMemoryArray: function (keyMemoryParent, keyMemoryChild) {
    if (!keyMemoryParent[keyMemoryChild]) {
      keyMemoryParent[keyMemoryChild] = [];
    }

    return keyMemoryParent[keyMemoryChild];
  },
  getOrCreateMemoryObject: function (keyMemoryParent, keyMemoryChild) {
    if (!keyMemoryParent[keyMemoryChild]) {
      keyMemoryParent[keyMemoryChild] = {};
    }

    return keyMemoryParent[keyMemoryChild];
  },
  getOrCreateMemoryString: function (keyMemoryParent, keyMemoryChild) {
    var memory = keyMemoryParent[keyMemoryChild];
    if (!keyMemoryParent[keyMemoryChild]) {
      keyMemoryParent[keyMemoryChild] = '';
    }

    var memory = keyMemoryParent[keyMemoryChild];

    if (typeof memory !== 'string') return null;

    return memory;
  },
  getOrCreateMemoryBoolean: function (keyMemoryParent, keyMemoryChild) {
    var memory = keyMemoryParent[keyMemoryChild];

    if (keyMemoryParent[keyMemoryChild] === undefined) {
      keyMemoryParent[keyMemoryChild] = false;
    }

    var memory = keyMemoryParent[keyMemoryChild];

    if (typeof memory !== 'boolean') return null;

    return memory;
  }
};

module.exports = map;