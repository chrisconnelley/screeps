/* NOTES AT BOTTOM */
var util = require('util');
var shared = require('role.shared');

var brainTasks = {
  typeTasksAllowed: [
    'deliver',
    'speak',
    'withdraw'
  ],
  sourcesPossible: [
    'storage',
    'container',
    'any'
  ],
  idTaskGlobal: 0,
  createTaskSpeak: function (message, target) {
    const idTask = this.createTask('speak', target, null, 0, message, Game.time);

    return idTask;
  },
  createTaskDeliver: function (target, typeResource, quantity) {
        
    const idTask = this.createTask('deliver', target, typeResource, quantity, null, Game.time);

    return idTask;
  },
  createTask: function (
    typeTask,
    target,
    typeResource,
    quantity,
    message,
    timeDue,
    sourcesToUse = ['any']
  ) {
    if (quantity === 0) {
          }

    if (!this.typeTasksAllowed.includes(typeTask)) return ERR_INVALID_ARGS;
    if (!target) return ERR_INVALID_ARGS;

    var isValidSources = true;
    sourcesToUse.forEach(sourceToUse => {
      if (!this.sourcesPossible.includes(sourceToUse)) {
        isValidSources = false;
      }
    });
    if (!isValidSources) return ERR_INVALID_ARGS;

    const idTaskNew = Game.time + "." + this.idTaskGlobal++;

    if (!Memory.tasks) Memory.tasks = {};

    const task = {
      id: idTaskNew,
      type: typeTask,
      target: target,
      quantity: quantity,
      typeResource: typeResource,
      message: message,
      timeDue: timeDue,
      tickCreated: Game.time,
      nameCreepAssigned: null,
    };

    Memory.tasks[idTaskNew] = task;

    return idTaskNew;
  },
  loadTask: function (udTask) {
    var task = {};

    task = Memory.tasks[idTask];

    if (!task || task.id) return null;

    return task;
  },
  taskDeliver: function (task) {
        const creep = Game.creeps[task.nameCreepAssigned];
   
    if (!creep) this.recycleTask(task);

    if (creep.store.getUsedCapacity(task.typeResource) >= task.quantity) {
      // deliver
      
      // if (task.quantity === 0) this.completeTask(task);

      var result = shared.deliverResource(creep, task.target, task.typeResource, task.quantity);

      if (result >= 0) this.completeTask(task);

    } else {
      // collect
            // TODO: Create collect resource function
    }

    return false;
  },
  taskSpeak: function (task) {
        const creep = Game.creeps[task.nameCreepAssigned];

    if (!creep) this.recycleTask(task);

    let posTask = task.target.pos || task.target;
    posTask = new RoomPosition(posTask.x, posTask.y, posTask.roomName);

    const isInPlace = creep.pos.isEqualTo(posTask);
    if (isInPlace) {
      creep.say(task.message);
      return true;
    } else {
      var result = creep.moveTo(posTask.x, posTask.y, {
        visualizePathStyle: {
          fill: 'transparent',
          stroke: '#ff00ff',
          lineStyle: 'solid',
          strokeWidth: .35,
          opacity: .5
        }
      });
          }

    return false;
  },
  recycleTask: function (idTask) {
    const task = idTask;
    task.nameCreepAssigned = null;
  },
  completeTask: function (task) {
    const creep = Game.creeps[task.nameCreepAssigned];
    delete creep.memory.idTask;
    this.deleteTask(task.id);
  },
  deleteTask: function (idTask) {
    delete Memory.tasks[idTask];
  },
  getTasks: function () {
    return Memory.tasks;
  },
  getCreepClosest: function (task) {
        const creeps = Game.creeps;

    let distanceClosest = 999;
    let creepClosest;

    // Look for in room creeps first
    _.forIn(creeps, (creep, nameCreep) => {
      if (!creep.memory.idTask) {
        const canDoTask = this.canCreepDoTask(creep, task.type);
  
                if (canDoTask) {
          // let posTask = task.target.pos || task.target;
          let target = Game.getObjectById(task.target);
          let posTask = target.pos || task.target;

          if (creep.pos.roomName === posTask.roomName) {
            let distance = util.distanceCheapest(creep.pos.x - posTask.x, creep.pos.y - posTask.y);
  
            if (distance < distanceClosest) {
              distanceClosest = distance
              //   
              creepClosest = creep;
            }
          }
        }
      }
    });

        
    return creepClosest;
  },
  bodyParts: ['move', 'attack', 'carry', 'work'],
  canCreepDoTask: function (creep, typeTask) {
    if (creep.memory.role !== 'task') return false;
    let canDoTask = false;
    if (!creep) return false;
    if (!typeTask) return false;

    switch (typeTask) {
      case 'speak':
        canDoTask = true;
        break;
      case 'deliver':
                if (creep.store.getFreeCapacity() > 0) {
          canDoTask = true;
        }
        break;
      default:
        canDoTask = false;
    }

    return canDoTask;
  },
  processTasks: function () {
        const tasks = this.getTasks();

    _.forIn(tasks, (task, idTask) => {
      if (!task.nameCreepAssigned) {
                const creepFound = this.getCreepClosest(task);
        if (creepFound) {
                    if (task.type === 'deliver') {
            
            this.assignTaskDeliver(task, creepFound);

          } else if (task.type === 'speak') {
            this.assignTask(task, creepFound);
          }
        }
      } else {
        
        this.performTask(task);
      }
    });
  },
  assignTask: function (task, creep) {
    task.nameCreepAssigned = creep.name;
    creep.memory.idTask = task.id;

    return OK;
  },
  assignTaskDeliver: function (task, creep) {
        
        if (task.quantity > creep.store.getFreeCapacity()) {
      
      this.createTaskDeliver(task.target, task.typeResource, task.quantity - creep.store.getFreeCapacity());

      task.quantity = creep.store.getFreeCapacity();

          }

    task.nameCreepAssigned = creep.name;
    creep.memory.idTask = task.id;

    return OK;
  },
  assignTasks: function () {
        const tasks = this.getTasks();

    _.forIn(tasks, (task, idTask) => {
      if (!task.nameCreepAssigned) {
        const creepFound = this.getCreepClosest(task);
        
        if (creepFound) {
          if (task.type === 'deliver') {
            // this.assignTaskDeliver(task, creepFound);
          } else {
            // task.nameCreepAssigned = creepFound.name;
          }
        }
      }
    });
  },
  performTask: function (task) {
    let wasTaskCompleted = false;

    switch (task.type) {
      case 'speak':
        wasTaskCompleted = this.taskSpeak(task);
        break;
      case 'deliver':
        wasTaskCompleted = this.taskDeliver(task);
        break;
      default:
    }

    if (wasTaskCompleted) this.deleteTask(task.id);
  }
}

module.exports = brainTasks;

/*

task: {
  id: Game.time + "_" + tickTaskId,
  taskType: [
    'attackCreep',
    'attackStructure',
    'build'
    'refuel',
    'mine',
    'transport', // from start to end
  ],
  tickCreated: Game.time,
  tickUpdated: Game.time,
  nameCreepAssigned: ,
  posStart: // if transport, this is a store or dropped resource
  posEnd: // if transport, this is a store or dropped location
  targetStart:
  targetEnd:
  quantity: X,

}
*/