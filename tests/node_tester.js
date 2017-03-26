// TODO: 
// This will be the tester used for Node.js

/*
    // Create a test runner if needed 
    if (!testRunner) 
    {
        // Used to create a default test runner in the absence of QUnit
        function CreateTestRunner() {
            let defaultAssert = new function() {
                this.ok = function(result, name) {
                    if (!result)
                        throw new Error("Test failed: " + name);
                }
            }
            
            // The test function 
            return function(name, testFn) {
                console.log("Running test: " + name);
                try {
                    testFn(defaultAssert);
                    console.log("Test passed");
                }
                catch (e) {
                    console.log("Test failed");
                    console.log(e);
                }
            }
        }

        testRunner = CreateTestRunner();
    }

*/