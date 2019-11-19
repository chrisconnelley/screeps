var util = require('util');

var brainFlags = {
  run: function() {
    for(var creepName in Game.creeps) {
      var creep = Game.creeps[creepName];
      
      var result;

      result= this.go(creep);
      if (result < -20) { return result; }

      result = this.goX(creep);
    }
  },
  go: function(creep) {
    var flag = Game.flags['go.'+creep.name];
    
    if (creep && flag) {
      return creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffff00'}});
    } else {
      return -20
    }
  },
  goX: function(creep) {
    var u = console;
    var flag = Game.flags['goX.'+creep.name];
    
    if (!flag) return -20;
    if (flag.pos.isNearTo(creep)) {
      return flag.remove();
    }

    if (creep && flag) {
      return creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffff00'}});
    } else {
      return -20
    }
  },
}

module.exports = brainFlags;