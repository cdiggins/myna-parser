// Myna Parsing Library
// Copyright (c) 2016 Christopher Diggins
// Usage permitted under terms of MIT License

// A parsing combinator library for JavaScript/TypeScript based on the PEG formalism.
// For more information see http://www.github.com/cdiggins/myna-parser

// NOTE: we are explicitly bypassing using the TypeScript "export" keyword for 
// the Myna module otherwise the module won't be usable from browsers without 
// using an additional moduler loader library. Instead we have manual  
// export code at the bottom of the file. 

module Myna
{   
    // This stores the state of the parser and is passed to the parse and match functions.
    export class Parser
    {        
        constructor(
            public input:string, 
            public index:number,
            public nodes:AstNode[])
        { }

        // Creates a copy of the parser, including a shallow copy of the nodes. 
        clone() : Parser {
            return new Parser(this.input, this.index, this.nodes.slice());
        }

        // Returns true if the index is within the input range. 
        get inRange() : boolean {
            return this.index >= 0 && this.index < this.input.length;
        }

        // Returns a string representation of the location. 
        get location() : string {
            return this.index.toString();
        }

        // Returns a shallow copy of the parser that advances its position
        advance(n:number=1) : Parser {
            return new Parser(this.input, this.index+n, this.nodes);
        }

        // Returns a string that helps debugging to figure out exactly where we are in the input string 
        get debugContext() : string {
            let contextWidth = 5;
            let start = this.index - contextWidth - 1;
            if (start < 0) start = 0;
            let prefix = this.input.slice(start, this.index - 1);
            let end = this.index + contextWidth;
            if (end >= this.input.length) end = this.input.length - 1;
            let postfix = this.input.slice(this.index, end);
            return prefix + " >>> " + this.input[this.index] + " <<< " + postfix;
        }
    }

    // Return true or false depending on whether the rule matches 
    // the beginning of the input string. 
    export function match(r:Rule, s:string) : boolean 
    {
        return r.match(new Parser(s, 0, []));        
    }

    // Returns the root node of the abstract syntax tree created 
    // by parsing the rule. 
    export function parse(r : Rule, s : string) : AstNode
    {
        let p = new Parser(s, 0, []);        
        p = r.ast.parse(p);  
        if (!p.nodes || !p.nodes.length)
            return undefined;
        if (p.nodes.length > 1)
            throw new Error("parse is returning more than one node");
        return p.nodes[0];        
    }

    // Returns an array of nodes created by parsing the given rule repeatedly until 
    // it fails or the end of the input is arrived. One Astnode is created for each time 
    // the token is parsed successfully, whether or not it explicitly has the "_createAstNode" 
    // flag set explicitly. 
    export function tokenize(r:Rule, s:string) : AstNode[]
    {
        let result = this.parse(r.ast.zeroOrMore, s);
        return result ? result.children : [];
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
        throw new Error("Invalid rule type: " + rule);
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

        // Identifies types of rules. Rules can have "types" that are different than the class name
        type:string = "";

        // Used to provide access to the name of the class 
        className:string = "Rule"

        // Indicates whether generated nodes should be added to the abstract syntax tree
        _createAstNode:boolean = false;

        // Note: child-rules are exposed as a public field
        constructor(
            public rules:Rule[]) 
        { }
        
        // Each rule derived object provides its own implementation of this function.  
        parseImplementation(p:Parser):Parser { 
            throw new Error("Missing override for parseImplementation");
        }

        // Returns true if this Rule matches the input at the given location and never creates nodes 
        match(p:Parser):boolean {
            return this.parseImplementation(p.clone()) != null;
        }        

        // If successful returns the end-location of where this Rule matches the input 
        // at the given location, or -1 if failed.
        // Note that PredicateRule overrides this function 
        parse(p:Parser):Parser {        
            // Either we add a node to the parse tree, or do a regular parse.
            if (!this._createAstNode)
                return this.parseImplementation(p);

            // Create a new AST node 
            let node = new AstNode(this, p.input, p.index);

            // Remember the old parser state
            let oldP = p.clone();
            
            // Create a new "node list" for the parser.
            // This is a new list of child nodes. It will be modified.
            p.nodes = [];

            // Call the implementation of the parse function 
            let result = this.parseImplementation(p);

            // If the parse failed, we return null
            if (!result) 
                return null;

            // The current nodes children is the parser node list 
            node.children = result.nodes;
            
            // Restore the parser's node list to what it was 
            result.nodes = oldP.nodes;
            
            // Add the node to the parser's node list 
            result.nodes.push(node);

            // Set the node's end index
            node.end = result.index;

            // return the parser
            return result;
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
        // Note: Every new rule class must override cloneImplemenation
        cloneImplementation() : Rule {
            throw new Error("Missing override for cloneImplementation");
        }

        // Returns a copy of this rule with all fields copied.  
        get copy() : Rule {
            let r = this.cloneImplementation();
            if (typeof(r) !== typeof(this))
                throw new Error("Error in implementation of cloneImplementation: not returning object of correct type");
            r.name = this.name;
            r.grammarName = this.grammarName;
            r.type = this.type;
            r._createAstNode = this._createAstNode;
            return r;
        }

        // Returns a copy of the rule that will create a node in the parse tree.
        // This property is the only way to create rules that generate nodes in a parse tree. 
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
            && (this instanceof Sequence || this instanceof Choice || this instanceof Quantified));
        }

