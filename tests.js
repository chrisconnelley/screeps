var map = require('map');
var utilTests = require('util.tests');
const brainTasks = require('brain.tasks');

var tests = {
  test_runTest: function() {
    const name = `runTest`;

    const tests = [
      {
        'functionTest': () => utilTests.runTest(() => true),
        'expectionTest': (resultTest) => utilTests.expect(resultTest, true)
      },
      {
        'functionTest': () => utilTests.runTest(() => false),
        'expectionTest': (resultTest) => utilTests.expect(resultTest, false)
      },
      {
        'functionTest': () => utilTests.runTest((a, b) => a+b, [4,9]),
        'expectionTest': (resultTest) => utilTests.expect(resultTest, 13)
      }
    ];

    return utilTests.runTestSet(name, tests);
  },
  test_expect: function() {
    const name = `expect`;

    const tests = [
      {
        'functionTest': () => utilTests.expect(true, false),
        'expectionTest': (resultTest) => resultTest() === false
      },
      {
        'functionTest': () => utilTests.expect(false, false),
        'expectionTest': (resultTest) => resultTest() === true
      },
      {
        'functionTest': () => utilTests.expect(false, true),
        'expectionTest': (resultTest) => resultTest() === false
      },
      {
        'functionTest': () => utilTests.expect(true, true),
        'expectionTest': (resultTest) => resultTest() === true
      },
      {
        'functionTest': () => utilTests.expect(() => true, true),
        'expectionTest': (resultTest) => resultTest() === true
      }
    ];

    return utilTests.runTestSet(name, tests);
  },
  test_haveAllPassed: function() {
    const name = `haveAllPassed`;

    const tests = [
      {
        'functionTest': () => utilTests.haveAllPassed([true, true, true, true]),
        'expectionTest': (resultTest) => resultTest() === true
      },
      {
        'functionTest': () => utilTests.haveAllPassed([true, false, true, true]),
        'expectionTest': (resultTest) => resultTest() === false
      },
      {
        'functionTest': () => utilTests.haveAllPassed([false, false, false, false]),
        'expectionTest': (resultTest) => resultTest() === false
      },
    ];

    return utilTests.runTestSet(name, tests);
  },
  // test_expectException: function() {
  //   console.log(`[test_expectException] Start`);
  //   var hasAllPassingTests = true;

  //   const test_01 = () => utilTests.haveAllPassed('bob');

  //   var expect_test_01 = utilTests.expectNew()
  //   console.log(`[test_expect] utilTests.test_expectException(test_01(): ${expect_test_01}`);


  //   console.log(`[test_expectException] End`);
  //   console.log(``);
    
  //   return hasAllPassingTests;
  // },
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
    const name = `test_brainTasks_createTask`;

    const tests = [
      {
        'functionTest': () => utilTests.haveAllPassed([true, true, true, true]),
        'expectionTest': (resultTest) => resultTest() === true
      },
      {
        'functionTest': () => utilTests.haveAllPassed([true, false, true, true]),
        'expectionTest': (resultTest) => resultTest() === false
      },
      {
        'functionTest': () => utilTests.haveAllPassed([false, false, false, false]),
        'expectionTest': (resultTest) => resultTest() === false
      },
    ];

    return utilTests.runTestSet(name, tests);
    
    
    var hasAllPassingTests = true;

    console.log(``);
    console.log(`Testing brainTasks createTasks:`);

    const typeTaskValid = 'deliver';
    const targetStartValid = Game.spawns['Spawn1'];

    const targetStartInvalid = '';

    const idTaskValid = brainTasks.createTask(typeTaskValid, targetStartValid, targetStartEnd, quantity, nameCreepAssigned);

    var expect_test_01a = utilTests.expect(typeof idTaskValid, 'string');


    hasAllPassingTests = utilTests.haveAllPassed([expect_test_01a]);
    return hasAllPassingTests;
  }
};

module.exports = tests;