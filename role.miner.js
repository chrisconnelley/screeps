var util = require('util');
var mc = require('util.memory.creep');
var shared = require('role.shared');

var roleMiner = {
    run: function(creep) {
        if (shared.checkRecycle(creep.name, mc.getStage, mc.setStage)) return;
        shared.displayBadge(creep,'X','10px','#FF0000','#000000');
        this.perform(creep); 
    },  
    perform: function(creep) {
        var mineral = mc.getMineral(creep.name);

        if (!mineral) return;

        var hasMinerals = mineral.mineralAmount > 0;

        if (hasMinerals) {
            var resultHarvest = creep.harvest(mineral);

            if (resultHarvest === ERR_NOT_IN_RANGE) {
                creep.moveTo(mineral, {
                    visualizePathStyle: {
                        stroke: '#00FF00'
                    }
                })
            }
        }
    }
}

module.exports = roleMiner;