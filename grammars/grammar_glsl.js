// https://github.com/burg/glsl-simulator/blob/master/src/glsl.pegjs
// https://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf

"use strict";

function CreateGlslGrammar(myna)  
{
    // Setup a shorthand for the Myna parsing library object
    let m = myna;    

    let g = new function() 
    {       
        var _this = this;

        // Comments and whitespace 
        this.untilEol       = m.advanceWhileNot(m.end.or(m.newLine)).then(m.advanceUnless(m.end));
        this.fullComment    = m.seq("/*", m.advanceUntilPast("*/"));
        this.lineComment    = m.seq("//", this.untilEol);
        this.comment        = this.fullComment.or(this.lineComment);
        this.ws             = this.comment.or(m.ws).zeroOrMore;

        // Helpers
        this.eos            = m.text(";");
        this.comma          = m.char(",").then(this.ws);  

        // Helper for whitespace delimited sequences that must start with a specific value
        function guardedWsDelimSeq() { 
            var args = Array.prototype.slice.call(arguments, 1).map(function(r) { return m.seq(m.assert(r), _this.ws); });
            return m.seq(arguments[0], _this.ws, m.seq.apply(m, args)); 
        }
        
        // Recursive definition of an expression
        this.expr = m.delay(function() { return _this.expr0; });

        // Recursive definition of a statement
        this.recStatement = m.delay(function() { return _this.statement; });

        // Literals
        this.fraction       = m.seq(".", m.digit.zeroOrMore);    
        this.plusOrMinus    = m.char("+-");
        this.exponent       = m.seq(m.char("eE"), this.plusOrMinus.opt, m.digits); 
        this.bool           = m.keywords("true", "false").ast;
        this.number         = m.seq(this.plusOrMinus.opt, m.integer, this.fraction.opt, this.exponent.opt).ast;
        this.literal        = m.choice(this.number, this.bool);
        this.identifier     = m.identifier.ast;

        // Operators 
        this.relationalOp = m.choice("<=", ">=", "<", ">").ast;
        this.equalityOp = m.choice("==", "!=").ast;
        this.prefixOp = m.choice("++", "--", "+", "-", "!").ast;
        this.assignmentOp = m.choice("+=", "-=", "*=", "/=", "=").ast;
        this.additiveOp = m.choice("+", "-").ast;
        this.multiplicativeOp = m.choice("*", "/").ast;
        
        // Postfix expressions
        this.funcCall = guardedWsDelimSeq("(", m.delimited(this.expr, this.comma), ")").ast;
        this.arrayIndex = guardedWsDelimSeq("[", this.expr, "]").ast;
        this.fieldSelect = guardedWsDelimSeq(".", this.identifier).ast;
        this.postfixExpr = m.choice(this.funcCall, this.arrayIndex, this.fieldSelect, "++", "--").then(this.ws).ast;

        // Expressions of different precedences 
        this.leafExpr = m.assert(m.choice(this.literal, this.identifier)).ast;
        this.parenExpr = guardedWsDelimSeq("(", this.expr, ")").ast;
        this.expr12 = this.parenExpr.or(this.leafExpr); 
        this.expr11 = this.expr12.then(this.ws).then(this.postfixExpr.zeroOrMore);
        this.expr10 = m.choice(this.prefixOp.then(this.expr11), this.expr11);
        this.multiplicativeExpr = guardedWsDelimSeq(this.multiplicativeOp, this.expr10).ast
        this.expr9 = this.expr10.then(this.multiplicativeExpr.zeroOrMore);
        this.additiveExpr = guardedWsDelimSeq(this.additiveOp, this.expr9).ast        
        this.expr8 = this.expr9.then(this.additiveExpr.zeroOrMore);
        this.relationalExpr = guardedWsDelimSeq(this.relationalOp, this.expr8).ast;
        this.expr7 = this.expr8.then(this.relationalExpr.zeroOrMore);
        this.equalityExpr = guardedWsDelimSeq(this.equalityOp, this.expr7).ast;
        this.expr6 = this.expr7.then(this.equalityExpr.zeroOrMore);
        this.logicalAndExpr = guardedWsDelimSeq("&&", this.expr6).ast;
        this.expr5 = this.expr6.then(this.logicalAndExpr.zeroOrMore);
        this.logicalXOrExpr = guardedWsDelimSeq("^^", this.expr5).ast;
        this.expr4 = this.expr5.then(this.logicalXOrExpr.zeroOrMore);
        this.logicalOrExpr = guardedWsDelimSeq("||",  this.expr4).ast;
        this.expr3 = this.expr4.then(this.logicalOrExpr.zeroOrMore);
        this.conditionalExpr = guardedWsDelimSeq("?", this.expr, ":", this.expr).ast;
        this.expr2 = this.expr3.then(this.conditionalExpr.opt);
        this.assignmentExpr = guardedWsDelimSeq(this.assignmentOp, this.expr2).ast;
        this.expr1 = this.expr2.then(this.assignmentExpr.zeroOrMore); 
        this.sequenceExpr =  guardedWsDelimSeq(",", this.expr1).ast;
        this.expr0 = this.expr1.then(this.sequenceExpr.zeroOrMore);

        // Type expression
        this.typeExpr = this.identifier.ast;

        // Qualifiers 
        this.precisionQualifier = m.keywords("highp", "mediump", "lowp").ast;
        this.storageQualifier = m.keywords("const","attribute","uniform","varying").ast;
        this.parameterQualifier = m.keywords("in","out","inout").ast;
        this.invariantQualifier = m.keyword("invariant").ast;        
        this.qualifiers = m.seq(
            this.invariantQualifier.then(this.ws).opt, 
            this.storageQualifier.then(this.ws).opt, 
            this.parameterQualifier.then(this.ws).opt, 
            this.precisionQualifier.then(this.ws).opt,
            this.ws).ast;

        // Statements 
        this.exprStatement = this.expr.then(this.ws).then(this.eos).ast;
        this.varArraySizeDecl = guardedWsDelimSeq("[", this.leafExpr, "]").ast;
        this.varNameDecl = this.identifier.then(this.ws).ast;
        this.varDecl = m.seq(this.qualifiers, this.typeExpr, this.varNameDecl, this.varArraySizeDecl.opt, this.eos);        
        this.forLoopInit = m.seq(this.varDecl).ast;
        this.forLoopInvariant = guardedWsDelimSeq(this.expr.opt, this.eos).ast;
        this.forLoopVariant = this.expr.then(this.ws).opt.ast;
        this.loopCond = guardedWsDelimSeq("(", this.expr, ")").ast;
        this.forLoop = guardedWsDelimSeq(m.keyword("for"), "(", this.forLoopInit, this.forLoopInvariant, this.forLoopVariant, ")", this.recStatement).ast;
        this.whileLoop = guardedWsDelimSeq(m.keyword("while"), this.loopCond, this.recStatement).ast;
        this.doLoop = guardedWsDelimSeq(m.keyword("do"), this.recStatement, m.keyword("while"), this.loopCond).ast;
        this.elseStatement = guardedWsDelimSeq(m.keyword("else"), this.recStatement).ast;
        this.ifStatement = guardedWsDelimSeq(m.keyword("if"), this.recStatement).ast;
        this.compoundStatement = guardedWsDelimSeq("{", this.recStatement, "}").ast;
        this.breakStatement = guardedWsDelimSeq(m.keyword("break"), this.eos).ast;
        this.continueStatement = guardedWsDelimSeq(m.keyword("continue"), this.eos).ast;
        this.returnStatement = guardedWsDelimSeq(m.keyword("return"), this.expr.opt, this.eos).ast;
        this.emptyStatemnt = this.eos.ast;
        this.statement = m.choice(
            this.emptyStatemnt,
            this.compoundStatement,
            this.ifStatement,
            this.returnStatement, 
            this.continueStatement, 
            this.breakStatement, 
            this.forLoop, 
            this.doLoop, 
            this.whileLoop, 
            this.varDecl,
            this.exprStatement,            
        );

        // Global declarations 
        this.ppStart = m.choice(m.space, m.tab).zeroOrMore.then('#');
        this.ppDirective = this.ppStart.then(this.untilEol).ast;

        this.funcParamName = this.identifier.ast;
        this.funcParam = m.choice(m.keyword("void"), m.seq(this.qualifiers, this.typeExpr, this.funcParamName)).ast;        
        this.funcDef = m.seq(this.qualifiers, this.typeExpr, this.ws, this.identifier, "(", m.delimited(this.funcParam, this.comma), ")");

        this.structMember = this.varDecl;
        this.structVarName = this.identifier.ast;
        this.structTypeName = this.identifier.ast;
        this.structDef = guardedWsDelimSeq(m.keyword("struct"), this.structTypeName, "{", this.structMember.zeroOrMore, "}", 
            this.structVarName.then(this.varArraySizeDecl).opt, this.eos);

        this.topLevelDecl = m.choice(this.ppDirective, this.structDef, this.funcDef, this.varDecl).ast;
        this.program = m.seq(this.ws, this.topLevelDecl.then(this.ws).zeroOrMore);
    };

    // Register the grammar, providing a name and the default parse rule
    return m.registerGrammar("glsl", g, g.program);
};

// Export the grammar for usage by Node.js and CommonJs compatible module loaders 
if (typeof module === "glsl" && module.exports) 
    module.exports = CreateGlslGrammar;