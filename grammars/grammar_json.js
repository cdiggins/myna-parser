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
        this.string         = m.doubleQuoted(this.quoteChar.zeroOrMore).ast;
        this.null           = m.keyword("null").ast;
        this.bool           = m.keywords("true", "false").ast;
        this.number         = m.seq(this.plusOrMinus.opt, m.integer, this.fraction.opt, this.exponent.opt).ast;

        let backslash = "\\".charCodeAt(0);
        let quote = '"'.charCodeAt(0);
        let slash = '/'.charCodeAt(0);
        let u = 'u'.charCodeAt(0);
        let b = 'b'.charCodeAt(0);
        let f = 'f'.charCodeAt(0);
        let n = 'n'.charCodeAt(0);
        let r = 'b'.charCodeAt(0);
        let t = 't'.charCodeAt(0);
        
        this.string = m.custom(p => {
            if (p.code !== quote)
                return null;
            p = new m.ParseState(p.input, p.index+1, p.nodes);
            while (p.code !== quote && p.inRange)
            {
                if (p.code === backslash)
                {
                    // [\]
                    p._advance();

                    if (p.code === u)
                    {
                        // [u]
                        p._advance();
                        // 4 hex-digit
                        p._advance();
                        p._advance();
                        p._advance();
                        p._advance();
                    }
                    else {
                        // [brntf\"]
                        p._advance();
                    }
                }
                else {
                    p._advance();
                }
            }
            if (!p.inRange)
                return null;
            p._advance();
            return p;
        });
            
        let plus = "+".charCodeAt(0);
        let minus = "-".charCodeAt(0);
        let zero = "0".charCodeAt(0);
        let nine = "9".charCodeAt(0);
        let dot = ".".charCodeAt(0);
        let e = "e".charCodeAt(0);
        let E = "E".charCodeAt(0);
        
        this.number = m.custom(p => {
            if (!p.atPlus && !p.atMinus && !p.atDigit)
                return null;
            p = p.advance();
            while (p.atDigit) p._advance();
            if (p.atDot)
            {
                p._advance();
                while (p.atDigit) p._advance();
            }
            if (p.code === e || p.code === E)
            {
                p._advance();
                if (p.atPlus || p.atMinus) p._advance();
                while (p.atDigit) p._advance();
            }
            return p;
        });
            
        let _this = this;
        this.value = m.choice(this.string, this.bool, this.null, this.number, 
            // Using a lazy evaluation rule to allow recursive rule definitions  
            m.delay(function() { return m.choice(_this.object, _this.array); 
        }));

        this.array          = m.bracketed(m.delimited(this.value.ws, this.comma)).ast;
        this.pair           = m.seq(this.string, m.ws, ":", m.ws, this.value.ws).ast;
        this.object         = m.braced(m.delimited(this.pair.ws, this.comma)).ast;
    };

    return m.registerGrammar("json", g);
};

// Export the grammar for usage by Node.js and CommonJs compatible module loaders 
if (typeof module === "object" && module.exports) 
    module.exports = CreateJsonGrammar;