// Myna Parsing Library
// Copyright (c) 2016 Christopher Diggins
// Usage permitted under terms of MIT License

// A parsing combinator library for JavaScript/TypeScript based on the PEG formalism.
// For more information see http://www.github.com/cdiggins/myna-parser

// NOTE: we are explicitly bypassing using the TypeScript "export" keyword for 
// the Myna module otherwise the module won't be usable from browsers without 
// some using some additional library.   
module Myna
{
    //===============================================================
    // Global parse functions 

    // Called whenever a new parsing session is started  
    export function _initialize(text:string) {
        _input = text;
        _stack = [new AstNode(null)]; 
    }

    // Return true or false depending on whether the rule matches 
    // the beginning of the input string. 
    export function match(r : Rule, s : string) : boolean 
    {
        _initialize(s);
        return r.match(0);        
    }

    // Returns the root node of the abstract syntax tree created 
    // by parsing the rule. If no exceptions are thrown, this will 
    // always return at least one node. If the content fails to parse 
    // the returned node will have an end position of "failed" (-1).  
    // Note that only rules returned from the ast 
    // property will add nodes in the tree (e.g. identifier.ast) when
    // parsed.
    export function parse(r : Rule, s : string) : AstNode
    {
        _initialize(s);
        let end = r.parse(0);
        if (_stack.length != 1)
            throw Exceptions.InternalStackError;
        let root = _stack[0];
        root.end = end;
        return root;        
    }
    
    //====================================================================================
    // Exception values 

    // Possible exception values that can be thrown by the Myna parser   
    export enum Exceptions 
    {
        // Internal error: this is due to a rule object not overriding an abstract function  
        MissingOverride,

        // Internal error: this is due to an implementation error in how the parse function constructs the AST  
        InternalStackError,

        // Parser error: thrown when a repeated rule does not advance the input parser location. This is due to an invalid grammar construction.
        InfiniteLoop,       
        
        // Grammar construction error: thrown when a rule operator is not given a valid Rule or string. 
        InvalidRuleType,    

        // Internal error: thrown when an internal clone implementation returns the wrong type.  
        CloneInvalidType,   
        
        // Grammar construction error: thrown when a range rule is given a min or max string that is not exactly one character long
        RangeRequiresChars,  
        
        // Grammar construction error: the same token is included twice in the lookup table. 
        TokenIncludedTwiceInLookup,
    }

    //====================================================================================
    // Internal variables used by the Myna library

    // A lookup table of all grammars registered with the Myna module 
    export let grammars = {}

    // A lookup table of all named rules registered with the Myna module
    export let rules = {}

    // Generates a new ID for each rule 
    let _nextId = 0;
    function genId() { 
        return _nextId++;
    }

    // The returned value of a failed parse
    const failed = -1;

    // This is the input text 
    let _input = "";

    // The call-stack of nodes. Used for constructing a parse tree 
    let _stack:AstNode[];

    //===============================================================
    // RuleType union of Rule, string, and boolean

    // For convenience this enables strings and boolean to be used interchangably with Rules in the combinators.
    export type RuleType = Rule | string | boolean;

    // Given a RuleType returns an instance of a Rule.
    export function RuleTypeToRule(rule:RuleType) : Rule {
        if (rule instanceof Rule) return rule;
        if (typeof(rule) === "string") return text(rule);
        if (typeof(rule) === "boolean") return rule ? truePredicate : falsePredicate;
        throw Exceptions.InvalidRuleType;
    } 

    //===============================================================
    // AstNode class 

    // Represents a node in the parse tree. 
    export class AstNode
    {
        children: AstNode[] = null;
        constructor(public rule:Rule, public start:number=0, public end:number=failed) { }
        get contents() { return _input.slice(this.start, this.end); } 
    }

    //===============================================================
    // Rule class     
    
    // A Rule is both a rule in the PEG grammar and a parser. The parse function takes  
    // a particular parse location (in either a string, or array of tokens) and will return 
    // the location of the end of the parse if successful or the constant failed (-1)
    // if not successful.  
    export class Rule
    {
        // Identifies individual rule
        name:string = "";

