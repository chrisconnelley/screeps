var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');
var locator = require('locator');

const STAGE_DELIVERING = 'delivering';
const STAGE_RELOADING = 'reloading';

var roleRefueler = {
  role: 'refueler',
  badge: 'R',
  run: function (creep) {
    shared.displayBadge(creep, this.badge);
    if (shared.checkRenew(creep.name, 'reloading', mc.setStage, mc.getStage)) return;
    if (shared.checkShouldDeposit(creep)) return;
    //this.perform(creep.name);
    this.selectStage(creep);
      
  },
  // Perform is deprecated
  perform: function (nameCreep) {
    console.log('DEPRECATED - role.refueler.perform!!! Use role.refuler.selectStage');
      
    var creep = Game.creeps[nameCreep];
    if (nameCreep === 'R18847759') {
        this.selectStage(creep);
        return;
    }
    
    if (mc.getStage(nameCreep) === undefined || creep.store[RESOURCE_ENERGY] === 0) {
      mc.setStage(nameCreep, "reloading");
    }
    if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()) {
      mc.setStage(nameCreep, 'delivering');
    }
    if (mc.getStage(nameCreep) === 'delivering') {
      var target = locator.findRefuelTarget(creep);
      if (!target) {
        mc.setStage(nameCreep, 'reloading');
      }
      var result = shared.transferEnergyOrMoveTo(creep, target);
    } else {
      var resultRetrieveEnergy;
      resultRetrieveEnergy = shared.retrieveEnergy(creep);
    }
    
    // this.performStage(creep);
    
  },
  selectStage: function(creep, hasWork = false) {
    const currentStage = mc.getStage(creep.name);
    
    if (!currentStage || creep.store[RESOURCE_ENERGY] === 0) {
      mc.setStage(creep.name, STAGE_RELOADING);
    }
    
    if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()) {
      mc.setStage(creep.name, STAGE_DELIVERING);
    }
      
    this.performStage(creep);
  },
  performStage: function(creep) {
    const currentStage = mc.getStage(creep.name);
    
    if (currentStage === STAGE_DELIVERING) {
        this.stageDeliver(creep);
    }
    
    if (currentStage === STAGE_RELOADING) {
        this.stageReload(creep);
    }
  },
  stageDeliver: function(creep) {
    const currentTargetId = mc.getTargetId(creep.name);

    if (currentTargetId === '') {
        const target = locator.findRefuelTarget(creep);
        
        console.log(`New target found: ${target}`);
        
        if (target === null) {
             // No refuel targets, reload to full
            if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
                mc.setStage(creep.name, STAGE_RELOADING);
                this.selectStage(creep);
            }
            creep.say('IDLE');
        } else {
            this.setTargetId(creep, target.id);
        }
    } else {
        const target = Game.getObjectById(currentTargetId);
        
        if (target === null) {
            // target doesn't exist anymore
            this.clearTargetId(creep);
            this.selectStage(creep);
        }
        
        // target is valid, attempt delivering
        var result = shared.transferEnergyOrMoveTo(creep, target);
        console.log(`Creep[${creep.name}] refuel ${target}: ${result}`)
        
        if (result === ERR_FULL) {
            this.clearTargetId(creep);
        }
    }
  },
  stageReload: function(creep) {
      var resultRetrieveEnergy;
      resultRetrieveEnergy = shared.retrieveEnergy(creep);
      
      console.log(`Creep[${creep.name}] (${creep.store[RESOURCE_ENERGY]}/${creep.store.getCapacity()})  loading: ${resultRetrieveEnergy} `);
      
      if (resultRetrieveEnergy === OK && creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()) this.selectStage(creep);
  },
  clearTargetId: function(creep) {
      mc.setTargetId(creep.name, '');
  },
  setTargetId: function(creep, targetId) {
       mc.setTargetId(creep.name, targetId);
  }
};
module.exports = roleRefueler;