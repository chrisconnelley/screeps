/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('notes');
 * mod.thing == 'a thing'; // true
 */

/*

  All creeps should behave the same.
  
  Behavior should be based on need.

  * Scouts
  - Create MOVE units that move to each of the nearby rooms
  - Pull energy sources from the rooms
  - 

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

*/

module.exports = {
  // do nothing - this is a notes file - didn't you read the filename?
};