        // Internal unique identifier
        id:number = genId();

        // Identifies types of rules.  
        type:string = "";

        // Indicates whether generated nodes should be added to the abstract syntax tree
        _createAstNode:boolean = false;

        // Note: child-rules are exposed as a public field
        constructor(public rules:Rule[]) { }
        
        // Each rule derived object provides its own implementation of this function.  
        parseImplementation(index:number):number { 
            throw Exceptions.MissingOverride;
        }

        // Returns true if this Rule matches the input at the given location 
        match(index:number):boolean {
            // Check that the index is valid  
            if (index < 0 || index > _input.length)
                return false;
            return this.parseImplementation(index) != failed;
        }        

        // If successful returns the end-location of where this Rule matches the input 
        // at the given location, or -1 if failed 
        parse(index:number):number {        
            // Check that the index is valid  
            if (index < 0 || index > _input.length)
                return failed;

            // Either we add a node to the parse tree, or do a regular parse 
            if (!this._createAstNode)
            {
                // When not creating nodes we just call the parse implementation 
                return this.parseImplementation(index);
            }
            else
            { 
                // Create a node 
                let node = new AstNode(this, index);

                // Push it on the stack (it will be a parent for child parses)
                _stack.push(node);   

                // Call the implementation of the parse function 
                let end = this.parseImplementation(index);

                // Get the node from the stack (should be the same as the node variable here)
                let child = _stack.pop();
                if (child != node)
                    throw Exceptions.InternalStackError;

                // If the parse failed then we can return 
                if (end === failed) 
                    return failed;

                // Update the node
                child.end = end;

                // Peek at the current top of the stack which will be a new parent,
                // and add the node (child) to it. 
                if (_stack.length === 0)
                    throw Exceptions.InternalStackError;
                let parent = _stack[_stack.length-1];            
                if (parent.children == null)
                    parent.children = new Array<AstNode>();
                parent.children.push(child);
                
                // Return the parse result 
                return end;
            }                              
        }

        // Defines the type of rules. Used for defining new rule types as combinators. 
        setType(typeName:string) : Rule {
            this.type = typeName;
            return this;
        }

        // Sets the name of the rule. 
        setName(name:string) : Rule {
            this.name = name;
            return this;            
        }

        // Returns a default string representation of the rule's definition  
        get definition() : string {
            return "_" + this.type + "_";
        }

        //  Returns the name or the definition if the name is not present
        get nameOrDefinition() : string {
            return this.name ? this.name : this.definition;
        }

        // Returns a string representation of the rule in the PEG format   
        toString() : string {
            return this.name + "\t<- " + this.definition;
        }

        // Returns the first child rule
        get firstChild() : Rule {
            return this.rules[0];
        }

        // Returns a copy of this rule with default values for all fields.  
        cloneImplementation() : Rule {
            throw Exceptions.MissingOverride;
        }

        // Returns a copy of this rule with all fields copied.  
        get copy() : Rule {
            let r = this.cloneImplementation();
            if (typeof(r) !== typeof(this))
                throw Exceptions.CloneInvalidType;
            r.name = this.name;
            r.type = this.type;
            r._createAstNode = this._createAstNode;
            return r;
        }

        // Returns a copy of the rule that has the property it will create a node in the parse tree. 
        get ast() : Rule {
            let r = this.copy;
            r._createAstNode = true;
            return r;
        }

        // Extensions to support method/property chaining a.k.a. fluent syntax
        get opt() : Rule {  return opt(this); }
        get star() : Rule { return star(this); }
        get plus() : Rule { return plus(this); }
        get not() : Rule { return not(this); }
        get advance() : Rule { return this.then(advance); }
        get ws() : Rule { return this.then(ws); }
        get all() : Rule { return this.then(all); }
        get end() : Rule { return this.then(end); }
        then(r:RuleType) : Rule { return seq(this, r); }
        thenAt(r:RuleType) : Rule { return this.then(at(r)); }
        thenNot(r:RuleType) : Rule { return this.then(not(r)); }
        or(r:RuleType) : Rule { return choice(this, r); } 
        until(r:RuleType) : Rule { return repeatWhileNot(this, r); }
        untilPast(r:RuleType) : Rule { return repeatUntilPast(this, r); }        
        repeat(count:number) { return repeat(this, count); }
        bounded(min:number, max:number) { return bounded(this, min, max); }
        delimited(delimiter:RuleType) { return delimited(this, delimiter); }        
    }

