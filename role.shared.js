var util = require('util')

var shared = {
  errorCodeToDisplay(errorCode) {
    console.log("DEPRECEATED");
    return 'USE UTIL';
  },
  remember_resourceWanted: function (creep, resource) {
    creep.memory['resourceWanted'] = resource.id;
  },
  forget_resourceWanted: function (creep) {
    creep.memory['resourceWanted'] = null;
  },
  remember_source: function (creep, sourceId) {
    creep.memory.sourceId = sourceId;

    return "remembered source (" + sourceId + ") for " + creep;
  },
  forget_source: function (creep) {
    creep.memory.sourceId = null;

    return "forgot source for " + creep
  },
  findAssignedSource: function (creep) {
    // If creep has been assigned a sourceId go there instead
    if (creep.memory.sourceId) {
      var sourceMemory = Game.getObjectById(creep.memory.sourceId);
      
      if (sourceMemory === null) {
        shared.forget_source(creep);
      } else {
        energyClosestFound = sourceMemory;
        return energyClosestFound; // If it was assigned, use this energy
      }
    }
  },
  findClosestEnergy: function (creep) {
    var energyClosestFound = null;
    
    energyClosestFound = shared.findAssignedSource(creep);
    if (energyClosestFound) 
    {
      // console.log("Using assigned source " + energyClosestFound);
      return energyClosestFound;
    }

    if (creep.memory.role !== 'harvester') {
      var containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return ((structure.structureType == STRUCTURE_STORAGE)&&
            structure.store.energy > 0)
        }
      });
      if (containers.length > 0) return containers[0];
    }

    var tombstones = creep.room.find(FIND_TOMBSTONES);
    if (tombstones.length > 0) {
      for (var i=0; i < tombstones.length; i++) {
        var tombstone = tombstones[i];
       if (tombstone.store['energy'] > 0) {
          return tombstone;
       }
      }
    }

    var ruins = creep.room.find(FIND_RUINS);
    if (ruins.length > 0) {
      for (var i=0; i < ruins.length; i++) {
        var ruin = ruins[i];
        // console.log("Ruin with energy: " + ruin.store['energy']);
        if (ruin.store['energy'] > 0) {
          return ruin;
        }
      }
    }

    var sources = creep.room.find(FIND_SOURCES);
    var sourceNum = parseInt(creep.name.substring(creep.name.length-1))%sources.length;
    var foundSource = sources[sourceNum];

    if (foundSource.energy === 0) {
      sources.forEach((source) => {
        if (source.energy > 0) {
          foundSource = source;
        }
      });
    }

    var resources = creep.room.find(FIND_DROPPED_RESOURCES);
    if (resources.length > 0) {
      for (var i=0; i < resources.length; i++) {
        var resource = resources[i];
        // console.log("Ruin with energy: " + ruin.store['energy']);
        if (resource.amount > 0) {
          return resource;
        }
      }
    }

    return foundSource;
  },
  gatherEnergy: function (creep, source) {
    var result;
    result = creep.harvest(source);
    
    if (result === ERR_INVALID_TARGET) {
      result = creep.pickup(source);
    }

    if (result === ERR_INVALID_TARGET) {
      result = creep.withdraw(source, RESOURCE_ENERGY);
    }

    if (result !== OK && result !== ERR_NOT_IN_RANGE) {
      console.log("Gather attempt by " + creep + " from " + source + " result: " + util.errorCodeToDisplay(result));
    }

    return result;
  },
}

module.exports = shared;