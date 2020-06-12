var control = require('control');
var cleanup = require('cleanup');
var brainFlags = require('brain.flags');
var brainCreeps = require('brain.creeps');
var brainColony = require('brain.colony');
// var brainTasks = require('brain.tasks');
var brainData = require('brain.data');
var brainMarket = require('brain.market');

module.exports.loop = function () {
  // brainData.recordData(Memory.game, 'cpuUsed_start', Game.cpu.getUsed(), 10);
  brainData.recordData(Memory.game, 'timeTick', Date.now(), 100);

  const timeGame = Game.time;
  console.log();
  console.log(`Tick Start: ${timeGame}`);
  global.co = control;
  global.bm = brainMarket;
  // global.bt = brainTasks;
  global.bd = brainData;

  cleanup.run();
  brainColony.run();
  brainCreeps.run();
  brainFlags.run();

  var lengthTickInMs = parseInt(brainData.getAverageDiff(Memory.game, 'timeTick')/100)*100;

  console.log(`Tick End: ${timeGame} ${lengthTickInMs/1000}s CPU Bucket: ${Game.cpu.bucket}/10000`);
    
}