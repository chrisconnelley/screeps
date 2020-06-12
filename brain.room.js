var util = require('util');
var control = require('control')
var hud = require('hud');
var brainSpawn = require('brain.spawn');
var mc = require('util.memory.creep');
var locator = require('locator');
var map = require('map');
var brainData = require('brain.data');
var brainMarket = require('brain.market');

const amountMaxUpgraderCost = 3200;

var brainRoom = {
  checkController: function (nameRoom) {
      
    if (Game.time % 2500 === 0) {
        brainMarket.emptyTerminal(nameRoom);
    }
      
    return;
      
    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memoryController = memoryRoom.controller;
    var isUpgraderOld = false;

    if (!memoryController || memoryController.level === 8) return;

    var nameUpgrader = memoryController.nameUpgrader;

    if (nameUpgrader) {
      var creepUpgrader = Game.creeps[memoryController.nameUpgrader];

      if (creepUpgrader) {
        isUpgraderOld = creepUpgrader.ticksToLive < 100;
      } else {
        memoryController.nameUpgrader = null;
      }
    }

    if ((!nameUpgrader || isUpgraderOld) &&
      (memoryRoom.energyAvailable == memoryRoom.energyCapacityAvailable || memoryRoom.energyAvailable > amountMaxUpgraderCost)
    ) {
      if (isUpgraderOld) memoryController.nameUpgrader = null;
      var memorySpawns = memoryRoom.spawns;

      var nameSpawnUse = _.findKey(memorySpawns, (memorySpawn) => {
        return !memorySpawn.spawning
      });

      if (nameSpawnUse) {
        var nameUpgraderNew = 'U' + nameSpawnUse + Game.time;

        var resultSpawn = OK;
        var energyUsed = memoryRoom.energyAvailable > amountMaxUpgraderCost ? amountMaxUpgraderCost : memoryRoom.energyAvailable;
        var resultSpawn = control.sU(nameSpawnUse, energyUsed, nameUpgraderNew);
        if (resultSpawn === OK) {
          memoryController.nameUpgrader = nameUpgraderNew;
        }
      }
    }
  },
  reserveController: function (nameRoom) {

    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memoryController = memoryRoom.controller;

    var nameClaimer = memoryController.nameClaimer;

    if (!nameClaimer) {
      var spawn = locator.findSpawnOwnedClosest(nameRoom);
      if (spawn) {
        var nameRoomSpawn = spawn.pos.roomName;
        memoryRoom = Memory.colony.rooms[nameRoomSpawn];
        if (!memoryRoom) return;

        var result; // 
        result = {
          code: ERR_NOT_IN_RANGE
        };
        // result =  control.sC(spawn.name,spawn.room.energyAvailable);

        if (result === OK) {
          memoryController.nameClaimer = result.nameCreep;
        } else {}
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
    return;
    console.log(`[brain.room | checkSource] nameRoom: ${nameRoom} idSource: ${idSource}`)
    
    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memorySources = memoryRoom.sources;

    if (!memorySources) return;

    var memorySource = memorySources[idSource];
    var memorySpawns = memoryRoom.spawns;

    var nameExcavator = memorySource.nameExcavator;
    var isExcavatorOld = false;

    // console.log(`[brain.room | checkSource] nameExcavator: ${nameExcavator}`)

    if (nameExcavator) {
      var creep = Game.creeps[nameExcavator];

//  console.log(`[brain.room | checkSource] creep: ${creep}`)

      if (creep) {
        isExcavatorOld = creep.ticksToLive < 100;
        var sourceCreep = mc.getSource(creep.name);

        if (!sourceCreep) {
          mc.setSource(creep.name, idSource);
        }
      } else {
        memorySource.nameExcavator = null;
      }
    }

    if (!util.isRoomMine(nameRoom)) {
      return; // TURN OFF REMOTE
    }

    var partsPossible = parseInt(memoryRoom.energyCapacityAvailable / 150);
    partsPossible = partsPossible > 5 ? 5 : partsPossible;
    var costExcavator = partsPossible * 150;
    if ((!nameExcavator || isExcavatorOld) && memoryRoom.energyAvailable >= costExcavator) {
      if (isExcavatorOld) {
        memorySource.nameExcavator = null;
      }

      var nameSpawnUse = _.findKey(memorySpawns, (memorySpawn) => {
        return !memorySpawn.spawning
      });

      // if 

    console.log(`[brain.room] checkSource:147 - nameSpawnUse: ${nameSpawnUse}`)


      if (nameSpawnUse) {
        var spawn = Game.spawns[nameSpawnUse];
        var nameExcavatorNew = 'X' + nameSpawnUse + Game.time;

        var resultSpawn = OK;
        var resultSpawn = control.spawnShort(nameSpawnUse, nameExcavatorNew, {
          'move': partsPossible,
          'work': partsPossible
        }, 'excavator');
        if (resultSpawn === OK) {
          memorySource.nameExcavator = nameExcavatorNew;
          var resultSet = mc.setSource(nameExcavatorNew, memorySource.id);
        }
      }
    } else if (!nameExcavator && memoryRoom.energyAvailable < 750) {
      var spawn = Game.rooms[nameRoom].find(FIND_MY_SPAWNS)[0];

      if (!spawn) return;

      if (!spawn.spawning && Game.time % 200 === 0) {
        control.sH(spawn.name, memoryRoom.energyAvailable);
      }
    }
  },
  checkMineral: function (nameRoom, idMineral) {
    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memoryMinerals = memoryRoom.minerals;

    if (!memoryMinerals) return;

    var memoryMineral = memoryMinerals[idMineral];

    var memorySpawns = memoryRoom.spawns;

    var nameMiner = memoryMineral.nameMiner;
    var isMinerOld = false;

    if (!memoryMineral.hasExtractor) return;
    creep = this.matchMiner(nameMiner, memoryMineral);

    if (memoryMineral.mineralAmount === 0) {
      if (creep) {
        mc.setStage(creep.name, 'recycle');
      }
      return;
    }

    isMinerOld = !!creep && creep.ticksToLive < 100;

    if (!creep || isMinerOld) {
      if (isMinerOld) {
        memoryMineral.nameMiner = null;
      }

      var nameSpawnUse = _.findKey(memorySpawns, (memorySpawn) => {
        return !memorySpawn.spawning
      });

      if (nameSpawnUse) {
        var resultSpawn = {
          code: OK,
          nameCreep: null
        };
        var resultSpawn = control.sM(nameSpawnUse, memoryRoom.energyAvailable);
        if (resultSpawn.code === OK) {
          memoryMineral.nameMiner = resultSpawn.nameCreep;
          var resultSet = mc.setMineral(resultSpawn.nameCreep, memoryMineral.id);
        }
      }
    }
  },
  matchMiner: function (nameMiner, memoryMineral) {
    idMineral = memoryMineral.id;

    if (nameMiner) {
      var creep = Game.creeps[nameMiner];

      if (creep) {
        var mineralCreep;

        try {
          mineralCreep = mc.getMineral(creep.name);
        } catch {

        }


        if (!mineralCreep) {
          mc.setMineral(creep.name, idMineral);
        }

        return creep;
      } else {
        memoryMineral.nameMiner = null;

        return null;
      }
    }

    return null;
  },
  findResources: function (nameRoom) {
    var isRoomVisible = !!Game.rooms[nameRoom];
    var memoryRoom = Memory.colony.rooms[nameRoom];

    if (isRoomVisible) {

    } else {
      if (memoryRoom && memoryRoom.resources) {
        delete memoryRoom.resources;
      }
    }

  },
  run: function (nameRoom) {
    // console.log(`[brain.room] run`);
    var room = Game.rooms[nameRoom];

    if (!room) {}

    this.checkController(nameRoom);
    brainData.recordRoom(nameRoom);


    // console.log(`[brain.room] hud?`);
    hud.run(nameRoom, []);

    var spawns = room.find(FIND_MY_SPAWNS);
    spawns.forEach((spawn) => {
      brainSpawn.run(spawn.name);
    });

    var sources = room.find(FIND_SOURCES); // Find all the sources
    sources.forEach((source) => {
      map.mapSource(source);
      this.checkSource(nameRoom, source.id);
    });

    // var minerals = room.find(FIND_MINERALS); // Find all the sources
    // minerals.forEach((mineral) => {
    //       //   map.mapMineral(mineral);
    //   this.checkMineral(nameRoom, mineral.id);
    // });

    // this.findResources(nameRoom);
  },
  updateMap: function (nameRoom) {
    var memoryRooms = Memory.colony.rooms;
    var memoryRoom = memoryRooms[nameRoom];

    var room = Game.rooms[nameRoom];

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