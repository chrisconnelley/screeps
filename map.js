var util = require('util');

var map = {
  addAdjacentRooms: function (nameRoom) {
    const u = util;
    var room = Game.rooms[nameRoom];

    if (!room || !room.controller || room.controller.my) return;

    var exits = Game.map.describeExits(nameRoom);
    var memoryRooms = Memory.colony.rooms;

    _.forIn(exits, (exitRoomName, exitDirection) => {
      if (!memoryRooms[exitRoomName]) {
        u.log(`Room (${exitRoomName}) NOT found in map.`)
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
    const u = util;
    var memoryRooms = Memory.colony.rooms;
    var memoryRoom = memoryRooms[nameRoom];

    var room = Game.rooms[nameRoom];

    u.log(`nameRoom: ${nameRoom} room: ${room}`)

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
    const u = util;
    var nameRoom = source.pos.roomName;

    u.log(`updateMapSource (${nameRoom}, ${source})`)
    var memoryRooms = Memory.colony.rooms;
    var memoryRoom = memoryRooms[nameRoom];

    u.log(memoryRoom.name + " " + memoryRoom.sources);

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
    const u = util;
    var nameRoom = mineral.pos.roomName;

    u.log(`mapMineral (${nameRoom}, ${mineral})`)
    var memoryRooms = Memory.colony.rooms;
    var memoryRoom = memoryRooms[nameRoom];

    u.log(`memoryRoom.name: ${memoryRoom.name} memoryRoom.minerals: ${memoryRoom.minerals}`);

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
      u.log(`structures: ${JSON.stringify(structures)}`);
      structures.forEach((structure) => {
        hasExtractor = structure.my && structure.structureType === 'extractor'
      });

      u.log(`hasExtractor: ${hasExtractor}`);
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
    const u = util;
   
    var memoryController = _.get(Memory, `colony.rooms.${nameRoom}.controller`);
    memoryController.arrayProgress = arrayProgress;

    u.log(`memoryController: ${JSON.stringify(memoryController)}`);
  },
  getRoomControllerProgress: function(nameRoom) {
    const u = util;
    
    var memoryArrayProgress = _.get(Memory, `colony.rooms.${nameRoom}.controller.arrayProgress`);

    u.log(`${nameRoom} memoryArrayProgress: ${JSON.stringify(memoryArrayProgress)}`);
  
    return memoryArrayProgress;
  },
  markRoomHostile: function (nameRoom) {
    console.log("TODO: map.markRoomHostile");
    var memoryColony = this.getOrCreateMemoryObject(Memory, 'colony');
    var memoryRooms = this.getOrCreateMemoryObject(memoryColony, 'rooms');
    var memoryRoom = this.getOrCreateMemoryObject(memoryRooms, nameRoom);
    var memoryRoomHostile = this.getOrCreateMemoryBoolean(memoryRoom, 'hostile');

    memoryRoomHostile = true;

    return false;

    // .rooms[nameRoom];

    // if (!memoryRoom) {

    // }
  },
  getOrCreateMemory: function(keyMemoryParent, keyMemoryChild) {
  },
  getOrCreateMemoryArray: function (keyMemoryParent, keyMemoryChild) {
    var u = util;

    u.log(`keyMemoryParent: ${keyMemoryParent} keyMemoryChild: ${keyMemoryChild}`);
    
    if (!keyMemoryParent[keyMemoryChild]) {
      keyMemoryParent[keyMemoryChild] = [];
    }

    return keyMemoryParent[keyMemoryChild];
  },
  getOrCreateMemoryObject: function (keyMemoryParent, keyMemoryChild) {
    var u = util;

    u.log(`keyMemoryParent: ${JSON.stringify(keyMemoryParent)} keyMemoryChild: ${keyMemoryChild}`);
    if (!keyMemoryParent[keyMemoryChild]) {
      keyMemoryParent[keyMemoryChild] = {};
    }

    return keyMemoryParent[keyMemoryChild];
  },
  /* 
    getOrCreateMemoryString

    return null if memory exists, but is not of type string
  */
  getOrCreateMemoryString: function (keyMemoryParent, keyMemoryChild) {
    var memory = keyMemoryParent[keyMemoryChild];
    console.log(`memory: ${memory} keyMemoryChild: ${keyMemoryChild}`);

    if (!keyMemoryParent[keyMemoryChild]) {
      keyMemoryParent[keyMemoryChild] = '';
    }

    var memory = keyMemoryParent[keyMemoryChild];

    if (typeof memory !== 'string') return null;

    return memory;
  },
  /* 
    getOrCreateMemoryString

    return null if memory exists, but is not of type string
  */
  getOrCreateMemoryBoolean: function (keyMemoryParent, keyMemoryChild) {
    var memory = keyMemoryParent[keyMemoryChild];
    console.log(`memory: ${memory} keyMemoryChild: ${keyMemoryChild}`);

    if (keyMemoryParent[keyMemoryChild] === undefined) {
      keyMemoryParent[keyMemoryChild] = false;
    }

    var memory = keyMemoryParent[keyMemoryChild];

    if (typeof memory !== 'boolean') return null;

    return memory;
  }
};

module.exports = map;