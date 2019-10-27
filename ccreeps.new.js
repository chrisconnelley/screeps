const countDesiredHarvesters = 6;
const countDesiredUpgraders = 1;
const countDesiredBuilders = 4;

const quiet = false;
const shouldMakeCreeps = false;
const shouldMakeLargeCreeps = true;

const workerSchemas = {
  250: [MOVE, MOVE, CARRY, WORK],
  400: [MOVE, MOVE, MOVE, CARRY, WORK, WORK],
  550: [MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK],
  700: [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK],
  850: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK],
  1000: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK],
  1150: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
  1300: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]
};

var ccreepsNew = {
  run: function () {
    const nameSpawn = 'Spawn1';
    const spawnRoom = Game.spawns[nameSpawn];

    var energyAvailable = spawnRoom.room.energyAvailable;
    var energyMax = spawnRoom.room.energyCapacityAvailable;
    let schemaCostMax = energyMax >= 700 ? 700 : energyMax;

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    if (harvesters.length === 0) schemaCostMax = 250;

    if (shouldMakeCreeps) {
      if (harvesters.length < countDesiredHarvesters) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        spawnRoom.spawnCreep([WORK, CARRY, MOVE], newName, {
          memory: {
            role: 'harvester'
          }
        });
      }

      if (upgraders.length < countDesiredUpgraders) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        spawnRoom.spawnCreep([WORK, CARRY, MOVE], newName, {
          memory: {
            role: 'upgrader'
          }
        });
      }

      if (builders.length < countDesiredBuilders) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        spawnRoom.spawnCreep([WORK, CARRY, MOVE], newName, {
          memory: {
            role: 'builder'
          }
        });
      }
    }

    if (shouldMakeLargeCreeps) {
      var schemaCostMatch = 0;
      var schemaBodyParts = [];
      _.forIn(workerSchemas, (bodyParts, schemaCost) => {
        schemaCost = parseInt(schemaCost);
        schemaCostMatch = parseInt(schemaCostMatch);
        // console.log('schemacost:' + schemaCostMatch + " " + schemaCost)
        if (schemaCostMatch <= schemaCost && schemaCost <= schemaCostMax) {
          schemaCostMatch = schemaCost;
          schemaBodyParts = bodyParts;
        }
      });
      var sourceId = null; // directives.findNextSource();

      var newName = 'Worker_' + schemaCostMatch + "_" + Game.time;
      var role = '';

      if (energyAvailable >= schemaCostMatch) {
        if (upgraders.length < countDesiredUpgraders) {
          role = 'upgrader';
        }
        if (builders.length < countDesiredBuilders) {
          role = 'builder';
        }
        if (harvesters.length < countDesiredHarvesters) {
          role = 'harvester';
        }
        if (role !== '') {
          console.log('Spawning new worker: ' + newName + ' role: ' + role);
          spawnRoom.spawnCreep(schemaBodyParts, newName, {
            memory: {
              type: 'worker',
              role: role,
              sourceId: sourceId
            }
          });
        }
      } else if (harvesters.length === 0) {
        role = 'harvester';
        newName = 'Worker_' + energyAvailable + "_" + Game.time;
        console.log('NO HARVESTERS - Spawning new worker: ' + newName + ' role: ' + role);
        console.log(spawnRoom.spawnCreep(workerSchemas[energyAvailable], newName, {
          memory: {
            type: 'worker',
            role: role
          }
        }));
      }

    }



    /* Status Report */

    var displayNames = function (creepArray) {
      var names = '';

      creepArray.forEach((creep) => names += creep.name + ', ')

      return names;
    }

    var result = [];
    if (!quiet) {
      result.push('Game time: ' + Game.time);
      result.push('Energy: ' + energyAvailable + "/" + energyMax + " Production: " + (shouldMakeLargeCreeps ? 'ON' : 'OFF'));
      result.push('Harvesters: ' + harvesters.length + "/" + countDesiredHarvesters);
      console.log('Harvester: ' + displayNames(harvesters));
      result.push('Builders: ' + builders.length + "/" + countDesiredBuilders);
      console.log('Builders: ' + displayNames(builders));
      result.push('Upgraders: ' + upgraders.length + "/" + countDesiredUpgraders);
      console.log('Upgraders: ' + displayNames(upgraders));
      console.log();
      result.push('Schema Cost: ' + schemaCostMatch);

    }
    return result;
  }
}

module.exports = ccreepsNew;