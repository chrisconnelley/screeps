const amountRepairMax = 0.9; // 90% of max

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

    // towers.forEach((tower) => this.towerRepair(tower))
    towers.forEach((tower) => this.towerAttack(tower));

  },
  towerAttack: function(tower) {
    // For this tower, find all the hostile creeps in the room and attack the first one

    var attackTargets = tower.room.find(FIND_HOSTILE_CREEPS);

    if (attackTargets.length > 0) {
      console.log("towerAttack (" + tower + ") attacking hostile creep: " + attackTargets[0]);
      tower.attack(attackTargets[0]);
    }
  },
  towerRepair: function(tower) {
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
  }
}

module.exports = towers;