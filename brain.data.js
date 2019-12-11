var util = require('util');
var map = require('map');
var locator = require('locator');

var brainData = {
  lengthTickLengthAverageOver: 99,
  recordData: function(parentMemory, nameMetric, valueMetric, lengthAverage = this.lengthTickLengthAverageOver) {
      const u = util;
      u.log(`[brainData recordData] parentMemory: ${parentMemory} nameMetric: ${nameMetric} valueMetric: ${valueMetric} lengthAverage: ${lengthAverage}`);
      
      var nameArray = `array${nameMetric}`;
      
      if (!parentMemory) {
        return ERR_INVALID_ARGS;   
      }
      
      if (!parentMemory[nameArray]) {
          parentMemory[nameArray] = [];
      }
      
      var arrayData = parentMemory[nameArray];
      
      if (arrayData.length > lengthAverage) {
          arrayData = arrayData.slice(arrayData.length - lengthAverage);
      }
      
      arrayData.push(valueMetric);
      parentMemory[nameArray] = arrayData;
  
      u.log(`[brainData recordData] arrayData: ${arrayData} parentMemory[nameArray]: ${parentMemory[nameArray]}`);
      
      return OK;
  },
  getValueLast: function(parentMemory, nameMetric) {
       const u = util;
      u.log(`[brainData recordData] getValueLast: ${parentMemory} nameMetric: ${nameMetric}`);
      
      var nameArray = `array${nameMetric}`;
      
      if (!parentMemory) {
        return ERR_INVALID_ARGS;   
      }
      
      if (!parentMemory[nameArray]) {
          parentMemory[nameArray] = [];
      }
      
      var arrayData = parentMemory[nameArray];
      
      return arrayData[arrayData.length-1];
  },
  getAverage: function(parentMemory, nameMetric) {
     const u = util;
      u.log(`[brainData recordData] getValueAverage: ${parentMemory} nameMetric: ${nameMetric}`);
      
      var nameArray = `array${nameMetric}`;
      var lengthArray = 0;
      var amountTotal = 0;
      
      if (!parentMemory) {
        return ERR_INVALID_ARGS;   
      }
      
      if (!parentMemory[nameArray]) {
          parentMemory[nameArray] = [];
      }

    var arrayData = parentMemory[nameArray];

    u.log(`arrayData: ${arrayData}`);

    amountTotal = arrayData.reduce((totalRunning, valueCurrent) => totalRunning + valueCurrent);
    
    u.log(`amountTotal: ${amountTotal}`);
  
    return amountTotal/arrayData.length;
  },
  getAverageDiff: function(parentMemory, nameMetric) {
      const u = util;
      u.log(`[brainData recordData] getValueAverage: ${parentMemory} nameMetric: ${nameMetric}`);
      
      var nameArray = `array${nameMetric}`;
      var lengthArray = 0;
      var amountTotal = 0;
      
      if (!parentMemory) {
        return ERR_INVALID_ARGS;   
      }
      
      if (!parentMemory[nameArray]) {
          parentMemory[nameArray] = [];
      }

    var arrayData = parentMemory[nameArray];

    u.log(`arrayData: ${arrayData}`);
    var valueBase = arrayData[0];
    u.log(`valueBase: ${valueBase}`);

    amountTotal = arrayData.slice(1).map((el,i) => el-arrayData[i]).reduce(
        (totalRunning, valueCurrent) =>  totalRunning + valueCurrent);

    u.log(`amountTotal: ${amountTotal}`);
  
    return amountTotal/(arrayData.length-1);
  },
  recordRoom: function(nameRoom) {
    const u = console;
    u.log(`[brain.data recordRoom] nameRoom: ${nameRoom}`);
    
    
    var room = Game.rooms[nameRoom];

    if (!room) return;
    
    brainData.recordData(Memory.colony.rooms[nameRoom], 'energyStored', locator.getAmountStoredEnergyInRoom(nameRoom), 1500);

    if (room.controller && room.controller.my) {
      const rclProgress = room.controller.progressTotal - room.controller.progress;
      u.log(`rclProgress: ${rclProgress}`);
      brainData.recordData(Memory.colony.rooms[nameRoom].controller, 'Progress', rclProgress);
    }

    // if (room.controller && room.controller.my) {
    //   // load progress for the last ten turns
    //   var arrayProgress = map.getRoomControllerProgress(nameRoom);

    //   if (arrayProgress.length > this.lengthTickLengthAverageOver) {        
    //     arrayProgress.shift();
    //   }

    //   arrayProgress.push(room.controller.progressTotal - room.controller.progress);

    //   map.setRoomControllerProgress(nameRoom, arrayProgress);
    // }
  },
  getRoomControllerEnergyPerTick: function(nameRoom) {
    // const u = util;
    // var room = Game.rooms[nameRoom];

    // if (room.controller && room.controller.my) {
    //   // load progress for the last ten turns
    //   var arrayProgress = map.getRoomControllerProgress(nameRoom);
      
    //   if (arrayProgress.length > 1) {
    //     var length = arrayProgress.length - 1;
    //     var end = arrayProgress[length];
    //     var start = arrayProgress[0];
    //     var average = (start - end)/length;
    //     return average;
    //   }
    // }

    return null;
  },
  
  setRoomControllerProgress: function(nameRoom) {
    const u = util;
   
    var memoryController = _.get(Memory, `colony.rooms.${nameRoom}.controller`);
    memoryController.arrayProgress = arrayProgress;

    u.log(`memoryController: ${JSON.stringify(memoryController)}`);
    
    
    
    
  },
  getRoomControllerProgress: function(nameRoom) {
    const u = util;
    
    var memoryArrayProgress = _.get(Memory, `colony.rooms.${nameRoom}.controller.arrayProgress`);

    u.log(`${nameRoom} memoryArrayProgress: ${JSON.stringify(memoryArrayProgress)}`);
  
    return memoryArrayProgress;
  },
};

module.exports = brainData;