var tests = require('tests');
var mc = require('util.memory.creep');
var map = require('map');
var locator = require('locator');

var control = {
  runTests: function () {
    var haveAllTestsPassed = true;
    _.forIn(tests, (testFunction, testFunctionName) => {
      var resultTest = testFunction();

      haveAllTestsPassed = resultTest && haveAllTestsPassed;
    });

    return haveAllTestsPassed;
  },
  killAll: function (nameRoom) {
    Object.keys(Game.creeps).forEach((creepName) => {
      if (!nameRoom) {
        Game.creeps[creepName].suicide();
      } else {
        if (Game.creeps[creepName].room.name === nameRoom) Game.creeps[creepName].suicide();
      }
    });
  },
  runTest: function (nameTest) {
    return tests[nameTest]();
  },
  assignSource: function (nameCreep, idSource) {
    var creep = Game.creeps[nameCreep];
    if (!creep) return;
    creep.memory.sourceId = idSource;
  },
  clearMap: function () {
    console.log('clearMap');
    delete Memory.colony;

    map.createInitialColonyMap();

    return OK;
  },
  assignRole: function (nameCreep, roleNew) {
    var creep = Game.creeps[nameCreep];
    creep.memory.role = roleNew;

    return 'Creep named ' + nameCreep + ' assigned role: ' + roleNew;
  },
  spawn: function (nameSpawn, nameCreep, bodyParts, role) {
    var result = Game.spawns[nameSpawn].spawnCreep(bodyParts, nameCreep, {
      memory: {
        role: role,
      },
    });

    return result;
  },
  spawnShort: function (nameSpawn, nameCreep, bodyParts, role) {
    if (!nameSpawn || !nameCreep || !bodyParts || !role) {
      console.log(`spawnShort(nameSpawn: ${nameSpawn}, nameCreep: ${nameCreep}, bodyParts: ${bodyParts}, role: ${role}) called with missing parameters`);

      return ERR_INVALID_ARGS;
    }

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
      claim: countParts,
      move: countParts * 2,
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return {
      code: result,
      nameCreep: nameCreep,
    };
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

    var result = this.spawnShort(
      nameSpawn,
      nameCreep,
      {
        tough: countParts,
        attack: countParts,
        move: countParts * 2,
      },
      'attacker'
    );

    mc.setStage(nameCreep, 'attack');

    if (!Game.creeps[nameCreep]) {
      return 'ERROR';
    }

    return nameCreep;
  },
   sU: function (nameSpawnorRoom, energy = 0) {
    let spawn = this.resolveSpawn(nameSpawnorRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnorRoom}. Aborting.`);
      return;
    }

    const role = 'upgrader';
    const prefixNameCreep = 'U';
    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 100 + 50 + 50 +50;

    if (!energy) {
      energy = spawn.room.energyAvailable;
      console.log(`Spawn ${spawn.name} using ${energy} to create ${role}`);
    }

    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
        work: countParts,
        carry: countParts,
        move: countParts * 2,
      };
    const nameCreep = prefixNameCreep + Game.time;
    const result = this.spawnShort(spawn.name, nameCreep, parts, role);

    return result !== OK || nameCreep;
  },
  sT: function (nameSpawn, energy) {
    var parts = Math.floor(energy / 250);
    if (parts * 2 > 50) {
      parts = parseInt(50 / 2);
    }

    return this.spawnShort(
      nameSpawn,
      'T' + Game.time,
      {
        carry: parts,
        move: parts,
      },
      'transport'
    );
  },
  sP: function (nameSpawnorRoom, energy = 0) {
    let spawn = this.resolveSpawn(nameSpawnorRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnorRoom}. Aborting.`);
      return;
    }

    const role = 'pitman';
    const prefixNameCreep = 'P';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 100 + 50;

    if (!energy) {
      energy = spawn.room.energyAvailable;
      console.log(`Spawn ${spawn.name} using ${energy} to create ${role}`);
    }

    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      work: countParts,
      move: countParts,
    };
    const nameCreep = prefixNameCreep + Game.time;
    const result = this.spawnShort(spawn.name, nameCreep, parts, role);

    return result !== OK || nameCreep;
  },
  sR: function (nameSpawnOrRoom, energy) {
    const role = 'refueler';
    const prefixNameCreep = 'R';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 50 + 50;
    
    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    energy = this.determineMaxEnergy(spawn, energy);
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    // Shared End

    const parts = {
      carry: countParts,
      move: countParts,
    };
    
    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role);

    return result;
  },
  sJ: function (nameSpawnOrRoom, energy) {
    // Setup
    const role = 'janitor';
    const prefixNameCreep = 'J';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 50 + 50;

    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    energy = this.determineMaxEnergy(spawn, energy);
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    // Shared End

    const parts = {
      carry: countParts,
      move: countParts,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role);

    if (result > 0) mc.setStage(result, 'clean');

    return result;
  },
  // Spawn Miner
  sM: function (nameSpawn, energy) {
    const role = 'miner';
    const prefixNameCreep = 'X';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 100 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    const parts = {
      work: countParts,
      move: countParts,
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return {
      code: result,
      nameCreep: nameCreep,
    };
  },
    sB: function (nameSpawnOrRoom, energy) {
    // Setup
    const role = 'builder';
    const prefixNameCreep = 'B';
    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 100 + 50 + 50 + 50;

    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    energy = this.determineMaxEnergy(spawn, energy);
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    // Shared End

    const parts = {
      work: countParts,
      carry: countParts,
      move: countParts * 2,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role);

    return result;
  },
  sH: function (nameSpawn, energy) {
    var parts = Math.floor(energy / 250);
    return this.spawnShort(
      nameSpawn,
      'W' + Game.time,
      {
        carry: parts,
        move: parts * 2,
        work: parts,
      },
      'harvester'
    );
  },
  spawnUpgrader: function (nameSpawn, nameCreep, energy) {
    var parts = Math.floor(energy / 200);
    return this.spawnShort(
      nameSpawn,
      nameCreep,
      {
        carry: parts,
        work: parts,
        move: parts,
      },
      'upgrader'
    );
  },
  sDecoy: function (nameSpawn, energy) {
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
      tough: countParts,
      move: countParts,
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    if (!Game.creeps[nameCreep]) {
      return 'ERROR';
    }

    return nameCreep;
  },
  sHealer: function (nameSpawn, energy) {
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
      tough: countParts,
      heal: countParts,
      move: countParts * 2,
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    if (!Game.creeps[nameCreep]) {
      return 'ERROR';
    }

    return nameCreep;
  },
  sHealerMax: function (nameSpawn, energy) {
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
      heal: countParts,
      move: countParts,
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    if (!Game.creeps[nameCreep]) {
      return `ERROR: ${result} energy: ${energy} countParts: ${countParts} cost: ${costBodySectionTemplate}`;
    }

    return nameCreep;
  },
  sExcavator: function (nameSpawn, energy) {
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
      work: countParts,
      move: countParts,
    };
    const nameCreep = prefixNameCreep + Game.time;

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    if (!Game.creeps[nameCreep]) {
      return 'ERROR';
    }

    return nameCreep;
  },

  sDestroy: function (nameSpawn, energy) {
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
      tough: countParts,
      work: countParts,
      attack: countParts,
      move: countParts * 3,
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
    return this.spawnShort(
      nameSpawn,
      'D' + Game.time,
      {
        tough: parts * 2,
        move: parts * 3,
        attack: parts,
      },
      'defender'
    );
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
  },
  resolveSpawn: function (nameSpawnOrRoom) {
    let spawn = Game.spawns[nameSpawnOrRoom];
    if (!spawn) {
      let room = Game.rooms[nameSpawnOrRoom];
      if (!room) {
        return;
      }
      spawn = locator.findSpawnThatIsAvailableForSpawning(room.name);
    }
    return spawn;
  },
  determineMaxEnergy: function(spawn, energy) {
    if (!energy) {
      console.log(`Spawn ${spawn.name} using ${energy}`);
      return spawn.room.energyAvailable;
    }
    return energy;
  },
  calculatePartCount: function(amountEnergy, countPartsSectionTemplate, costBodySectionTemplate) {
    var countParts = Math.floor(amountEnergy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    return countParts;
  },
  spawnShorter: function (spawn, prefixNameCreep, parts, role) {
    const nameCreep = prefixNameCreep + Game.time;
    var result = this.spawnShort(spawn.name, nameCreep, parts, role)
  
    return result !== OK || nameCreep;
  }
};

module.exports = control;
