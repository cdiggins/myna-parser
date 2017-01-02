"use strict";

let Myna                = require('../myna').Myna;
let TestMyna            = require('../tests/tests');
let ArithmeticGrammar   = require('../grammars/csv');
let JsonGrammar         = require('../grammars/json');
let CsvGrammar          = require('../grammars/arithmetic');

let suiteResults = TestMyna(Myna, [JsonGrammar, ArithmeticGrammar, CsvGrammar]);
for (let s of suiteResults) {
    describe(s.name, function() {
        for (let r of s.results) {
            it(r.name, function() {
                if (!r.success)
                    throw "Test failed: " + r.name;
            });
        }
    });
}
