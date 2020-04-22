const shared = require('role.shared');
const um = require('util.memory');
const locator = require('locator');

var rolePitman = {
  name: 'pitman',
  badge: {
    character: 'P',
    colorOfText: '#FF0000',
    colorOfStroke: '#FFFF44',
    size: '10px',
  },
  run: function (creep) {
    if (creep.spawning) return;
    shared.displayBadgeNew(creep, this.badge);
    
    if (shared.checkRenew(creep.name, '')) return;
    
    this.perform(creep);
  },
  perform: function (creep) {
    let depositCurrent = um.getObject(creep, 'deposit');

    if (!depositCurrent) {
      // Find new energy deposit
      console.log(`Pitman ${creep.name} needs to find a new energy deposit`);
      creep.say('LF deposit');

      const depositNew = locator.findSourcesWithEnergy(creep);
      // console.log(depositNew.id);
      if (depositNew) {
        um.remember(creep, 'deposit', depositNew.id);
        depositCurrent = depositNew;
      }
    }

    // TURN OFF MINERAL DEPOSITING FOR NOW
    // if (!depositCurrent) {
    //   // Find new mineral deposit
    //   console.log(`Looking for deposits`);
    //   const depositMineral = locator.findDeposit(creep);
      
    //   if (depositMineral) {
    //     console.log(`Mineral deposit found: ${depositMineral}`);
    //     um.remember(creep, 'deposit', depositMineral.id);
    //     depositCurrent = depositMineral;
    //   }
    // }

    if (!depositCurrent) return ERR_INVALID_TARGET;

    const resultHarvest = creep.harvest(depositCurrent);
  
    if (resultHarvest === ERR_NOT_IN_RANGE) {
      creep.moveTo(depositCurrent, {
        visualizePathStyle: {
          stroke: '#00FF00'
        }
      });
    }

    if (resultHarvest !== OK) {
      console.log(`result of Pitman harvest: ${resultHarvest}`);
    
      if (resultHarvest === ERR_NOT_ENOUGH_ENERGY) {
        um.forget(creep, 'deposit');
        this.perform(creep);
      }
    }
  },
};

module.exports = rolePitman;
