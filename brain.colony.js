var brainRoom = require('brain.room');
var map = require('map');

var brainColony = {
  run: function() {
    // Map rooms that we can see
    var nameRooms = Object.keys(Game.rooms)
    nameRooms.forEach((nameRoom) => {
      map.mapRoom(nameRoom);
    });

    nameRooms.forEach((nameRoom) => {
      brainRoom.run(nameRoom);
    });
  }
};

module.exports = brainColony;