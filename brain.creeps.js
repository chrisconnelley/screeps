var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleLoader = require('role.loader');
var roleExcavator = require('role.excavator');
var roleTransport = require('role.transport');
var roleScout = require('role.scout');
var roleRefueler = require('role.refueler');
var roleBattery = require('role.battery');

var brainCreeps = {
  run: function() {
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
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
      if(creep.memory.role == 'loader') {
        roleLoader.run(creep);
      }
      if(creep.memory.role == 'excavator') {
        roleExcavator.run(creep);
      }
      if(creep.memory.role == 'transport') {
        roleTransport.run(creep);
      }
      if(creep.memory.role == 'scout') {
        roleScout.run(creep);
      }
      if(creep.memory.role == 'refueler') {
        roleRefueler.run(creep);
      }
      if(creep.memory.role == 'battery') {
          roleBattery.run(creep);
      }
  }
  }
}

module.exports = brainCreeps;