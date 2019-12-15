var control = require('control');
var cleanup = require('cleanup');
var brainFlags = require('brain.flags');
var brainCreeps = require('brain.creeps');
var brainColony = require('brain.colony');
var brainTasks = require('brain.tasks');
var brainData = require('brain.data');

module.exports.loop = function () {
  // brainData.recordData(Memory.game, 'cpuUsed_start', Game.cpu.getUsed(), 10);
  brainData.recordData(Memory.game, 'timeTick', Date.now(), 100);

  
  const timeGame = Game.time;
  console.log(`Game tick: ${timeGame} START`);
  global.co = control;
  global.bt = brainTasks;
  global.bd = brainData;

  cleanup.run();
  // brainData.recordData(Memory.game, 'cpuUsed_cleanup', Game.cpu.getUsed(), 10);

  brainColony.run();
  // brainData.recordData(Memory.game, 'cpuUsed_colony', Game.cpu.getUsed(), 10);
  brainCreeps.run();
  // brainData.recordData(Memory.game, 'cpuUsed_creeps', Game.cpu.getUsed(), 10);
  
  brainFlags.run();
  // brainData.recordData(Memory.game, 'cpuUsed_flags', Game.cpu.getUsed(), 10);
  
  // console.log(`Cleanup: ${brainData.getValueLast(Memory.game, 'cpuUsed_cleanup') - brainData.getValueLast(Memory.game, 'cpuUsed_start')}`);
  
  // console.log(`Colony: ${brainData.getValueLast(Memory.game, 'cpuUsed_colony') - brainData.getValueLast(Memory.game, 'cpuUsed_cleanup')}`);
  
  // console.log(`Creeps: ${brainData.getValueLast(Memory.game, 'cpuUsed_creeps') - brainData.getValueLast(Memory.game, 'cpuUsed_colony')}`);
  
  // console.log(`Flags: ${brainData.getValueLast(Memory.game, 'cpuUsed_flags') - brainData.getValueLast(Memory.game, 'cpuUsed_creeps')}`);
  
  // brainData.recordData(Memory.game, 'cpuUsed_end', Game.cpu.getUsed(), 10);

  // console.log(`Total: ${brainData.getValueLast(Memory.game, 'cpuUsed_end')}`);
  
  console.log(`Game tick: ${timeGame} END`);
  console.log();  
}