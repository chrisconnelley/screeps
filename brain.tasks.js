
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

var brainTasks = {
  typeTasksAllowed: [
    'deliver'
  ],
  sourcesPossible: [
    'storage',
    'container',
    'any'
  ],
  idTaskGlobal: 0,
  createTask: function(
    typeTask, 
    targetStart, 
    targetEnd, 
    quantity, 
    nameCreepAssigned,
    sourcesToUse = ['any']
    ) {
    if (!this.typeTasksAllowed.includes(typeTask)) return ERR_INVALID_ARGS;
    if (!targetStart) return ERR_INVALID_ARGS;
    if (targetStart && !targetStart.pos) return ERR_INVALID_ARGS;
    if (targetEnd && !targetEnd.pos) return ERR_INVALID_ARGS;
    
    var isValidSources = true;
    sourcesToUse.forEach(sourceToUse => {
      if (!this.sourcesPossible.includes(sourceToUse)) {
        isValidSources = false;
      } 
    }); 
    if (!isValidSources) return ERR_INVALID_ARGS;

    const idTaskNew = Game.time + "." + idTaskGlobal++;

    if (!memory.tasks) memory.tasks = [];

    const task = {
      id: idTaskNew,
      type: typeTask,
      tickCreated: Game.time,
      nameCreepAssigned: nameCreepAssigned,
      targetStart: targetStart,
      targetEnd: targetEnd,
      quantity: quantity
    };

    memory.tasks.push(task);

    return idTaskNew;
  },
  completeTask: function(idTask, nameCreep) {
    
  },
  assignTask: function(idTask, nameCreep) {

  },
  findTask: function(typeTask, quantity) {

  },
  deleteTask: function(idTask) {

  },
  getTasks: function() {
    return memory.tasks;
  }
}

module.exports = brainTasks;