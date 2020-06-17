var hud = require('hud');
var brainSpawn = require('brain.spawn');
var locator = require('locator');
var brainData = require('brain.data');
const brainTowers = require('brain.towers');

var brainRoom = {
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
  run: function (nameRoom) {
    var room = Game.rooms[nameRoom];

    brainData.recordRoom(nameRoom);
    brainTowers.run(nameRoom);

    hud.run(nameRoom, []);

    var spawns = room.find(FIND_MY_SPAWNS);
    spawns.forEach((spawn) => {
      brainSpawn.run(spawn.name);
    });
  }
};

module.exports = brainRoom;