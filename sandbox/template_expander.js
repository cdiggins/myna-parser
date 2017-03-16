'use strict';

// Load the Myna module 
let myna = require('../myna.js');

// Add the template grammar to Myna
let templateCtor = require('../grammars/template');
myna.registerGrammar("template", templateCtor);

// Get the parsing rules  
let templateRule = myna.allRules["template.document"];

function expandAst(ast, data, lines) {
    if (lines == undefined)
        lines = [];
    
    // If there is a child "key" get the value associated with it. 
    let key = ast.getChild("key");
    let val = data[key];

    // TODO: if val is callable do something special.
    // TODO: support "." look-up.

    switch (ast.rule.name) 
    {
        case "document":
            ast.children.foreach(function(c) { 
                expandAst(c, data, lines); });
            return lines;

        case "comment":
            return lines;

        case "plainText":
            lines.push(ast.allText);
            return lines;

        case "section":
            for (let x in val)
                expandAst(ast, x, lines);
            return lines;

        case "invertedSection":
            for (let x in val)
                expandAst(ast, x, lines);
            return lines;

        case "escapedVar":
            if (val) 
                lines.push(escapeHtmlChars(val));
            return lines;
        
        case "unescapedVar":
            if (val) 
                lines.push(val);
            return lines;
    }
            
    throw "Unrecognized AST node " + ast.rule.name;
}

function expand(template, data) {
    let lines = expandAst(myna.parse(template));
    return lines.join("");
}

// Export the function for use with Node.js
if (typeof module === "object" && module.exports) 
    module.exports = expand;