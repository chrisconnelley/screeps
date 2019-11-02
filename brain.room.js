var hud = require('hud');
var brainSpawn = require('brain.spawn');
var ccreepsNew = require('ccreeps.new');

var brainRoom = {
  infoRoom: function(nameRoom) {
    var room = Game.rooms[nameRoom];
    var creeps = room.find(FIND_MY_CREEPS);

    var countCreeps = {};

    creeps.forEach((creep) => {
        if (countCreeps[creep.memory.role] === undefined) {
            countCreeps[creep.memory.role] = 1;
        } else {
            countCreeps[creep.memory.role]++;
        }
    })
    
    return { 
        countCreeps: countCreeps
    };
  },
  run: function(nameRoom) {
    // brainRoom is in charge of spawning creeps to harvest sources
    var room = Game.rooms[nameRoom];

    brainRoom.infoRoom(nameRoom);

    var status = ccreepsNew.run(nameRoom);
    hud.run(nameRoom, status); 

    var spawns = room.find(FIND_MY_SPAWNS);
    spawns.forEach((spawn) => {
      brainSpawn.run(spawn.name);
    });

    var sourceMapToExcavators;

    var sources = room.find(FIND_SOURCES);  // Find all the sources
    var creepsExcavators;   // Find all the excavators

    /*
      Determine if this room's spawn can spawn an excavator
        if they can't ask a bigger room (or generate a smaller one)
      
      var nameSpawn = Spawn from this room;
      spawnExcavator(nameSpawn, sourceId)
      
    */
    console.log(sources);

  },
  keepControllerAlive: function(nameRoom,infoRoom) {
      var room = Game.rooms[nameRoom];
         
      if (room.controller.my &&
          room.controller.ticksToDowngrade < 10000 &&
          infoRoom.countCreeps['upgrader']
          ) {
              var spawnClosest = room.controller.pos.findClosestByRange(FIND_MY_SPAWNS);
              control.spawnUpgrader(spawnClosest.name);
          }
  }
};

module.exports = brainRoom;