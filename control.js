var util = require('util');
var tests = require('tests');

var control = {
  runTests: function() {
    var haveAllTestsPassed = true;
    _.forIn(tests, (testFunction, testFunctionName) => {
      var resultTest = testFunction();
      
      console.log(`${testFunctionName}: ${resultTest}`);
    
      haveAllTestsPassed = resultTest && haveAllTestsPassed;
    });

    return haveAllTestsPassed;
  },
  clearMap: function() {
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
    
    var result =  Game.spawns[nameSpawn].spawnCreep(bodyParts, nameCreep, {
      memory: {
        role: role
      }
    });

    return result;
  },
  spawnShort: function(nameSpawn, nameCreep, bodyParts, role) {
      var bodyPartsSpawn = [];
      var nameParts = Object.keys(bodyParts);
      nameParts.forEach((namePart) => {
         for (var i=0; i < bodyParts[namePart]; i++) {
             bodyPartsSpawn.push(namePart);
         }
      });
      
      return this.spawn(nameSpawn, nameCreep, bodyPartsSpawn, role);
  },
  sT: function(nameSpawn, energy) {
    var parts = Math.floor(energy/100);
    return this.spawnShort(nameSpawn, 'W'+Game.time, {'carry':parts,'move':parts},'transport');
  },
  sR: function(nameSpawn, energy) {
    var parts = Math.floor(energy/100);
    return this.spawnShort(nameSpawn, 'W'+Game.time, {'carry':parts,'move':parts},'refueler');
  },
  sB: function(nameSpawn, energy) {
    var parts = Math.floor(energy/200);
    return this.spawnShort(nameSpawn, 'W'+Game.time, {'carry':parts,'move':parts, 'work':parts},'builder');
  },
  sH: function(nameSpawn, energy) {
    var parts = Math.floor(energy/250);
    return this.spawnShort(nameSpawn, 'W'+Game.time, {'carry':parts,'move':parts*2, 'work':parts},'harvester');
  },
  spawnUpgrader: function(nameSpawn, nameCreep, energy) {
    var parts = Math.floor(energy/200);
    return this.spawnShort(nameSpawn, nameCreep, {'carry':parts,'work':parts, 'move':parts},'upgrader');
  },
  sU: function(nameSpawn, energy) {
    var parts = Math.floor(energy/200);
    return this.spawnShort(nameSpawn, 'W'+Game.time, {'carry':parts,'work':parts, 'move':parts},'upgrader');
  },
  sDef: function(nameSpawn, energy) {
    var parts = Math.floor(energy/250);
    return this.spawnShort(nameSpawn, 'D'+Game.time, {'tough':parts*2,'move':parts*3,'attack':parts},'defender');
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
  claimController: function(nameCreep,idController) {
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
  signController: function(nameCreep, idController, message) {
    var creep = Game.creeps[nameCreep];
    var controller = Game.getObjectById(idController);
    return creep.signController(controller, message);
  }
}

module.exports = control;