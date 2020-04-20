var locator = require('locator');

var brainData = {
  lengthTickLengthAverageOver: 99,
  recordData: function(parentMemory, nameMetric, valueMetric, lengthAverage = this.lengthTickLengthAverageOver) {
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
  
      return OK;
  },
  getValueLast: function(parentMemory, nameMetric) {
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

    amountTotal = arrayData.reduce((totalRunning, valueCurrent) => totalRunning + valueCurrent);
    return amountTotal/arrayData.length;
  },
  getAverageDiff: function(parentMemory, nameMetric) {
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

    var valueBase = arrayData[0];
    amountTotal = arrayData.slice(1).map((el,i) => el-arrayData[i]).reduce(
        (totalRunning, valueCurrent) =>  totalRunning + valueCurrent);
    return amountTotal/(arrayData.length-1);
  },
  recordRoom: function(nameRoom) {
    var room = Game.rooms[nameRoom];

    if (!room) return;
    brainData.recordData(Memory.colony.rooms[nameRoom], 'energyStored', locator.getAmountStoredEnergyInRoom(nameRoom), 1500);

    if (room.controller && room.controller.my) {
      const rclProgress = room.controller.progressTotal - room.controller.progress;
      brainData.recordData(Memory.colony.rooms[nameRoom].controller, 'Progress', rclProgress);
    }
  }, 
  setRoomControllerProgress: function(nameRoom) {
    var memoryController = _.get(Memory, `colony.rooms.${nameRoom}.controller`);
    memoryController.arrayProgress = arrayProgress;
  },
  getRoomControllerProgress: function(nameRoom) {
    var memoryArrayProgress = _.get(Memory, `colony.rooms.${nameRoom}.controller.arrayProgress`);
  
    return memoryArrayProgress;
  },
};

module.exports = brainData;