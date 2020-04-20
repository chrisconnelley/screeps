var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');

var roleAttacker = {
  run: function (creep) {
    console.log(`creep: ${creep}`);
    shared.displayBadge(creep, 'A');
    if (shared.checkRenew(creep.name, 'attack')) return;
   
    // if (mc.getStage(creep.name) === 'attack') {
      this.attack(creep);
    // }
  },
  attack: function(creep) {
    var result = this.attackTarget(creep, FIND_HOSTILE_CREEPS);
    // if (result === ERR_NOT_FOUND) {
    //   result = this.attackTarget(creep, FIND_HOSTILE_STRUCTURES);
    // }

    return result;
  },
  attackTarget: function(creep, FIND_TYPE) {
    // find target
    var target ;
    // = creep.pos.findClosestByPath(FIND_TYPE, {
    //   ignoreDestructibleStructures: true, 
    //       maxRooms: 1, 
    //       ignoreRoads: true, 
    //   filter: (attackTarget) => {
    //     if (attackTarget.structureType) {
    //       if (attackTarget.structureType === 'tower') {
    //         return true;
    //       } else if (attackTarget.structureType === 'extension' ||attackTarget.structureType === 'storage' || attackTarget.structureType === 'controller') return false;
    //       // if (attackTarget.structureType === )
    //     }

    //     return true;
    //   }
    // });

    var targetsAttack = creep.room.find(FIND_HOSTILE_CREEPS);
    if (targetsAttack.length > 0) {
      target = targetsAttack[0];
    }

    console.log(`${creep} Attacking: ${targetsAttack.length}`);
    if (target) {
      if (!creep.pos.isNearTo(target)) {
        var result2 = creep.moveTo(target, {
          ignoreDestructibleStructures: true, 
          maxRooms: 1, 
          ignoreRoads: true, 
          visualizePathStyle: {
            stroke: '#ff0000',
            opacity: 0.6
          }
        });

        console.log(`${creep} ${result2}`);
      }
      result = creep.attack(target);
      if (creep.getActiveBodyparts(WORK) > 0 && 
        creep.memory._move && creep.memory._move.path) {
        var path = Room.deserializePath(creep.memory._move.path); 
        if (path.length && creep.pos.isNearTo(path[0].x, path[0].y)) {
          var structures = creep.room.lookForAt('structure', path[0].x, path[0].y); 
          if (structures.length > 0) { 
            console.log(`Testing`);
            creep.dismantle(structures[0]); 
          } 
        } 
      } 

      return result;
    }

    return ERR_NOT_FOUND;
  }
}

module.exports = roleAttacker;