    //===============================================================
    // Rule derived classes 

    // These are the core Rule classes of Myna. Normally you would not use theses directly but use the factory methods
    // If you fork this code, think twice before adding new classes here. Maybe you can implement your new Rule
    // in terms of functions or other low-level rules. Then you can be happy knowing that the same code is being 
    // re-used and tested all the time.  

    // Matches a series of rules in order. Succeeds only if all sub-rules succeed. 
    export class Sequence extends Rule 
    {
        type = "sequence";

        constructor(rules:Rule[]) { super(rules); }

        parseImplementation(index:number): number {
            for (let r of this.rules) {
                index = r.parse(index);
                if (index === failed) return index;
            }
            return index;
        }

        get definition() : string { return "(" + this.rules.map(r => r.nameOrDefinition).join(" ") + ")"; }
        cloneImplementation() : Rule { return new Sequence(this.rules); }
    }
    
    // Tries to match each rule in order until one succeeds. Succeeds if any of the sub-rules succeed. 
    export class Choice extends Rule
    {
        type = "choice";

        constructor(rules:Rule[]) { super(rules); }

        parseImplementation(index:number): number {
            for (let r of this.rules) {
                let result = r.parse(index);
                if (result === failed) continue;
                return result;
            }
            return failed;
        }        

        match(index:number):boolean {
            for (let r of this.rules)
                if (r.match(index))
                    return true;
            return false;
        }

        get definition() : string { return "(" + this.rules.map(r => r.nameOrDefinition).join(" / ") + ")"; }
        cloneImplementation() : Rule { return new Choice(this.rules); }
    }

    // A generalization of several rules such as star (0+), plus (1+), opt(0 or 1),
    // When matching with an unbounded upper limit set the maxium to  -1   
    export class BoundedRule extends Rule
    {    
        type = "bounded";

        constructor(rule:Rule, public min:number=0, public max:number=-1) { super([rule]); }

        parseImplementation(index:number): number {
            let result = index;
            // This can loop forever (-1) or a maximum number of times. 
            for (let i=0; this.max < 0 || i < this.max; ++i) {
                let tmp = this.firstChild.parse(result);
                // If parsing the rule fails, we return the last result, or failed 
                // if the minimum number of matches is not met. 
                if (tmp === failed)
                    return (i >= this.min) ? result : failed;
                // Check for progress, to assure we aren't hitting an infinite loop  
                if (this.max < 0) 
                    if (result === tmp)
                        throw Exceptions.MissingOverride;
                // Check we don't go past the end of the input 
                if (i > _input.length)
                    return failed;
                result = tmp;
            }            
            return result;
        }

        get definition() : string { 
            return this.firstChild.nameOrDefinition + "{" + 
                this.min + "," + (this.max >= 0 ? this.max : "*") + "}"; 
        }

        cloneImplementation() : Rule { return new BoundedRule(this.firstChild, this.min, this.max); }
    }

    // Advances the parser by one token unless at the end
    export class Advance extends Rule
    {
        type = "advance";
        constructor() { super([]); }
        parseImplementation(index:number): number { return index < _input.length ? index+1 : failed; }
        get definition() : string { return "."; }
        cloneImplementation() : Rule { return new Advance(); }                
    }

    // Uses a lookup table to find the next rule to parse next from the current token 
    export class Lookup extends Rule
    {
        type = "lookup";
        constructor(public lookup:any, public onDefault:Rule) { super([]); }        
        parseImplementation(index:number): number {
            if (index >= _input.length)
                return failed;
            let tkn = _input[index];
            let r = this.lookup[tkn];
            if (r !== undefined) 
                return r.parse(index);
            return this.onDefault.parse(index);
        }
        get definition() : string { return this.lookup; }
        cloneImplementation() : Rule { return new Lookup(this.lookup, this.onDefault); }
    }

