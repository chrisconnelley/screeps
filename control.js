var tests = require('tests');
var mc = require('util.memory.creep');
var map = require('map');
var locator = require('locator');
var brainSpawn = require('brain.spawn');
var brainTasks = require('brain.tasks');

var control = {
  runTests: function () {
    var haveAllTestsPassed = true;
    _.forIn(tests, (testFunction, testFunctionName) => {
      var resultTest = testFunction();

      haveAllTestsPassed = resultTest && haveAllTestsPassed;
    });

    return `Tests run. All tests passed = ${haveAllTestsPassed}`;
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
  clearTasks: function () {
    const tasks = brainTasks.getTasks();
    // console.log(`clearTasks tasks.length: ${Object.keys(tasks).length}`);
    Object.keys(tasks).forEach((taskId) => {
      brainTasks.deleteTask(taskId);
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
  // Spawn Claimer
  sC: function (nameSpawnOrRoom, energy) {
    const role = 'claimer';
    const prefixNameCreep = 'CC';
    const countPartsSectionTemplate = 3;
    const costBodySectionTemplate = 600 + 50 + 50;

    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    energy = this.determineMaxEnergy(spawn, energy);
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

    return {
      code: result,
      nameCreep: nameCreep,
    };
  },
  sA: function (nameSpawnOrRoom, energy) {
    const role = 'attacker';
    const prefixNameCreep = 'A';
    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 80 + 10 + 50 + 50;

    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    energy = this.determineMaxEnergy(spawn, energy);
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const parts = {
      tough: countParts,
      attack: countParts,
      move: countParts * 2,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

    return result;
  },
  sU: function (nameSpawnOrRoom, energy) {
    const role = 'upgrader';
    const prefixNameCreep = 'U';
    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 100 + 50 + 50 + 50;

    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    console.log(`Energy: ${energy}`)
    energy = this.determineMaxEnergy(spawn, energy);
    console.log(`Determined max energy: ${energy}`)
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const parts = {
      work: countParts,
      carry: countParts,
      move: countParts * 2,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

    return result;
  },
  sP: function (nameSpawnOrRoom, energy = 0) {
    const role = 'pitman';
    const prefixNameCreep = 'P';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 100 + 50;

    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    energy = this.determineMaxEnergy(spawn, energy);
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const parts = {
      work: countParts,
      move: countParts,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

    return result;
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
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const parts = {
      carry: countParts,
      move: countParts,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

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
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const parts = {
      carry: countParts,
      move: countParts,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

    if (result > 0) mc.setStage(result, 'clean');

    return result;
  },
  findSpawnEnergyTest: function (nameSpawn) {
    var extensions = brainSpawn.findSpawnEnergy(nameSpawn, 1000);
    console.log(extensions);
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
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const parts = {
      work: countParts,
      carry: countParts,
      move: countParts * 2,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

    return result;
  },
  sD: function (nameSpawnOrRoom, energy) {
    const role = 'decoy';
    const prefixNameCreep = 'Quack';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 10 + 50;

    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    energy = this.determineMaxEnergy(spawn, energy);
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const parts = {
      tough: countParts,
      move: countParts,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

    return result;
  },
  sHealer: function (nameSpawn, energy) {
    const role = 'healer';
    const prefixNameCreep = 'Heal';
    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 10 + 150 + 50 + 50;

    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    energy = this.determineMaxEnergy(spawn, energy);
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const parts = {
      tough: countParts,
      heal: countParts,
      move: countParts * 2,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

    return result;
  },
  sHealerMax: function (nameSpawn, energy) {
    const role = 'healer';
    const prefixNameCreep = 'HealMax';
    const countPartsSectionTemplate = 2;
    const costBodySectionTemplate = 150 + 50;

    // Shared Start
    let spawn = this.resolveSpawn(nameSpawnOrRoom);
    if (!spawn) {
      console.log(`Could not find spawn using ${nameSpawnOrRoom}. Aborting.`);
      return;
    }

    energy = this.determineMaxEnergy(spawn, energy);
    const countParts = this.calculatePartCount(energy, countPartsSectionTemplate, costBodySectionTemplate);
    const energyRequired = countParts * costBodySectionTemplate;
    // Shared End

    const parts = {
      heal: countParts,
      move: countParts,
    };

    const result = this.spawnShorter(spawn, prefixNameCreep, parts, role, energyRequired);

    return result;
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
  determineMaxEnergy: function (spawn, energy) {
    var energyUsed = energy;
    if (!energyUsed) {
      energyUsed = spawn.room.energyAvailable;
    }
    console.log(`Spawn ${spawn.name} using ${energyUsed}`);
    return energyUsed;
  },
  calculatePartCount: function (amountEnergy, countPartsSectionTemplate, costBodySectionTemplate) {
    var countParts = Math.floor(amountEnergy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }
    return countParts;
  },
  spawnShorter: function (spawn, prefixNameCreep, parts, role, energyRequired) {
    const nameCreep = prefixNameCreep + Game.time;
    var result = this.spawnShort(spawn.name, nameCreep, parts, role, energyRequired);

    return result !== OK || nameCreep;
  },
  spawnShort: function (nameSpawn, nameCreep, bodyParts, role, energyRequired) {
    console.log(`spawnShort(nameSpawn: ${nameSpawn}, nameCreep: ${nameCreep}, bodyParts: ${bodyParts}, role: ${role}, energyRequired: ${energyRequired})`);
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

    return brainSpawn.spawn(nameSpawn, nameCreep, bodyPartsSpawn, role, energyRequired);
  },
  help: function () {
    console.log('*** Control Help ***');
    console.log('Attacker  - sA(room or spawn name, (energy to used)');
    console.log('Builder   - sB(room or spawn name, (energy to used)');
    console.log('Claimer   - sC(room or spawn name, (energy to used)');
    console.log('Decoy     - sD(room or spawn name, (energy to used)');
    console.log('Healer    - sHealer(room or spawn name, (energy to used)');
    console.log('HealerMax - sHealerMax(room or spawn name, (energy to used)');
    console.log('Janitor   - sJ(room or spawn name, (energy to used)');
    console.log('Pitman    - sP(room or spawn name, (energy to used)');
    console.log('Refueler  - sR(room or spawn name, (energy to used)');
    console.log('Upgrader  - sU(room or spawn name, (energy to used)');
    console.log('           killAll(room name)');
    console.log('           assignRole(creepName, newRole)');
  },
};

module.exports = control;
