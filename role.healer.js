var util = require('util');
var shared = require('role.shared');
var mc = require('util.memory.creep');

var roleHealer = {
    run: function(creep) {
        if (creep.spawning) return;
        shared.displayBadge(creep, '💙');
        if (shared.checkRenew(creep.name, 'heal')) return;
        
        var room = creep.room;
        var woundedCreeps = room.find(FIND_MY_CREEPS, {
        filter: (creep) =>
            creep.hits < creep.hitsMax
        });
        
        console.log(`Healer: ${creep.name}`);
        const woundedCreep = woundedCreeps[0];
        
        if (creep.pos.isNearTo(woundedCreep)) {
            creep.heal(woundedCreep);
        } else {
            creep.moveTo(woundedCreep, {
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#00FF00',
                    lineStyle: 'solid',
                    strokeWidth: .35,
                    opacity: .75
                }
            });
        }
    
        
    }
};

module.exports = roleHealer;