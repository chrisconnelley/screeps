var util = require('util');

var map = {
  addAdjacentRooms: function(nameRoom) {
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
  mapRoom: function(nameRoom) {
    var u = util;
    var memoryRooms = Memory.colony.rooms;
    var memoryRoom = memoryRooms[nameRoom];

    var room = Game.rooms[nameRoom];
   
    u.log(`nameRoom: ${nameRoom} room: ${room}`)

    if (!memoryRoom) {
      memoryRooms[nameRoom] = {};
      memoryRooms[nameRoom] = Object.assign({}, room);
      memoryRooms[nameRoom].tickCreated = Game.time;
      memoryRooms[nameRoom].tickUpdated = Game.time;      

      if (!memoryRooms[nameRoom].sources) {
        memoryRooms[nameRoom].sources = {};
      }
      return;
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
      memoryRoom.sources[source.id] =  Object.assign({}, source);
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
  mapController: function(idController) {

  },
  mapSpawn: function(nameSpawn) {

  },
  markRoomHostile: function(nameRoom) {
    console.log("TODO: map.markRoomHostile");
    var memoryColony = this.getOrCreateMemory(Memory,'colony');
    var memoryRooms = this.getOrCreateMemoryObject(memoryColony, 'rooms');
    var memoryRoom = this.getOrCreateMemoryObject(memoryRooms, nameRoom);
    var memoryRoomHostile = this.getOrCreateMemoryBoolean(memoryRoom, 'hostile');

    memoryRoomHostile = true;

    return false;
    
    // .rooms[nameRoom];

    // if (!memoryRoom) {

    // }
  },
  getOrCreateMemoryObject: function(keyMemoryParent, keyMemoryChild) {
    if (!keyMemoryParent[keyMemoryChild]) {
      keyMemoryParent[keyMemoryChild] = {};
    }

    return keyMemoryParent[keyMemoryChild];
  },
  /* 
    getOrCreateMemoryString

    return null if memory exists, but is not of type string
  */
  getOrCreateMemoryString: function(keyMemoryParent, keyMemoryChild) {
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
 getOrCreateMemoryBoolean: function(keyMemoryParent, keyMemoryChild) {
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