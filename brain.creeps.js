var roleAttacker = require('role.attacker');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var roleDefender = require('role.defender');
var roleHarvester = require('role.harvester');
var roleJanitor = require('role.janitor');
var rolePitman = require('role.pitman');
var roleRefueler = require('role.refueler');
var roleUpgrader = require('role.upgrader');
var roleHealer = require('role.healer');

var brainCreeps = {
  run: function() {
    
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];

      if (creep.spawning) continue;

      if (creep.memory.idTask) 
      {
        if (!Memory.tasks || !Memory.tasks[creep.memory.idTask]) delete creep.memory.idTask;
        // continue; // brain.tasks has them perform the task
      }

      if(creep.memory.role == 'harvester') {
          roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
          roleUpgrader.run(creep);
      }
      if(creep.memory.role == 'builder') {
          roleBuilder.run(creep);
      }     
      if(creep.memory.role == 'refueler') {
        roleRefueler.run(creep);
      }
      if (creep.memory.role == 'defender') {
        roleDefender.run(creep);
      }
      if (creep.memory.role === 'claimer') {
        roleClaimer.run(creep);
      }
      if (creep.memory.role === 'pitman') {
        rolePitman.run(creep);
      }
      if (creep.memory.role === 'janitor') {
        roleJanitor.run(creep);
      }
      if (creep.memory.role === 'attacker') {
        roleAttacker.run(creep);
      }
      if (creep.memory.role === 'healer') {
          roleHealer.run(creep);
      }
  }
  }
}

module.exports = brainCreeps;