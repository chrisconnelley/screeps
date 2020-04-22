var utilMemory = require('util.memory');

var roleLoader = {
  /* memory:
    consumers: array of ids of Spawn/extensions
    idSource: id of source Structure
    stage: loading or unloading
    isRecharging: true
  */
  echo: function(nameCreep, message) {
    var creep = Game.creeps[nameCreep];
    creep.say(message);
    return message;
  },
  displayBadge: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    creep.room.visual.text('L', creep.pos, {
      color: '#FF0000',
      font: '10px',
      stroke: '#FFFFFF'
    })
  },
  run: function (creep) {
    this.runInternal(creep.name); 
  },
  isSetup: function(nameCreep) {
    var isSetup = true;

    var creep = Game.creeps[nameCreep];
    if (!utilMemory.hasMemory(creep, 'consumer')) {
      isSetup = false;
    } 

    if (!utilMemory.hasMemory(creep, 'source')) {
      isSetup = false;
    }

    return isSetup;
  },
  runInternal: function(nameCreep) {
    roleLoader.displayBadge(nameCreep);
    var creep = Game.creeps[nameCreep];

    if (!utilMemory.hasMemory(creep, 'home_roomName')) {
      return;
    }

    var isHome = creep.pos.isEqualTo(this.home(nameCreep));
    if (!isHome) {
      // check if we really are home
      // if (creep.pos.isEqualTo(this.home(nameCreep))) {
      //   //
      //   this.assign_isHome(nameCreep, true);
      // } else {
        creep.moveTo(this.home(nameCreep), {
            visualizePathStyle: {
              stroke: '#FFFFFF'
            }
        });
      // }
    }    

    if (!this.isSetup(nameCreep)) return;

    this.perform(nameCreep);
  },
  perform: function(nameCreep) {
    var creep = Game.creeps[nameCreep];
    var consumer;
    var source = this.source(nameCreep);
    var hasSourceEnergy = source.store.energy > 0;
    var doesConsumerNeedEnergy = false; 

    var countConsumers = this.consumers_length(nameCreep);

    for (var i=0; i < countConsumers; i++) {
      consumer = this.consumer(nameCreep, i);
      // //
      if (consumer === undefined || consumer.store === undefined) continue;
      doesConsumerNeedEnergy = consumer.store.energy < consumer.store.getCapacity('energy');
      if (doesConsumerNeedEnergy) break;
    }

    // //

    if (hasSourceEnergy && doesConsumerNeedEnergy) {
      if (this.stage(nameCreep) === undefined) {
        this.assign_stage(nameCreep, 'loading');  
      }

      var stage = this.stage(nameCreep);

      if (stage === 'loading') {
        creep.say("!!");
        var result = creep.withdraw(source, RESOURCE_ENERGY);
        this.assign_stage(nameCreep, 'unloading'); 
      }
      else {
        var result = creep.transfer(consumer, RESOURCE_ENERGY);
        this.assign_stage(nameCreep, 'loading');  
      }
    }

  },
  consumer: function(nameCreep, index) {
    var creep = Game.creeps[nameCreep];
    var idsConsumers = utilMemory.getArray(creep, 'consumer');
    // //
    return Game.getObjectById(idsConsumers[index]);
  },
  consumers_length: function(nameCreep) {
    var creep = Game.creeps[nameCreep];
    var idsConsumers = utilMemory.getArray(creep, 'consumer');
    return idsConsumers.length;
  },
  source: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    return utilMemory.getObject(creep, 'source');
  },
  stage: function (nameCreep) {
    var creep = Game.creeps[nameCreep];
    return utilMemory.getString(creep, 'stage');
  },
  isHome: function(nameCreep) {
    var creep = Game.creeps[nameCreep];
    return utilMemory.getBoolean(creep, 'isHome');
  },
  home: function(nameCreep) {
    var creep = Game.creeps[nameCreep];
    var x = utilMemory.getInt(creep, 'home_x');
    var y = utilMemory.getInt(creep, 'home_y');
    var nameRoom = utilMemory.getString(creep, 'home_roomName');

    return new RoomPosition(x, y, nameRoom);
  },
  add_consumer(nameCreep, idConsumer) {
    var creep = Game.creeps[nameCreep];
    utilMemory.rememberInArray(creep, 'consumer', idConsumer);
  },
  remove_consumer(nameCreep, idConsumer) {
    var creep = Game.creeps[nameCreep];
    utilMemory.forgetInArray(creep, 'consumer', idConsumer);
  },
  removeConsumerByIndex(nameCreep, index) {
    var creep = Game.creeps[nameCreep];
    utilMemory.forgetInArrayByIndex(creep, 'consumer', index);
  },
  assign_source(nameCreep, idSource) {
    var creep = Game.creeps[nameCreep];
    utilMemory.remember(creep, 'source', idSource);
  },
  assign_stage(nameCreep, stage) {
    var creep = Game.creeps[nameCreep];
    utilMemory.remember(creep, 'stage', stage);
  },
  assign_home(nameCreep, x, y, roomName) {
    var creep = Game.creeps[nameCreep];
    utilMemory.remember(creep, 'home_x', x);
    utilMemory.remember(creep, 'home_y', y);
    utilMemory.remember(creep, 'home_roomName', roomName);
    this.assign_isHome(nameCreep, false);
  },
  assign_isHome(nameCreep, isHome) {
    var creep = Game.creeps[nameCreep];
    utilMemory.remember(creep, 'isHome', isHome);
  }
};

module.exports = roleLoader;