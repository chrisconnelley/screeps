var util = require('util');
var control = require('control')
var hud = require('hud');
var brainSpawn = require('brain.spawn');
var mc = require('util.memory.creep');
var locator = require('locator');
var map = require('map');

var brainRoom = {
  checkController: function(nameRoom) {
    const u = util;
    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memoryController = memoryRoom.controller;
    var isUpgraderOld = false;

    if (!memoryController) return;

    var nameUpgrader = memoryController.nameUpgrader;

    u.log(`checkController room: ${nameRoom} controller: ${memoryController.id} upgrader: ${memoryController.nameUpgrader}`);

    if (nameUpgrader) {
      var creepUpgrader = Game.creeps[memoryController.nameUpgrader];

      u.log(`creepUpgrader: ${memoryController.nameUpgrader} ${creepUpgrader}`)
      if (creepUpgrader) {
        isUpgraderOld = creepUpgrader.ticksToLive < 100;
      } else {
        memoryController.nameUpgrader = null;
      }
    }
 
    u.log(`spawn upgrader check: ${nameUpgrader} ${!nameUpgrader} ${isUpgraderOld} E: ${memoryRoom.energyAvailable} / ${memoryRoom.energyCapacityAvailable}`)
    if ((!nameUpgrader || isUpgraderOld) &&
      memoryRoom.energyAvailable == memoryRoom.energyCapacityAvailable
    ) {
      if (isUpgraderOld) memoryController.nameUpgrader = null;
      var memorySpawns = memoryRoom.spawns;
      
      u.log(`inside spawn upgrader ${memorySpawns}`)
      var nameSpawnUse = _.findKey(memorySpawns, (memorySpawn) => {
        return !memorySpawn.spawning
      });

      u.log(`spawn to use ${nameSpawnUse}`)

      if (nameSpawnUse) {
        var nameUpgraderNew = 'U' + nameSpawnUse + Game.time;
                
        var resultSpawn = OK;
        var resultSpawn = control.spawnUpgrader(nameSpawnUse, nameUpgraderNew, memoryRoom.energyAvailable);
        u.log(`${nameUpgraderNew} resultSpawn: ${resultSpawn}`);
        if (resultSpawn === OK) {
          memoryController.nameUpgrader = nameUpgraderNew;
          u.log(`resultSpawn inside: ${resultSpawn}`);
        }
      }
    }

  },
  checkSource: function(nameRoom, idSource) {
    var u = util;
    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memorySources = memoryRoom.sources;

    if (!memorySources) return;

    var memorySource = memorySources[idSource];
    var memorySpawns = memoryRoom.spawns;

    var nameExcavator = memorySource.nameExcavator;
    var isExcavatorOld = false;

    u.log(`nameRoom: ${nameRoom} idSource: ${idSource}`);

    if (nameExcavator) {
      var creep = Game.creeps[nameExcavator];

      if (creep) {
        u.log(`Excavator ${nameExcavator} ticks to live: ${creep.ticksToLive}`);
        isExcavatorOld = creep.ticksToLive < 100;
        var sourceCreep = mc.getSource(creep.name);

        u.log(`Creep (${creep}) source: ${sourceCreep}`)

        if (!sourceCreep) {
          mc.setSource(creep.name, idSource);
        }
      } else {
        u.log("Forgetting: " + memorySource.nameExcavator);
        memorySource.nameExcavator = null;
      }
      u.log("Source " + idSource + " energy: " + memorySource.energy + " Excavator: " + nameExcavator + " " + creep);
    }

    u.log(`Check Source Creep: ${nameExcavator}`);

    if (!util.isRoomMine(nameRoom)) {
        return; // TURN OFF REMOTE
    //   var spawn = locator.findSpawnOwnedClosest(nameRoom);
    //   u.log(`spawn: ${spawn}`);
    //   if (spawn) {
    //     var nameRoomSpawn = spawn.pos.roomName;
    //     memoryRoom = Memory.colony.rooms[nameRoomSpawn];
    //     if (!memoryRoom) return;
    //     u.log(`spawn: ${spawn.name} room: ${nameRoomSpawn} memoryRoom: ${JSON.stringify(memoryRoom)}`);
    //     memorySpawns = memoryRoom.spawns;
    //   }
    }

    u.log(`memoryRoom: ${memoryRoom} memorySpawns: ${memorySpawns}`);
    u.log(`nameExcavator: ${nameExcavator} isExcavatorOld: ${isExcavatorOld} memoryRoom.energyAvailable: ${memoryRoom.energyAvailable}`);
    if ((!nameExcavator || isExcavatorOld) && memoryRoom.energyAvailable > 750) {
      if (isExcavatorOld) {
        memorySource.nameExcavator = null;
      } 
        
      var nameSpawnUse = _.findKey(memorySpawns, (memorySpawn) => {
        return !memorySpawn.spawning
      });
      
      if (nameSpawnUse) {
        var spawn = Game.spawns[nameSpawnUse];
        var nameExcavatorNew = 'X' + nameSpawnUse + Game.time;
                
        var resultSpawn = OK;
        var resultSpawn = control.spawnShort(nameSpawnUse, nameExcavatorNew, {'move':5,'work':5},'excavator');
        u.log(`${nameExcavatorNew} resultSpawn: ${resultSpawn}`);
        if (resultSpawn === OK) {
          memorySource.nameExcavator = nameExcavatorNew;
          u.log(`resultSpawn inside: ${resultSpawn}`);
          var resultSet = mc.setSource(nameExcavatorNew, memorySource.id);
          u.log(`Result of assigning Source (${memorySource.id}) to excavator ${nameExcavatorNew}: ${resultSet}`);
        }
      }
    } else if (!nameExcavator && memoryRoom.energyAvailable < 750) {
      u = util;
      u.log(`Room ${nameRoom} Energy low! ${memoryRoom.energyAvailable}`)
      var spawn = Game.rooms[nameRoom].find(FIND_MY_SPAWNS)[0];
      u.log(`Room ${nameRoom} spawn: ${spawn}`)
      
      if (!spawn) return;

      u.log(`Spawn.spawning: ${spawn.spawning} Game.time: ${Game.time}`)
      if (!spawn.spawning && Game.time % 200 === 0) {
        u.log(`Spawing buider`)
        control.sB(spawn.name, memoryRoom.energyAvailable);
      }
    }
  },
  findResources: function(nameRoom) {
    var u = util;
    var isRoomVisible = !!Game.rooms[nameRoom];
    var memoryRoom = Memory.colony.rooms[nameRoom];

    u.log(`memoryRoom (${nameRoom}) and isRoomVisible? ${isRoomVisible}`);

    if (isRoomVisible) {

    } else {
      if (memoryRoom && memoryRoom.resources) {
        delete memoryRoom.resources;
      }
    }
    
  },
  run: function(nameRoom) {
    const u = util;
    var room = Game.rooms[nameRoom];

    if (!room) {
      u.log(`Can't see room ${nameRoom}`);
    }

    this.checkController(nameRoom);

    hud.run(nameRoom, []);

    var spawns = room.find(FIND_MY_SPAWNS);
    spawns.forEach((spawn) => {
      brainSpawn.run(spawn.name);
    });

    var sources = room.find(FIND_SOURCES); // Find all the sources
    sources.forEach((source) => {
      u.log(`${nameRoom} source: ${source.id}`)
      map.mapSource(source);
      this.checkSource(nameRoom, source.id);
    });
    
    this.findResources(nameRoom);
  },
  updateMap: function (nameRoom) {
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
  }
};

module.exports = brainRoom;