        // Returns a string that describes the AST nodes created by this rule.
        // Will throw an exception if this is not a valid AST rule (this.isAstRule != true)
        get astRuleDefn() : string {    
            let rules = this.rules.filter(r => r.isAstRule);        
            if (!rules.length)
                return this.name;
            if (rules.length == 1) {
                let result = rules[0].astRuleNameOrDefn;
                if (this instanceof Quantified)
                    result += "[" + this.min + "," + this.max + "]";     
                return result;
            }
            if (this instanceof Sequence)
                return "seq(" + rules.map(r => r.astRuleNameOrDefn).join(",") + ")";

            if (this instanceof Choice)
                return "choice(" + rules.map(r => r.astRuleNameOrDefn).join(",") + ")";
                
            throw new Error("Internal error: not a valid AST rule");
        }

        // Returns a string that is either the name of the AST parse node, or a definition 
        // (schema) describing the makeup of the rules. 
        get astRuleNameOrDefn() : string {
            if (this._createAstNode) 
                return this.name;
            return this.astRuleDefn;
        }

        //======================================================
        // Extensions to support method/property chaining. 
        // This is also known as a fluent API syntax

        get opt() : Rule { return opt(this); }
        get zeroOrMore() : Rule { return zeroOrMore(this); }
        get oneOrMore() : Rule { return oneOrMore(this); }
        get at() : Rule { return at(this); }
        get not() : Rule { return not(this); }
        get advance() : Rule { return this.then(advance); }
        get ws() : Rule { return this.then(ws); }
        get all() : Rule { return this.then(all); }
        get end() : Rule { return this.then(end); }
        get assert() : Rule { return assert(this); }

        then(r:RuleType) : Rule { return seq(this, r); }
        thenAt(r:RuleType) : Rule { return this.then(at(r)); }
        thenNot(r:RuleType) : Rule { return this.then(not(r)); }
        or(r:RuleType) : Rule { return choice(this, r); } 
        until(r:RuleType) : Rule { return repeatWhileNot(this, r); }
        untilPast(r:RuleType) : Rule { return repeatUntilPast(this, r); }        
        repeat(count:number) { return repeat(this, count); }
        quantified(min:number, max:number) { return quantified(this, min, max); }
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
        className = "Sequence";

        constructor(rules:Rule[]) { super(rules); }

