var roleScout = {
    role: 'scout',
    /* memory:
      consumers: array of ids of Spawn/extensions
      idSource: id of source Structure
      stage: loading or unloading
      isRecharging: true
    */
    costBodyPartsSection: 260,
    bodyPartsSection: [ATTACK, TOUGH, MOVE, MOVE],
    echo: function(nameCreep, message) {
      var creep = Game.creeps[nameCreep];
      creep.say(message);
      return message;
    },
    controlCommand: function(nameCreep, command) {
      console.log("controlCommand" + command);
      eval(command); // uses nameCreep
    },
    displayBadge: function (nameCreep) {
      var creep = Game.creeps[nameCreep];
      creep.room.visual.text('S', creep.pos, {
        color: '#FF0000',
        font: '10px',
        stroke: '#FFFFFF'
      })
    },
    run: function (creep) {
      this.runInternal(creep.name); 
    },
    runInternal: function(nameCreep) {
      this.displayBadge(nameCreep);
  
       this.perform(nameCreep);
    },
    perform: function(nameCreep) {
      var roomNameDestination = 'E6N44';
      var creep = Game.creeps[nameCreep];
      
      if (creep.room.name !== roomNameDestination) {
        // console.log(creep.room + " " + roomNameDestination);
        const exitDir = Game.map.findExit(creep.room, roomNameDestination);
        const exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
      } else {
        creep.say('Attack!');
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var result = creep.attack(target);

        if (result === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: {
              stroke: '#ff0000'
            }
          });
        }
      }
      


    }
};

module.exports = roleScout;