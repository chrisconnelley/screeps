var util = require('util');
var mc = require('util.memory.creep');
var shared = require('role.shared');

var roleLocomotive = {
  run: function(creep) {
    const u = util;
    u.log(`[role.locomotive run] creep (${creep})`);
    if (creep.spawning) return;
    
        if (shared.checkRecycle(creep.name, mc.getStage, mc.setStage)) return;
    
        shared.displayBadge(creep,'L','10px','#FF0000','#000000');
        this.perform(creep.name); 
  },
  perform: function(creep) {
    const u = util;
    u.log(`[role.locomotive perform] creep (${creep})`);
  }
}

module.exports = roleLocomotive;