        parseImplementation(p:Parser): Parser {
            for (let r of this.rules) {
                p = r.parse(p);
                if (!p) return null;
            }
            return p;
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
        className = "Choice";

        constructor(rules:Rule[]) { super(rules); }

        parseImplementation(p:Parser): Parser {
            for (let r of this.rules) {
                let result = r.parse(p);
                if (result) 
                    return result;
            }
            return null;
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
    export class Quantified extends Rule
    {    
        type = "quantified";
        className = "Quantified";

        constructor(rule:Rule, public min:number=0, public max:number=Infinity) { super([rule]); }

        parseImplementation(p:Parser): Parser {
            let result = p;
            for (let i=0; i < this.max; ++i) {
                let tmp = this.firstChild.parse(result);

                // If parsing the rule fails, we return the last result, or failed 
                // if the minimum number of matches is not met. 
                if (tmp == null) 
                    return i >= this.min ? result : null;

                // Check for progress, to assure we aren't hitting an infinite loop  
                // Without this it is possible to accidentally put a zeroOrMore with a predicate.
                // For example: myna.truePredicate.zeroOrMore would loop forever 
                if (this.max == Infinity) 
                    if (result.index === tmp.index)
                        throw new Error("Infinite loop: unbounded quanitifed rule is not making progress");

                result = tmp;
            }            
            return result;
        }

        // Used for creating a human readable definition of the grammar.
        get definition() : string {            
            if (this.min == 0 && this.max == 1)
                return this.firstChild.toString() + "?";
            if (this.min == 0 && this.max == Infinity)
                return this.firstChild.toString() + "*";
            if (this.min == 1 && this.max == Infinity)
                return this.firstChild.toString() + "+";
            return this.firstChild.toString() + "{" + this.min + "," + this.max + "}";
         }

        cloneImplementation() : Rule { return new Quantified(this.firstChild, this.min, this.max); }
    }

    // Advances the parser by one token unless at the end
    export class Advance extends Rule
    {
        type = "advance";
        className = "Advance";
        constructor() { super([]); }
        parseImplementation(p:Parser): Parser { return p.inRange ? p.advance() : null; }
        get definition() : string { return "<advance>"; }
        cloneImplementation() : Rule { return new Advance(); }                
    }

    // Uses a lookup table to find the next rule to parse next from the current token 
    export class Lookup extends Rule
    {
        type = "lookup";
        className = "Lookup";
        constructor(public lookup:any, public onDefault:Rule) { super([]); }        
        parseImplementation(p:Parser): Parser {
            if (!p.inRange) return null;
            let tkn = p.input[p.index];
            let r = this.lookup[tkn];
            if (r !== undefined) 
                return r.parse(p);
            return this.onDefault.parse(p);
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
        for (let t of tokens) 
            d[t] = RuleTypeToRule(rule);
        return d;
    }

    // A specialization of the lookup 
    export class CharSet extends Lookup {
        type = "charSet";
        className = "CharSet";
        constructor(public chars:string) { 
            super(tokensToDictionary(chars.split(""), advance), falsePredicate);
        }
        get definition() : string { return "[" + escapeChars(this.chars) + "]"};
        cloneImplementation() : Rule { return new CharSet(this.chars); }        
    }

    // A specialization of the lookup 
    export class NegatedCharSet extends Lookup {
        type = "negatedCharSet";
        className = "NegatedCharSet";
        constructor(public chars:string) { 
            super(tokensToDictionary(chars.split(""), falsePredicate), truePredicate);
        }
        get definition() : string { return "[^" +  escapeChars(this.chars) + "]"};
        cloneImplementation() : Rule { return new NegatedCharSet(this.chars); }        
    }

    // Creates a dictionary from a range of tokens, mapping each one to the same rule.
    export function rangeToDictionary(min:string, max:string, rule:RuleType) {
        if (min.length != 1 || max.length != 1)
            throw new Error("rangeToDictionary requires characters as inputs");
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
        className = "CharRange";
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
        className = "Text";
        constructor(public text:string) { super([]); }
        parseImplementation(p:Parser): Parser {
            if (p.index > p.input.length - this.text.length)
                return null;
            for (let i=0; i < this.text.length; ++i) 
                if (p.input[p.index+i] !== this.text[i])
                    return null;
            return p.advance(this.text.length);
        }
        get definition() : string { return '"' + escapeChars(this.text) + '"' };
        cloneImplementation() : Rule { return new Text(this.text); }        
    }

    // Creates a rule that is defined from a function that generates the rule. 
    // This allows two rules to have a cyclic relation. 
    export class Delay extends Rule 
    {
        type = "delay";
        className = "Delay";
        constructor(public fn:()=>Rule) { super([]); }        
        parseImplementation(p:Parser): Parser { return this.fn().parse(p); }
        cloneImplementation() : Rule { return new Delay(this.fn); }    
        get definition() : string { return "delay(" + this.fn() + ")"; }    
    } 

    //=======================================
    // Zero length rules 

    // A MatchRule that does not advance the input
    export class MatchRule extends Rule
    {            
        className = "MatchRule";

        // Rules derived from a MatchRule will only provide an override 
        // of the match function, so the parse is ovverriden and defined in terms of match.  
        // The parser state is always restored. 
        parseImplementation(p:Parser):Parser 
        {
            // Remember the old parser state
            let oldP = p.clone();
            
            // The result of calling the derived parseImplementation
            let result = this.match(p);

            // Returns the position of the parser, or null
            return result ? oldP : null;
        } 
    }

    // Returns true only if the child rule fails to match.
    export class Not extends MatchRule
    {
        type = "not";
        className = "Not";
        constructor(rule:Rule) { super([rule]); }
        match(p:Parser):boolean { return !this.firstChild.match(p); }
        cloneImplementation() : Rule { return new Not(this.firstChild); }
        get definition() : string { return "!" + this.firstChild.toString(); }
    }   

    // Returns true only if the child rule matches, but does not advance the parser
    export class At extends MatchRule
    {
        type = "at";
        className = "At";
        constructor(rule:Rule) { super([rule]); }
        match(p:Parser):boolean { return this.firstChild.match(p); }
        cloneImplementation() : Rule { return new At(this.firstChild); }
        get definition() : string { return "&" + this.firstChild.toString(); }
    }   

    // Uses a function to return true or not based on the behavior of the predicate rule
    export class Predicate extends MatchRule
    {
        type = "predicate";
        className = "Predicate";
        constructor(public fn:(p:Parser)=>boolean) { super([]); }
        match(p:Parser):boolean { return this.fn(p); }
        cloneImplementation() : Rule { return new Predicate(this.fn); }        
        get definition() : string { return "<predicate>"; }
    }
    
    // Returns true always 
    export class TruePredicate extends MatchRule
    {
        type = "true";
        className = "TruePredicate";
        constructor() { super([]); }
        match(p:Parser):boolean { return true; }
        cloneImplementation() : Rule { return new TruePredicate(); }        
        get definition() : string { return "<true>"; }
    }
    
    // Returns false always 
    export class FalsePredicate extends MatchRule
    {
        type = "false";
        className = "FalsePredicate";
        constructor() { super([]); }
        match(p:Parser):boolean { return false; }
        cloneImplementation() : Rule { return new FalsePredicate(); }        
        get definition() : string { return "<false>"; }
    }
    
    // Returns true if at the end of the input, or false otherwise
    export class AtEndPredicate extends MatchRule
    {
        type = "end";
        className = "AtEndPredicate";
        constructor() { super([]); }
        match(p:Parser):boolean { return !p.inRange; }
        cloneImplementation() : Rule { return new AtEndPredicate(); }        
        get definition() : string { return "<end>"; }
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
    export function quantified(rule:RuleType, min:number=0, max:number=Infinity) { 
        return new Quantified(RuleTypeToRule(rule), min, max); 
    }

    // Attempts to apply the rule 0 or more times. Will always succeed unless the parser does not 
    // advance, in which case an exception is thrown.    
    export function zeroOrMore(rule:RuleType) { 
        return quantified(rule).setType("zeroOrMore"); 
    };

    // Attempts to apply the rule 1 or more times. Will throw an exception if the parser does not advance.  
    export function oneOrMore(rule:RuleType)  { 
        return quantified(rule, 1).setType("oneOrMore"); 
    }

    // Attempts to match a rule 0 or 1 times. Always succeeds.   
    export function opt(rule:RuleType)  { 
        return quantified(rule, 0, 1).setType("opt"); 
    };

    // Attempts to apply a rule a precise number of times
    export function repeat(rule:RuleType, count:number) { 
        return quantified(rule, count, count).setType("repeat"); 
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
    export function notAtChar(chars:string) { return new NegatedCharSet(chars); }

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
    
    export function predicate(fn:(p:Parser)=>boolean) { return new Predicate(fn); }
    export function action(fn:(p:Parser)=>void) { return predicate((p)=> { fn(p); return true; }).setType("action"); }
    export function log(msg:string = "") { return action(p=> { console.log(msg); }).setType("log"); }

    //==================================================================
    // Assertions and errors 

    export class ParseError extends Error 
    {
        constructor(public parser:Parser, public message:string)
        {
            super(message);
        }
    }

    export function err(message) { 
        return action(p=> { throw new ParseError(p, message); }).setType("err"); 
    }

    export function assert(rule:RuleType) { 
        return choice(rule, action(p => { 
            // This has to be embedded in a function because the rule might be in a circular definition.  
            throw new ParseError(p, "assertion failed, expected: " + RuleTypeToRule(rule)); 
        })).setType("assert"); 
    }
    
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
        
    export let truePredicate    = new TruePredicate();
    export let falsePredicate   = new FalsePredicate();
    export let end              = new AtEndPredicate();
    export let notEnd           = end.not;
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

    // Given a rule will output the full structure of the rule as a JSON object  
    // This is useful for debugging rules and rule transformations 
    export function ruleStructure(rule:Rule) : any {        
        let r = { class:rule.className };
        if (rule.name)
            r['name'] = rule.name;
        if (rule instanceof Text)
            return "Text:" + rule.text;
        if (rule instanceof Lookup) {
            r['lookup'] = {}; 
            for (let r2 in rule.lookup)
                //r['lookup'][r2] = ruleStructure(rule.lookup[r2]);
                r['lookup'][r2] = rule.lookup[r2].className;
            r['default'] = ruleStructure(rule.onDefault);
        }
        else {
            if (rule.rules.length == 0)
                return rule.name ? rule.name : rule.className;
            else
                r['rules'] = rule.rules.map(ruleStructure);
        }
        return r;
    }

    // Creates a string representation of the AST schema generated by parsing the grammar 
    export function astSchemaToString(grammarName:string) : string {
        return grammarAstRules(grammarName).map(r => r.name + " <- " + r.astRuleDefn).join('\n');
    }

    // Initializes and register a grammar object and all of the rules. 
    // Sets names for all of the rules from the name of the field it is associated with combined with the 
    // name of the grammar. Each rule is stored in Myna.rules and each grammar is stored in Myna.grammars. 
    export function registerGrammar(grammarName:string, grammar:any)
    {
        for (let k in grammar) {
            if (grammar[k] instanceof Rule) {
                let rule = grammar[k];
                rule.setName(grammarName, k);
                allRules[rule.fullName] = rule;
            }
        }
        grammars[grammarName] = grammar;
        return grammar;
    }

    //===========================================================================
    // Utility functions

    export function escapeChars(text:string) {
        let r = JSON.stringify(text);
        return r.slice(1, r.length - 1);
    }

    //===========================================================================
    // Initialization

    // The entire module is a grammar because it is an object that exposes rules as properties
    registerGrammar("core", Myna);
}

// Export the function for use with Node.js and the CommonJS module system. 
// In TypeScript we have to "declare" the module variable to make it a valid symbol, 
// before we check if it exists. 
declare let module;
if (typeof module === "object" && module.exports) 
    module.exports = Myna;
