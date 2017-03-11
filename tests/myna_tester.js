"use strict";

// This class contains various helper functions for testing Myna grammars 
// TODO: generate a report for which grammar productions are tested
function MynaTester(myna)
{    
    this.myna = myna; 

    // Tests parsing an individual rule against the input input text, and returns an object 
    // representing the result of running the test 
    this.testParse = function(rule, text, shouldPass)  {    
        if (shouldPass == undefined) shouldPass = true;
        let result = myna.failed;
        let err = undefined;    
        try {        
            result = myna.parse(rule, text).end;
        }
        catch (e) {
            err = e;
        }

        return {
            name : rule.toString() + ": " + text,
            description : result + "/" + text.length,
            negative : !shouldPass,
            success : (result == text.length) ^ !shouldPass,
            error : err,
            ruleDescr : rule.type + ": " + rule.toString(),
            rule : rule        
        };
    }

    // Tests parsing an individual rule against using an array of inputs string that should pass
    // and an array of inputs strings that should fail. 
    this.testRule = function(rule, passStrings, failStrings) {
        let _this = this;
        if (failStrings == undefined) failStrings = [];
        let passResults = passStrings.map(
            function (tkn) { 
                return _this.testParse(rule, tkn, true); 
            });
        let failResults = failStrings.map(
            function (tkn) { 
                return _this.testParse(rule, tkn, false); 
            });  
        return { 
            name: "Testing rule: " + rule.toString(),
            results : [].concat(passResults, failResults)
        }; 
    }

    // Returns an array of test results, where each input is:
    // 0: a rule
    // 1: an array of passing strings
    // 2: an array of failing strings 
    this.testRules = function(inputs) {
        for (let t of inputs) 
            if (t.length != 3 || t[0] === undefined) 
                throw "Each test must have a rule, an array of passing strings, and an array of failing strings";            

        let _this = this;        
        return inputs.map(
            function (input) { 
                return _this.testRule(input[0], input[1], input[2]); 
            }); 
    }

    // Tests an evaluator, a rule, an input, and an expected output.
    // An evaluator is a function that given an AST returns a result 
    this.testExpr = function(rule, evaluator, input, expected) {
        let err = undefined;
        try {
            let ast = myna.parse(rule, input);
            if (ast == null) 
                throw "Parse failed: no AST created";
            if (ast.end != input.length)
                throw "Failed to parse whole input " + ast.contents;
            ast = ast.children[0];
            let val = evaluator(ast);
            if (val !== expected) 
                throw "Value was " + val + " but expected " + expected;
        }
        catch (e) {
            err = e;
        }
        return {
            name : input + " === " + expected,
            description : "",
            negative : false,
            success : err === undefined, 
            error : err,
        };
    }

    // Given a named grammar, tests it.  
    this.testGrammar = function(g) {
        let rules = myna.grammarRules(g);
        if (rules.length == 0)
            throw "grammar has no rules " + grammarName;

        // TODO: add more grammar tests. 
        console.log(myna.grammarToString(g));
    }

    // Given an array of grammar constructors, creates them and registers them 
    this.testGrammars = function(grammarCtors)
    {
        for (let ctor of grammarCtors)
            myna.registerGrammar(ctor);
    }        
}