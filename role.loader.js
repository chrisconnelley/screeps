var utilMemory = require('util.memory');

var roleLoader = {
  /* memory:
    consumer: name of Spawn
    idSource: id of source Structure
    stage: loading or unloading
  */
  displayBadge: function (creep) {
    creep.room.visual.text('L', creep.pos, {
      color: '#FF0000',
      font: '10px',
      stroke: '#FFFFFF'
    })
  },
  run: function (creep) {
    roleLoader.displayBadge(creep);

    if (utilMemory.hasMemory(creep, 'consumer') &&
        utilMemory.hasMemory(store, 'store')) {
          perform(creep);
    } else {
      console.log("Loader needs both consumer and store assigned.");
    }
  },
  perform: function(creep) {
    var consumer = this.consumer(creep);
    var source = this.source(creep);
    var hasSourceEnergy = source.store.energy > 0;
    var doesConsumerNeedEnergy = consumer.store.energy < consumer.store.getCapacity('energy');

    console.log("hasSourceEnergy? " + hasSourceEnergy + " doesConsumerNeedEnergy? " + doesConsumerNeedEnergy);

  },
  consumer: function (creep) {
    return utilMemory.getObject(creep, 'consumer');
  },
  source: function (creep) {
    return utilMemory.getObject(creep, 'source');
  },
  stage: function (creep) {
    return utilMemory.getString(creep, 'stage');
  },
  assign_Consumer(creep, idConsumer) {
    utilMemory.remember(creep, 'consumer', idConsumer);
  },
  assign_Source(creep, idSource) {
    utilMemory.remember(creep, 'source', idSource);
  },
  assign_Stage(creep, stage) {
    utilMemory.remember(creep, 'stage', stage);
  }
};

module.exports = roleLoader;