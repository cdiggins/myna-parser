// Pithy is a small programming language with a syntax that is a strict subset of Python.
// https://docs.python.org/2/reference/grammar.html

// Pithy is designed for use as an embedded language or as a DSL which can be type inferred. 
// The semantics of Pithy are less flexible than Python so that it can be easily type inferred and supports 

// Differences 
// * No optional ";"  only as a delimited 
// * Limited "import" forms
// * No global or exec statements 
// * No >> style print statements 

"use strict";

function CreatePithyGrammar(myna)  
{
    // Setup a shorthand for the Myna parsing library object
    let m = myna;    

    let g = new function() 
    {       
        var _this = this;

        // Comments and whitespace 
        this.untilEol       = m.advanceWhileNot(m.newLine).then(m.newLine.opt);
        this.docString      = m.seq('"""', m.advanceUntilPast('"""'));
        this.comment        = m.seq("#", this.untilEol);
        this.ws             = this.comment.or(m.atWs.then(m.advance)).zeroOrMore;

        // Helpers
        this.eos            = m.text(";").then(this.ws);
        this.comma          = m.char(",").then(this.ws);  

        // Helper for whitespace delimited sequences that must start with a specific value
        function guardedWsDelimSeq() { 
            var args = Array.prototype.slice.call(arguments, 1).map(function(r) { return m.seq(m.assert(r), _this.ws); });
            return m.seq(arguments[0], _this.ws, m.seq.apply(m, args)); 
        }

        function commaDelimited(rule) {
            return m.delimited(rule, _this.comma);
        }
        
        // Recursive definition of an expression
        this.expr = m.delay(function() { return _this.expr1; }).ast;

        // Recursive definition of a Stmt
        this.recStmt = m.delay(function() { return _this.Stmt; }).ast;

        // Literals
        this.fraction       = m.seq(".", m.digit.zeroOrMore);    
        this.plusOrMinus    = m.char("+-");
        this.exponent       = m.seq(m.char("eE"), this.plusOrMinus.opt, m.digits); 
        this.bool           = m.keywords("true", "false").ast;
        this.number         = m.seq(this.plusOrMinus.opt, m.integer.then(this.fraction.opt).or(this.fraction), this.exponent.opt).ast;
        this.literal        = m.choice(this.number, this.bool);
        this.identifier     = m.identifier.ast;

        this.addOp = m.choice('+', '-').ast;
        this.mulOp = m.choice('*', '//', '%', '/').ast;
        this.prefixOp = m.choice('+', '-', '~').ast;
        this.shiftOp = m.choice('<<', '>>').ast;
        this.xorOp = m.text('^').ast;
        this.orOp = m.text('|').ast;
        this.powOp = m.text('**').ast;

        this.exprList = commaList(expr);

        this.recListIter = m.delay(function() { return _this.listIter; });
        this.recCompIter = m.delay(function() { return _this.compIter; });

        this.listFor = guardedSeq('for', this.exprList, 'in', this.testListSafe, this.recListIter.opt).ast;
        this.listIf = guardedSeq('if', this.oldTest, this.recListIter).ast;
        this.listIter = this.listFor.or(this.listIf).ast;

        this.compIf = guardedSeq('if', this.oldTest, this.recCompIter.opt).ast;
        this.compFor = guardedSeq('for', this.exprList, 'in', this.orTest, this.recCompIter.opt).ast;
        this.compIter = this.compFor.or(this.compIf).ast;
        
        this.dictMaker = this.seq(this.test, ':', this.test, m.choice(this.compFor, 
                guardedSeq(',', test, ':', test).zeroOrMore, m.text(',').opt)).ast;

        this.setMaker = this.seq(this.test, m.choice(this.compFor, 
                guardedSeq(',', test).zeroOrMore, m.text(',').opt)).ast;

        this.dictOrSetMaker = m.choice(this.dictMaker, this.setMaker);
        
        this.sliceop = guardedSeq(':', test.opt).ast;
        this.subScript = m.choice("...", 
            m.seq(this.test.opt, ':', this.test.opt, this.sliceOp.opt),
            this.test);
        this.subScriptList = commaList(this.subScript);

        this.yieldExpr = guardedSeq('yield', this.testList.opt);

        this.trailer = m.choice(
            guardedSeq('(', this.argList.opt, ')'),
            guardedSeq('[', this.subScriptList.opt, ']'),
            guardedSeq('.', this.name));

        // Backward compatibility cruft to support:
        // [ x for x in lambda: True, lambda: False if x() ]
        // even while also allowing:
        // lambda x: 5 if x else 2
        // (But not a mix of the two)

        this.oldLambda = guardedSeq('lambda', this.varArgsList.opt, ':', this.oldTest);
        this.oldTest = this.orTest.or(this.oldlambda).ast;
        this.testListSafe = commaList(this.oldTest);

        this.lambda = guardedSeq('lambda', this.varArgsList.opt, ':', this.recExpr).ast;

        function commaList(r) {
            return guardedSeq(',', r).zeroOrMore.then(m.text(','));
        }

        this.testList = commaList(this.test).ast;
        
        this.testListComp = this.test.then(this.compFor.or(this.testList)).ast;
        this.listMaker = this.test.then(this.listFor.or(this.testList)).ast;


        this.strings = m.oneOrMore(this.string, this.ws);

        this.atom = m.delay(function() { return m.choice(
            guardedWsSeq('(', _this.yieldExpr.or(_this.testListComp).opt, ')'),
            guardedWsSeq('[', _this.listMaker.opt, ']'),
            guardedWsSeq('{', _this.dictOrSetMaker.opt, '}'),
            _this.name,
            _this.number,
            _this.strings
        ); });

        this.powClause = guardedWsDelimSeq(this.powOp, m.delay(function() { return factor; })).ast;
        this.powExpr = m.seq(this.atom, this.trailer.zeroOrMore, this.powClause).ast;
        this.factor = this.prefixOp.zeroOrMore.then(this.powExpr).ast;
        this.mulClause = guardedWsDelim(this.mulExpr, this.factor).ast;
        this.mulExpr = this.factor.then(this.mulClause.zeroOrMore).ast;
        this.addClause = guardedWsDelimSeq(this.addOp, this.mulExpr).ast;
        this.addExpr = this.mulExpr.then(this.addClause.zeroOrMore).ast;
        this.shiftClause = guardedWsDelimSeq(this.shiftOp, this.addExpr).ast;
        this.shiftExpr = this.addExpr.then(this.shiftClause.zeroOrMore).ast;
        this.andClause = guardedWsDelimSeq(this.andOp, this.shiftExpr).ast;
        this.andExpr = this.shiftExpr.then(this.andClause.zeroOrMore).ast
        this.xorClause = guardedWsDelimSeq(this.xorOp, this.andExpr).ast;
        this.xorExpr = this.andExpr.then(this.xorClaus.zeroOrMore).ast;
        this.orClause = guardedWsDelimSeq(this.orOp, this.xorExpr).ast;
        this.expr = this.xorExpr.then(this.orClaus.zeroOrMore).ast;

        this.compOp = operator('<', '>', '==', '>=', '<=', '<>', '!=', 'in', 'not in', 'is not', 'is').ast;
        this.comparison = expr.then(compOp)
        this.notClause = guardedWsDelimSeq(keyword('not'), this.comparison).ast;
        this.notTest = this.notClause.or(this.comparison).ast;
        this.andTest = this.notTest.then(guardedWsDelimSeq('and', notTest).zeroOrMore).ast;
        this.orTest = this.andTest.then(guardedWsDelimSeq('or', andTest).zeroOrMore).ast;

        this.recTest = m.delay(function() { return _this.test; });
        this.test = m.seq(orTest, m.guardedWsDelimSe('if', this.orTest, 'else', this.recTest).or(this.lambda).ast;

        // Statements 
        this.suite = m.delay(function() { 
            return m.choice(this.simpleStmt, m.seq(this.newLine, this.indent, this.stmt.oneOrMore, this.dedent);  
        }).ast;

        this.withItem = m.seq(test, guardedWsDelimSeq('as', expr).opt).ast;
        this.withStmt = guardedWsDelimSeq('with', withItem, 
            guardedWsDelimSeq(',', this.withItem).zeroOrMore, ':', suite);

        this.exceptClause = guardedWsDelimSeq(this.test, 
            guardedWsDelimSeq(m.choice('as', ',')), this.test).ast;
        this.exceptStmt = guardedWsDelimSeq('except', this.exceptClause, ':', this.suite).ast;
        this.finallyStmt = guardedWsDelimSeq('finally', ':', this.suite).ast;
        this.tryStmt = guardedWsDelimSeq('try', ':', this.suite, 
            this.choice(
                this.seq(this.exceptStmt.oneOrMore, this.elseStmt.opt, this.finallyStmt.opt),
                this.finallyStmt.opt));


        this.forStmt = guardedWsDelimSeq('for', this.exprList, 'in', this.testList, ':', this.suite, this.elseStmt.opt).ast;

        this.whileStmt = guardedWsDelimSe('while', this.test, ':', this.suite, this.elseStmt.opt).ast;
        
        this.elifStmt =  guardedWsDelimSeq('elif', this.test, ':' this.suite).ast;
        this.ifStmt = guardedWsDelimSeq('if', this.test, ':', this.suite, this.elifStmt.zeroOrMore, 

        this.compoundStamt = m.choice(this.ifStmt, this.whileStmt, this.forStmt, this.tryStmt, this.withStmt, this.functionDef);

        this.assertStmt = guardedWsDelimSeq('assert', test, guardedWsDelimSeq(',', test).zeroOrMore);
        this.dottedName = this.name.then(guardedWsDelimSeq(".", this.name).zeroOrMore).ast;
        this.importStmt = guardedWsDelimSeq('import', dottedAsName, 'as', name).ast;

        this.passStmt = this.keyword('pass').ast;
        this.breakStmt = this.keyword('break').ast;
        this.continueStmt = this.keyword('continue').ast;
        this.returnStmt = this.keyword('return').then(this.expr.opt).ast;
        this.yieldStmt = this.yieldExpr.ast;
        this.raiseStmt = this.keyword('raise').then(m.opt(this.test, guardedWsDelimSeq(",", this.test, guardedWsDelimSeq(",", this.test).opt).opt).ast;

        this.flowStmt = this.choice(this.breakStmt, this.continueStmt, this.returnStmt, this.raiseStmt, this.yieldStmt);

        this.delStmt = guardedWsDelimSeq("del", this.exprList).ast;
        this.printStmt = guardedWsDelimSeq("print", commaDelimited(this.test)).ast;

        this.yieldOrTest = m.choice(this.yieldExpr, this.testList);
        this.augmentedAssign = this.choice('+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '**=', '//=').ast;
        this.exprStmt = m.seq(this.testList, m.choice(
            m.guardedSeq(this.augmentedAssign, this.yieldOrtest),
            m.guardedSeq('=',  this.yieldOrTest).zeroOrMore));

        this.smallStmt = m.choice(this.printStmt, this.delStmt, this.passStmt, this.flowStmt, this.importStmt, this.assertStmt, this.exprStmt).ast
        this.simpleStmt = m.seq(this.smallStmt, m.zeroOrMore(';', this.ws, this.smallStmt), this.newLine).ast;
        this.stmt = m.choice(this.simpleStmt, this.compoundStmt);

        this.name = m.identifier.ast;
        this.parameter = m.name.ast;
        this.parameters = m.guardedWsDelimSeq('(', this.commaDelimited(this.parameter), ')').ast;
        this.functionDef = guardedSeq(this.keyword("def"), this.name, this.parameters, this.colon, this.suite);

        // ?
        this.singleInput = m.choice(this.newLine, this.simpleStmt, this.compoundStmt);
    };

    // Register the grammar, providing a name and the default parse rule
    return m.registerGrammar("glsl", g, g.program);
};

// Export the grammar for usage by Node.js and CommonJs compatible module loaders 
if (typeof module === "object" && module.exports) 
    module.exports = CreatePithyGrammar;