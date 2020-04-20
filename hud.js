var util = require('util');
var brainData = require('brain.data');
var locator = require('locator');

var hud = {
  run: function(nameRoom, status) {
    var room = Game.rooms[nameRoom];
    if (!room) return;
    var lengthTickInMs = parseInt(brainData.getAverageDiff(Memory.game, 'timeTick')/100)*100;

    status.push(`🕰: ${Game.time} (${lengthTickInMs/1000}s)`);
    status.push(`CPU Bucket: ${Game.cpu.bucket}/10000`);
    status.push(`Spawn: ${Game.rooms[nameRoom].energyAvailable} / ${Game.rooms[nameRoom].energyCapacityAvailable}`);
    var controller = room.controller;
    var energyToControllerUpgrade = 'N/A';
    var progressRCLAverage = 'N/A';
    var secondsToUpgrade = 'N/A';
    var amountEnergyDropped = locator.getAmountDroppedResources(nameRoom);
    var amountEnergyStored = brainData.getValueLast(Memory.colony.rooms[nameRoom], 'energyStored');
    var amountEnergyStoredAverage = brainData.getAverageDiff(Memory.colony.rooms[nameRoom], 'energyStored').toFixed(2);

    if (controller && controller.my && controller.level !== 8) {
      energyToControllerUpgrade = controller.progressTotal - controller.progress;
      progressRCLAverage = brainData.getAverageDiff(Memory.colony.rooms[nameRoom].controller, 'Progress');
      if (progressRCLAverage !== 0) {
        secondsToUpgrade = energyToControllerUpgrade / progressRCLAverage;
        secondsToUpgrade = parseInt(secondsToUpgrade * lengthTickInMs / 1000);
      }
        status.push(`RCL upgrade time: ${util.countdown(-secondsToUpgrade)} (${energyToControllerUpgrade} / ${-secondsToUpgrade}s) ${progressRCLAverage.toFixed(2)}/t`);
    }

    status.push(`Dropped: ${amountEnergyDropped}`);
    status.push(`Stored: ${amountEnergyStored} / ${amountEnergyStoredAverage}`);
    
    if (controller && controller.my && controller.room.terminal) {
        const amountTotalUsedInTerminal = controller.room.terminal.store.getUsedCapacity()
        const amountEnergyUsedInTerminal = controller.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY)
        const amountOtherUsedInTerminal = amountTotalUsedInTerminal - amountEnergyUsedInTerminal;
        
        status.push(`Terminal: ${amountTotalUsedInTerminal} (${amountOtherUsedInTerminal})`)
    }

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
        var alerts = '';
        
        if (room.energyCapacityAvailable > 0) {
            const creepCount = room.find(FIND_MY_CREEPS).length;
            const droppedResource = locator.getAmountDroppedResources(room.name);
            const roomCapacity = room.energyCapacityAvailable;
            const rcl = room.controller.level;
          status.push(`${room.name}: ${room.energyAvailable} / ${roomCapacity} | Creeps: ${creepCount}`);
          status.push(`Floor: ${droppedResource} | Bank ${brainData.getValueLast(Memory.colony.rooms[room.name], 'energyStored')}`)
          if (rcl < 8) status.push(`RCL: ${rcl} | Til next: ${room.controller.progressTotal - room.controller.progress}`);
          
          // ☢�💎⚡
          if (creepCount < 4) alerts += '💣';
          if (creepCount > 6) alerts += '⚠';
          if (droppedResource > 1500) alerts += '⚡';
          switch (rcl) {
            case 2:
                if (roomCapacity < (300 + 5 * 50)) alerts += '🔔';
                break;
            case 3:
                if (roomCapacity < (300 + 10 * 50)) alerts += '🔔';
                break;
            case 4:
                if (roomCapacity < (300 + 20 * 50)) alerts += '🔔';
                break;
            case 5:
                if (roomCapacity < (300 + 30 * 50)) alerts += '🔔';
                break;
            case 6:
                if (roomCapacity < (300 + 40 * 50)) alerts += '🔔';
                break;
            case 7:
                if (roomCapacity < (600 + 50 * 100)) alerts += '🔔';
                break;
            case 8:
                if (roomCapacity < (600 + 60 * 200)) alerts += '🔔';
                break;
            default:
          }
          if (alerts === '') alerts = '💎';
          
          status.push(alerts + this.loadCreepsInfo(room.name));
          status.push('')
        }
    });

  },
  // Return a string of the creeps in the room (likely to be pushed into status)
  loadCreepsInfo: function(nameRoom) {
    let infoAboutCreeps = ' | ';
    const creepsOfRoom = Game.rooms[nameRoom].find(FIND_MY_CREEPS);
    
    creepsOfRoom.forEach(creep => {
        infoAboutCreeps += `${this.getCreepAbbrev(creep)}${creep.body.length} | ` 
    });

    return infoAboutCreeps;
  },
  getCreepAbbrev: function(creep) {
    // TODO: get this from creep role info
    return creep.name.substring(0,1);
  }
}

module.exports = hud;