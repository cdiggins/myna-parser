"use strict";

// Defines a grammar for arithmetic with variables and function application
function ArithmeticGrammar(myna)  
{
    // Setup a shorthand for the Myna parsing library object
    let m = myna;    

    // These are helper rules, they do not create nodes in the parse tree.  
    this.fraction       = m.seq(".", m.digit.star);    
    this.plusOrMinus    = m.char("+-").ws;
    this.exponent       = m.seq(m.char("eE"), this.plusOrMinus.opt, m.digit.plus); 
    this.comma          = m.text(",").ws;  

    // The following rules create nodes in the abstract syntax tree 
    
    // Using a lazy evaluation rule to allow recursive rule definitions  
    let _this = this; 
    this.expr = m.delay(function() { return _this.sum; });

    this.variable   = m.identifier.ast;
    this.number     = m.seq(m.integer, this.fraction.opt, this.exponent.opt).ast;    
    this.parenExpr  = m.parenthesized(this.expr.ws).ast;
    this.args       = m.parenthesized(this.expr.ws.delimited(this.comma)).ast;
    this.leafExpr   = m.choice(this.number.ws, m.seq(this.parenExpr.or(this.variable).ws, this.args.ws.opt)).ast;
    this.prefixExpr = m.seq(this.plusOrMinus.opt, this.leafExpr).ast;
    this.mulExpr    = m.seq(m.char("*/").ws, this.prefixExpr).ast;
    this.product    = m.seq(this.prefixExpr.ws, this.mulExpr.star).ast; 
    this.addExpr    = m.seq(m.char("+-").ws, this.product).ast;
    this.sum        = m.seq(this.product, this.addExpr.star).ast;

    // Finalize the grammar and make it available to all users of the Myna module 
    m.registerGrammar("arithmetic", this);    
};

// Export the function for use with Node.js
if (typeof module === "object" && module.exports) 
    module.exports = ArithmeticGrammar;