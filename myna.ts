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
    // A special immutable class used internally for creating AstNodes 
    class NodeBldr
    {
        constructor(
            public rule:Rule = null, 
            public begin:ParseState = null,
            public end:ParseState = null,
            public nodes:NodeBldr = null)
        { }

        // Adds a new AstNode to the NodeBldr 
        addNode(rule:Rule, begin:ParseState, end:ParseState):NodeBldr {
            return new NodeBldr(rule, begin, end, this);
        }

        // Creates an AstNode from the NodeBldr 
        toAst() : AstNode {
            // TODO: create the child arrays and stuff
            return this.begin && this.end  
                ? new AstNode(this.rule, this.begin.input, this.begin.index, this.end.index)
                : null;
        }
    }

    // This stores the state of the parser and is passed to the parse and match functions.
    export class ParseState
    {
        code = -1;

        constructor(
            public input:string, 
            public index:number,
            public nodes:NodeBldr)
        { 
            this.code = input.charCodeAt(index);
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
        advance(n:number=1) : ParseState {
            return new ParseState(this.input, this.index+n, this.nodes);
        }

        // Creates a new ParseState with a node added to it.
        addNode(rule:Rule, begin:ParseState):ParseState {
            return new ParseState(this.input, this.index, this.nodes.addNode(rule, begin, this));
        }

        // Returns a string that helps debugging to figure out exactly where we are in the input string 
        get debugContext() : string {
            var contextWidth = 5;
            var start = this.index - contextWidth - 1;
            if (start < 0) start = 0;
            var prefix = this.input.slice(start, this.index - 1);
            var end = this.index + contextWidth;
            if (end >= this.input.length) end = this.input.length - 1;
            var postfix = this.input.slice(this.index, end);
            return prefix + ">>>" + this.input[this.index] + "<<<" + postfix;
        }
    }

    // Returns the root node of the abstract syntax tree created 
    // by parsing the rule. 
    export function parse(r : Rule, s : string) : AstNode
    {
        var p = new ParseState(s, 0, new NodeBldr());        
        p = r.ast.parser(p);  
        return p ? p.nodes.toAst() : null;
    }

    // Returns an array of nodes created by parsing the given rule repeatedly until 
    // it fails or the end of the input is arrived. One Astnode is created for each time 
    // the token is parsed successfully, whether or not it explicitly has the "_createAstNode" 
    // flag set explicitly. 
    export function tokenize(r:Rule, s:string) : AstNode[]
    {
        var result = this.parse(r.ast.zeroOrMore, s);
        return result ? result.children : [];
    }
        
    //====================================================================================
    // Internal variables used by the Myna library

    // A lookup table of all grammars registered with the Myna module 
    export var grammars = {}

    // A lookup table of all named rules registered with the Myna module
    export var allRules = {}

    // Generates a new ID for each rule 
    var _nextId = 0;
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
        // The list of child nodes in the parse tree. 
        // This is not allocated unless used, to minimize memory consumption 
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
                for (var c of this.children) 
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

        // A parser function, computed in a rule's constructor
        parser : (ParseState)=>ParseState = null;

        // Note: child-rules are exposed as a public field
        constructor(
            public rules:Rule[]) 
        { }

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

        // Returns the name of the rule preceded by the grammar name and a "."
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
            var r = this.cloneImplementation();
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
            var r = this.copy;
            r._createAstNode = true;
            var parser = r.parser;
            r.parser = p => {
                var result = parser(p);
                if (result == null) return null;
                return result.addNode(r, p); 
            }
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
            var rules = this.rules.filter(r => r.isAstRule);        
            if (!rules.length)
                return this.name;
            if (rules.length == 1) {
                var result = rules[0].astRuleNameOrDefn;
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

        constructor(rules:Rule[]) { 
            super(rules); 
            var parsers = this.rules.map(r => r.parser);
            var len = parsers.length;
            this.parser = p => {
                for (var i = 0; i < len; ++i) 
                    if (!(p = parsers[i](p))) 
                        return null;
                return p;
            };
        }

        get definition() : string {
            var result = this.rules.map((r) => r.toString()).join(" ");
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

        constructor(rules:Rule[]) { 
            super(rules);
            var parsers = this.rules.map(p => p.parser);
            var len = parsers.length;
            this.parser = p => {
                var tmp = null;
                for (var i = 0; i < len; ++i) 
                    if (tmp = parsers[i](p)) 
                        return tmp;
                return null;
            };
        }

        get definition() : string {
            var result = this.rules.map((r) => r.toString()).join(" / ");
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
       
        constructor(rule:Rule, public min:number=0, public max:number=Infinity) { 
            super([rule]); 
            var pChild = this.firstChild.parser;
            this.parser = p => {
                var result = p;
                for (var i=0; i < max; ++i) {
                    var tmp = pChild(result);

                    // If parsing the rule fails, we return the last result, or failed 
                    // if the minimum number of matches is not met. 
                    if (tmp == null) 
                        return i >= min ? result : null;

                    // Check for progress, to assure we aren't hitting an infinite loop  
                    // Without this it is possible to accidentally put a zeroOrMore with a predicate.
                    // For example: myna.truePredicate.zeroOrMore would loop forever 
                    if (max === Infinity && result.index === tmp.index)
                        throw new Error("Infinite loop: unbounded quanitifed rule is not making progress");

                    result = tmp;
                }            
                return result;
            };
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
    // Never creates a node.
    export class Advance extends Rule
    {
        type = "advance";
        className = "Advance";
        constructor() { super([]); this.parser = p => p.inRange ? p.advance() : null; }
        get definition() : string { return "<advance>"; }
        cloneImplementation() : Rule { return new Advance(); }                
    }

    // Uses a character lookup table to find the next rule to parse next from the current token 
    // Character lookups must be ASCII characters having a character code in the range of [0..255]
    export class Lookup extends Rule
    {
        type = "lookup";
        className = "Lookup";
        constructor(public lookup:any, public onDefault:Rule) { 
            super([]); 
            var table = [];
            var defaultParser = this.onDefault.parser;
            for (var i=0;i<255;++i)
                table[i] = defaultParser;
            for (var k in lookup) {
                if (k.length != 1)
                    throw new Error("A lookup table has to have exactly one element");
                var val = k.charCodeAt(0);
                table[val] = lookup[k].parser;
            }
            this.parser = p => {
                if (!p.inRange) return null;
                var tkn = p.code;
                var parser = table[tkn];
                if (parser) 
                    return parser(p);
                return defaultParser(p);
            };
        }           
        get definition() : string {
            return '{' + Object.keys(this.lookup).map(k => '"' + escapeChars(k)  + '" :' + this.lookup[k].toString()).join(',') + '}';
        }
        cloneImplementation() : Rule { return new Lookup(this.lookup, this.onDefault); }
    }

    // A specialization of the lookup 
    export class CharSet extends Lookup {
        type = "charSet";
        className = "CharSet";
        constructor(public chars:string) { super(charsToDictionary(chars, advance), falsePredicate); }
        get definition() : string { return "[" + escapeChars(this.chars) + "]"};
        cloneImplementation() : Rule { return new CharSet(this.chars); }        
    }

    // A specialization of the lookup 
    // Advances if the current token is within a range of characters, otherwise returns false
    export class CharRange extends Lookup {
        type = "charRange";
        className = "CharRange";
        constructor(public min:string, public max:string) { super(charRangeToDictionary(min, max, advance), falsePredicate); }
        get definition() : string { return "[" + this.min + ".." + this.max + "]"};
        cloneImplementation() : Rule { return new CharRange(this.min, this.max); }            
    }

    // Used to match a string in the input string 
    export class Text extends Rule
    {
        type = "text";
        className = "Text";
        constructor(public text:string) { 
            super([]); 
            var length = text.length;
            this.parser = p => {
                for (var i=0; i < length; ++i, p = p.advance()) 
                    if (!p || p.code !== text.charCodeAt(i))
                        return null;
                return p;
            };
        }           
        get definition() : string { return '"' + escapeChars(this.text) + '"' }
        cloneImplementation() : Rule { return new Text(this.text); }        
    }

    // Used to match a single character in the input string 
    export class Char extends Rule
    {
        type = "char";
        className = "Char";
        constructor(public text:string) { 
            super([]); 
            if (text.length != 1) 
                throw new Error("Expected a single character");
            var code = text.charCodeAt(0);
            this.parser = p => {
                return p.code == code ? p.advance() : null;
            };
        }           
        get definition() : string { return '"' + escapeChars(this.text) + '"' }
        cloneImplementation() : Rule { return new Text(this.text); }        
    }

    // Creates a rule that is defined from a function that generates the rule. 
    // This allows two rules to have a cyclic relation. 
    export class Delay extends Rule 
    {
        type = "delay";
        className = "Delay";
        constructor(public fn:()=>Rule) { 
            super([]); 
            var tmp = null;
            this.parser = p => (tmp ? tmp : tmp = fn().parser)(p);
        }
        cloneImplementation() : Rule { return new Delay(this.fn); }    
        get definition() : string { return "delay(" + this.fn() + ")"; }    
    } 

    //=======================================
    // Zero length rules: they don't create nodes 

    // Returns true only if the child rule fails to match.
    export class Not extends Rule
    {
        type = "not";
        className = "Not";
        constructor(rule:Rule) { 
            super([rule]); 
            var child = rule.parser; 
            this.parser = p => child(p) ? null : p;
        }
        cloneImplementation() : Rule { return new Not(this.firstChild); }
        get definition() : string { return "!" + this.firstChild.toString(); }
    }   

    // Returns true only if the child rule matches, but does not advance the parser
    export class At extends Rule
    {
        type = "at";
        className = "At";
        constructor(rule:Rule) { 
            super([rule]); 
            var child = rule.parser; 
            this.parser = p => child(p) ? p : null;
        }
        cloneImplementation() : Rule { return new At(this.firstChild); }
        get definition() : string { return "&" + this.firstChild.toString(); }
    }   

    // Uses a function to return true or not based on the behavior of the predicate rule
    export class Predicate extends Rule
    {
        type = "predicate";
        className = "Predicate";
        constructor(public fn:(p:ParseState)=>boolean) {
            super([]); 
            this.parser = p => fn(p) ? p : null;
        }
        cloneImplementation() : Rule { return new Predicate(this.fn); }        
        get definition() : string { return "<predicate>"; }
    }
    
    // Returns true always 
    export class TruePredicate extends Rule
    {
        type = "true";
        className = "TruePredicate";
        constructor() { super([]); this.parser = p => p; }
        cloneImplementation() : Rule { return new TruePredicate(); }        
        get definition() : string { return "<true>"; }
    }
    
    // Returns false always 
    export class FalsePredicate extends Rule
    {
        type = "false";
        className = "FalsePredicate";
        constructor() { super([]); this.parser = p => null; }
        cloneImplementation() : Rule { return new FalsePredicate(); }        
        get definition() : string { return "<false>"; }
    }
    
    // Returns true if at the end of the input, or false otherwise
    export class AtEndPredicate extends Rule
    {
        type = "end";
        className = "AtEndPredicate";
        constructor() { super([]); this.parser = p => !p.inRange ? p : null; }
        cloneImplementation() : Rule { return new AtEndPredicate(); }        
        get definition() : string { return "<end>"; }
    }

    // Returns true if the character is not in the character set, false otherwise
    export class NegatedCharSet extends Lookup {
        type = "negatedCharSet";
        className = "NegatedCharSet";
        constructor(public chars:string) { super(charsToDictionary(chars, falsePredicate), truePredicate); }
        get definition() : string { return "[^" +  escapeChars(this.chars) + "]"};
        cloneImplementation() : Rule { return new NegatedCharSet(this.chars); }        
    }    
    
    // Returns true if the character is not in the character set, false otherwise
    export class NegatedCharRange extends Lookup {
        type = "negatedCharRange";
        className = "NegatedCharRange";
        constructor(public min:string, public max:string) {  super(charRangeToDictionary(min, max, falsePredicate), truePredicate); }
        get definition() : string { return "[^" + this.min + ".." + this.max + "]"};
        cloneImplementation() : Rule { return new CharRange(this.min, this.max); }            
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
    export function lookup(table:any, onDefault:RuleType=false) {
        return new Lookup(table, RuleTypeToRule(onDefault));
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
    export function char(chars:string) { return chars.length == 1 ? new Char(chars) : new CharSet(chars); }    

    // Advances if one of the characters are present, or returns false
    export function range(min:string, max:string) { return new CharRange(min, max); }

    // Returns true if on of the characters are not in the range, but does not advance the parser position
    export function notRange(min:string, max:string) { return new NegatedCharRange(min, max); }

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
    
    export function predicate(fn:(p:ParseState)=>boolean) { return new Predicate(fn); }
    export function action(fn:(p:ParseState)=>void) { return predicate((p)=> { fn(p); return true; }).setType("action"); }
    export function log(msg:string = "") { return action(p=> { console.log(msg); }).setType("log"); }

    //==================================================================
    // Assertions and errors 

    export class ParseError extends Error 
    {
        constructor(public parser:ParseState, public message:string)
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
    
    //========================================================================    
    // Common sequences 

    export function doubleQuoted(rule:RuleType) { return seq("\"", rule, "\"").setType("doubleQuoted"); }
    export function singleQuoted(rule:RuleType) { return seq("'", rule, "'").setType("singleQuoted"); }
    export function parenthesized(rule:RuleType) { return seq("(", ws, rule, ws, ")").setType("parenthesized"); }
    export function braced(rule:RuleType) { return seq("{", ws, rule, ws, "}").setType("braced"); }
    export function bracketed(rule:RuleType) { return seq("[", ws, rule, ws, "]").setType("bracketed"); }
    export function tagged(rule:RuleType) { return seq("<", ws, rule, ws, ">").setType("tagged"); }
         
    // A complete identifier, with no other letters or numbers
    export function keyword(text:string) { return seq(text, not(identifierNext)).setType("keyword"); }
    export function keywords(...words:string[]) { return choice(...words.map(keyword)); }

    //===============================================================    
    // Core grammar rules 
        
    export var truePredicate    = new TruePredicate();
    export var falsePredicate   = new FalsePredicate();
    export var end              = new AtEndPredicate();
    export var notEnd           = end.not;
    export var advance          = new Advance();   
    export var all              = advance.zeroOrMore;
    export var letterLower      = range('a','z');
    export var letterUpper      = range('A','Z');
    export var letter           = choice(letterLower, letterUpper);
    export var letters          = letter.oneOrMore;
    export var digit            = range('0', '9');
    export var digits           = digit.oneOrMore;
    export var digitNonZero     = range('1', '9');
    export var integer          = choice('0', seq(digitNonZero, digit.zeroOrMore));
    export var hexDigit         = choice(digit,range('a','f'), range('A','F'));
    export var binaryDigit      = char('01');
    export var octalDigit       = range('0','7');
    export var alphaNumeric     = choice(letter, digit);
    export var underscore       = text("_");
    export var identifierFirst  = choice(letter, underscore);
    export var identifierNext   = choice(alphaNumeric, underscore);     
    export var identifier       = seq(identifierFirst, identifierNext.zeroOrMore);     
    export var hyphen           = text("-");
    export var crlf             = text("\r\n");
    export var newLine          = choice(crlf, "\n");          
    export var space            = text(" ");
    export var tab              = text("\t");    
    // TODO: figure out how to support unicode characters.
    //export var ws               = char(" \t\r\n\u00A0\uFEFF").zeroOrMore;    
    export var ws               = char(" \t\r\n").zeroOrMore;    
    export var wordChar         = letter.or(char("-'"));
    export var word             = letter.then(wordChar.zeroOrMore);    
        
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
        var r = { class:rule.className };
        if (rule.name)
            r['name'] = rule.name;
        if (rule instanceof Text)
            return "Text:" + rule.text;
        if (rule instanceof Lookup) {
            r['lookup'] = {}; 
            for (var r2 in rule.lookup)
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
        for (var k in grammar) {
            if (grammar[k] instanceof Rule) {
                var rule = grammar[k];
                rule.setName(grammarName, k);
                allRules[rule.fullName] = rule;
            }
        }
        grammars[grammarName] = grammar;
        return grammar;
    }

    //===========================================================================
    // Utility functions

    // Replaces characters with the JSON escaped version
    export function escapeChars(text:string) {
        var r = JSON.stringify(text);
        return r.slice(1, r.length - 1);
    }

    // Creates a dictionary from a set of tokens, mapping each one to the same rule.     
    function charsToDictionary(chars:string, rule:RuleType)
    {
        var d = {};
        var tokens = chars.split("");
        for (var t of tokens) 
            d[t] = RuleTypeToRule(rule);
        return d;
    }

    // Creates a dictionary from a range of tokens, mapping each one to the same rule.     
    function charRangeToDictionary(min:string, max:string, rule:RuleType)
    {
        if (min.length != 1 || max.length != 1)
            throw new Error("rangeToDictionary requires characters as inputs");
        var d = {};
        var a = min.charCodeAt(0);
        var b = max.charCodeAt(0);
        for (var i=a; i <= b; ++i)  
            d[String.fromCharCode(i)] = RuleTypeToRule(rule);
        return d;
    }

    //===========================================================================
    // Initialization

    // The entire module is a grammar because it is an object that exposes rules as properties
    registerGrammar("core", Myna);
}

// Export the function for use with Node.js and the CommonJS module system. 
// In TypeScript we have to "declare" the module variable to make it a valid symbol, 
// before we check if it exists. 
declare var module;
if (typeof module === "object" && module.exports) 
    module.exports = Myna;
