var utilMemory = require('util.memory');
var shared = require('role.shared');

/*

  Batteries are dumb. They carry a lot and try to stick to roads.  If they are near an energy source, they reload.
  They should be directed by flags named:
    go.[batteryName]

*/

var roleBattery = {
  role: 'battery',
  /* memory:
    consumers: array of ids of Spawn/extensions
    idSource: id of source Structure
    stage: loading or unloading
    isRecharging: true
  */
  costBodyPartsSection: 150,
  bodyPartsSection: [MOVE, CARRY,CARRY],
  echo: function(nameCreep, message) {
    var creep = Game.creeps[nameCreep];
    creep.say(message);
    return message;
  },
  controlCommand: function(nameCreep, command) {
    console.log("controlCommand" + command);
    eval(command); // uses nameCreep
  },
  displayBadge: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    creep.room.visual.text('🔋', creep.pos, {
      color: '#FF0000',
      font: '10px',
      stroke: '#FFFFFF'
    })
  },
  run: function (creep) {
    if (creep.spawning) return;
    this.runInternal(creep.name); 
  },
  runInternal: function(nameCreep) {
    this.displayBadge(nameCreep);

    this.perform(nameCreep);
  },
  findCreepWithEnergyNeeds: function(nameCreep) {
    var creep = Game.creeps[nameCreep];
    var creepsWithEnergyNeeds = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
      filter: (creep) => {
        return (
          creep.name !== nameCreep &&
          creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()
        );
      }
    });

    if (creepsWithEnergyNeeds.length > 0) {
      console.log(nameCreep + " found creep with energy needs");
      return creepsWithEnergyNeeds[0];
    } else {
      console.log(nameCreep + " found NO creeps with energy needs");
    }
  },
  perform: function(nameCreep) {
    // console.log(this.role + " performing");
    var creep = Game.creeps[nameCreep];
    var stage = this.stage(nameCreep);

    console.log(nameCreep + " in stage " + stage);

    if (stage === undefined) {
      stage = "not full";
    }

    console.log(nameCreep + " in stage " + stage);

    var creepWithEnergyNeeds = this.findCreepWithEnergyNeeds(nameCreep);
    console.log(this.role + " NEEDS ENERGY " + creepWithEnergyNeeds);
    if (creepWithEnergyNeeds) {
      creep.transfer(creepWithEnergyNeeds, RESOURCE_ENERGY);
    }

    if (stage === 'not full' || stage === 'empty') {
      var energyClosest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return ((
            structure.structureType == STRUCTURE_LINK ||
            structure.structureType == STRUCTURE_CONTAINER || 
            structure.structureType == STRUCTURE_STORAGE
            ) &&
            structure.store.energy > 0 &&
            creep.pos.inRangeTo(structure,10)
            );  
        }
      });
      // console.log(this.role + " closest energy: " + energyClosest);
      if (energyClosest === undefined || energyClosest === null) {
        // console.log(this.role + " no energy found");
        
        this.assign_stage(nameCreep, "full");
        return;
      }
      var resultGather = shared.gatherEnergy(creep, energyClosest);

      // console.log(this.role + " result gather: " + resultGather);
      if (resultGather == ERR_NOT_IN_RANGE) {
        creep.moveTo(energyClosest, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    }

    if (creep.store.getFreeCapacity() === 0) {
      // console.log(this.role + " has no free capacity");
      
      this.assign_stage(nameCreep, "full");      
    }

    console.log(nameCreep + " energy: " + creep.store[RESOURCE_ENERGY]);

    if (creep.store[RESOURCE_ENERGY] == 0) {
      console.log(nameCreep + " EMPTY!");
      this.assign_stage(nameCreep, "empty");
    }
  },
  assign_stage(nameCreep, stage) {
    var creep = Game.creeps[nameCreep];
    utilMemory.remember(creep, 'stage', stage);
  },
  stage: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    return utilMemory.getString(creep, 'stage');
  }
}

module.exports = roleBattery;