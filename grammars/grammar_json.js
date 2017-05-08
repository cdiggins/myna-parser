"use strict";

// Implements a JSON (JavaScript Object Notation) grammar using the Myna parsing library
// See http://www.json.org
function CreateJsonGrammar(myna)  
{
    // Setup a shorthand for the Myna parsing library object
    let m = myna;    

    let g = new function() 
    {
        // These are helper rules, they do not create nodes in the parse tree.  
        this.escapedChar    = m.seq('\\', m.char('\\/bfnrt"'));
        this.escapedUnicode = m.seq('\\u', m.hexDigit.repeat(4));
        this.quoteChar      = m.choice(this.escapedChar, this.escapedUnicode, m.charExcept('"'));
        this.fraction       = m.seq(".", m.digit.zeroOrMore);    
        this.plusOrMinus    = m.char("+-");
        this.exponent       = m.seq(m.char("eE"), this.plusOrMinus.opt, m.digits); 
        this.comma          = m.text(",").ws;  

        // The following rules create nodes in the abstract syntax tree 
        
        // Using a lazy evaluation rule to allow recursive rule definitions  
        let _this = this; 
        this.value = m.delay(function() { 
            return m.choice(_this.string, _this.number, _this.object, _this.array, _this.bool, _this.null); 
            /* TODO: DID NOT SPEED ANYTHING UP!! 
            return new m.Lookup(
                {
                    '"':_this.string, 
                    '[':_this.array,
                    '{':_this.object,
                    't':_this.bool,
                    'f':_this.bool,
                    'n':_this.null,
                    '+':_this.number,
                    '-':_this.number,
                    '0':_this.number,
                    '1':_this.number,
                    '2':_this.number,
                    '3':_this.number,
                    '4':_this.number,
                    '5':_this.number,
                    '6':_this.number,
                    '7':_this.number,
                    '8':_this.number,
                    '9':_this.number
                }, m.falsePredicate);
                */
        }).ast;

        this.string         = m.doubleQuoted(this.quoteChar.zeroOrMore).ast;
        this.null           = m.keyword("null").ast;
        this.bool           = m.keywords("true", "false").ast;
        this.number         = m.seq(this.plusOrMinus.opt, m.integer, this.fraction.opt, this.exponent.opt).ast;
        this.array          = m.bracketed(m.delimited(this.value.ws, this.comma)).ast;
        this.pair           = m.seq(this.string, m.ws, ":", m.ws, this.value.ws).ast;
        this.object         = m.braced(m.delimited(this.pair.ws, this.comma)).ast;
    };

    return m.registerGrammar("json", g);
};

// Export the grammar for usage by Node.js and CommonJs compatible module loaders 
if (typeof module === "object" && module.exports) 
    module.exports = CreateJsonGrammar;