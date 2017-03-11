"use strict";

function EvalArithmetic(expr, logging)
{
    if (logging) 
    {
        console.log('evaluating expression "' + expr.selfText + '" which was parsed according to rule "' + expr.rule.toString + '"');
    }

    switch (expr.rule.name) 
    {   
        case "sum": 
        {
            let v = EvalArithmetic(expr.children[0]);
            for (let i=1; i < expr.children.length; ++i) {
                let child = expr.children[i];
                switch (child.rule.name) {
                    case("addExpr"): v += EvalArithmetic(child); break;
                    case("subExpr"): v -= EvalArithmetic(child); break;
                    default: throw "Unexpected expression " + child.rule.name;
                }
            }
            return v;
        }
        case "product": 
        {
            let v = EvalArithmetic(expr.children[0]);
            for (let i=1; i < expr.children.length; ++i) {
                let child = expr.children[i];
                switch (child.rule.name) {
                    case("mulExpr"): v *= EvalArithmetic(child); break;
                    case("divExpr"): v /= EvalArithmetic(child); break;
                    default: throw "Unexpected expression " + child.rule.name;
                }
            }
            return v;
        }
        case "prefixExpr":  
        {
            let v = EvalArithmetic(expr.children[expr.children.length-1]);
            for (let i=expr.children.length-2; i >= 0; --i)
                if (expr.children[i].selfText == "-")
                    v = -v;
            return v;
        }
        case "parenExpr" : return EvalArithmetic(expr.children[0]);
        case "number": return Number(expr.selfText);
        case "addExpr": return EvalArithmetic(expr.children[0]);
        case "subExpr": return EvalArithmetic(expr.children[0]);
        case "mulExpr": return EvalArithmetic(expr.children[0]);
        case "divExpr": return EvalArithmetic(expr.children[0]);
        default: throw "Unrecognized expression " + expr.rule.name;
    }
}

function ArithmeticEvaluator(rule) 
{
    this.rule = rule;
    this.eval = EvalArithmetic; 
}

// Export the function for use with Node.js
if (typeof module === "object" && module.exports) 
    module.exports = EvalArithmetic;