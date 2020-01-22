var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var roleAttacker = require('role.attacker');
var roleDefender = require('role.defender');
var roleExcavator = require('role.excavator');
var roleHarvester = require('role.harvester');
var roleJanitor = require('role.janitor');
var roleMiner = require('role.miner');
var roleRefueler = require('role.refueler');
var roleTransport = require('role.transport');
var roleUpgrader = require('role.upgrader');
var roleWrecker = require('role.wrecker');
var shared = require('role.shared');
var tasks = require('brain.tasks');
var roleHealer = require('role.healer');

var brainCreeps = {
  run: function() {
    

    for(var name in Game.creeps) {
      var creep = Game.creeps[name];

    //  if (creep.room.name === 'E6N41' ) {
    //     //  if (Game.time % 10 != 0) {
    //           continue;
    //     //   }
    //   }

      if (creep.memory.idTask) 
      {
        // console.log(`Creep ${creep} is performing task: ${creep.memory.idTask}`);
        if (!Memory.tasks || !Memory.tasks[creep.memory.idTask]) delete creep.memory.idTask;
        // continue; // brain.tasks has them perform the task
      }

      shared.pave(creep);
      if(creep.memory.role == 'harvester') {
          roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
          roleUpgrader.run(creep);
      }
      if(creep.memory.role == 'builder') {
          roleBuilder.run(creep);
      }
      if(creep.memory.role == 'gatherer') {
        roleHarvester.run(creep);
      }
      if(creep.memory.role == 'excavator') {
        roleExcavator.run(creep);
      }
      if(creep.memory.role == 'transport') {
        roleTransport.run(creep);
      }      
      if(creep.memory.role == 'refueler') {
        roleRefueler.run(creep);
      }
      if (creep.memory.role == 'defender') {
        roleDefender.run(creep);
      }      
      if (creep.memory.role == 'scout') {
        roleScout.run(creep);
      }
      if (creep.memory.role === 'claimer') {
        roleClaimer.run(creep);
      }
      if (creep.memory.role === 'miner') {
        roleMiner.run(creep);
      }
      if (creep.memory.role === 'janitor') {
        roleJanitor.run(creep);
      }
      if (creep.memory.role === 'attacker') {
        roleAttacker.run(creep);
      }
      if (creep.memory.role === 'wrecker') {
        roleWrecker.run(creep);
      }
      if (creep.memory.role === 'healer') {
          roleHealer.run(creep);
      }
  }
  }
}

module.exports = brainCreeps;