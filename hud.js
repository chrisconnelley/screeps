var hud = {
  run: function(nameRoom, status) {
    var room = Game.rooms[nameRoom];
    
    status = [];
    status.push(`Game time: ${Game.time}`);
    status.push(`Energy available: ${Game.rooms[nameRoom].energyAvailable} / ${Game.rooms[nameRoom].energyCapacityAvailable}`);

    var numberLine = 0;
    status.forEach((statusLine) => {
      room.visual.text(statusLine, 2, 2+(numberLine++), {
        color: '#FFFFFF',
        font: '12px',
        align: 'left'
      });
    })

  }
}

module.exports = hud;