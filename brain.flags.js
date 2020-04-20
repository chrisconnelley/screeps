var control = require('control');
var tasks = require('brain.tasks');
var mc = require('util.memory.creep');

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
      if (nameFlag.startsWith('task')) {
        // create a task
        var nameFlagSplit = nameFlag.split('.');

        if (nameFlagSplit[1] === 'deliver') {
          const flag = Game.flags[nameFlag];
          const typeResource = nameFlagSplit[2];
          const quantity = nameFlagSplit[3];
          
          const look = flag.room.lookAt(flag.pos);
          look.forEach(function(lookObject) {
              if (lookObject.type === LOOK_STRUCTURES && (
                lookObject.structure.structureType === STRUCTURE_TERMINAL ||
                lookObject.structure.structureType === STRUCTURE_STORAGE ||
                lookObject.structure.structureType === STRUCTURE_CONTAINER 
              )) {
                  const idTask = tasks.createTaskDeliver(lookObject.structure.id, typeResource, quantity);

                  if (idTask > 0) {
                    flag.remove();
                  }
              }
          });
        } else if (nameFlagSplit[1] === 'speak') {
          const flag = Game.flags[nameFlag];
          const message = nameFlagSplit[2];

          const idTask = tasks.createTaskSpeak(message, flag.pos);

          if (idTask > 0) {
            flag.remove();
          }
        }
      }
      if (nameFlag.startsWith('assignSource.')) {
        this.assignSource(nameFlag);
      }
      if (nameFlag.startsWith('assignSourceB.')) {
        this.assignSource(nameFlag, true);
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
    const flag = Game.flags[nameFlag];

    var splitNameFlag = nameFlag.split('.');
    var role = splitNameFlag[1];

    var nameFlagCreep = flag.memory.nameCreep;

    if (!nameFlagCreep) {
      switch (role) {
        case 'C':
          var result = control.sC('Spawn1', 5600);
          
          if (result.code === OK) {
            flag.memory.nameCreep = result.nameCreep;
          }
          
          break;
        case 'B':
          var pos = flag.pos;
          var nameRoom = flag.pos.roomName;

          flag.memory.nameCreep = 'B' + Game.time;
          flag.room.createFlag(pos, 'makeX.D.' + Game.time);
          flag.remove();

          break;
        case 'D':
          var pos = flag.pos;
          var nameRoom = flag.pos.roomName;

          break;
        default:
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
  },
  assignSource: function(nameFlag, isSecondary) {
    var flag = Game.flags[nameFlag];

    if (!flag) return ERR_NOT_FOUND;

    const structures = flag.pos.lookFor(LOOK_SOURCES);
    if (structures.length > 0) {
      var source = structures[0];
    }

    var nameCreep = nameFlag.split('.')[1];
    var creep = Game.creeps[nameCreep];

    if (!creep) return ERR_NOT_FOUND;

    this.assignExcavatorToSource(flag.pos.roomName, source.id, nameCreep, isSecondary);

    flag.remove();
  },
  getSourceExcavatorName: function(nameRoom) {
    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memorySources = memoryRoom.sources;

    if (!memorySources) return;

    var memorySource = memorySources[idSource];

    return memorySource.nameExcavator;
  },
  assignExcavatorToSource: function(nameRoom, idSource, nameCreep, isSecondary) {
    var memoryRoom = Memory.colony.rooms[nameRoom];
    var memorySources = memoryRoom.sources;

    if (!memorySources) return;

    var memorySource = memorySources[idSource];
    
    mc.setSource(nameCreep, idSource, isSecondary);
    memorySource.nameExcavator = nameCreep;
  }
}

module.exports = brainFlags;