var util = require('util');
var mc = require('util.memory.creep');
var shared = require('role.shared');
var map = require('map');

var roleMiner = {
    run: function(creep) {
        if (creep.spawning) return;
    
        if (shared.checkRecycle(creep.name, mc.getStage, mc.setStage)) return;
    
        shared.displayBadge(creep,'X','10px','#FF0000','#000000');
        this.perform(creep.name); 
    },  
    perform: function(creep) {
        const u = util;
        var creep = Game.creeps[nameCreep];
        var mineral = mc.getMineral(nameCreep);
        u.log(`mineral: ${mineral}`);
    
        if (!mineral) return;
        
        var hasMinerals = mineral.mineralAmount > 0;
        
        u.log(`mineral.mineralAmount: ${mineral.mineralAmount}`);
        if (hasMinerals) {
            var resultHarvest = creep.harvest(mineral);
            
            u.log(`resultHarvest: ${resultHarvest}`);
            if (resultHarvest === ERR_NOT_IN_RANGE) {
                creep.moveTo(mineral, {
                    visualizePathStyle: {
                        stroke: '#00FF00'
                    }
                })
            } else if (resultHarvest === ERR_NOT_OWNER) {
                map.markRoomHostile(creep.pos.roomName);
            }
        }
    }
}

module.exports = roleMiner;