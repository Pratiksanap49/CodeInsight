import vm from 'vm';

/**
 * Runs student code against a list of test cases.
 * @param {string} code - The student's submitted code
 * @param {string[]} tests - Array of test case strings (e.g., "assert(sum([1,2]) === 3)")
 * @returns {Promise<{syntax: string[], runtime: string[], testFailures: {test: string, error: string}[]}>}
 */
export async function runTests(code, tests) {
    const result = {
        syntax: [],
        runtime: [],
        testFailures: [],
        passed: false
    };

    // context with safe globals
    const sandbox = {
        console: { log: () => { } }, // Mute console
        assert: (condition, message) => {
            if (!condition) {
                throw new Error(message || "Assertion failed");
            }
        },
        // deepEqual helper for array/object comparisons
        expect: (actual) => ({
            toBe: (expected) => {
                if (actual !== expected) throw new Error(`Expected ${expected}, received ${actual}`);
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
                }
            }
        })
    };

    vm.createContext(sandbox);

    // 1. Execute User Code
    try {
        // Timeout 1s to prevent infinite loops
        vm.runInContext(code, sandbox, { timeout: 1000 });
    } catch (err) {
        if (err.name === 'SyntaxError') {
            result.syntax.push(err.message);
        } else {
            result.runtime.push(err.message);
        }
        // If runtime error, we can't really run tests
        return result;
    }

    // 2. Run Tests
    for (const testCode of tests) {
        try {
            vm.runInContext(testCode, sandbox, { timeout: 500 });
        } catch (err) {
            result.testFailures.push({
                test: testCode,
                error: err.message
            });
        }
    }

    result.passed = result.syntax.length === 0 &&
        result.runtime.length === 0 &&
        result.testFailures.length === 0;

    return result;
}
