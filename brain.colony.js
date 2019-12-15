var util = require('util');
var brainData = require('brain.data');
var brainRoom = require('brain.room');
var map = require('map');

var brainColony = {
  run: function() {
    const u = util;
    u.log("[brain.colony run]");

    // brainData.recordData(Memory.game, 'cpuUsed_mapping-before', Game.cpu.getUsed(), 100);
    // map.createInitialColonyMap();
    // brainData.recordData(Memory.game, 'cpuUsed_mapping-after', Game.cpu.getUsed(), 100);
    // console.log(
    //   `Colony Map: ${brainData.getValueLast(Memory.game, 'cpuUsed_mapping-after') - brainData.getValueLast(Memory.game, 'cpuUsed_mapping-before')
    // }`);


    // Map rooms that we can see
    var nameRooms = Object.keys(Game.rooms)
    nameRooms.forEach((nameRoom) => {
      u.log("brainColony found room (" + nameRoom + ")")
      map.mapRoom(nameRoom);
    });

    nameRooms.forEach((nameRoom) => {
      u.log("brainColony found room (" + nameRoom + ")")
      brainRoom.run(nameRoom);
    });

    // _.forIn(Memory.colony.rooms, (memoryRoom, nameRoom) => {
    //   if (memoryRoom.controller) {
    //     // u.log(`${JSON.stringify(memoryRoom)}`)
    //     if (util.isRoomRemoteAndFree(nameRoom)) {
    //       // u.log(`Room that is not mine and has no owner: ${nameRoom}`)
    //       // locator.findAssignedScout(nameRoom);
    //       var sources = memoryRoom.sources;
          
    //       u.log(`Room ${nameRoom} has sources: ${JSON.stringify(sources)}`);
    //       brainRoom.reserveController(nameRoom);
            
    //       _.forIn(sources, (source, idSource) => {
    //         // brainRoom.checkSource(nameRoom, idSource);
    //         // locator.findAssignedTransportRemote(nameRoom);
    //       });
    //     } else {
    //       u.log(`Room ${nameRoom} isn't mine`);
    //     }
    //   } else {
    //     u.log(`Room ${nameRoom} doesn't have controller`);
    //   }
    // });
  }
};

module.exports = brainColony;