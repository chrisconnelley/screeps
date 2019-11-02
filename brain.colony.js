
var brainRoom = require('brain.room');

var brainColony = {
    run: function() {
        var nameRooms = Object.keys(Game.rooms)
        nameRooms.forEach((nameRoom) => {
          brainRoom.run(nameRoom);
        });
    }
};

module.exports = brainColony;