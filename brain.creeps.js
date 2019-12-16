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
var shared = require('role.shared');
var roleWrecker = require('role.wrecker');

var brainCreeps = {
  run: function() {
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
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
  }
  }
}

module.exports = brainCreeps;