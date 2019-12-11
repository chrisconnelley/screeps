var util = require('util');
var brainData = require('brain.data');
var locator = require('locator');

var hud = {
  run: function(nameRoom, status) {
    const u = util;
    var room = Game.rooms[nameRoom];
    // return;
    if (!room) return;
    
    var lengthTickInMs = parseInt(brainData.getAverageDiff(Memory.game, 'timeTick')/100)*100;

    var controller = room.controller;
    var energyToControllerUpgrade = 'N/A';
    var progressRCLAverage = 'N/A';
    var secondsToUpgrade = 'N/A';
    var amountEnergyDropped = locator.getAmountDroppedResources(nameRoom);
    var amountEnergyStored = brainData.getValueLast(Memory.colony.rooms[nameRoom], 'energyStored');
    var amountEnergyStoredAverage = brainData.getAverageDiff(Memory.colony.rooms[nameRoom], 'energyStored').toFixed(2);

    if (controller) {
      energyToControllerUpgrade = controller.progressTotal - controller.progress;
      progressRCLAverage = brainData.getAverageDiff(Memory.colony.rooms[nameRoom].controller, 'Progress');
      if (progressRCLAverage !== 0) {
        secondsToUpgrade = energyToControllerUpgrade / progressRCLAverage;
        secondsToUpgrade = parseInt(secondsToUpgrade * lengthTickInMs / 1000);
      }
    }

    status.push(`Game time: ${Game.time}`);
    status.push(`CPU Bucket: ${Game.cpu.bucket}/10000`);
    status.push(`Energy available: ${Game.rooms[nameRoom].energyAvailable} / ${Game.rooms[nameRoom].energyCapacityAvailable}`);
    status.push(`Tick Length: ${lengthTickInMs/1000} seconds`);
    status.push(`RCL Upgrade in ${energyToControllerUpgrade} energy`);
    status.push(`RCL average progress: ${progressRCLAverage.toFixed(2)}`);
    status.push(`RCL upgrade time: ${util.countdown(-secondsToUpgrade)} (${-secondsToUpgrade}s)`);
    status.push(`Dropped energy: ${amountEnergyDropped}`);
    status.push(`Stored energy: ${amountEnergyStored} / ${amountEnergyStoredAverage}`);

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