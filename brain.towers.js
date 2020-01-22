const amountRepairMax = 0.9; // 90% of max
const amountWallHPDesired = 10000;

var towers = {
  run: function(nameSpawn) {
    // Find all towers in spawn room and command them
    var roomSpawn = Game.spawns[nameSpawn].room;
    var towers = roomSpawn.find(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER) && structure.energy > 0;
      }
    });

    towers.forEach((tower) => 
    {
      this.towerAttack(tower) == OK || 
        this.towerHeal(tower) == OK ||
        this.towerRepairRamparts(tower) ||
        this.towerRepairWalls(tower) == OK ||
        this.towerRepairContainers(tower) == OK
      });
  },
  towerHeal: function(tower) {
    // For this tower, find all the hostile creeps in the room and attack the first one

    var targetsHeal = tower.room.find(FIND_MY_CREEPS);

    if (targetsHeal.length > 0) {
      for (var i=0; i < targetsHeal.length; i++) {
        var targetHeal = targetsHeal[i];
        if (targetHeal.hits < targetHeal.hitsMax) {
         return tower.heal(targetHeal);
        }
      }
    }
  },
  towerAttack: function(tower) {
    // For this tower, find all the hostile creeps in the room and attack the first one

    var targetsAttack = tower.room.find(FIND_HOSTILE_CREEPS);

    //console.log(`[towerAttack] tower: ${tower} targetsAttack: ${targetsAttack}.`);

    if (targetsAttack.length > 0) {
      console.log(targetsAttack[0]);
      
      return tower.attack(targetsAttack[0]);        
    }
  },
  towerRepairContainers: function(tower) {
    // For this tower, find all the damaged structures in the room and repair the first one
   
    var repairTargets = tower.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_CONTAINER &&
        structure.hits < structure.hitsMax*amountRepairMax;
      }
    });
    
    if (repairTargets.length > 0) {
      return tower.repair(repairTargets[0]);
    }
  },
  towerRepairRoads: function(tower) {
    // For this tower, find all the damaged walls in the room and repair the first one
   
    var repairTargets = tower.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_ROAD &&
          structure.hits < structure.hitsMax*amountRepairMax
        );
      }
    });
    
    if (repairTargets.length > 0) {
      return tower.repair(repairTargets[0]);
    }
  },
  towerRepairWalls: function(tower) {
    // For this tower, find all the damaged walls in the room and repair the first one
   
    var repairTargets = tower.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_WALL &&
        structure.hits < amountWallHPDesired;
      }
    });
    
    if (repairTargets.length > 0) {
       return tower.repair(repairTargets[0]);
    }
  },
  towerRepairRamparts: function(tower) {
    // For this tower, find all the damaged walls in the room and repair the first one
   
    var repairTargets = tower.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_RAMPART &&
        structure.hits < amountWallHPDesired;
      }
    });
    
    if (repairTargets.length > 0) {
      return tower.repair(repairTargets[0]);
    }
  }
}

module.exports = towers;