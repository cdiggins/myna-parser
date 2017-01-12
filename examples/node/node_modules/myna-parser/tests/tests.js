"use strict";

function testParse(myna, rule, text, shouldFail)  {    
    if (shouldFail == undefined) shouldFail = false;
    let result = myna.failed;
    let err = undefined;    
    try {        
        result = myna.parse(rule, text).end;
    }
    catch (e) {
        err = e;
    }

    return {
        name : rule.name + ": " + text,
        description : result + "/" + text.length,
        negative : shouldFail,
        success : (result == text.length) ^ shouldFail,
        error : err,
        ruleDescr : rule.type + ": " + rule.toString(),
        rule : rule        
    };
}

function testRule(myna, rule, passStrings, failStrings) 
{
    if (failStrings == undefined) failStrings = [];
    let passResults = passStrings.map(
        function (tkn) { 
            return testParse(myna, rule, tkn, false); 
        });
    let failResults = failStrings.map(
        function (tkn) { 
            return testParse(myna, rule, tkn, true); 
        });  
    return { 
        name: "Testing rule " + rule.toString(),
        results : [].concat(passResults, failResults)
    }; 
}

function simpleParserTests() {
    let input = "abc 123 def 456 ghi 789";
}

function oddNumberOfXGrammar() {
    let x = function() { return choice(seq("x", delay(x), "x"), "x"); }
    return x();
}

function commonGrammarTests(m) {
    return [
        [m.letterLower, ['a', 'm', 'z'], ['A', '?', '0', ' ']],
        [m.letterUpper, ['A', 'M', 'Z'], ['a', '?', '0', ' ']],
        [m.letter, ['b', 'B'], ['?', '9', ' ', 'aa']],
        [m.digit, ['0', '5', '9'], ['a', 'Z', '?', ' ']],
        [m.digitNonZero, ['1', '5', '9'], ['0', 'a', 'Z', '?', ' ']],
        [m.integer, ['0', '123', '1000000'], ['01', '12.34', '1a', 'x0']],
        [m.hexDigit, ['0', '8', 'a', 'f', 'c', 'A', 'F', 'C'], ['X', '?', '', '34']],
        [m.binaryDigit, ['0', '1'], ['?', '5', '', '00']],
        [m.octalDigit, ['0', '7', '1'], ['X', '?', '', '34', '8', 'a', '00']],
        [m.alphaNumeric, ['A', 'm', '0', '4'], ['?', '/t', 'ab00', '   ']],
        [m.underscore, ['_'], ['__', '', 'a', '9']],
        [m.identifierFirst, ['A', 'm', '_'], ['0', '4', '?', ' ', '', '/t', 'ab00', '   ']],
        [m.identifierNext, ['A', 'm', '_', '0', '4'], ['?', ' ', '', '/t', 'ab00', '   ']],
        [m.identifier, ['abc', '_', '_ab01', 'A1', '_b_c_0_'], ['', '0abc', 'ab_ cd', ' ', '\t']],
        [m.hyphen, ['-'], ['?', '', '']],
        [m.crlf, ['\r\n'], ['\r', '\n', '', ' \r\n', '\\r\\n', '\rn']],
        [m.newLine, ['\r\n', '\n'], ['\n\r', '\r', ' \r\n']],
        [m.space, [' '], ['', '\t', '  ']],
        [m.tab, ['\t'], ['', '\n', '\r', '\rn', ' \t ']],
        [m.ws, ['', '\t','\r','\n', ' ', '  ', ' \t\r\n \t\r\n'], ['a', ' a ']]
        ];
}

