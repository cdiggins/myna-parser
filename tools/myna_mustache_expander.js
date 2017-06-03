// Exposes a function for expanding mustache and CTemplate style templates.
// http://mustache.github.io/mustache.5.html

'use strict';

// Load the Myna module 
let myna = require('../myna');

// Create the template grammar and give it Myna
let grammar = require('../grammars/grammar_template')(myna);

// Escape HTML characters into their special representations
let escapeHtmlChars = require('../tools/myna_escape_html_chars');

// Get the document parsing rules  
let templateRule = grammar.document;

// Given an AST node, a data object, and an optional array of string, converts the nodes 
// expanding the reserved characters. 
function expandAst(ast, data, lines) {
    if (lines == undefined)
        lines = [];
    
    // If there is a child "key" get the value associated with it. 
    let keyNode = ast.child("key");
    let key = keyNode ? keyNode.allText : "";
    let val = data ? (key in data ? data[key] : "") : "";

    // Functions are not supported
    if (typeof(val) == 'function')
        throw new Exception('Functions are not supported');

    switch (ast.rule.name) 
    {
        case "document":
        case "sectionContent":
            ast.children.forEach(function(c) { 
                expandAst(c, data, lines); });
            return lines;

        case "comment":
            return lines;

        case "plainText":
            lines.push(ast.allText);
            return lines;

        case "section":        
            let content = ast.child("sectionContent");
            if (typeof val === "boolean" || typeof val === "number" || typeof val === "string") {
                if (val) 
                    expandAst(content, data, lines);
            }
            else if (val instanceof Array) {
                for (let x of val)
                    expandAst(content, x, lines);
            }                
            else {
                expandAst(content, val, lines);
            }
            return lines;

        case "invertedSection":
            if (!val || ((val instanceof Array) && val.length == 0))
                expandAst(ast.child("sectionContent"), data, lines);
            return lines;

        case "escapedVar":
            if (val) 
                lines.push(escapeHtmlChars(String(val)));
            return lines;
        
        case "unescapedVar":
            if (val) 
                lines.push(String(val));
            return lines;
    }
            
    throw "Unrecognized AST node " + ast.rule.name;
}

function expand(template, data) {
    let ast = myna.parsers.template(template);
    let lines = expandAst(ast, data);
    return lines.join("");
}

// Export the function for use with Node.js
if (typeof module === "object" && module.exports) 
    module.exports = expand;