    // Used to match a string in the input string 
    export class Text extends Rule
    {
        type = "text";
        constructor(public text:string) { super([]); }
        parseImplementation(index:number): number {
            if (index > _input.length - this.text.length) return failed;
            for (let i=0; i < this.text.length; ++i) 
                if (_input[index+i] !== this.text[i])
                    return failed;
            return index + this.text.length;
        }
        get definition() : string { return "'" + this.text +  "'"; }
        cloneImplementation() : Rule { return new Text(this.text); }        
    }

    // Creates a rule that is defined from a function that generates the rule. 
    // This allows two rules to have a cyclic relation. 
    export class Delay extends Rule 
    {
        type = "delay";
        constructor(public fn:()=>Rule) { super([]); }        
        parseImplementation(index:number): number { return this.fn().parse(index); }
        get definition() : string { return this.fn().definition; }
        cloneImplementation() : Rule { return new Delay(this.fn); }        
    } 

    //=======================================
    // Zero length rules 

    // A PredicateRule that does not advance the input and does not create parse nodes in the tree.
    export class PredicateRule extends Rule
    {            
        // Rules derived from a PredicateRule will only provide an override 
        // of the match function, so the parse is defined in terms of match.       
        parse(index:number):number {
            if (!this.match(index))
                return failed;
            return index; 
        } 
    }

    // Returns true only if the child rule fails to match.
    export class Not extends PredicateRule
    {
        type = "not";
        constructor(rule:Rule) { super([rule]); }
        match(index:number):boolean { return !this.firstChild.match(index); }
        get definition() : string { return "!" + this.firstChild.nameOrDefinition; }
        cloneImplementation() : Rule { return new Not(this.firstChild); }
    }   

    // Returns true only if the child rule matches, but does not advance the parser
    export class At extends PredicateRule
    {
        type = "at";
        constructor(rule:Rule) { super([rule]); }
        match(index:number):boolean { return this.firstChild.match(index); }
        get definition() : string { return "&" + this.firstChild.nameOrDefinition; }
        cloneImplementation() : Rule { return new At(this.firstChild); }
    }   

    // Uses a function to return true or not based on the behavior of the predicate rule
    export class Predicate extends PredicateRule
    {
        type = "predicate";
        constructor(public fn:(index:number)=>boolean) { super([]); }
        match(index:number):boolean { return this.fn(index); }
        cloneImplementation() : Rule { return new Predicate(this.fn); }        
    }
    
    //===============================================================
    // Rule creation function
    
    // Create a rule that matches the text 
    export function text(text:string) {
        return new Text(text); 
    }

    // Matches a series of rules in order, and succeeds if they all do
    export function seq(...rules:RuleType[]) {
        return new Sequence(rules.map(RuleTypeToRule));
    }

    // Tries to match each rule in order, and succeeds if one does 
    export function choice(...rules:RuleType[]) : Choice {
        return new Choice(rules.map(RuleTypeToRule));
    }        

    // Enables Rules to be defined in terms of variables that are defined later on. This 
    // enables cyclic rule definitions.  
    export function delay(fxn:()=>RuleType) { return new Delay(() => RuleTypeToRule(fxn())); }

    // Parses successfully if the given rule does not match the input at the current location  
    export function not(rule:RuleType) { 
        return new Not(RuleTypeToRule(rule)); 
    };

    // Attempts to apply a rule between min and max number of times inclusive. If the maximum is set to -1, 
    // it will attempt to match as many times as it can, but throw an exception if the parser does not advance 
    export function bounded(rule:RuleType, min:number=0, max:number=-1) { 
        return new BoundedRule(RuleTypeToRule(rule), min, max); 
    }

    // Attempts to apply the rule 0 or more times. Will always succeed unless the parser does not 
    // advance, in which case an exception is thrown.    
    export function star(rule:RuleType) { 
        return bounded(rule).setType("star"); 
    };

