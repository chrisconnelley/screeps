const amountRepairMax = 0.9; // 90% of max
const amountWallHPDesired = 10000;

var towers = {
  run: function(nameSpawn) {
    // console.log("Tower Run (" + nameSpawn + ")");
    // Find all towers in spawn room and command them
    var roomSpawn = Game.spawns[nameSpawn].room;
    // console.log("roomSpawn: " + roomSpawn)
    var towers = roomSpawn.find(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER) && structure.energy > 0;
      }
    });

    towers.forEach((tower) => this.towerRepairRoads(tower));
    towers.forEach((tower) => this.towerRepairContainers(tower));
    towers.forEach((tower) => this.towerRepairWalls(tower));
    towers.forEach((tower) => this.towerRepairRamparts(tower));
    towers.forEach((tower) => this.towerHeal(tower));
    towers.forEach((tower) => this.towerAttack(tower));
  },
  towerHeal: function(tower) {
    // For this tower, find all the hostile creeps in the room and attack the first one

    var targetsHeal = tower.room.find(FIND_MY_CREEPS);

    if (targetsHeal.length > 0) {
      for (var i=0; i < targetsHeal.length; i++) {
        var targetHeal = targetsHeal[i];
        if (targetHeal.hits < targetHeal.hitsMax) {
          console.log("towerHeal (" + tower + ") healing creep: " + targetHeal);
          tower.heal(targetHeal);
          break;
        }
      }
    }
  },
  towerAttack: function(tower) {
    // For this tower, find all the hostile creeps in the room and attack the first one

    var targetsAttack = tower.room.find(FIND_HOSTILE_CREEPS);

    if (targetsAttack.length > 0) {
      console.log("towerAttack (" + tower + ") attacking hostile creep: " + targetsAttack[0]);
      var result = tower.attack(targetsAttack[0]);
      console.log("attack result: " + result);
        
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
      console.log("towerRepair (" + tower + ") repairing structure: " + repairTargets[0]);
      tower.repair(repairTargets[0]);
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
      console.log("towerRepair (" + tower + ") repairing road: " + repairTargets[0]);
      tower.repair(repairTargets[0]);
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
      console.log("towerRepair (" + tower + ") repairing wall: " + repairTargets[0]);
      tower.repair(repairTargets[0]);
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
      console.log("towerRepair (" + tower + ") repairing rampart: " + repairTargets[0]);
      tower.repair(repairTargets[0]);
    }
  }
}

module.exports = towers;