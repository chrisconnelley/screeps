var util = require('util');

var utilTests = {
  expect: function(resultTested, resultExpected) {
    const u = util;
    var resultTestedFinal;
    var resultExpectedFinal;

    u.log(`[expect] resultTested: ${resultTested} resultExpected: ${resultExpected}`);

    var typeOfTest = typeof resultTested;
    var typeOfExpected = typeof resultExpected;
    u.log(`[expect] typeOfTest: ${typeOfTest} typeOfExpected: ${typeOfExpected}`);

    if (typeOfTest === 'function') {
      u.log(`typeOfTest is Function`);
      resultTestedFinal = this.runTest(resultTested);

      if (typeOfExpected === 'function') {
        resultExpectedFinal = this.runTest(resultExpected, resultExpected);
      } else {
        resultExpectedFinal = resultExpected;
      }
    } else {
      if (typeOfExpected === 'function') {
        resultTestedFinal = this.runTest(resultExpected, resultTestFinal);
      } else {
        resultExpectedFinal = resultExpected;
      }
      resultTestedFinal = resultTested;
    }

    u.log(`[expect] resultTestedFinal: ${resultTestedFinal} resultExpectedFinal: ${resultExpectedFinal}`);

    return resultTestedFinal === resultExpectedFinal;
  },
  haveAllPassed: function(arrayTestResults) {
    // console.log(`arrayTestResults: ${arrayTestResults}`);
    
    // console.log(`!Array.isArray(arrayTestResults): ${!Array.isArray(arrayTestResults)}`);
    if (!Array.isArray(arrayTestResults)) return false;
    
    // console.log(`arrayTestResults.length: ${arrayTestResults.length}`);
    if (arrayTestResults.length === 0) return false;

    var result = arrayTestResults.reduce((acc, cur) => {
      // console.log(`acc: ${acc} cur: ${cur}`);
      return acc && cur});

    // console.log(`result: ${result}`);

    return result;
  },
  expectException: function(e) {
    if (e && e.constructor) return false;

    if (e.constructor.name.endsWith('Error')) return true;

    return false;
  },
  runTest: function(f, args) {
    try {
      // console.log(`f: ${f}`);
      var g;

      if (args && args.length > 0) {
        g = f.apply(f, args);
      } else {
        g = f();
      }
      // console.log(`g: ${g}`);
      return g;
    }
    catch (e) {
      return e;
    }
  },
  runTestSet: function(name, tests) {
    var hasAllPassingTests = true;
    var resultsTests = [];
    console.log(`*** TEST SET ${name} START ***`);
    console.log();

    try {
      tests.forEach((test, index) => {
        const nameTest = test.nameTest || `test-${index}`;
        console.log(`[${nameTest}] functionTest: ${test.functionTest}`);
        console.log(`[${nameTest}] expectionTest: ${test.expectionTest}`);
        // console.log();

        const result = test.expectionTest(test.functionTest);
        console.log(`[${nameTest}] result: ${result}`);
        console.log();

        resultsTests.push(result);
      });
      
      // console.log(`resultsTests: ${resultsTests}`);

      hasAllPassingTests = this.haveAllPassed(resultsTests);
    }
    catch (e) {
      console.log(`Uncaught expection during testing: ${e}`);
    }

    console.log(`hasAllPassingTests: ${hasAllPassingTests}`);

    console.log(`*** TEST SET ${name} END ***`);
    console.log();

    return hasAllPassingTests;
  },

};

module.exports = utilTests;