    // Attempts to apply the rule 1 or more times. Will throw an exception if the parser does not advance.  
    export function plus(rule:RuleType)  { 
        return bounded(rule, 1).setType("plus"); 
    }

    // Attempts to match a rule 0 or 1 times. Always succeeds.   
    export function opt(rule:RuleType)  { 
        return bounded(rule, 0, 1).setType("opt"); 
    };

    // Attempts to apply a rule a precise number of times
    export function repeat(rule:RuleType, count:number) { 
        return bounded(rule, count, count).setType("repeat"); 
    }
    
    // Returns true if the rule successfully matches, but does not advance the parser index. 
    export function at(rule:RuleType) { 
        return new At(RuleTypeToRule(rule)); 
    };

    // Looks up the rule to parse based on whether the token in the array of not.      
    export function lookup(tokens:string[], rule:RuleType, onDefault:RuleType=false) {
        let d = {};
        let r = RuleTypeToRule(rule);
        for (let t of tokens) {
            if (t in d)
                throw Exceptions.TokenIncludedTwiceInLookup;                
            d[t] = r; 
        }
        return new Lookup(d, RuleTypeToRule(onDefault));
    }

    //===============================================================    
    // Character set rules

    export function atChar(chars:string) { return lookup(chars.split(""), truePredicate); };    
    export function notAtChar(chars:string) { return lookup(chars.split(""), falsePredicate, truePredicate); };        
    export function char(chars:string) { return lookup(chars.split(""), advance); };    
    export function charExcept(chars:string) { return lookup(chars.split(""), falsePredicate, advance); };

    export function inRange(min:string, max:string, rule:RuleType, onDefault:RuleType=false) { 
        if (min.length != 1 || max.length != 1)
            throw Exceptions.RangeRequiresChars;
        let minChar = min.charCodeAt(0);
        let maxChar = max.charCodeAt(0);
        let tokens = [];
        for (let x=minChar; x <= maxChar; ++x)
            tokens.push(String.fromCharCode(x));
        return lookup(tokens, rule, onDefault); 
    }

    export function range(min:string, max:string) { return inRange(min, max, advance); }
    export function exceptRange(min:string, max:string) { return inRange(min, max, falsePredicate, advance); }

    //===============================================================    
    // Advanced rule operators 
    
    export function delimited(rule:RuleType, delimiter:RuleType) { return opt(seq(rule, star(seq(delimiter, rule)))).setType("delimitedList"); }
    export function except(condition:RuleType, rule:RuleType) { return seq(not(condition), rule).setType("except"); }        
    export function repeatWhileNot(body:RuleType, condition:RuleType) { return star(except(condition, body)).setType("whileNot"); }
    export function repeatUntilPast(body:RuleType, condition:RuleType) { return seq(repeatWhileNot(body, condition), condition).setType("repeatUntilPast"); }
    export function advanceWhileNot(rule:RuleType) { return not(rule).advance.star.setType("advanceWhileNot"); }
    export function advanceUntilPast(rule:RuleType) { return seq(advanceWhileNot(rule), rule).setType("advanceUntilPast"); }

    //===============================================================    
    // Predicates and actions  
    
    export function predicate(fn:(index:number)=>boolean) { return new Predicate(fn); }
    export function action(fn:(index:number)=>void) { return predicate((index)=> { fn(index); return true; }).setType("action"); }
    export function err(ex:any) { return action(p=> { ex.location=p; throw(ex); }).setType("err"); }
    export function log(msg:string = "") { return action(p=> { console.log(msg); }).setType("log"); }
    export function assert(rule:RuleType) { return choice(rule, err({rule:rule,type:"assert"})).setType("assert"); }
    
    //=======================================================================
    // Guarded sequences. 
    
    // If first part of a guarded sequence passes then each subsequent rule must pass as well 
    // otherwise an exception occurs. This helps create parsers that fail fast, and thus provide
    // better feedback for badly formed input.      
    export function guardedSeq(condition:RuleType, ...rules:RuleType[]) { 
        return seq(condition, seq(...rules.map((r) => assert(r)))).setType("guardedSeq"); 
    }
    
