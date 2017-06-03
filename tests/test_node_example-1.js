// Load the Myna module and all grammars
var m = require('myna-parser');

// Load the JSON grammar/parser
require('myna-parser/grammars/grammar_json')(m);

// Get the JSON parser 
var parser = m.parsers.json; 

// Define some input 
var input = '{ "integer":42, "greeting":"hello", "truth":false, "array":[1,2,3] }';

// Get a parse-tree 
var ast = parser(input);

// Print the parse tree 
console.log("\nAbstract Syntax Tree\n")
console.log(ast.toString());

// Print the Parsing Expression Grammar 
console.log("\nJSON Grammar in PEG Form\n")
console.log(m.grammarToString('json'));
