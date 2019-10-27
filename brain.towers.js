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
    console.log("towerAttack (" + tower + ")");
    // For this tower, find all the damaged structures in the room and repair the first one
    

    var attackTargets = tower.room.find(FIND_HOSTILE_CREEPS);

    tower.attack(attackTargets[0]);
  },
  towerRepair: function(tower) {
    console.log("towerRepair (" + tower + ")");
    // For this tower, find all the damaged structures in the room and repair the first one
    

    var repairTargets = tower.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_CONTAINER &&
          structure.hits < structure.hitsMax*amountRepairMax;
      }
    });

    tower.repair(repairTargets[0]);
  }
}

module.exports = towers;