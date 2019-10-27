var control = require('control');
var ccreepsNew = require('ccreeps.new');
var hud = require('hud');
var cleanup = require('cleanup');
var brainBase = require('brain.base');
var brainFlags = require('brain.flags');
var brainCreeps = require('brain.creeps');
var brainTowers = require('brain.towers');

module.exports.loop = function () {
  console.log("Game tick" + Game.time);
  var nameSpawn = 'Spawn1';
  global.control = control;
  cleanup.run();

  var status = ccreepsNew.run();

  brainCreeps.run();
  brainTowers.run(nameSpawn);
  brainBase.run(nameSpawn);
  brainFlags.run();
  
  hud.run(nameSpawn, status); 
}