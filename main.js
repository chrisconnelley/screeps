var control = require('control');
var cleanup = require('cleanup');
var brainFlags = require('brain.flags');
var brainCreeps = require('brain.creeps');
var brainColony = require('brain.colony');
var brainTasks = require('brain.tasks');
var brainData = require('brain.data');

module.exports.loop = function () {
  brainData.recordData(Memory.game, 'timeTick', Date.now(), 100);

  const timeGame = Game.time;
  console.log(`Game tick: ${timeGame} START`);
  global.co = control;
  global.bt = brainTasks;
  global.bd = brainData;

  cleanup.run();

  brainColony.run();
  brainCreeps.run();
  
  brainFlags.run();

  console.log(`Game tick: ${timeGame} END`);
  console.log();  
}