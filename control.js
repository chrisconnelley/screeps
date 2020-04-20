var tests = require('tests');
var mc = require('util.memory.creep');

var control = {
  runTests: function () {
    var haveAllTestsPassed = true;
    _.forIn(tests, (testFunction, testFunctionName) => {
      var resultTest = testFunction();
      
      haveAllTestsPassed = resultTest && haveAllTestsPassed;
    });

    return haveAllTestsPassed;
  },
  killAll: function(nameRoom) {
    // TODO: if supplied, only kill all the creeps in the room with roomName
    Object.keys(Game.creeps).forEach(creepName => {
        Game.creeps[creepName].suicide()
    })
  },
  runTest: function(nameTest) {
    return tests[nameTest]();
  },
  assignSource: function(nameCreep, idSource) {
            
    var creep = Game.creeps[nameCreep];
    if (!creep) return;
    creep.memory.sourceId = idSource; 
  },
  clearMap: function () {
    delete Memory.colony;
  },
  assignRole: function (nameCreep, roleNew) {
    var creep = Game.creeps[nameCreep];
    creep.memory.role = roleNew;

    return "Creep named " + nameCreep + " assigned role: " + roleNew;
  },
  spawn: function (nameSpawn, nameCreep, bodyParts, role) {
    var result = Game.spawns[nameSpawn].spawnCreep(bodyParts, nameCreep, {
      memory: {
        role: role
      }
    });

    return result;
  },
  spawnShort: function (nameSpawn, nameCreep, bodyParts, role) {
    var bodyPartsSpawn = [];
    var nameParts = Object.keys(bodyParts);
    nameParts.forEach((namePart) => {
      for (var i = 0; i < bodyParts[namePart]; i++) {
        bodyPartsSpawn.push(namePart);
      }
    });

    return this.spawn(nameSpawn, nameCreep, bodyPartsSpawn, role);
  },
  // Spawn Claimer
  sC: function (nameSpawn, energy) {
        const role = 'claimer';
    const prefixNameCreep = 'CC';
    const countPartsSectionTemplate = 3;
    const costBodySectionTemplate = 600 + 50 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'claim': countParts,
      'move': countParts * 2
    };
    const nameCreep = prefixNameCreep + Game.time;

        
    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return {
      code: result,
      nameCreep: nameCreep
    }
  },
  sAttack: function (nameSpawn, energy) {
    if (energy === undefined) {
      var spawn = Game.spawns[nameSpawn];
      if (spawn) {
        energy = spawn.room.energyAvailable;
      }
    }

    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 80 + 10 + 50 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }

    const nameCreep = 'A' + Game.time;

    var result = this.spawnShort(nameSpawn, nameCreep, {
      'tough': countParts,
      'attack': countParts,
      'move': countParts * 2
    }, 'attacker');
      
    mc.setStage(nameCreep, 'attack');

    if (!Game.creeps[nameCreep]) {
      return 'ERROR';
    }

    return nameCreep;
  },
  sU: function (nameSpawn, energy, nameCreep) {
    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 100 + 50 + 50 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }

    if (!nameCreep) {
      nameCreep = 'U' + Game.time;
    }

    return this.spawnShort(nameSpawn, nameCreep, {
      'work': countParts,
      'carry': countParts,
      'move': countParts * 2
    }, 'upgrader');
  },
  sT: function (nameSpawn, energy) {
    var parts = Math.floor(energy / 250);
    if (parts * 2 > 50) {
      parts = parseInt(50 / 2);
    }

    return this.spawnShort(nameSpawn, 'T' + Game.time, {
      'carry': parts,
      'move': parts
    }, 'transport');
  },
  sR: function (nameSpawn, energy) {
        const role = 'refueler';
    const prefixNameCreep = 'R';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 50 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'carry': countParts,
      'move': countParts 
    };
    const nameCreep = prefixNameCreep + Game.time;
    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return result !== OK || nameCreep;
  },
  sJ: function (nameSpawn, energy) {
        const role = 'janitor';
    const prefixNameCreep = 'J';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 50 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'carry': countParts,
      'move': countParts 
    };
    const nameCreep = prefixNameCreep + Game.time;
   
    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    mc.setStage(nameCreep, 'clean');

    return result !== OK || nameCreep;
  },
  // Spawn Miner
  sM: function(nameSpawn, energy) {
        const role = 'miner';
    const prefixNameCreep = 'X';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 100 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'work': countParts,
      'move': countParts
    };
    const nameCreep = prefixNameCreep + Game.time;
  
    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return {
      code: result,
      nameCreep: nameCreep
    }
  },

  sB: function(nameSpawn, energy) {
    const role = 'builder';
    const prefixNameCreep = 'B';
    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 100 + 50 + 50 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'work': countParts,
      'carry': countParts,
      'move': countParts * 2
    };
    const nameCreep = prefixNameCreep + Game.time;
  
    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return {
      code: result,
      nameCreep: nameCreep
    }
  },
  sH: function (nameSpawn, energy) {
    var parts = Math.floor(energy / 250);
    return this.spawnShort(nameSpawn, 'W' + Game.time, {
      'carry': parts,
      'move': parts * 2,
      'work': parts
    }, 'harvester');
  },
  spawnUpgrader: function (nameSpawn, nameCreep, energy) {
    var parts = Math.floor(energy / 200);
    return this.spawnShort(nameSpawn, nameCreep, {
      'carry': parts,
      'work': parts,
      'move': parts
    }, 'upgrader');
  },
  sDecoy: function(nameSpawn, energy) {
    if (energy === undefined) {
      var spawn = Game.spawns[nameSpawn];
      if (spawn) {
        energy = spawn.room.energyAvailable;
      }
    }

    const role = 'decoy';
    const prefixNameCreep = 'Quack';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 10 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'tough': countParts,
      'move': countParts
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    if (!Game.creeps[nameCreep]) {
      return 'ERROR';
    }

    return nameCreep;
  },
  sHealer: function(nameSpawn, energy) {
    if (energy === undefined) {
      var spawn = Game.spawns[nameSpawn];
      if (spawn) {
        energy = spawn.room.energyAvailable;
      }
    }

    const role = 'healer';
    const prefixNameCreep = 'Heal';
    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 10 + 150 + 50 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'tough': countParts,
      'heal': countParts,
      'move': countParts * 2
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    if (!Game.creeps[nameCreep]) {
      return 'ERROR';
    }

    return nameCreep;
  },
  sHealerMax: function(nameSpawn, energy) {
    if (energy === undefined) {
      var spawn = Game.spawns[nameSpawn];
      if (spawn) {
        energy = spawn.room.energyAvailable;
      }
    }

    const role = 'healer';
    const prefixNameCreep = 'HealMax';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 150 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'heal': countParts,
      'move': countParts
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    if (!Game.creeps[nameCreep]) {
      return `ERROR: ${result} energy: ${energy} countParts: ${countParts} cost: ${costBodySectionTemplate}`;
    }

    return nameCreep;
  },
  sExcavator: function(nameSpawn, energy) {
    if (energy === undefined) {
      var spawn = Game.spawns[nameSpawn];
      if (spawn) {
        energy = spawn.room.energyAvailable;
      }
    }

    const role = 'excavator';
    const prefixNameCreep = 'Excavator';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 100 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'work': countParts,
      'move': countParts
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    if (!Game.creeps[nameCreep]) {
      return 'ERROR';
    }

    return nameCreep;
  },

  sDestroy: function(nameSpawn, energy) {
    if (energy === undefined) {
      var spawn = Game.spawns[nameSpawn];
      if (spawn) {
        energy = spawn.room.energyAvailable;
      }
    }

    const role = 'attacker';
    const prefixNameCreep = 'Destroyer';
    const countPartsSectionTemplate = 6;
    const costBodySectionTemplate = 10 + 80 + 100 + 50 + 50 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      'tough': countParts,
      'work': countParts,
      'attack': countParts,
      'move': countParts * 3
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    if (!Game.creeps[nameCreep]) {
      return 'ERROR';
    }

    return nameCreep;
  },

  sDef: function (nameSpawn, energy) {
    var parts = Math.floor(energy / 250);
    return this.spawnShort(nameSpawn, 'D' + Game.time, {
      'tough': parts * 2,
      'move': parts * 3,
      'attack': parts
    }, 'defender');
  },
  spawnGatherer: function (nameSpawn) {
    var role = 'gatherer';
    return this.spawn(nameSpawn, 'Gatherer' + Game.time, [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY], role);
  },
  spawnHarvester: function (nameSpawn) {
    var role = 'harvester';
    return this.spawn(nameSpawn, 'Harvester' + Game.time, [MOVE, MOVE, MOVE, WORK, CARRY], role);
  },
  designRoad: function (nameSpawn) {
    var room = Game.spawns[nameSpawn].room;

    var posStart = Game.flags['road_start'].pos;
    var posEnd = Game.flags['road_end'].pos;
    var path = posStart.findPathTo(posEnd);

    path.forEach((pathStep) => {
      room.createConstructionSite(pathStep.x, pathStep.y, STRUCTURE_ROAD);
    });

    return false;
  },
  removeAllConstructionSites: function (nameSpawn) {
    var room = Game.spawns[nameSpawn].room;
    var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);

    constructionSites.forEach((site) => site.remove());
  },
  claimController: function (nameCreep, idController) {
    var creep = Game.creeps[nameCreep];
    var controller = Game.getObjectById(idController);
    var resultClaim = creep.claimController(controller);

    if (resultClaim == ERR_GCL_NOT_ENOUGH) {
      return creep.reserveController(controller);
    }

    if (resultClaim == ERR_INVALID_TARGET) {
      return creep.attackController(controller);
    }

    return resultClaim;
  },
  signController: function (nameCreep, idController, message) {
    var creep = Game.creeps[nameCreep];
    var controller = Game.getObjectById(idController);
    return creep.signController(controller, message);
  }
}

module.exports = control;