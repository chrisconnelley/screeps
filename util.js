var util = {
  debug: false,

  convertRoomToXY: function (roomName) {
    var splitRoomName, x, y;
    if (roomName.includes("N")) {
      splitRoomName = roomName.split("N");
      y = parseInt(splitRoomName[1]);
    } else {
      splitRoomName = roomName.split("S");
      y = -parseInt(splitRoomName[1]) - 1;
    }

    if (splitRoomName[0].includes("E")) {
      x = parseInt(splitRoomName[0].split("E")[1]);
    } else {
      x = -parseInt(splitRoomName[0].split("W")[1]) - 1;
    }

    util.log(`x: ${x} y: ${y}`);

    return {
      x,
      y
    };
  },
  distance: function (a, b) {
    return a * a + b * b;
  },
  errorCodeToDisplay(errorCode) {
    switch (errorCode) {
      case 0:
        return "OK";
      case -1:
        return "ERR_NOT_OWNER";
      case -2:
        return "ERR_NO_PATH";
      case -3:
        return "ERR_NAME_EXISTS";
      case -4:
        return "ERR_BUSY";
      case -5:
        return "ERR_NOT_FOUND";
      case -6:
        return "ERR_NOT_ENOUGH";
      case -7:
        return "ERR_INVALID_TARGET";
      case -8:
        return "ERR_FULL";
      case -9:
        return "ERR_NOT_IN_RANGE";
      case -10:
        return "ERR_INVALID_ARGS";
      case -11:
        return "ERR_TIRED";
      case -12:
        return "ERR_NO_BODYPART";
      case -14:
        return "ERR_RCL_NOT_ENOUGH";
      case -15:
        return "ERR_GCL_NOT_ENOUGH";
      default:
        return "ERROR (" + errorCode + ") not in list"
    }
  },
  getRoomDistance: function (roomNameA, roomNameB) {
    var {
      x: xA,
      y: yA
    } = this.convertRoomToXY(roomNameA);
    var {
      x: xB,
      y: yB
    } = this.convertRoomToXY(roomNameB);

    var distanceAtoB = this.distance(xB - xA, yB - yA);

    return distanceAtoB;
  },
  getRoomOwner: function (nameRoom) {
    var memoryRoom = Memory.colony.rooms[nameRoom];

    if (!memoryRoom) return null;

    var memoryController = memoryRoom.controller;

    if (!memoryController) return null;

    var memoryOwner = memoryController.owner;

    if (!memoryOwner) return null;

    return memoryOwner.username;
  },
  isRoomMine: function (nameRoom) {
    return this.getRoomOwner(nameRoom) === 'NeteruOsmosis';
  },
  log: function(message) {
    if (this.debug) {
      console.log(message);
    }
  },
};

module.exports = util;