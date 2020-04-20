var util = require('util');

var utilTests = {
  expect: function(resultTested, resultExpected) {
    //
    var resultTestedFinal;
    var resultExpectedFinal;
    //
    var typeOfTest = typeof resultTested;
    var typeOfExpected = typeof resultExpected;
    //
    if (typeOfTest === 'function') {
      //
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
    //
    return resultTestedFinal === resultExpectedFinal;
  },
  haveAllPassed: function(arrayTestResults) {
    // //
    
    // //
    if (!Array.isArray(arrayTestResults)) return false;

    // //
    if (arrayTestResults.length === 0) return false;
    var result = arrayTestResults.reduce((acc, cur) => {
      // //
      return acc && cur});
    // //
    return result;
  },
  expectException: function(e) {
    if (e && e.constructor) return false;
    if (e.constructor.name.endsWith('Error')) return true;
    return false;
  },
  runTest: function(f, args) {
    try {
      // //
      var g;
      if (args && args.length > 0) {
        g = f.apply(f, args);
      } else {
        g = f();
      }
      // //
      return g;
    }
    catch (e) {
      return e;
    }
  },
  runTestSet: function(name, tests) {
    var hasAllPassingTests = true;
    var resultsTests = [];
    //
    //
    try {
      tests.forEach((test, index) => {
        const nameTest = test.nameTest || `test-${index}`;
        //
        //
        // //
        const result = test.expectionTest(test.functionTest);
        //
        //
        resultsTests.push(result);
      });
      
      // //
      hasAllPassingTests = this.haveAllPassed(resultsTests);
    }
    catch (e) {
      //
    }
    //
    //
    //
    return hasAllPassingTests;
  },
};
module.exports = utilTests;