var util = require('util');

var control = {
  assignRoleAllCreeps: function (role) {
    for (var nameCreep in Memory.creeps) {
      if (Game.creeps[nameCreep]) {
        var creep = Game.creeps[nameCreep];
        creep.memory.role = role;
      }
    }

    return true;
  },
  assignSource: function (nameCreep, sourceId) {
    var creep = Game.creeps[nameCreep];
    // var source = Game.getObjectById(sourceId);;
    creep.memory.sourceId = sourceId;

    return sourceId;
  },
  assignRole: function (nameCreep, roleNew) {
    var creep = Game.creeps[nameCreep];
    creep.memory.role = roleNew;

    return "Creep named " + nameCreep + " assigned role: " + roleNew;
  },
  assignRoleBuilder: function (nameCreep) {
    return this.assignRole(nameCreep, 'builder');
  },
  assignRoleUpgrader: function (nameCreep) {
    return this.assignRole(nameCreep, 'upgrader');
  },
  assignRoleHarvester: function (nameCreep) {
    return this.assignRole(nameCreep, 'harvester');
  },
  spawn: function (nameCreep, bodyParts, role) {
    // return÷ "Spawning " + nameCreep + " with [" + bodyParts + "] and role of " + role;
    var result =  Game.spawns['Spawn1'].spawnCreep(bodyParts, nameCreep, {
      memory: {
        role: role
      }
    });

    return util.errorCodeToDisplay(result);
  },
  spawnGatherer: function () {
    var role = 'gatherer';
    return this.spawn('Gatherer' + Game.time, [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY], {
      memory: {
        role: role
      }
    });
  },
  spawnHarvester: function () {
    var role = 'harvester';
    return this.spawn('Harvester' + Game.time, [MOVE, MOVE, MOVE, WORK, CARRY], {
      memory: {
        role: role
      }
    });
  },
  designRoad: function () {
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
  }
}

module.exports = control;