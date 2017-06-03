// Reference the Myna module
var m = require('myna-parser');

// Construct a grammar object 
var g = new function() 
{
    var delimiter = ",";
    this.textdata   = m.notChar('\n\r"' + delimiter);    
    this.quoted     = m.doubleQuoted(m.notChar('"').or('""').zeroOrMore);
    this.field      = this.textdata.or(this.quoted).zeroOrMore.ast;
    this.record     = this.field.delimited(delimiter).ast;
    this.file       = this.record.delimited(m.newLine).ast;   
}

// Let consumers of the Myna module access 
m.registerGrammar("csv", g, g.file);

// Get the parser 
var parser = m.parsers.csv; 

// Parse some input and print the AST
var input = 'a,1,"hello"\nb,2,"good bye"';
var ast = parser(input);
console.log(ast.toString());
