var util = require('util');
var brainData = require('brain.data');
var locator = require('locator');

var hud = {
  run: function(nameRoom, status) {
    const u = util;
    var room = Game.rooms[nameRoom];
    
    if (!room) return;
    
    var lengthTickInMs = parseInt(brainData.getAverageDiff(Memory.game, 'timeTick')/100)*100;

    status.push(`🕰: ${Game.time} (${lengthTickInMs/1000}s)`);
    status.push(`CPU Bucket: ${Game.cpu.bucket}/10000`);
    status.push(`Spawn ⚡: ${Game.rooms[nameRoom].energyAvailable} / ${Game.rooms[nameRoom].energyCapacityAvailable}`);


    var controller = room.controller;
    var energyToControllerUpgrade = 'N/A';
    var progressRCLAverage = 'N/A';
    var secondsToUpgrade = 'N/A';
    var amountEnergyDropped = locator.getAmountDroppedResources(nameRoom);
    var amountEnergyStored = brainData.getValueLast(Memory.colony.rooms[nameRoom], 'energyStored');
    var amountEnergyStoredAverage = brainData.getAverageDiff(Memory.colony.rooms[nameRoom], 'energyStored').toFixed(2);

    if (controller && controller.my) {
      energyToControllerUpgrade = controller.progressTotal - controller.progress;
      progressRCLAverage = brainData.getAverageDiff(Memory.colony.rooms[nameRoom].controller, 'Progress');
      if (progressRCLAverage !== 0) {
        secondsToUpgrade = energyToControllerUpgrade / progressRCLAverage;
        secondsToUpgrade = parseInt(secondsToUpgrade * lengthTickInMs / 1000);
      }
        status.push(`RCL upgrade time: ${util.countdown(-secondsToUpgrade)} (${-secondsToUpgrade}s) ${progressRCLAverage.toFixed(2)} per tick`);
    }

    status.push(`Dropped ⚡: ${amountEnergyDropped}`);
    status.push(`Stored ⚡: ${amountEnergyStored} / ${amountEnergyStoredAverage}`);

    this.loadOtherRooms(nameRoom, status);

    var numberLine = 0;
    status.forEach((statusLine) => {
      room.visual.text(statusLine, 2, 2+(numberLine++), {
        color: '#FFFFFF',
        font: '12px',
        align: 'left'
      });
    })
  },
  loadOtherRooms: function(nameRoom, status) {
    status.push('');

    var rooms = Game.rooms;

    _.forIn(rooms, (room) => {
      status.push(`${room.name}: ${room.energyAvailable}/${room.energyCapacityAvailable} ${room.find(FIND_MY_CREEPS).length}`);
      status.push(`${locator.getAmountDroppedResources(room.name)} ${brainData.getValueLast(Memory.colony.rooms[room.name], 'energyStored')}`)
    });

  } 
}

module.exports = hud;