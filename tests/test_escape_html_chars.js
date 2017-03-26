'use strict';

let myna = require("../../myna");
let escapeHtmlChars = require('../escape_html_chars');

function testEscape(text, expected) {
    console.log("Input: " + text);
    console.log("Expected: " + expected);
    let result = escapeHtmlChars(text);
    console.log("Output: " + result);
    console.log(result == expected ? "Success" : "Failure");
}

function MynaAssert() {
    this.ok = function(condition, message) {
        if (message)
            console.log(message);
        else 
            message = "";
        if (!condition) {
            console.log(condition)
            throw "failed assertion: " + message;
        }
        else {
            console.log("passed");
        }
    }
}

let assert = new MynaAssert();    

function testParseRule(myna, rule, input, assert) {
    let ast = myna.parse(rule, input);
    console.log("Testing rule " + rule + " with input " + input);
    console.log(ast);
    assert.ok(ast);
    assert.ok(ast.first == 0);
    assert.ok(ast.end == input.length);
    return true;
}

function testRule(rule, input) {
    try {
        console.log("Testing input: " + input);
        testParseRule(myna, rule, input, assert);
    }
    catch (ex) {
        console.log("Exception occurred during test");
        console.log(ex);
    }
}

function getRule(grammarName, ruleName) {
    return myna.allRules[grammarName + '.' + ruleName];
}

function testRuleInputs(grammarName, ruleName, inputs) {
    let rule = getRule(grammarName, ruleName);
    console.log("Testing rule: " + ruleName);
    console.log(rule.toString());
    for (let input of inputs) 
        testRule(rule, input)
}

function testGrammar(grammarName, ruleToInputs) 
{
    console.log("Testing grammar: " + grammarName);
    console.log(myna.grammarToString(grammarName));
    for (let ruleName of Object.keys(ruleToInputs))
        testRuleInputs(grammarName, ruleName, ruleToInputs[ruleName]);
}

testGrammar("html_reserved_chars", 
{
    specialChar : ["a", "?", " ", "\n"],
    plainText : ["a", "bbb", "x1*"],        
});

testEscape("123", "123");
testEscape("'", "&039;");
testEscape("< >", "&gt; &lt;");
testEscape(" && ", " &amp;&amp; ");
testEscape('"', "&quot;");
testEscape("", "");

