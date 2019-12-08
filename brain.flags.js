var util = require('util');
var control = require('control');

var brainFlags = {
  run: function () {
    for (var creepName in Game.creeps) {
      var creep = Game.creeps[creepName];

      var result;

      result = this.go(creep);
      if (result < -20) {
        return result;
      }

      result = this.goX(creep);
    }

    Object.keys(Game.flags).forEach((nameFlag) => {
      if (nameFlag.startsWith('makeX')) {
        this.makeX(nameFlag);
      }
    })
  },
  go: function (creep) {
    var flag = Game.flags['go.' + creep.name];

    if (creep && flag) {
      return this.moveCreepToMe(flag, creep);
    } else {
      return -20
    }
  },
  goX: function (creep) {
    const u = util;
    var flag = Game.flags['goX.' + creep.name];

    if (!flag) return -20;
    if (flag.pos.isNearTo(creep)) {
      return flag.remove();
    }

    if (creep && flag) {
      return this.moveCreepToMe(flag, creep);
    } else {
      return -20
    }
  },
  makeX: function (nameFlag) {
    const u = util;
    const flag = Game.flags[nameFlag];

    u.log(`[brain.flags makeX] nameFlag: ${flag.name}`);

    var splitNameFlag = nameFlag.split('.');
    var role = splitNameFlag[1];

    u.log(`[brain.flags makeX] role: ${role}`);

    var nameFlagCreep = flag.memory.nameCreep;
    u.log(`[brain.flags makeX] flag.memory.creepName: ${nameFlagCreep}`)

    if (!nameFlagCreep) {
      switch (role) {
        case 'C':
          u.log(`[brain.flags makeX] Making claimer`);
          var result = control.sC('Spawn1', 5600);
          u.log(`[brain.flags makeX] result: ${JSON.stringify(result)}`);

          if (result.code === OK) {
            flag.memory.nameCreep = result.nameCreep;
          }

          
          break;
        case 'B':
          u.log(`B switch`);
          var pos = flag.pos;
          var nameRoom = flag.pos.roomName;
          u.log(`room: ${nameRoom}`);

          flag.memory.nameCreep = 'B' + Game.time;
          flag.room.createFlag(pos, 'makeX.D.' + Game.time);
          flag.remove();

          break;
        case 'D':
          u.log(`D switch`);
          var pos = flag.pos;
          var nameRoom = flag.pos.roomName;

          break;
        default:
          u.log(`switch default`);
      }
    } else {
      if (flag.pos.isNearTo(creep)) {
        return flag.remove();
      }

      this.moveCreepToMe(flag, creep);
    }
  },
  moveCreepToMe: function(flag, creep) {
    if (!flag || !creep) return ERR_INVALID_ARGS
    return creep.moveTo(flag, {
      visualizePathStyle: {
        stroke: '#ffff00'
      }
    });
  }
}

module.exports = brainFlags;