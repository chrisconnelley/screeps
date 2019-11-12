var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleExcavator = require('role.excavator');
var roleTransport = require('role.transport');
var roleTransportRemote = require('role.transport-remote');
var roleRefueler = require('role.refueler');
var roleDefender = require('role.defender');
var roleScout = require('role.scout');
var shared = require('role.shared');

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
      if (creep.memory.role == 'transport-remote') {
        roleTransportRemote.run(creep);
      }
  }
  }
}

module.exports = brainCreeps;