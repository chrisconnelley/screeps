var util = require('util');

var brainTasks = {
  typeTasksAllowed: [
    'refuel'
  ],
  idTaskGlobal: 0,
  createTaskRefuel: function (targetId, quantity) {
    const idTask = this.createTask('refuel', targetId, RESOURCE_ENERGY, quantity, null);

    return idTask;
  },
  createTask: function (
    typeTask,
    targetId,
    typeResource,
    quantity,
    message,
    sourcesToUse = ['any']
  ) {
    if (quantity === 0) {
      console.log(`[brain.tasks.createTask] ${targetId} requested ${typeTask} task with no quantity`);
    }

    if (!this.typeTasksAllowed.includes(typeTask)) return ERR_INVALID_ARGS;
    if (!targetId) return ERR_INVALID_ARGS;

    const idTaskNew = Game.time + "." + this.idTaskGlobal++;

    if (!Memory['tasks']) Memory['tasks'] = [];

    var target = Game.getObjectById(targetId);
    var nameRoom = target.pos.roomName;

    const task = {
      id: idTaskNew,
      message: message,
      nameCreepAssigned: null,
      targetRoomName: nameRoom,
      quantity: quantity,
      target: targetId,
      tickCreated: Game.time,
      type: typeTask,
      typeResource: typeResource,
    };

    Memory['tasks'][idTaskNew] = task;

    return idTaskNew;
  },
  loadTask: function (idTask) {
    var task = {};

    task = Memory['tasks'][idTask];

    if (!task || task.id) return null;

    return task;
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
  getTasks: function (typeTask) {
    // console.log(`getTasks typeTask: ${typeTask}`);
    if (!!typeTask) {
      const filteredTasks = Memory.tasks.map((task) => {
        if (task.type === typeTask) return task;
      })

      return filteredTasks;
    }

    const tasks = Memory['tasks'];
    // console.log(`getTasks tasks: ${JSON.stringify(tasks)}`);
    return tasks;
  },
  getTasksUnassigned: function (typeTask, nameRoom) {

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
  assignTask: function (task, creep) {
    task.nameCreepAssigned = creep.name;
    creep.memory.idTask = task.id;

    return OK;
  }
}

module.exports = brainTasks;