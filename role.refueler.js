var utilMemory = require('util.memory');
var shared = require('role.shared');

var roleRefueler = {
  role: 'refueler',
  /* memory:
    consumers: array of ids of Spawn/extensions
    idSource: id of source Structure
    stage: loading or unloading
    isRecharging: true
  */
  costBodyPartsSection: 100,
  bodyPartsSection: [MOVE,CARRY],
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
    creep.room.visual.text('R', creep.pos, {
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
  perform: function(nameCreep) {
    // console.log(this.role + " performing");
    var creep = Game.creeps[nameCreep];
    var stage = this.stage(nameCreep);

    if (stage === undefined) {
      stage = "reloading";
    }

    // console.log(this.role + " in stage " + stage);
    if (stage === 'delivering') {
      // console.log(this.role + " delivering");
      var target = shared.findRefuelTarget(creep);

      if (!target) {
        // Reload!
        this.assign_stage(nameCreep, "reloading");
      }

      var result = shared.transferEnergyOrMoveTo(creep, target);



      if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
        this.assign_stage(nameCreep, "reloading");
      }

      // This should never happen. This is energy only
      // if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 &&
      //   creep.store.getUsedCapacity() > 0
      // ) {
      //   shared.depositResource(creep);   
      // }


      return;
    }

    if (stage === 'reloading') {
      var energyClosest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return ((structure.structureType == STRUCTURE_CONTAINER || 
            structure.structureType == STRUCTURE_STORAGE
            ) && structure.store.energy > 0);  
        }
      });
      // console.log(this.role + " closest energy: " + energyClosest);
      if (energyClosest === undefined || energyClosest === null) {
        // console.log(this.role + " no energy found");
        
        this.assign_stage(nameCreep, "delivering");
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
      
      this.assign_stage(nameCreep, "delivering");      
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
};

module.exports = roleRefueler;