function coreTests(m) {
    return [
        [m.truePredicate, [""], ["a"]],
        [m.falsePredicate, [], ["", "a"]],
        [m.end, [""], ["a", " a", "a "]],
        [m.seq(m.notEnd, m.all), ["a", " ", "jhasd kajshd"], [""]],
        [m.advance, ["a", "Z", "9", "."], ["", " a"]],
        [m.char("ab").star, ["", "a", "aabbaa"], ["c", "abc"]],
        [m.text("ab"), ["ab"], ["abc"]],
        [m.all, ["", "ab", "bacasdasd"], []],
        [m.not("ab"), [""], ["ab", "aab", "bc"]],
        [m.seq(m.not("ab"), "bc"), ["bc"], ["", "aab", "ab"]],
        [m.seq(m.not("ab"), m.all), ["ba", "aab", ""], ["ab"]],
        [m.star("a"), ["", "a","aa", "aaa"], ["b", "aab"]],
        [m.plus("a"), ["a","aa", "aaa"], ["", "b", "aab"]],
        [m.star("ab"), ["","ab","ababab"], ["aab", "b"]],
        [m.bounded("ab", 1, 2), ["ab", "abab"], ["", "ababab"]],
        [m.repeat("a", 3), ["aaa"], ["aa", "aaaa"]],
        [m.opt("ab"), ["", "ab"], ["abc"]],
        [m.seq(m.opt("a"), "b"), ["b", "ab"], ["a", "bb", "aab", "abb"]],
        [m.at("ab"), [], ["ab"]],
        [m.except("a", m.advance), ["b", "c"], ["", "a"]],
        [m.seq("a", "b"), ["ab"], ["abb", "", "aab", "ba"]],
        [m.choice("a", "b"), ["a", "b"], ["ab", "", "c", "ba"]],
        [m.seq(m.plus("a"), m.plus("b")), ["aab", "ab", "abb", "aaabb"], ["", "aa", "ba", "bb"]],
        [m.charExcept("a"), ["b","c"], ["a", ""]],
        [m.seq(m.repeatWhileNot("a", "b"), "b"), ["aaab", "b"], ["abb", "bb"]],
        [m.repeatUntilPast("a", "b"), ["aaab", "b"], ["abb", "bb"]],
        [m.seq(m.advanceWhileNot("z"), "z"), ["aaaaz", "z", "abcz"], ["za", "abc", ""]],
        [m.err("testing error"), [], ["", "a", "abc"]],
        [m.log("testing log"), [""], ["a", "abc"]],
        [m.assert("a"), ["a"], ["b"]],
        [m.seq(m.assert(m.not("b")), "a"), ["a"], ["b"]],
        [m.seq("a", m.assert(m.end)), ["a"], ["", "ab", "b"]],
        [m.seq("a", m.not("b")), ["a"], ["ab", "b", ""]],
        [m.seq(m.seq("a", m.not("b"), m.opt("c"))), ["a", "ac"], ["ab", "b", "ac "]],
        [m.seq("a", m.not("b"), m.choice("b", "c")), ["ac"], ["ab", "a", ""]],
        [m.keyword("abc"), ["abc"], ["ab", "abcd", "ABC", "abc "]],
        [m.parenthesized("a"), ["(a)"], ["()", "a", "", "(a", "a)", "()a", "a()"]],
        [m.guardedSeq("(", "a", ")"), ["(a)"], ["()", "a", "", "(a", "a)", "()a", "a()"]],
        [m.braced("a"), ["{a}"], ["{}", "a", "", "{a", "a}", "{}a", "a{}"]],
        [m.bracketed("a"), ["[a]"], ["[]", "a", "", "[a", "a]", "[]a", "a[]"]],
        [m.doubleQuoted("a"), ['"a"'], ['""', "a", "", '"a', 'a"', '""a', 'a""']],
        [m.singleQuoted("a"), ["'a'"], ["''", "a", "", "'a", "a'", "''a", "a''"]],
        [m.tagged("a"), ["<a>"], ["<>", "<", "", "<a", "a>", "<>a", "a<>"]],
        [m.delimited("a", ","), ["", "a", "a,a", "a,a,a"], ["a,", ",a", ",", "aa", "aa,aa"]],
    ];
}

function csvTests(m) {
    let cg = m.grammars.csv;
    let records = [
            'Stock Name,Country of Listing,Ticker,Margin Rate,Go Short?,Limited Risk Premium',
            '"Bankrate, Inc.",USA,RATE.O,25%,No,0.30%',
            '2 Ergo Group Plc,UK,RGO.L,25%,Yes,1.00%'
            ];
    let file = records.join("\n");        
    return [
        [cg.textdata, ['a', '?', ' ', ';', '\t', '9', '.'], [',', '\n', '\r', '"']],
        [cg.quoted, ['"abc"', '""', '"\n\r,"', '" "" "'], ['abc', "'abc'"]],
        [cg.field, ['Stock Name', '"Bankrate, Inc."', '0.30%', '', '"a""b"', 'a"b,c"d', '', 'Aa', 'a a', '.', ' 3.4 ', " 'abc'def "], ['"', 'abc,', ',', ',abc', 'ab,cd']],
        [cg.record, records, []],
        [cg.file, [file], []],
    ];
}