    // Common guarded sequences 

    export function doubleQuoted(rule:RuleType) { return guardedSeq("\"", rule, "\"").setType("doubleQuoted"); }
    export function singleQuoted(rule:RuleType) { return guardedSeq("'", rule, "'").setType("singleQuoted"); }

    // Common guarded sequences: with internal whitespace 

    export function parenthesized(rule:RuleType) { return guardedSeq("(", ws, rule, ws, ")").setType("parenthesized"); }
    export function braced(rule:RuleType) { return guardedSeq("{", ws, rule, ws, "}").setType("braced"); }
    export function bracketed(rule:RuleType) { return guardedSeq("[", ws, rule, ws, "]").setType("bracketed"); }
    export function tagged(rule:RuleType) { return guardedSeq("<", ws, rule, ws, ">").setType("tagged"); }
         
    // A complete identifier, with no other letters or numbers
    export function keyword(text:string) { return seq(text, not(identifierNext)).setType("keyword"); }
    export function keywords(...words:string[]) { return choice(...words.map(keyword)); }

    //===============================================================    
    // Core grammar rules 
        
    export let truePredicate    = predicate((index) => true);
    export let falsePredicate   = predicate((index) => false);        
    export let end              = predicate((index) => index >= _input.length);
    export let notEnd           = predicate((index) => index < _input.length);
    export let advance          = new Advance();   
    export let all              = advance.star;
    export let letterLower      = range('a','z');
    export let letterUpper      = range('A','Z');
    export let letter           = choice(letterLower, letterUpper);
    export let digit            = range('0', '9');
    export let digitNonZero     = range('1', '9');
    export let integer          = choice('0', seq(digitNonZero, digit.star));
    export let hexDigit         = choice(digit,range('a','f'), range('A','F'));
    export let binaryDigit      = choice('0','1');
    export let octalDigit       = range('0','7');
    export let alphaNumeric     = choice(letter, digit);
    export let underscore       = text("_");
    export let identifierFirst  = choice(letter, underscore);
    export let identifierNext   = choice(alphaNumeric, underscore);     
    export let identifier       = seq(identifierFirst, identifierNext.star);     
    export let hyphen           = text("-");
    export let crlf             = text("\r\n");
    export let newLine          = choice(crlf, "\n");          
    export let space            = text(" ");
    export let tab              = text("\t");    
    export let ws               = char(" \t\r\n").star;
        
    //===============================================================
    // Grammar functions 
    
    // The following are helper functions for grammar objects. A grammar is a loosely defined concept.
    // It is any JavaScript object where one or more member fields are instances of the Rule class.    

    // Returns all properties of an object that correspond to Rules 
    export function grammarRules(g:any)
    {
        return Object
            .keys(g)
            .map(k => g[k])
            .filter(v => v instanceof Rule)
    }

    // Returns the representation using the standard PEG notation 
    export function grammarToString(g:any) 
    {
        return grammarRules(g)
            .map(r => r.toString())
            .join('\n');
    }

    // Initializes a grammar object by setting names for all of the rules
    // from the name of the field it is associated with combined with the 
    // name of the grammar. Each rule is stored in Myna.rules and each 
    // grammar is stored in Myna.grammars. 
    export function registerGrammar(grammarName:string, grammar:any)
    {
        for (let k in grammar) {
            if (grammar[k] instanceof Rule) {
                let ruleName = grammarName + "." + k;
                let rule = grammar[k];
                rule.setName(ruleName);
                rules[ruleName] = rule;
            }
        }
        grammars[grammarName] = grammar;
    }
    
    //===========================================================================
    // Initialization code

    // Myna itself is a grammar in that it has member fields that are rules. 
    // This sets names for each of the built-in rules 
    registerGrammar("core", Myna);
}

// Export the function for use with Node.js
declare let module;
if (typeof module === "object" && module.exports) 
    module.exports.Myna = Myna;
