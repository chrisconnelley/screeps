var util = require('util');
var brainRoom = require('brain.room');
var locator = require('locator');
var map = require('map');

var brainColony = {
  run: function () {
    const u = util;
    u.log("brainColony run()");

    map.createInitialColonyMap();

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
    //     u.log(`${JSON.stringify(memoryRoom)}`)
    //     if (!memoryRoom.controller.my && !memoryRoom.controller.owner) {
    //       u.log(`Room that is not mine and has no owner: ${nameRoom}`)
    //       locator.findAssignedScout(nameRoom);
    //       var sources = memoryRoom.sources;
          
    //       u.log(`Room ${nameRoom} has sources: ${JSON.stringify(sources)}`);
    //       _.forIn(sources, (source, idSource) => {
    //         brainRoom.checkSource(nameRoom, idSource);
    //         locator.findAssignedTransportRemote(nameRoom);
    //       });
    //     }
    //   } else {
    //     u.log(`Room ${nameRoom} doesn't have controller`);
        
    //   }

    // });
  }
};

module.exports = brainColony;