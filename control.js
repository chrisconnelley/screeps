var util = require('util');
var tests = require('tests');

var control = {
  runTests: function () {
    var haveAllTestsPassed = true;
    _.forIn(tests, (testFunction, testFunctionName) => {
      var resultTest = testFunction();

      console.log(`${testFunctionName}: ${resultTest}`);

      haveAllTestsPassed = resultTest && haveAllTestsPassed;
    });

    return haveAllTestsPassed;
  },
  assignSource: function(nameCreep, idSource) {
    const u = util;
    u.log(`[control assignSource] nameCreep: ${nameCreep} idSource: ${idSource}`);
    
    var creep = Game.creeps[nameCreep];
    
    if (!creep) return;
    
    creep.memory.sourceId = idSource; 
  },
  clearMap: function () {
    delete Memory.colony;
  },
  setMemory: function (nameCreep, keyMemory, valueMemory) {

  },
  assignRole: function (nameCreep, roleNew) {
    var creep = Game.creeps[nameCreep];
    creep.memory.role = roleNew;

    return "Creep named " + nameCreep + " assigned role: " + roleNew;
  },
  spawn: function (nameSpawn, nameCreep, bodyParts, role) {
    util.log("Spawning " + nameCreep + " with [" + bodyParts + "] and role of " + role);

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
    const u = util;
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

    u.log(`[control sC] nameSpawn: ${nameSpawn} energy: ${energy}`);
    u.log(`[control sC] nameCreep: ${nameCreep} parts: ${JSON.stringify(parts)} role: ${role}`);

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return {
      code: result,
      nameCreep: nameCreep
    }
  },
  sA: function (nameSpawn, energy) {
    const countPartsSectionTemplate = 4;
    const costBodySectionTemplate = 80 + 10 + 50 + 50;
    var countParts = Math.floor(energy / costBodySectionTemplate);
    if (countParts * countPartsSectionTemplate > 50) {
      countParts = parseInt(50 / countPartsSectionTemplate);
    }

    return this.spawnShort(nameSpawn, 'A' + Game.time, {
      'tough': countParts,
      'attack': countParts,
      'move': countParts * 2
    }, 'attacker');
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
    const u = util;
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

    // u.log(`[control sC] nameSpawn: ${nameSpawn} energy: ${energy}`);
    // u.log(`[control sC] nameCreep: ${nameCreep} parts: ${JSON.stringify(parts)} role: ${role}`);

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return result !== OK || nameCreep;
  },
  sJ: function (nameSpawn, energy) {
    const u = util;
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

    // u.log(`[control sC] nameSpawn: ${nameSpawn} energy: ${energy}`);
    // u.log(`[control sC] nameCreep: ${nameCreep} parts: ${JSON.stringify(parts)} role: ${role}`);

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return result !== OK || nameCreep;
  },
  // Spawn Miner
  sM: function(nameSpawn, energy) {
    const u = util;
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

    u.log(`[control s${prefixNameCreep}] nameSpawn: ${nameSpawn} energy: ${energy}`);
    u.log(`[control s${prefixNameCreep}] nameCreep: ${nameCreep} parts: ${JSON.stringify(parts)} role: ${role}`);

    const result = this.spawnShort(nameSpawn, nameCreep, parts, role);

    return {
      code: result,
      nameCreep: nameCreep
    }
  },



  sB: function(nameSpawn, energy) {
    const u = util;
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

    u.log(`[control s${prefixNameCreep}] nameSpawn: ${nameSpawn} energy: ${energy}`);
    u.log(`[control s${prefixNameCreep}] nameCreep: ${nameCreep} parts: ${JSON.stringify(parts)} role: ${role}`);

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