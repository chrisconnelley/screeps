/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('hud');
 * mod.thing == 'a thing'; // true
 */

var hud = {
  run: function(spawnName, status) {
    var spawn = Game.spawns[spawnName];
    var room = spawn.room;
    var flag = Game.flags['display'];
    
    if (!flag) return;
    
    var pos = {x: flag.pos.x+2, y: flag.pos.y, roomName: room.name};

    var numberLine = 0;
    status.forEach((statusLine) => {
      room.visual.text(statusLine, flag.pos.x+2, flag.pos.y+(numberLine++), {
        color: '#FFFFFF',
        font: '12px',
        align: 'left'
      });
    })

  }
}

module.exports = hud;