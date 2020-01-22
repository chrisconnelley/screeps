var util = require('util');
var control = require('control');
var tasks = require('brain.tasks');

var brainFlags = {
  run: function () {
    const u = console;
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
      if (nameFlag.startsWith('task')) {
        // create a task
        u.log(`Found task flag`);
        var nameFlagSplit = nameFlag.split('.');

        if (nameFlagSplit[1] === 'deliver') {
          u.log('Found deliver task');
          const flag = Game.flags[nameFlag];
          const typeResource = nameFlagSplit[2];
          const quantity = nameFlagSplit[3];

          u.log(`Flag position: ${JSON.stringify(flag.pos)}`)

          const look = flag.room.lookAt(flag.pos);
          look.forEach(function(lookObject) {
              // u.log(`lookObject: ${JSON.stringify(lookObject)}`);
              if (lookObject.type === LOOK_STRUCTURES && (
                lookObject.structure.structureType === STRUCTURE_TERMINAL ||
                lookObject.structure.structureType === STRUCTURE_STORAGE ||
                lookObject.structure.structureType === STRUCTURE_CONTAINER 
              )) {
                  u.log(`structure found: ${lookObject.structure}`);
                  
                  u.log(`creating task for deliver ${quantity} of resource ${typeResource} to structure: ${lookObject.structure}`);
                  const idTask = tasks.createTaskDeliver(lookObject.structure.id, typeResource, quantity);

                  if (idTask > 0) {
                    flag.remove();
                  }
              }
          });
        } else if (nameFlagSplit[1] === 'speak') {
          u.log(`Found speak task`);

          const flag = Game.flags[nameFlag];
          const message = nameFlagSplit[2];

          const idTask = tasks.createTaskSpeak(message, flag.pos);

          if (idTask > 0) {
            flag.remove();
          }
        }
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