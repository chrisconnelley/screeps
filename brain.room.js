var util = require('util');
var control = require('control')
var hud = require('hud');
var brainSpawn = require('brain.spawn');
var mc = require('util.memory.creep');
var locator = require('locator');
var map = require('map');
var brainData = require('brain.data');

const amountMaxUpgraderCost = 3200;

var brainRoom = {
  checkController: function (nameRoom) {
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
      (memoryRoom.energyAvailable == memoryRoom.energyCapacityAvailable || memoryRoom.energyAvailable > amountMaxUpgraderCost)
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
        var energyUsed = memoryRoom.energyAvailable > amountMaxUpgraderCost ? amountMaxUpgraderCost : memoryRoom.energyAvailable;
        var resultSpawn = control.sU(nameSpawnUse, energyUsed, nameUpgraderNew);
        u.log(`${nameUpgraderNew} resultSpawn: ${resultSpawn}`);
        if (resultSpawn === OK) {
          memoryController.nameUpgrader = nameUpgraderNew;
          u.log(`resultSpawn inside: ${resultSpawn}`);
        }
      }
    }
  },
  reserveController: function (nameRoom) {
    const u = util;
    u.log(`[brain.room reserveController] nameRoom: ${nameRoom}`);

    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memoryController = memoryRoom.controller;

    var nameClaimer = memoryController.nameClaimer;

    if (!nameClaimer) {
      var spawn = locator.findSpawnOwnedClosest(nameRoom);
      u.log(`spawn: ${spawn}`);
      if (spawn) {
        var nameRoomSpawn = spawn.pos.roomName;
        memoryRoom = Memory.colony.rooms[nameRoomSpawn];
        if (!memoryRoom) return;
        u.log(`spawn: ${spawn.name} room: ${nameRoomSpawn} memoryRoom: ${JSON.stringify(memoryRoom)}`);
        
        var result; // 
        result = { code: ERR_NOT_IN_RANGE }; 
        // result =  control.sC(spawn.name,spawn.room.energyAvailable);
        
        if (result === OK) {
          memoryController.nameClaimer = result.nameCreep;
          u.log(`Attempt to create controller claimer succeeded: ${result.nameCreep}`);
        } else {
          u.log(`Attempt to create controller claimer failed: ${util.errorCodeToDisplay(result.code)}`);
        }
      }
    } else {
      var creep = Game.creep[nameClaimer];
      if (!creep) {
        memoryController.nameClaimer = null;
        this.reserveController(nameRoom);
      }

      if (creep.idController !== memoryController.id) {
        creep.idController = memoryController.id;
        creep.posController = memoryController.pos;
      }
    }
  },
  checkSource: function (nameRoom, idSource) {
    var u = util;

    if (nameRoom === 'E4N43') u = console;

    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memorySources = memoryRoom.sources;

    u.log(`[brain.room checkSource] memorySources: ${memorySources}`);
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
    var partsPossible = parseInt(memoryRoom.energyCapacityAvailable / 150);
    partsPossible = partsPossible > 5 ? 5 : partsPossible;
    var costExcavator = partsPossible * 150;


    u.log(`parts possible: ${partsPossible}  costExcavator: ${costExcavator}`);
    if ((!nameExcavator || isExcavatorOld) && memoryRoom.energyAvailable >= costExcavator) {
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
        var resultSpawn = control.spawnShort(nameSpawnUse, nameExcavatorNew, {
          'move': partsPossible,
          'work': partsPossible
        }, 'excavator');
        u.log(`${nameExcavatorNew} resultSpawn: ${resultSpawn}`);
        if (resultSpawn === OK) {
          memorySource.nameExcavator = nameExcavatorNew;
          u.log(`resultSpawn inside: ${resultSpawn}`);
          var resultSet = mc.setSource(nameExcavatorNew, memorySource.id);
          u.log(`Result of assigning Source (${memorySource.id}) to excavator ${nameExcavatorNew}: ${resultSet}`);
        }
      }
    } else if (!nameExcavator && memoryRoom.energyAvailable < 750) {
         u = console;
         u.log(`Room ${nameRoom} Energy low! ${memoryRoom.energyAvailable}`)
         var spawn = Game.rooms[nameRoom].find(FIND_MY_SPAWNS)[0];
         u.log(`Room ${nameRoom} spawn: ${spawn}`)

         if (!spawn) return;

         u.log(`Spawn.spawning: ${spawn.spawning} Game.time: ${Game.time}`)
         if (!spawn.spawning && Game.time % 200 === 0) {
           u.log(`Spawing harvester`)
           control.sH(spawn.name, memoryRoom.energyAvailable);
         }
    }
  },
  checkMineral: function (nameRoom, idMineral) {
    const u = util;
    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memoryMinerals = memoryRoom.minerals;

    if (!memoryMinerals) return;

    var memoryMineral = memoryMinerals[idMineral];

    var memorySpawns = memoryRoom.spawns;

    var nameMiner = memoryMineral.nameMiner;
    var isMinerOld = false;

    u.log(`nameRoom: ${nameRoom} idMineral: ${idMineral} hasExtractor: ${memoryMineral.hasExtractor}`);

    if (!memoryMineral.hasExtractor) return;
    creep = this.matchMiner(nameMiner, memoryMineral);

    if (memoryMineral.mineralAmount === 0) {
      if (creep) {
        mc.setStage(creep.name, 'recycle');
      }
      return;
    }

    isMinerOld = !!creep && creep.ticksToLive < 100;

    u.log(`[checkMineral] creep: ${creep}`);

    u.log(`memoryRoom: ${memoryRoom} memorySpawns: ${memorySpawns}`);
    u.log(`nameMiner: ${nameMiner} isMinerOld: ${isMinerOld} memoryRoom.energyAvailable: ${memoryRoom.energyAvailable}`);
    if (!creep || isMinerOld) {
      if (isMinerOld) {
        memoryMineral.nameMiner = null;
      }

      var nameSpawnUse = _.findKey(memorySpawns, (memorySpawn) => {
        return !memorySpawn.spawning
      });

      if (nameSpawnUse) {
        var resultSpawn = { code: OK, nameCreep: null };
        var resultSpawn = control.sM(nameSpawnUse, memoryRoom.energyAvailable);
        u.log(`${resultSpawn.nameCreep} resultSpawn: ${JSON.stringify(resultSpawn)}`);
        if (resultSpawn.code === OK) {
          memoryMineral.nameMiner = resultSpawn.nameCreep;
          u.log(`resultSpawn inside: ${resultSpawn.code}`);
          var resultSet = mc.setMineral(resultSpawn.nameCreep, memoryMineral.id);
          u.log(`Result of assigning Mineral (${memoryMineral.id}) to miner ${resultSpawn.nameCreep}: ${resultSet}`);
        }
      }
    }
  },
  matchMiner: function (nameMiner, memoryMineral) {
    const u = util;

    idMineral = memoryMineral.id;

    u.log(`[matchMiner] namerMiner: ${nameMiner} memoryMineral: ${JSON.stringify(memoryMineral)}`);
    if (nameMiner) {
      var creep = Game.creeps[nameMiner];

      if (creep) {
        var mineralCreep;

        try {
          mineralCreep = mc.getMineral(creep.name);
        } catch {

        }

        u.log(`Creep (${creep}) mineral: ${mineralCreep}`);

        if (!mineralCreep) {
          mc.setMineral(creep.name, idMineral);
        }

        u.log("Mineral " + idMineral + " mineralAmount: " + memoryMineral.mineralAmount + " Miner: " + nameMiner + " " + creep);
        return creep;
      } else {
        u.log("Forgetting: " + memoryMineral.nameMiner);
        memoryMineral.nameMiner = null;

        u.log("Mineral " + idMineral + " mineralAmount: " + memoryMineral.mineralAmount + " Miner: " + nameMiner + " " + creep);
        return null;
      }
    }

    u.log("Mineral " + idMineral + " mineralAmount: " + memoryMineral.mineralAmount + " Miner: " + nameMiner + " " + creep);
    return null;
  },
  findResources: function (nameRoom) {
    const u = util;
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
  run: function (nameRoom) {
    const u = util;
    u.log(`*** Brain.Room.Run ***`);
    var room = Game.rooms[nameRoom];

    if (!room) {
      u.log(`Can't see room ${nameRoom}`);
    }

    this.checkController(nameRoom);
    brainData.recordRoom(nameRoom);

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

    var minerals = room.find(FIND_MINERALS); // Find all the sources
    minerals.forEach((mineral) => {
      u.log(`${nameRoom} mineral: ${mineral.id}`)
      map.mapMineral(mineral);
      this.checkMineral(nameRoom, mineral.id);
    });

    this.findResources(nameRoom);
  },
  updateMap: function (nameRoom) {
    const u = util;
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