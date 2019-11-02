var utilMemory = require('util.memory');
var shared = require('role.shared');

var roleTransport = {
  role: 'transport',
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
    creep.room.visual.text('T', creep.pos, {
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

    console.log(this.role + " in stage " + stage);
    if (stage === 'delivering') {
      // console.log(this.role + " delivering");
      var target = shared.findEnergyTarget(creep);
      var result = shared.transferEnergyOrMoveTo(creep, target);

      if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
        this.assign_stage(nameCreep, "reloading");
      }

      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 &&
        creep.store.getUsedCapacity() > 0
      ) {
        shared.depositResource(creep);   
      }

      return;
    }

    if (stage === 'reloading') {
      var resultReload;
      // Move non-energy resources to Storage
      var resourceType = null;
      var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            if (structure.structureType == STRUCTURE_CONTAINER) {
                // console.log(creep.name + " " + structure.store.getUsedCapacity() + " " + structure.store.energy );
            }
            
            return (structure.structureType == STRUCTURE_CONTAINER &&
            structure.store.getUsedCapacity() !== structure.store.energy);
        }
      });
      
      // console.log(creep.name + " " + container.store.getUsedCapacity() + " " + container.store.energy );
           
      
      if (container) {
        var resourceTypes = Object.keys(container.store);
        var resultReload = creep.withdraw(container, resourceTypes[0]);
      } else {
          container = shared.findResource(creep);
          // console.log(this.role + " closest energy: " + energyClosest);
          if (container === undefined || container === null) {
            // console.log(this.role + " no energy found");
            
            this.assign_stage(nameCreep, "delivering");
            return;
          }
        resultReload = shared.gatherEnergy(creep, container);
      };

      console.log(this.role + " result gather: " + resultReload);
      if (resultReload == ERR_NOT_IN_RANGE) {
          console.log(creep.name + " moving to " + container );
        creep.moveTo(container, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    }

    if (creep.store.getFreeCapacity() === 0 || container === null) {
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

module.exports = roleTransport;