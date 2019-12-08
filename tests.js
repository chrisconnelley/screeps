var map = require('map');
var utilTests = require('util.tests');
const brainTasks = require('brain.tasks');

var tests = {
  test_getOrCreateMemoryObject: function() {
    var hasAllPassingTests = true;
    
    /* TEST 1 */

    var keyMemoryParent = Memory;
    var keyMemoryChild = 'colony';

    var memoryTest = Memory.colony;
    var result = map.getOrCreateMemoryObject(keyMemoryParent, keyMemoryChild);

    var assertMemoryTest_01 = memoryTest == result;
    var expect_Test_01 = utilTests.expect(assertMemoryTest_01, true);

    hasAllPassingTests = hasAllPassingTests && expect_Test_01;

    console.log(`Testing if Memory.colony == result of getOrCreateMemoryObject(Memory,'colony'): ${assertMemoryTest_01}`);
    console.log(`Expected TRUE. Test passed: ${expect_Test_01}`);

    /* TEST 2 */

    var keyMemoryParent = Memory;
    var keyMemoryChild = 'testing';

    var memoryTest = Memory.testing;
    var result = map.getOrCreateMemoryObject(keyMemoryParent, keyMemoryChild);

    var expect_Test_02a = utilTests.expect(memoryTest, undefined);
    console.log(`Testing if Memory.testing ${memoryTest} is undefined before method call: ${expect_Test_02a}`);
    hasAllPassingTests = hasAllPassingTests && expect_Test_02a;

    var assertMemoryTest_02 = memoryTest == result;
    var expect_Test_02 = utilTests.expect(assertMemoryTest_02, false);
    hasAllPassingTests = hasAllPassingTests && expect_Test_02;

    console.log(`Testing if Memory.bob !== result of getOrCreateMemoryObject(Memory,'bob'): ${assertMemoryTest_02}`);
    console.log(`Expected FALSE. Test passed: ${expect_Test_02}`);

    /* CLEANUP */
    delete Memory.testing;

    return hasAllPassingTests;
  },
  test_getOrCreateMemoryString: function() {
    var hasAllPassingTests = true;
    
    /* TEST 1 */
    console.log(``);
    console.log(`Testing getOrCreateMemoryString:`);

    var keyMemoryParent = Memory;
    var keyMemoryChild = 'testing1';

    Memory.testing1 = 'hello';

    var memoryTest = Memory.testing1;
    var result = map.getOrCreateMemoryString(keyMemoryParent, keyMemoryChild);

    console.log(`Given Memory.testing1 = 'hello', testing:`);

    var expect_Test_01a = utilTests.expect(typeof memoryTest, 'string');
    console.log(`memoryTest (Memory.testing1) ${memoryTest} is typeof string (${typeof memoryTest}): ${expect_Test_01a}`);

    var expect_Test_01b = utilTests.expect(result, 'hello');
    console.log(`result (${result}) of getOrCreateMemoryString equals 'hello': ${expect_Test_01b}`);
    
    var expect_Test_01c = utilTests.expect(memoryTest, result);
    console.log(`memoryTest (Memory.testing1) is typeof string: ${expect_Test_01c}`);
    
    var expect_Test_01d = utilTests.expect(typeof result, 'string');
    console.log(`result of getOrCreateMemoryString is typeof string: ${expect_Test_01d}`);

    hasAllPassingTests = hasAllPassingTests && expect_Test_01a && expect_Test_01b && expect_Test_01c && expect_Test_01d;

    /* TEST 1 CLEANUP */

    delete Memory.testing1;

    return hasAllPassingTests;
  },
  test_getOrCreateMemoryBoolean: function() {
    var hasAllPassingTests = true;
    
    /* TEST 1 */
    console.log(``);
    console.log(`Testing getOrCreateMemoryBoolean:`);

    var keyMemoryParent = Memory;
    var keyMemoryChild = 'testing1';

    Memory.testing1 = false;

    var memoryTest = Memory.testing1;
    var result = map.getOrCreateMemoryBoolean(keyMemoryParent, keyMemoryChild);

    console.log(`Given Memory.testing1 = false, testing:`);

    var expect_Test_01a = utilTests.expect(typeof memoryTest, 'boolean');
    console.log(`memoryTest (Memory.testing1) ${memoryTest} is typeof string (${typeof memoryTest}): ${expect_Test_01a}`);

    var expect_Test_01b = utilTests.expect(result, false);
    console.log(`result (${result}) of getOrCreateMemoryString equals 'hello': ${expect_Test_01b}`);
    
    var expect_Test_01c = utilTests.expect(memoryTest, result);
    console.log(`memoryTest (Memory.testing1: ${memoryTest}) equals result (${result}): ${expect_Test_01c}`);
    
    var expect_Test_01d = utilTests.expect(typeof result, 'boolean');
    console.log(`result of getOrCreateMemoryString is typeof string: ${expect_Test_01d}`);

    hasAllPassingTests = hasAllPassingTests && expect_Test_01a && expect_Test_01b && expect_Test_01c && expect_Test_01d;

    /* TEST 1 CLEANUP */

    delete Memory.testing1;

    return hasAllPassingTests;
  },
  test_brainTasks_createTask: function() {
    var hasAllPassingTests = true;

    console.log(``);
    console.log(`Testing brainTasks createTasks:`);

    const idTaskGlobal = brainTasks.idTaskGlobal;

    const typeTaskValid = 'deliver';
    const targetStartValid = Game.spawns['Spawn1'];

  }
};

module.exports = tests;