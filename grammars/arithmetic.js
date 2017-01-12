"use strict";

// Defines a grammar for basic arithmetic 
function ArithmeticGrammar(myna)  
{
    // Setup a shorthand for the Myna parsing library object
    let m = myna;    

    // These are helper rules, they do not create nodes in the parse tree.  
    this.fraction       = m.seq(".", m.digit.star);    
    this.plusOrMinus    = m.char("+-");
    this.exponent       = m.seq(m.char("eE"), this.plusOrMinus.opt, m.digit.plus); 
    this.comma          = m.text(",").ws;  
    
    // Using a lazy evaluation rule to allow recursive rule definitions  
    let _this = this; 
    this.expr = m.delay(function() { return _this.sum; });

    // The following rules create nodes in the abstract syntax tree 
    this.number     = m.seq(m.integer, this.fraction.opt, this.exponent.opt).ast;    
    this.parenExpr  = m.parenthesized(this.expr.ws).ast;
    this.leafExpr   = m.choice(this.parenExpr, this.number.ws);
    this.prefixOp   = this.plusOrMinus.ast;
    this.prefixExpr = m.seq(this.prefixOp.ws.star, this.leafExpr).ast;
    this.divExpr    = m.seq(m.char("/").ws, this.prefixExpr).ast;
    this.mulExpr    = m.seq(m.char("*").ws, this.prefixExpr).ast;
    this.product    = m.seq(this.prefixExpr.ws, this.mulExpr.or(this.divExpr).star).ast;
    this.subExpr    = m.seq(m.char("-").ws, this.product).ast;
    this.addExpr    = m.seq(m.char("+").ws, this.product).ast;
    this.sum        = m.seq(this.product, this.addExpr.or(this.subExpr).star).ast;
    this.start      = this.sum.copy.ast;

    // Finalize the grammar and make it available to all users of the Myna module 
    m.registerGrammar("arithmetic", this);    
};

// Export the function for use with Node.js
if (typeof module === "object" && module.exports) 
    module.exports = ArithmeticGrammar;