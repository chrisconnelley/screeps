/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('notes');
 * mod.thing == 'a thing'; // true
 */

/*

1. Spawn Excavators for each source in each room controlled
2. Resource/Energy gathering:
  Ruins/Tombstones/Dropped Resources - GATHER IMMEDIATELY
  Store which resource is being tapped and how much each creep is plannning on taking
  Only assign one creep per resource
  Once picked up. Stop remembering that the creep is going to get that resource.

Builder
control.spawnShort('Spawn1','B'+Game.time,{'move':16,'work':5,'carry':10},'builder');

Upgrader
control.spawnShort('Spawn2','U'+Game.time,{'move':4,'work':2,'carry':3},'upgrader');

X01
control.spawnShort('Spawn1','X01',{'move':5,'work':5},'excavator');
control.commandCreep('X01','this.assign_home(nameCreep,38,14,\'E6N43\');');
control.commandCreep('X01','this.assign_source(nameCreep,\'5bbcad419099fc012e636f56\');');

X02
control.spawnShort('Spawn1','X02',{'move':5,'work':5},'excavator');
control.commandCreep('X02','this.assign_home(nameCreep,40,17,\'E6N43\');');
control.commandCreep('X02','this.assign_source(nameCreep,\'5bbcad419099fc012e636f58\');');

X03
control.spawnShort('Spawn1','X03',{'move':5,'work':5},'excavator');
  control.commandCreep('X03','this.assign_home(nameCreep,11,3,\'E5N43\');');
  control.commandCreep('X03','this.assign_source(nameCreep,\'5bbcad339099fc012e636d2e\');');

X04
control.spawnShort('Spawn1','X04',{'move':5,'work':5},'excavator');
control.commandCreep('X04','this.assign_home(nameCreep,41,40,\'E4N43\');');
control.commandCreep('X04','this.assign_source(nameCreep,\'5bbcad259099fc012e636af1\');');


5bbcad419099fc012e636f56
control.commandCreep('Loader12111297','this.assign_source(nameCreep,\'5bbcad419099fc012e636f56\');');

Loader12111366 - 23,9
Loader12111297 - 23,10
Loader12111397 - 23,11
Container - 24, 10 - 5db7f6e3ca9097412d0b4166
SE - 22,8  5db8114193d24933b4568a3c
SE - 23,8  5db807e7a047ca3e33137dce
SE - 24,8  5db7feddf1141e1fa8d0f190
SE - 22,9  5db81a61f1f26ccc1951c99d
SE - 22,10 5db823fde82abbfd04da2874
SE - 22,11 5db82d130816e73c7c961fe8
SE - 22,12 5db8362aeb40adedd7b4c4ce
SE - 23,12 5db83df275d625d39465307d
SE - 24,12 5db84635f1141e6d7fd1102f
control.commandCreep('Loader12111366','this.add_consumer(nameCreep,\'5db8114193d24933b4568a3c\');');

control.commandCreep('Loader12111297','this.assign_source(nameCreep,\'5db7f6e3ca9097412d0b4166\');');


control.commandCreep('Loader12111236','this.assign_home(nameCreep,23,10,\'E6N43\');');

control.commandCreep('Loader-Spawn','this.assign_home(nameCreep,41,13,\'E6N43\');');
control.commandCreep('Loader-Spawn','this.add_consumer(nameCreep,\'5db2fc447e6adca7bc377981\');');
control.commandCreep('Loader-Spawn','this.assign_source(nameCreep,\'5db6726a92cc0e6ed99b42af\');');
consumer: 5db2fc447e6adca7bc377981
source: 5db6726a92cc0e6ed99b42af


control.commandCreep('LoaderTest','this.assign_home(nameCreep,39,5,\'E6N43\');');

control.commandCreep('LoaderTest','this.add_consumer(nameCreep,\'5db3f7aeca43cc83fbebf5ae\');');
control.commandCreep('LoaderTest','this.add_consumer(nameCreep,\'5db3fa6147e216b76d498e39\');');
control.commandCreep('LoaderTest','this.add_consumer(nameCreep,\'5db3fcf4cbd1fd041ce26827\');');
5db3f7aeca43cc83fbebf5ae
5db3fa6147e216b76d498e39
5db3fcf4cbd1fd041ce26827


  5db72c9146fe69172cbf4332
control.commandCreep('LoaderTest05','this.assign_home(nameCreep,38,7,\'E6N43\');');
control.commandCreep('LoaderTest05','this.add_consumer(nameCreep,\'5db75019045ac034089dfe40\');');
control.commandCreep('LoaderTest05','this.add_consumer(nameCreep,\'5db7518bfa4cae101ed96f4d\');');
control.commandCreep('LoaderTest05','this.add_consumer(nameCreep,\'5db7554aa8d48929a65dcb46\');');
control.commandCreep('LoaderTest05','this.assign_source(nameCreep,\'5db72c9146fe69172cbf4332\');');


5db75019045ac034089dfe40
5db7518bfa4cae101ed96f4d
5db7554aa8d48929a65dcb46

control.commandCreep('LoaderTest06','this.add_Consumer(nameCreep,41,7,\'E6N43\');');
5db74e45db618494c73c7579
5db752f2dac98a78a165ec2f

Transport

MOVE + CARRY = 100 

***
Scouts
***

Memory.map: {
  <roomName>: {
    roomType: oneOfType[],
    owner: ?
  }
}

roomsExplored = Memory.map;
scout.explore: (creep) => {
  creep.room.name
}

getRoomInDirection: (nameRoom, direction) {
  

}


*/

module.exports = {
  // do nothing - this is a notes file - didn't you read the filename?
};