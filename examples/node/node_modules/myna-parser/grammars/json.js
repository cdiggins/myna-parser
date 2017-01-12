"use strict";

// Implements a JSON (JavaScript Object Notation) grammar using the Myna parsing library
// See http://www.json.org
function JsonGrammar(myna)  
{
    // Setup a shorthand for the Myna parsing library object
    let m = myna;    

    // These are helper rules, they do not create nodes in the parse tree.  
    this.escapedChar    = m.seq('\\', m.char('\\/bfnrt"'));
    this.escapedUnicode = m.seq('\\u', m.hexDigit.repeat(4));        
    this.quoteChar      = m.choice(this.escapedChar, this.escapedUnicode, m.charExcept('"'));
    this.fraction       = m.seq(".", m.digit.star);    
    this.plusOrMinus    = m.char("+-");
    this.exponent       = m.seq(m.char("eE"), this.plusOrMinus.opt, m.digit.plus); 
    this.comma          = m.text(",").ws;  

    // The following rules create nodes in the abstract syntax tree 
    
    // Using a lazy evaluation rule to allow recursive rule definitions  
    let _this = this; 
    this.value = m.delay(function() { 
        return m.choice(_this.string, _this.number, _this.object, _this.array, _this.bool, _this.null); 
    }).ast;

    this.string         = m.doubleQuoted(this.quoteChar.star).ast;
    this.null           = m.keyword("null").ast;
    this.bool           = m.keywords("true", "false").ast;
    this.number         = m.seq(this.plusOrMinus.opt, m.integer, this.fraction.opt, this.exponent.opt).ast;
    this.array          = m.bracketed(m.delimited(this.value.ws, this.comma)).ast;
    this.pair           = m.seq(this.string, m.ws, ":", m.ws, this.value.ws).ast;
    this.object         = m.braced(m.delimited(this.pair.ws, this.comma)).ast;

    // Finalize the grammar and make it available to all users of the Myna module 
    m.registerGrammar("json", this);    
};

// Export the function for use use with Node.js
if (typeof module === "object" && module.exports) 
    module.exports = JsonGrammar;