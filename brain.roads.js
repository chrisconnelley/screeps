var map = require('map')

var brainRoads = {
    pave: function(creep) {
        // Don't just make a road at the first pass, require N requests before building - This is to prevent the one off gathering of dropped resources by Invaders creating roads 
        //  Currently thinking N should be 3
        if (creep.fatigue && creep.pos.lookFor(LOOK_STRUCTURES).length === 0) {
            creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
        }
    }
}

module.exports = brainRoads;