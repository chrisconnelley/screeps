var control = require('control');
var cleanup = require('cleanup');
var brainFlags = require('brain.flags');
var brainCreeps = require('brain.creeps');
var brainColony = require('brain.colony');

module.exports.loop = function () {
  console.log("Game tick: " + Game.time);
  global.control = control;

  cleanup.run();

  brainColony.run();
  brainCreeps.run();
  
  brainFlags.run();
  
  console.log("Game tick END");
  console.log();
}