function jsonTests(m) {
    let jg = m.grammars.json;
    return [
        // JsonGrammar tests*
        [jg.bool, ["true", "false"], ["TRUE", "0", "fal"]],
        [jg.null, ["null"], ["", "NULL", "nul"]],
        [jg.number,  [ '0', '100', '123.456', '0.34e-42', '-43', '+43', '43', "+100", "-0"], ["abc", "1+2", "e+2", "01", "-"]],
        [jg.string, ['""', '"a"', '"\t"', '"\\t"','"\\""', '"\\\\"',  '\"AB cd\"'], ['"', '"ab', 'abc', 'ab"', '"ab""', '"\\"'  ]],
        [jg.array, ['[]', '[ 1 ]','[1,2, 3]', '[true,"4.3", 1.23e4]', '[[],[], []]'], ['[', ']', '[1],2', '3,4','','[1,2,]']],
        [jg.object, [
            '{}', 
            '{  \t\n }', 
            '{"a":1}', 
            '{"a":1,"b":2}', 
            '{ "" : 42}', 
            '{"":""}',
            '{"a":{}}', 
            '{"b":[1,2, 3,"",4.5]}',
            '{"}":"{"}', 
            '{"c":3.14}', 
            '{"d": "hello world" }', 
            '{"a":{"nested " : [1, 2, 3.14]}}',
            '{"a":1, "BCD": 3.14, "":"", "d":{}}',
            '{"BCD": 3.14, "":"", "d":{}}',
            '{"BCD": 3.14 }',
            '{"BCD": 3.14, "":""}',
            '{"BCD": 3.14,"":""}',
            '{"":"", "BCD": 3.14}',
            '{"a":1, "BCD": 3.14, "":"", "d":{"nested " : [1, 2, 3.14]}}',
            ],
             ['', '{}{', '}', '{{}}', '{\'a\':12}', '{"a:32}', '{"a":1,}']],
    ];
}

function arithmeticTests(m) {
    let ag = m.grammars.arithmetic;
    return [
        [ag.number,     ['0', '100', '421', '123.456', '0.0123e-456'], ["", "abc", "1+2", "e+2", "01", "-"]],
        [ag.variable,   ['a', 'X', 'bc_0123'], ['', '1a', '1+2', 'e+2']],
        [ag.parenExpr,  ['(1)', '(1+2)', '((1))', '((1)+(2))'], ['', '?', ' ']],
        [ag.args,       ['()', '(1)', '(1,2,3)'], ['', '?', ' ', '1', 'x']],
        [ag.leafExpr,   ['123', 'x0', '(2+3)', 'x(1,2)', 'sqrt(-9.9)'], ['', '?', ' ']],
        [ag.prefixExpr, ['+34', '-x', '+(-(4))'], ['', '?', ' ']],
        [ag.mulExpr,    ['* 42', '/\tx', '* -3'], ['', '?', ' ']],
        [ag.product,    ['1', '1*2', '1 * 2 * 3', '42 * (9 + 3)'], ['42 * 9 + 3', '', '?', ' ']],
        [ag.addExpr,    ['+x', '- 43'], ['', '?', ' ']],
        [ag.sum,        ['1', '1+2', '1 + 2 + 3', '42 * 9 + 3'], ['', '?', ' ']],
        [ag.expr,       ['(1+(2.3 * 42) / f(19))'], ['', '?', ' ']]         
    ];
}

function runTests(m, inputs) {
    return inputs.map(
        function (input) { 
            return testRule(m, input[0], input[1], input[2]); 
        }); 
}

function tests(myna, grammarConstructors) {
    // Construct a grammar from each Grammar constructor
    for (let grammarFxn of grammarConstructors)
        new grammarFxn(myna);

    // Get all the tests and concatenate them together 
    let tests = [].concat(
        commonGrammarTests(myna),
        coreTests(myna),    
        jsonTests(myna),
        csvTests(myna),
        arithmeticTests(myna));
   
    // Validate tests 
    for (let t of tests) 
        if (t.length != 3 || t[0] === undefined) 
            throw new Exception("Each test must have a rule, an array of passing strings, and an array of failing strings");            
    
    return runTests(myna, tests);
}

// Export the function for use use with Node.js
if (typeof module === "object" && module.exports) 
    module.exports = tests;