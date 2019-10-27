var brainFlags = {
  run: function() {
    for(var creepName in Game.creeps) {
      var creep = Game.creeps[creepName];
      var flag = Game.flags['go.'+creepName];
      var creep = Game.creeps[creepName];

      if (creep && flag) {
          creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffff00'}});
      }
    }
  }
}

module.exports = brainFlags;