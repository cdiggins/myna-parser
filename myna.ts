// Myna Parsing Library
// Copyright (c) 2016 Christopher Diggins
// Usage permitted under terms of MIT License

// A parsing combinator library for JavaScript/TypeScript based on the PEG formalism.
// For more information see http://www.github.com/cdiggins/myna-parser

// NOTE: we are explicitly bypassing using the TypeScript "export" keyword for 
// the Myna module otherwise the module won't be usable from browsers without 
// using an additional moduler loader library. Instead we use some manual  
// export code at the bottom of the file. 

module Myna
{
    // This stores the state of the parser and is passed to the 
    // match and parse functions.
    export class Parser
    {        
        constructor(
            public input:string, 
            public nodes:AstNode[] = []) 
        { }
    }

    // Return true or false depending on whether the rule matches 
    // the beginning of the input string. 
    export function match(r:Rule, s:string) : boolean 
    {
        return r.match(new Parser(s), 0);        
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
        let p = new Parser(s);
        let curNode = new AstNode(r.ast, s);
        curNode.end = r.parse(p, 0);
        return curNode;        
    }

    // Returns an array of nodes created by parsing the given rule repeatedly until 
    // it fails or the end of the input is arrived. One Astnode is created for each time 
    // the token is parsed successfully, whether or not it explicitly has the "_createAstNode" 
    // flag set explicitly. 
    export function tokenize(r:Rule, s:string) : AstNode[]
    {
        return this.parse(r.ast.zeroOrMore, s).children;
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
    export let allRules = {}

    // Generates a new ID for each rule 
    let _nextId = 0;
    function genId() { 
        return _nextId++;
    }

    // The returned value of a failed parse
    const failed = -1;

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

    // Represents a node in the generated parse tree. These nodes are returned by the Rule.parse function. If a Rule 
    // has the "_createAstNode" field set to true (because you created the rule using the ".ast" property), then the 
    // generated node will also be added to the constructed parse tree.   
    export class AstNode
    {
        // The list of child nodes in the parse tree. This is not allocated unless used, to minimize memory consumption 
        children: AstNode[] = null;

        // Constructs a new node associated with the given rule.  
        constructor(
            public rule:Rule, 
            public input:string,
            public start:number=0, 
            public end:number=failed) 
        { }

        // Returns the name of the rule associated with this node
        get name() : string { return this.rule != null ? this.rule.name : "unnamed"; }

        // Returns the name of the rule, preceded by the grammar name, associated with this node
        get fullName() : string { return this.rule != null ? this.rule.fullName : "unnamed"; }

        // Returns the parsed text associated with this node's start and end locations  
        get allText() : string { return this.input.slice(this.start, this.end); } 

        // Returns true if this node has no children
        get isLeaf() : boolean { return this.children == null || this.children.length == 0; }

        // Returns the first child with the given name, or null if no named child is found. 
        child(name:string) : AstNode { 
            if (this.children)
                for (let c of this.children) 
                    if (c.name == name) return c; 
            return null; 
        }

        // The position of the first child, or the end position for the entire node if no children 
        get _firstChildStart() : number {
            return this.isLeaf ? this.end : this.children[0].start;
        }        

        // The end position of the last child, or the end position for the entire node if no children 
        get _lastChildEnd() : number {
            return this.isLeaf ? this.end : this.children[0].end;
        }        

        // Returns the text before the children, or if no children returns the entire text. 
        get beforeChildrenText() : string {
            return this.input.slice(this.start, this._firstChildStart);
        }

        // Returns the text after the children, or if no children returns the empty string.
        get afterChildrenText() : string {
            return this.input.slice(this._lastChildEnd, this.end);
        }

        // Returns the text from the beginning of the first child to the end of the last child.
        get allChildrenText() : string {
            return this.input.slice(this._firstChildStart, this._lastChildEnd);
        }
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

        // Identifies the grammar that this rule belongs to 
        grammarName:string = "";

        // Internal unique identifier
        id:number = genId();

        // Identifies types of rules.  
        type:string = "";

        // Indicates whether generated nodes should be added to the abstract syntax tree
        _createAstNode:boolean = false;

        // Note: child-rules are exposed as a public field
        constructor(
            public rules:Rule[]) 
        { }
        
        // Each rule derived object provides its own implementation of this function.  
        parseImplementation(p:Parser, index:number):number { 
            throw Exceptions.MissingOverride;
        }

        // Returns true if this Rule matches the input at the given location 
        match(p:Parser, index:number):boolean {
            // Check that the index is valid  
            if (index < 0 || index > p.input.length)
                return false;
            return this.parseImplementation(p, index) != failed;
        }        

        // If successful returns the end-location of where this Rule matches the input 
        // at the given location, or -1 if failed 
        parse(p:Parser, index:number):number {        
            // Check that the index is valid  
            if (index < 0 || index > p.input.length)
                return failed;

            // Either we add a node to the parse tree, or do a regular parse 
            if (!this._createAstNode)
            {
                // When not creating nodes we just call the parse implementation 
                return this.parseImplementation(p, index);
            }
            else
            {                 
                // Remember the old AST node
                let oldAst = p.nodes;

                // Create a new AST node 
                let node = new AstNode(this, p.input, index);

                // Create a new array of child nodes
                p.nodes = []; 

                // Call the implementation of the parse function 
                node.end = this.parseImplementation(p, index);

                // If the parse failed then we can return 
                if (node.end === failed) {
                    // Restore the previous AST state 
                    p.nodes = oldAst; 
                    return failed;
                }

                // We succeeded, so update the children of this node 
                // with the "_ast"
                node.children = p.nodes;                

                // Restore the previous AST state 
                p.nodes = oldAst; 
                
                // We are going to add the node to the list of children 
                p.nodes.push(node);

                // Return the parse result 
                return node.end;
            }                              
        }

        // Defines the type of rules. Used for defining new rule types as combinators.
        // Warning: this modifies the rule, use "copy" first if you don't want to update the rule.
        setType(typeName:string) : Rule {
            this.type = typeName;
            return this;
        }

        // Sets the name of the rule, and the grammar 
        // Warning: this modifies the rule, use "copy" first if you don't want to update the rule.
        setName(grammarName:string, ruleName:string) : Rule {
            this.grammarName = grammarName;
            this.name = ruleName;
            return this;            
        }

        // Returns a default definition of the rule
        get definition() : string {
            return this.type + "(" + this.rules.map((r) => r.toString()).join(", ") + ")";
        }

        // Returns the name of trhe rule preceded by the grammar name and a "."
        get fullName() : string {
            return this.grammarName + "." + this.name
        }

        // Returns either the name of the rule, or it's definition
        get nameOrDefinition() : string {
            return this.name 
                ? this.fullName
                : this.definition;
        }

        // Returns a string representation of the rule 
        toString() : string {
            return this.nameOrDefinition;
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
            r.grammarName = this.grammarName;
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

        //  Returns true if any of the child rules are "ast rules" meaning they create nodes in the 
        // parse tree.
        get hasAstChildRule() : boolean {
            return this.rules.filter(r => r.isAstRule).length > 0;
        }

        // Returns true if this rule when parsed successfully will create a node in the parse tree 
        get isAstRule() : boolean{
            return this._createAstNode || (this.hasAstChildRule 
            && (this instanceof Sequence || this instanceof Choice || this instanceof Bounded));
        }

        // Returns a string that describes the AST nodes created by this rule.
        // Will throw an exception if this is not a valid AST rule (this.isAstRule != true)
        get astRuleDefn() : string {    
            let rules = this.rules.filter(r => r.isAstRule);        
            if (!rules.length)
                return this.name;
            if (rules.length == 1) {
                let result = rules[0].astRuleNameOrDefn;
                if (this instanceof Bounded)
                    result += "[" + this.min + "," + this.max + "]";     
                return result;
            }
            if (this instanceof Sequence)
                return "seq(" + rules.map(r => r.astRuleNameOrDefn).join(",") + ")";

            if (this instanceof Choice)
                return "choice(" + rules.map(r => r.astRuleNameOrDefn).join(",") + ")";
                
            throw "Internal error: not a valid AST rule";
        }

        // Returns a string that is either the name of the AST parse node, or a definition 
        // (schema) describing the makeup of the rules. 
        get astRuleNameOrDefn() : string {
            if (this._createAstNode) 
                return this.name;
            return this.astRuleDefn;
        }

        // Extensions to support method/property chaining a.k.a. fluent syntax
        get opt() : Rule { return opt(this); }
        get zeroOrMore() : Rule { return zeroOrMore(this); }
        get oneOrMore() : Rule { return oneOrMore(this); }
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
        butNot(r:RuleType) { return not(r).then(this); }
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
        type = "seq";

        constructor(rules:Rule[]) { super(rules); }

        parseImplementation(p:Parser, index:number): number {
            for (let r of this.rules) {
                index = r.parse(p, index);
                if (index === failed) return index;
            }
            return index;
        }

        get definition() : string {
            let result = this.rules.map((r) => r.toString()).join(" ");
            if (this.rules.length > 1)   
                result = "(" + result + ")";
            return result;
        }

        cloneImplementation() : Rule { return new Sequence(this.rules); }
    }
    
    // Tries to match each rule in order until one succeeds. Succeeds if any of the sub-rules succeed. 
    export class Choice extends Rule
    {
        type = "choice";

        constructor(rules:Rule[]) { super(rules); }

        parseImplementation(p:Parser, index:number): number {
            let state = p.nodes.length;
            for (let r of this.rules) {
                let result = r.parse(p, index);
                if (result === failed) {
                    // Throw away any created nodes
                    p.nodes.length = state;
                    continue;
                }
                return result;
            }
            return failed;
        }        

        match(p:Parser, index:number):boolean {
            for (let r of this.rules)
                if (r.match(p, index))
                    return true;
            return false;
        }

        get definition() : string {
            let result = this.rules.map((r) => r.toString()).join(" / ");
            if (this.rules.length > 1)   
                result = "(" + result + ")";
            return result;
        }

        cloneImplementation() : Rule { return new Choice(this.rules); }
    }

    // A generalization of several rules such as zeroOrMore (0+), oneOrMore (1+), opt(0 or 1),
    // When matching with an unbounded upper limit set the maxium to  -1   
    export class Bounded extends Rule
    {    
        type = "bounded";

        constructor(rule:Rule, public min:number=0, public max:number=Infinity) { super([rule]); }

        parseImplementation(p:Parser, index:number): number {
            let result = index;
            // This can loop forever 
            for (let i=0; i < this.max; ++i) {
                let tmp = this.firstChild.parse(p, result);
                // If parsing the rule fails, we return the last result, or failed 
                // if the minimum number of matches is not met. 
                if (tmp === failed)
                    return (i >= this.min) ? result : failed;
                // Check for progress, to assure we aren't hitting an infinite loop  
                if (this.max < 0) 
                    if (result === tmp)
                        throw Exceptions.MissingOverride;
                // Check we don't go past the end of the input 
                if (i > p.input.length)
                    return failed;
                result = tmp;
            }            
            return result;
        }

        get definition() : string {            
            if (this.min == 0 && this.max == 1)
                return this.firstChild.toString() + "?";
            if (this.min == 0 && this.max == Infinity)
                return this.firstChild.toString() + "*";
            if (this.min == 1 && this.max == Infinity)
                return this.firstChild.toString() + "+";
            return this.firstChild.toString() + "{" + this.min + "," + this.max + "}";
         }

        cloneImplementation() : Rule { return new Bounded(this.firstChild, this.min, this.max); }
    }

    // Advances the parser by one token unless at the end
    export class Advance extends Rule
    {
        type = "advance";
        constructor() { super([]); }
        parseImplementation(p:Parser, index:number): number { return index < p.input.length ? index+1 : failed; }
        get definition() : string {
            return ".";
        }
        cloneImplementation() : Rule { return new Advance(); }                
    }

    // Uses a lookup table to find the next rule to parse next from the current token 
    export class Lookup extends Rule
    {
        type = "lookup";
        constructor(public lookup:any, public onDefault:Rule) { super([]); }        
        parseImplementation(p:Parser, index:number): number {
            if (index >= p.input.length)
                return failed;
            let tkn = p.input[index];
            let r = this.lookup[tkn];
            if (r !== undefined) 
                return r.parse(index);
            return this.onDefault.parse(p, index);
        }           
        get definition() : string {
            return '{' + Object.keys(this.lookup).map(k => '"' + escapeChars(k)  + '" :' + this.lookup[k].toString()).join(',') + '}';
        }
        cloneImplementation() : Rule { return new Lookup(this.lookup, this.onDefault); }
    }

    // Creates a dictionary from a set of tokens, mapping each one to the same rule.     
    export function tokensToDictionary(tokens:string[], rule:RuleType)
    {
        let d = {};
        for (let t of tokens) {
            if (t in d)
                throw Exceptions.TokenIncludedTwiceInLookup;                
            d[t] = RuleTypeToRule(rule);
        }
        return d;
    }

    // A specialization of the lookup 
    export class CharSet extends Lookup {
        type = "charSet";
        constructor(public chars:string) { 
            super(tokensToDictionary(chars.split(""), advance), falsePredicate);
        }
        get definition() : string { return "[" + escapeChars(this.chars) + "]"};
        cloneImplementation() : Rule { return new CharSet(this.chars); }        
    }

    // A specialization of the lookup 
    export class NegatedCharSet extends Lookup {
        type = "negatedCharSet";
        constructor(public chars:string) { 
            super(tokensToDictionary(chars.split(""), falsePredicate), truePredicate);
        }
        get definition() : string { return "[^" +  escapeChars(this.chars) + "]"};
        cloneImplementation() : Rule { return new NegatedCharSet(this.chars); }        
    }

    // Creates a dictionary from a range of tokens, mapping each one to the same rule.
    export function rangeToDictionary(min:string, max:string, rule:RuleType) {
        if (min.length != 1 || max.length != 1)
            throw Exceptions.RangeRequiresChars;
        let minChar = min.charCodeAt(0);
        let maxChar = max.charCodeAt(0);
        let d = {};
        for (let x=minChar; x <= maxChar; ++x)
            d[String.fromCharCode(x)] = rule;
        return d;
    }

    // Advances if the current token is within a range of characters, otherwise returns false
    export class CharRange extends Lookup {
        type = "charRange";
        constructor(public min:string, public max:string) { 
            super(rangeToDictionary(min, max, advance), falsePredicate); 
        }
        get definition() : string { return "[" + this.min + ".." + this.max + "]"};
        cloneImplementation() : Rule { return new CharRange(this.min, this.max); }            
    }

    // Used to match a string in the input string 
    export class Text extends Rule
    {
        type = "text";
        constructor(public text:string) { super([]); }
        parseImplementation(p:Parser, index:number): number {
            if (index > p.input.length - this.text.length) return failed;
            for (let i=0; i < this.text.length; ++i) 
                if (p.input[index+i] !== this.text[i])
                    return failed;
            return index + this.text.length;
        }
        get definition() : string { return '"' + escapeChars(this.text) + '"' };
        cloneImplementation() : Rule { return new Text(this.text); }        
    }

    // Creates a rule that is defined from a function that generates the rule. 
    // This allows two rules to have a cyclic relation. 
    export class Delay extends Rule 
    {
        type = "delay";
        constructor(public fn:()=>Rule) { super([]); }        
        parseImplementation(p:Parser, index:number): number { return this.fn().parse(p, index); }
        cloneImplementation() : Rule { return new Delay(this.fn); }    
        get definition() : string { return "delay(" + this.fn() + ")"; }    
    } 

    //=======================================
    // Zero length rules 

    // A PredicateRule that does not advance the input and does not create parse nodes in the tree.
    export class PredicateRule extends Rule
    {            
        // Rules derived from a PredicateRule will only provide an override 
        // of the match function, so the parse is defined in terms of match.  
        // This prevents the creation of parse nodes.     
        parse(p:Parser, index:number):number {
            let result = failed;
            // We create a new array of children 
            // New nodes will parse this, but will get thrown away if it fails. 
            let state = p.nodes.length;
            if (this.match(p, index))
                result = index;
            // This discards any nodes created and restores
            p.nodes.length = state;
            return result;
        } 
    }

    // Returns true only if the child rule fails to match.
    export class Not extends PredicateRule
    {
        type = "not";
        constructor(rule:Rule) { super([rule]); }
        match(p:Parser, index:number):boolean { return !this.firstChild.match(p, index); }
        cloneImplementation() : Rule { return new Not(this.firstChild); }
        get definition() : string { return "!" + this.firstChild.toString(); }
    }   

    // Returns true only if the child rule matches, but does not advance the parser
    export class At extends PredicateRule
    {
        type = "at";
        constructor(rule:Rule) { super([rule]); }
        match(p:Parser, index:number):boolean { return this.firstChild.match(p, index); }
        cloneImplementation() : Rule { return new At(this.firstChild); }
        get definition() : string { return "&" + this.firstChild.toString(); }
    }   

    // Uses a function to return true or not based on the behavior of the predicate rule
    export class Predicate extends PredicateRule
    {
        type = "predicate";
        constructor(public fn:(p:Parser, index:number)=>boolean) { super([]); }
        match(p:Parser, index:number):boolean { return this.fn(p, index); }
        cloneImplementation() : Rule { return new Predicate(this.fn); }        
        get definition() : string { return "predicate(" + this.fn + ")"; }
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

    // Enables Rules to be defined in terms of variables that are defined later on.
    // This enables recursive rule definitions.  
    export function delay(fxn:()=>RuleType) { 
        return new Delay(() => RuleTypeToRule(fxn())); 
    }

    // Parses successfully if the given rule does not match the input at the current location  
    export function not(rule:RuleType) { 
        return new Not(RuleTypeToRule(rule)); 
    };

    // Attempts to apply a rule between min and max number of times inclusive. If the maximum is set to Infinity, 
    // it will attempt to match as many times as it can, but throw an exception if the parser does not advance 
    export function bounded(rule:RuleType, min:number=0, max:number=Infinity) { 
        return new Bounded(RuleTypeToRule(rule), min, max); 
    }

    // Attempts to apply the rule 0 or more times. Will always succeed unless the parser does not 
    // advance, in which case an exception is thrown.    
    export function zeroOrMore(rule:RuleType) { 
        return bounded(rule).setType("zeroOrMore"); 
    };

    // Attempts to apply the rule 1 or more times. Will throw an exception if the parser does not advance.  
    export function oneOrMore(rule:RuleType)  { 
        return bounded(rule, 1).setType("oneOrMore"); 
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
        return new Lookup(tokensToDictionary(tokens, rule), RuleTypeToRule(onDefault));
    }

    //===============================================================    
    // Character set rules

    // Returns true if one of the characters is present, but does not advance the parser position
    export function atChar(chars:string) { return at(char(chars)); }

    // Returns true if none of the characters are present, but does not advance the parser position 
    export function notAtChar(chars:string) { return not(char(chars)); }

    // Advances if none of the characters are present.
    export function charExcept(chars:string) { return notAtChar(chars).advance; }    

    // Returns true if one of the characters are present, and advances the parser position
    export function char(chars:string) { return new CharSet(chars); }    

    // Advances if one of the characters are present, or returns false
    export function range(min:string, max:string) { return new CharRange(min, max); }

    // Advance if on of the characters are not in the range
    export function exceptRange(min:string, max:string) { return range(min, max).not.then(advance); }

    //===============================================================    
    // Advanced rule operators 
    
    export function delimited(rule:RuleType, delimiter:RuleType) { return opt(seq(rule, zeroOrMore(seq(delimiter, rule)))).setType("delimitedList"); }
    export function except(condition:RuleType, rule:RuleType) { return seq(not(condition), rule).setType("except"); }        
    export function repeatWhileNot(body:RuleType, condition:RuleType) { return zeroOrMore(except(condition, body)).setType("whileNot"); }
    export function repeatUntilPast(body:RuleType, condition:RuleType) { return seq(repeatWhileNot(body, condition), condition).setType("repeatUntilPast"); }
    export function advanceWhileNot(rule:RuleType) { return not(rule).advance.zeroOrMore.setType("advanceWhileNot"); }
    export function advanceUntilPast(rule:RuleType) { return seq(advanceWhileNot(rule), rule).setType("advanceUntilPast"); }
    export function advanceUnless(rule:RuleType) { return advance.butNot(rule).setType("advanceUnless"); }

    //===============================================================    
    // Predicates and actions  
    
    export function predicate(fn:(p:Parser, index:number)=>boolean) { return new Predicate(fn); }
    export function action(fn:(p:Parser, index:number)=>void) { return predicate((p, index)=> { fn(p, index); return true; }).setType("action"); }
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

    // Create an array rule by injecting another rule in between each pairs
    export function join(sep:RuleType, ...xs:RuleType[]) : RuleType[] {
        let r=[];
        for (var i=0; i < xs.length; ++i) {
            if (i > 0) r.push(sep);
            r.push(xs[i]);
        } 
        return r;
    }

    // Given a list of rules, maps the text to keywords 
    export function keywordMap(...rules:RuleType[]) { return rules.map((r) => typeof r == "string" ? keyword(r) : r); } 

    // Add whitespace matching rule in between each other rule. 
    export function seqWs(...rules:RuleType[]) { return seq(...join(ws, ...rules)); } 

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
        
    export let truePredicate    = predicate((p, index) => true);
    export let falsePredicate   = predicate((p, index) => false);        
    export let end              = predicate((p, index) => index >= p.input.length);
    export let notEnd           = predicate((p, index) => index < p.input.length);
    export let advance          = new Advance();   
    export let all              = advance.zeroOrMore;
    export let letterLower      = range('a','z');
    export let letterUpper      = range('A','Z');
    export let letter           = choice(letterLower, letterUpper);
    export let letters          = letter.oneOrMore;
    export let digit            = range('0', '9');
    export let digits           = digit.oneOrMore;
    export let digitNonZero     = range('1', '9');
    export let integer          = choice('0', seq(digitNonZero, digit.zeroOrMore));
    export let hexDigit         = choice(digit,range('a','f'), range('A','F'));
    export let binaryDigit      = char('01');
    export let octalDigit       = range('0','7');
    export let alphaNumeric     = choice(letter, digit);
    export let underscore       = text("_");
    export let identifierFirst  = choice(letter, underscore);
    export let identifierNext   = choice(alphaNumeric, underscore);     
    export let identifier       = seq(identifierFirst, identifierNext.zeroOrMore);     
    export let hyphen           = text("-");
    export let crlf             = text("\r\n");
    export let newLine          = choice(crlf, "\n");          
    export let space            = text(" ");
    export let tab              = text("\t");    
    export let ws               = char(" \t\r\n\u00A0\uFEFF").zeroOrMore;    
    export let wordChar         = letter.or(char("-'"));
    export let word             = letter.then(wordChar.zeroOrMore);    
        
    //===============================================================
    // Grammar functions 
    
    // The following are helper functions for grammar objects. A grammar is a loosely defined concept.
    // It is any JavaScript object where one or more member fields are instances of the Rule class.    

    // Returns all rules that belong to a specific grammar and that create AST nodes. 
    export function grammarAstRules(grammarName:string) {
        return grammarRules(grammarName).filter(r => r._createAstNode);
    }

    // Returns all rules that belong to a specific grammar
    export function grammarRules(grammarName:string) {
        return allGrammarRules().filter(r => r.grammarName == grammarName);
    }

    // Returns all rules as an array sorted by name.
    export function allGrammarRules() {
        return Object.keys(allRules).sort().map(k => allRules[k]);
    }

    // Returns an array of names of the grammars
    export function grammarNames() : string[] {
        return Object.keys(grammars).sort();
    }
        
    // Creates a string representation of a grammar 
    export function grammarToString(grammarName:string) : string {
        return grammarRules(grammarName).map(r => r.fullName + " <- " + r.definition).join('\n');
    }

    // Creates a string representation of the AST schema generated by parsing the grammar 
    export function astSchemaToString(grammarName:string) : string {
        return grammarAstRules(grammarName).map(r => r.name + " <- " + r.astRuleDefn).join('\n');
    }

    // Creates and initializes a Grammar object from a constructor.  
    // Sets names for all of the rules from the name of the field it is associated with combined with the 
    // name of the grammar. Each rule is stored in Myna.rules and each  grammar is stored in Myna.grammars. 
    export function registerGrammar(grammarName:string, grammarCtor:(Myna)=>void)
    {
        let grammar = new grammarCtor(this);
        initializeGrammar(grammarName, grammar);
    }

    // Given a constructed grammar, stores it and its rules, and sets the name of the rules/
    export function initializeGrammar(grammarName:string, grammar:any)
    {
        for (let k in grammar) {
            if (grammar[k] instanceof Rule) {
                let rule = grammar[k];
                rule.setName(grammarName, k);
                allRules[rule.fullName] = rule;
            }
        }
        grammars[grammarName] = grammar;
    }

    //===========================================================================
    // Utility functions

    export function escapeChars(text:string) {
        let r = JSON.stringify(text);
        return r.slice(1, r.length - 1);
    }
}

// Export the function for use with Node.js and the CommonJS module system. 
// In TypeScript we have to "declare" the module variable to make it a valid symbol, 
// before we check if it exists. 
declare let module;
if (typeof module === "object" && module.exports) 
    module.exports = Myna;
