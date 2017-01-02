// Myna Parsing Library
// Copyright (c) 2016 Christopher Diggins
// Usage permitted under terms of MIT License
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// A parsing combinator library for JavaScript/TypeScript based on the PEG formalism.
// For more information see http://www.github.com/cdiggins/myna-parser
// NOTE: we are explicitly bypassing using the TypeScript "export" keyword for 
// the Myna module otherwise the module won't be usable from browsers without 
// some using some additional library.   
var Myna;
(function (Myna) {
    //===============================================================
    // Global parse functions 
    // Called whenever a new parsing session is started  
    function _initialize(text) {
        _input = text;
        _stack = [new AstNode(null)];
    }
    Myna._initialize = _initialize;
    // Return true or false depending on whether the rule matches 
    // the beginning of the input string. 
    function match(r, s) {
        _initialize(s);
        return r.match(0);
    }
    Myna.match = match;
    // Returns the root node of the abstract syntax tree created 
    // by parsing the rule. If no exceptions are thrown, this will 
    // always return at least one node. If the content fails to parse 
    // the returned node will have an end position of "failed" (-1).  
    // Note that only rules returned from the ast 
    // property will add nodes in the tree (e.g. identifier.ast) when
    // parsed.
    function parse(r, s) {
        _initialize(s);
        var end = r.parse(0);
        if (_stack.length != 1)
            throw Exceptions.InternalStackError;
        var root = _stack[0];
        root.end = end;
        return root;
    }
    Myna.parse = parse;
    //====================================================================================
    // Exception values 
    // Possible exception values that can be thrown by the Myna parser   
    (function (Exceptions) {
        // Internal error: this is due to a rule object not overriding an abstract function  
        Exceptions[Exceptions["MissingOverride"] = 0] = "MissingOverride";
        // Internal error: this is due to an implementation error in how the parse function constructs the AST  
        Exceptions[Exceptions["InternalStackError"] = 1] = "InternalStackError";
        // Parser error: thrown when a repeated rule does not advance the input parser location. This is due to an invalid grammar construction.
        Exceptions[Exceptions["InfiniteLoop"] = 2] = "InfiniteLoop";
        // Grammar construction error: thrown when a rule operator is not given a valid Rule or string. 
        Exceptions[Exceptions["InvalidRuleType"] = 3] = "InvalidRuleType";
        // Internal error: thrown when an internal clone implementation returns the wrong type.  
        Exceptions[Exceptions["CloneInvalidType"] = 4] = "CloneInvalidType";
        // Grammar construction error: thrown when a range rule is given a min or max string that is not exactly one character long
        Exceptions[Exceptions["RangeRequiresChars"] = 5] = "RangeRequiresChars";
        // Grammar construction error: the same token is included twice in the lookup table. 
        Exceptions[Exceptions["TokenIncludedTwiceInLookup"] = 6] = "TokenIncludedTwiceInLookup";
    })(Myna.Exceptions || (Myna.Exceptions = {}));
    var Exceptions = Myna.Exceptions;
    //====================================================================================
    // Internal variables used by the Myna library
    // A lookup table of all grammars registered with the Myna module 
    Myna.grammars = {};
    // A lookup table of all named rules registered with the Myna module
    Myna.rules = {};
    // Generates a new ID for each rule 
    var _nextId = 0;
    function genId() {
        return _nextId++;
    }
    // The returned value of a failed parse
    var failed = -1;
    // This is the input text 
    var _input = "";
    // The call-stack of nodes. Used for constructing a parse tree 
    var _stack;
    // Given a RuleType returns an instance of a Rule.
    function RuleTypeToRule(rule) {
        if (rule instanceof Rule)
            return rule;
        if (typeof (rule) === "string")
            return text(rule);
        if (typeof (rule) === "boolean")
            return rule ? Myna.truePredicate : Myna.falsePredicate;
        throw Exceptions.InvalidRuleType;
    }
    Myna.RuleTypeToRule = RuleTypeToRule;
    //===============================================================
    // AstNode class 
    // Represents a node in the parse tree. 
    var AstNode = (function () {
        function AstNode(rule, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = failed; }
            this.rule = rule;
            this.start = start;
            this.end = end;
            this.children = null;
        }
        Object.defineProperty(AstNode.prototype, "contents", {
            get: function () { return _input.slice(this.start, this.end); },
            enumerable: true,
            configurable: true
        });
        return AstNode;
    }());
    Myna.AstNode = AstNode;
    //===============================================================
    // Rule class     
    // A Rule is both a rule in the PEG grammar and a parser. The parse function takes  
    // a particular parse location (in either a string, or array of tokens) and will return 
    // the location of the end of the parse if successful or the constant failed (-1)
    // if not successful.  
    var Rule = (function () {
        // Note: child-rules are exposed as a public field
        function Rule(rules) {
            this.rules = rules;
            // Identifies individual rule
            this.name = "";
            // Internal unique identifier
            this.id = genId();
            // Identifies types of rules.  
            this.type = "";
            // Indicates whether generated nodes should be added to the abstract syntax tree
            this._createAstNode = false;
        }
        // Each rule derived object provides its own implementation of this function.  
        Rule.prototype.parseImplementation = function (index) {
            throw Exceptions.MissingOverride;
        };
        // Returns true if this Rule matches the input at the given location 
        Rule.prototype.match = function (index) {
            // Check that the index is valid  
            if (index < 0 || index > _input.length)
                return false;
            return this.parseImplementation(index) != failed;
        };
        // If successful returns the end-location of where this Rule matches the input 
        // at the given location, or -1 if failed 
        Rule.prototype.parse = function (index) {
            // Check that the index is valid  
            if (index < 0 || index > _input.length)
                return failed;
            // Either we add a node to the parse tree, or do a regular parse 
            if (!this._createAstNode) {
                // When not creating nodes we just call the parse implementation 
                return this.parseImplementation(index);
            }
            else {
                // Create a node 
                var node = new AstNode(this, index);
                // Push it on the stack (it will be a parent for child parses)
                _stack.push(node);
                // Call the implementation of the parse function 
                var end_1 = this.parseImplementation(index);
                // Get the node from the stack (should be the same as the node variable here)
                var child = _stack.pop();
                if (child != node)
                    throw Exceptions.InternalStackError;
                // If the parse failed then we can return 
                if (end_1 === failed)
                    return failed;
                // Update the node
                child.end = end_1;
                // Peek at the current top of the stack which will be a new parent,
                // and add the node (child) to it. 
                if (_stack.length === 0)
                    throw Exceptions.InternalStackError;
                var parent_1 = _stack[_stack.length - 1];
                if (parent_1.children == null)
                    parent_1.children = new Array();
                parent_1.children.push(child);
                // Return the parse result 
                return end_1;
            }
        };
        // Defines the type of rules. Used for defining new rule types as combinators. 
        Rule.prototype.setType = function (typeName) {
            this.type = typeName;
            return this;
        };
        // Sets the name of the rule. 
        Rule.prototype.setName = function (name) {
            this.name = name;
            return this;
        };
        Object.defineProperty(Rule.prototype, "definition", {
            // Returns a default string representation of the rule's definition  
            get: function () {
                return "_" + this.type + "_";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "nameOrDefinition", {
            //  Returns the name or the definition if the name is not present
            get: function () {
                return this.name ? this.name : this.definition;
            },
            enumerable: true,
            configurable: true
        });
        // Returns a string representation of the rule in the PEG format   
        Rule.prototype.toString = function () {
            return this.name + "\t<- " + this.definition;
        };
        Object.defineProperty(Rule.prototype, "firstChild", {
            // Returns the first child rule
            get: function () {
                return this.rules[0];
            },
            enumerable: true,
            configurable: true
        });
        // Returns a copy of this rule with default values for all fields.  
        Rule.prototype.cloneImplementation = function () {
            throw Exceptions.MissingOverride;
        };
        Object.defineProperty(Rule.prototype, "copy", {
            // Returns a copy of this rule with all fields copied.  
            get: function () {
                var r = this.cloneImplementation();
                if (typeof (r) !== typeof (this))
                    throw Exceptions.CloneInvalidType;
                r.name = this.name;
                r.type = this.type;
                r._createAstNode = this._createAstNode;
                return r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "ast", {
            // Returns a copy of the rule that has the property it will create a node in the parse tree. 
            get: function () {
                var r = this.copy;
                r._createAstNode = true;
                return r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "opt", {
            // Extensions to support method/property chaining a.k.a. fluent syntax
            get: function () { return opt(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "star", {
            get: function () { return star(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "plus", {
            get: function () { return plus(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "not", {
            get: function () { return not(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "advance", {
            get: function () { return this.then(Myna.advance); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "ws", {
            get: function () { return this.then(Myna.ws); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "all", {
            get: function () { return this.then(Myna.all); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "end", {
            get: function () { return this.then(Myna.end); },
            enumerable: true,
            configurable: true
        });
        Rule.prototype.then = function (r) { return seq(this, r); };
        Rule.prototype.thenAt = function (r) { return this.then(at(r)); };
        Rule.prototype.thenNot = function (r) { return this.then(not(r)); };
        Rule.prototype.or = function (r) { return choice(this, r); };
        Rule.prototype.until = function (r) { return repeatWhileNot(this, r); };
        Rule.prototype.untilPast = function (r) { return repeatUntilPast(this, r); };
        Rule.prototype.repeat = function (count) { return repeat(this, count); };
        Rule.prototype.bounded = function (min, max) { return bounded(this, min, max); };
        Rule.prototype.delimited = function (delimiter) { return delimited(this, delimiter); };
        return Rule;
    }());
    Myna.Rule = Rule;
    //===============================================================
    // Rule derived classes 
    // These are the core Rule classes of Myna. Normally you would not use theses directly but use the factory methods
    // If you fork this code, think twice before adding new classes here. Maybe you can implement your new Rule
    // in terms of functions or other low-level rules. Then you can be happy knowing that the same code is being 
    // re-used and tested all the time.  
    // Matches a series of rules in order. Succeeds only if all sub-rules succeed. 
    var Sequence = (function (_super) {
        __extends(Sequence, _super);
        function Sequence(rules) {
            _super.call(this, rules);
            this.type = "sequence";
        }
        Sequence.prototype.parseImplementation = function (index) {
            for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
                var r = _a[_i];
                index = r.parse(index);
                if (index === failed)
                    return index;
            }
            return index;
        };
        Object.defineProperty(Sequence.prototype, "definition", {
            get: function () { return "(" + this.rules.map(function (r) { return r.nameOrDefinition; }).join(" ") + ")"; },
            enumerable: true,
            configurable: true
        });
        Sequence.prototype.cloneImplementation = function () { return new Sequence(this.rules); };
        return Sequence;
    }(Rule));
    Myna.Sequence = Sequence;
    // Tries to match each rule in order until one succeeds. Succeeds if any of the sub-rules succeed. 
    var Choice = (function (_super) {
        __extends(Choice, _super);
        function Choice(rules) {
            _super.call(this, rules);
            this.type = "choice";
        }
        Choice.prototype.parseImplementation = function (index) {
            for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
                var r = _a[_i];
                var result = r.parse(index);
                if (result === failed)
                    continue;
                return result;
            }
            return failed;
        };
        Choice.prototype.match = function (index) {
            for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
                var r = _a[_i];
                if (r.match(index))
                    return true;
            }
            return false;
        };
        Object.defineProperty(Choice.prototype, "definition", {
            get: function () { return "(" + this.rules.map(function (r) { return r.nameOrDefinition; }).join(" / ") + ")"; },
            enumerable: true,
            configurable: true
        });
        Choice.prototype.cloneImplementation = function () { return new Choice(this.rules); };
        return Choice;
    }(Rule));
    Myna.Choice = Choice;
    // A generalization of several rules such as star (0+), plus (1+), opt(0 or 1),
    // When matching with an unbounded upper limit set the maxium to  -1   
    var BoundedRule = (function (_super) {
        __extends(BoundedRule, _super);
        function BoundedRule(rule, min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = -1; }
            _super.call(this, [rule]);
            this.min = min;
            this.max = max;
            this.type = "bounded";
        }
        BoundedRule.prototype.parseImplementation = function (index) {
            var result = index;
            // This can loop forever (-1) or a maximum number of times. 
            for (var i = 0; this.max < 0 || i < this.max; ++i) {
                var tmp = this.firstChild.parse(result);
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
        };
        Object.defineProperty(BoundedRule.prototype, "definition", {
            get: function () {
                return this.firstChild.nameOrDefinition + "{" +
                    this.min + "," + (this.max >= 0 ? this.max : "*") + "}";
            },
            enumerable: true,
            configurable: true
        });
        BoundedRule.prototype.cloneImplementation = function () { return new BoundedRule(this.firstChild, this.min, this.max); };
        return BoundedRule;
    }(Rule));
    Myna.BoundedRule = BoundedRule;
    // Advances the parser by one token unless at the end
    var Advance = (function (_super) {
        __extends(Advance, _super);
        function Advance() {
            _super.call(this, []);
            this.type = "advance";
        }
        Advance.prototype.parseImplementation = function (index) { return index < _input.length ? index + 1 : failed; };
        Object.defineProperty(Advance.prototype, "definition", {
            get: function () { return "."; },
            enumerable: true,
            configurable: true
        });
        Advance.prototype.cloneImplementation = function () { return new Advance(); };
        return Advance;
    }(Rule));
    Myna.Advance = Advance;
    // Uses a lookup table to find the next rule to parse next from the current token 
    var Lookup = (function (_super) {
        __extends(Lookup, _super);
        function Lookup(lookup, onDefault) {
            _super.call(this, []);
            this.lookup = lookup;
            this.onDefault = onDefault;
            this.type = "lookup";
        }
        Lookup.prototype.parseImplementation = function (index) {
            if (index >= _input.length)
                return failed;
            var tkn = _input[index];
            var r = this.lookup[tkn];
            if (r !== undefined)
                return r.parse(index);
            return this.onDefault.parse(index);
        };
        Object.defineProperty(Lookup.prototype, "definition", {
            get: function () { return this.lookup; },
            enumerable: true,
            configurable: true
        });
        Lookup.prototype.cloneImplementation = function () { return new Lookup(this.lookup, this.onDefault); };
        return Lookup;
    }(Rule));
    Myna.Lookup = Lookup;
    // Used to match a string in the input string 
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(text) {
            _super.call(this, []);
            this.text = text;
            this.type = "text";
        }
        Text.prototype.parseImplementation = function (index) {
            if (index > _input.length - this.text.length)
                return failed;
            for (var i = 0; i < this.text.length; ++i)
                if (_input[index + i] !== this.text[i])
                    return failed;
            return index + this.text.length;
        };
        Object.defineProperty(Text.prototype, "definition", {
            get: function () { return "'" + this.text + "'"; },
            enumerable: true,
            configurable: true
        });
        Text.prototype.cloneImplementation = function () { return new Text(this.text); };
        return Text;
    }(Rule));
    Myna.Text = Text;
    // Creates a rule that is defined from a function that generates the rule. 
    // This allows two rules to have a cyclic relation. 
    var Delay = (function (_super) {
        __extends(Delay, _super);
        function Delay(fn) {
            _super.call(this, []);
            this.fn = fn;
            this.type = "delay";
        }
        Delay.prototype.parseImplementation = function (index) { return this.fn().parse(index); };
        Object.defineProperty(Delay.prototype, "definition", {
            get: function () { return this.fn().definition; },
            enumerable: true,
            configurable: true
        });
        Delay.prototype.cloneImplementation = function () { return new Delay(this.fn); };
        return Delay;
    }(Rule));
    Myna.Delay = Delay;
    //=======================================
    // Zero length rules 
    // A PredicateRule that does not advance the input and does not create parse nodes in the tree.
    var PredicateRule = (function (_super) {
        __extends(PredicateRule, _super);
        function PredicateRule() {
            _super.apply(this, arguments);
        }
        // Rules derived from a PredicateRule will only provide an override 
        // of the match function, so the parse is defined in terms of match.       
        PredicateRule.prototype.parse = function (index) {
            if (!this.match(index))
                return failed;
            return index;
        };
        return PredicateRule;
    }(Rule));
    Myna.PredicateRule = PredicateRule;
    // Returns true only if the child rule fails to match.
    var Not = (function (_super) {
        __extends(Not, _super);
        function Not(rule) {
            _super.call(this, [rule]);
            this.type = "not";
        }
        Not.prototype.match = function (index) { return !this.firstChild.match(index); };
        Object.defineProperty(Not.prototype, "definition", {
            get: function () { return "!" + this.firstChild.nameOrDefinition; },
            enumerable: true,
            configurable: true
        });
        Not.prototype.cloneImplementation = function () { return new Not(this.firstChild); };
        return Not;
    }(PredicateRule));
    Myna.Not = Not;
    // Returns true only if the child rule matches, but does not advance the parser
    var At = (function (_super) {
        __extends(At, _super);
        function At(rule) {
            _super.call(this, [rule]);
            this.type = "at";
        }
        At.prototype.match = function (index) { return this.firstChild.match(index); };
        Object.defineProperty(At.prototype, "definition", {
            get: function () { return "&" + this.firstChild.nameOrDefinition; },
            enumerable: true,
            configurable: true
        });
        At.prototype.cloneImplementation = function () { return new At(this.firstChild); };
        return At;
    }(PredicateRule));
    Myna.At = At;
    // Uses a function to return true or not based on the behavior of the predicate rule
    var Predicate = (function (_super) {
        __extends(Predicate, _super);
        function Predicate(fn) {
            _super.call(this, []);
            this.fn = fn;
            this.type = "predicate";
        }
        Predicate.prototype.match = function (index) { return this.fn(index); };
        Predicate.prototype.cloneImplementation = function () { return new Predicate(this.fn); };
        return Predicate;
    }(PredicateRule));
    Myna.Predicate = Predicate;
    //===============================================================
    // Rule creation function
    // Create a rule that matches the text 
    function text(text) {
        return new Text(text);
    }
    Myna.text = text;
    // Matches a series of rules in order, and succeeds if they all do
    function seq() {
        var rules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rules[_i - 0] = arguments[_i];
        }
        return new Sequence(rules.map(RuleTypeToRule));
    }
    Myna.seq = seq;
    // Tries to match each rule in order, and succeeds if one does 
    function choice() {
        var rules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rules[_i - 0] = arguments[_i];
        }
        return new Choice(rules.map(RuleTypeToRule));
    }
    Myna.choice = choice;
    // Enables Rules to be defined in terms of variables that are defined later on. This 
    // enables cyclic rule definitions.  
    function delay(fxn) { return new Delay(function () { return RuleTypeToRule(fxn()); }); }
    Myna.delay = delay;
    // Parses successfully if the given rule does not match the input at the current location  
    function not(rule) {
        return new Not(RuleTypeToRule(rule));
    }
    Myna.not = not;
    ;
    // Attempts to apply a rule between min and max number of times inclusive. If the maximum is set to -1, 
    // it will attempt to match as many times as it can, but throw an exception if the parser does not advance 
    function bounded(rule, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = -1; }
        return new BoundedRule(RuleTypeToRule(rule), min, max);
    }
    Myna.bounded = bounded;
    // Attempts to apply the rule 0 or more times. Will always succeed unless the parser does not 
    // advance, in which case an exception is thrown.    
    function star(rule) {
        return bounded(rule).setType("star");
    }
    Myna.star = star;
    ;
    // Attempts to apply the rule 1 or more times. Will throw an exception if the parser does not advance.  
    function plus(rule) {
        return bounded(rule, 1).setType("plus");
    }
    Myna.plus = plus;
    // Attempts to match a rule 0 or 1 times. Always succeeds.   
    function opt(rule) {
        return bounded(rule, 0, 1).setType("opt");
    }
    Myna.opt = opt;
    ;
    // Attempts to apply a rule a precise number of times
    function repeat(rule, count) {
        return bounded(rule, count, count).setType("repeat");
    }
    Myna.repeat = repeat;
    // Returns true if the rule successfully matches, but does not advance the parser index. 
    function at(rule) {
        return new At(RuleTypeToRule(rule));
    }
    Myna.at = at;
    ;
    // Looks up the rule to parse based on whether the token in the array of not.      
    function lookup(tokens, rule, onDefault) {
        if (onDefault === void 0) { onDefault = false; }
        var d = {};
        var r = RuleTypeToRule(rule);
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var t = tokens_1[_i];
            if (t in d)
                throw Exceptions.TokenIncludedTwiceInLookup;
            d[t] = r;
        }
        return new Lookup(d, RuleTypeToRule(onDefault));
    }
    Myna.lookup = lookup;
    //===============================================================    
    // Character set rules
    function atChar(chars) { return lookup(chars.split(""), Myna.truePredicate); }
    Myna.atChar = atChar;
    ;
    function notAtChar(chars) { return lookup(chars.split(""), Myna.falsePredicate, Myna.truePredicate); }
    Myna.notAtChar = notAtChar;
    ;
    function char(chars) { return lookup(chars.split(""), Myna.advance); }
    Myna.char = char;
    ;
    function charExcept(chars) { return lookup(chars.split(""), Myna.falsePredicate, Myna.advance); }
    Myna.charExcept = charExcept;
    ;
    function inRange(min, max, rule, onDefault) {
        if (onDefault === void 0) { onDefault = false; }
        if (min.length != 1 || max.length != 1)
            throw Exceptions.RangeRequiresChars;
        var minChar = min.charCodeAt(0);
        var maxChar = max.charCodeAt(0);
        var tokens = [];
        for (var x = minChar; x <= maxChar; ++x)
            tokens.push(String.fromCharCode(x));
        return lookup(tokens, rule, onDefault);
    }
    Myna.inRange = inRange;
    function range(min, max) { return inRange(min, max, Myna.advance); }
    Myna.range = range;
    function exceptRange(min, max) { return inRange(min, max, Myna.falsePredicate, Myna.advance); }
    Myna.exceptRange = exceptRange;
    //===============================================================    
    // Advanced rule operators 
    function delimited(rule, delimiter) { return opt(seq(rule, star(seq(delimiter, rule)))).setType("delimitedList"); }
    Myna.delimited = delimited;
    function except(condition, rule) { return seq(not(condition), rule).setType("except"); }
    Myna.except = except;
    function repeatWhileNot(body, condition) { return star(except(condition, body)).setType("whileNot"); }
    Myna.repeatWhileNot = repeatWhileNot;
    function repeatUntilPast(body, condition) { return seq(repeatWhileNot(body, condition), condition).setType("repeatUntilPast"); }
    Myna.repeatUntilPast = repeatUntilPast;
    function advanceWhileNot(rule) { return not(rule).advance.star.setType("advanceWhileNot"); }
    Myna.advanceWhileNot = advanceWhileNot;
    function advanceUntilPast(rule) { return seq(advanceWhileNot(rule), rule).setType("advanceUntilPast"); }
    Myna.advanceUntilPast = advanceUntilPast;
    //===============================================================    
    // Predicates and actions  
    function predicate(fn) { return new Predicate(fn); }
    Myna.predicate = predicate;
    function action(fn) { return predicate(function (index) { fn(index); return true; }).setType("action"); }
    Myna.action = action;
    function err(ex) { return action(function (p) { ex.location = p; throw (ex); }).setType("err"); }
    Myna.err = err;
    function log(msg) {
        if (msg === void 0) { msg = ""; }
        return action(function (p) { console.log(msg); }).setType("log");
    }
    Myna.log = log;
    function assert(rule) { return choice(rule, err({ rule: rule, type: "assert" })).setType("assert"); }
    Myna.assert = assert;
    //=======================================================================
    // Guarded sequences. 
    // If first part of a guarded sequence passes then each subsequent rule must pass as well 
    // otherwise an exception occurs. This helps create parsers that fail fast, and thus provide
    // better feedback for badly formed input.      
    function guardedSeq(condition) {
        var rules = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rules[_i - 1] = arguments[_i];
        }
        return seq(condition, seq.apply(void 0, rules.map(function (r) { return assert(r); }))).setType("guardedSeq");
    }
    Myna.guardedSeq = guardedSeq;
    // Common guarded sequences 
    function doubleQuoted(rule) { return guardedSeq("\"", rule, "\"").setType("doubleQuoted"); }
    Myna.doubleQuoted = doubleQuoted;
    function singleQuoted(rule) { return guardedSeq("'", rule, "'").setType("singleQuoted"); }
    Myna.singleQuoted = singleQuoted;
    // Common guarded sequences: with internal whitespace 
    function parenthesized(rule) { return guardedSeq("(", Myna.ws, rule, Myna.ws, ")").setType("parenthesized"); }
    Myna.parenthesized = parenthesized;
    function braced(rule) { return guardedSeq("{", Myna.ws, rule, Myna.ws, "}").setType("braced"); }
    Myna.braced = braced;
    function bracketed(rule) { return guardedSeq("[", Myna.ws, rule, Myna.ws, "]").setType("bracketed"); }
    Myna.bracketed = bracketed;
    function tagged(rule) { return guardedSeq("<", Myna.ws, rule, Myna.ws, ">").setType("tagged"); }
    Myna.tagged = tagged;
    // A complete identifier, with no other letters or numbers
    function keyword(text) { return seq(text, not(Myna.identifierNext)).setType("keyword"); }
    Myna.keyword = keyword;
    function keywords() {
        var words = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            words[_i - 0] = arguments[_i];
        }
        return choice.apply(void 0, words.map(keyword));
    }
    Myna.keywords = keywords;
    //===============================================================    
    // Core grammar rules 
    Myna.truePredicate = predicate(function (index) { return true; });
    Myna.falsePredicate = predicate(function (index) { return false; });
    Myna.end = predicate(function (index) { return index >= _input.length; });
    Myna.notEnd = predicate(function (index) { return index < _input.length; });
    Myna.advance = new Advance();
    Myna.all = Myna.advance.star;
    Myna.letterLower = range('a', 'z');
    Myna.letterUpper = range('A', 'Z');
    Myna.letter = choice(Myna.letterLower, Myna.letterUpper);
    Myna.digit = range('0', '9');
    Myna.digitNonZero = range('1', '9');
    Myna.integer = choice('0', seq(Myna.digitNonZero, Myna.digit.star));
    Myna.hexDigit = choice(Myna.digit, range('a', 'f'), range('A', 'F'));
    Myna.binaryDigit = choice('0', '1');
    Myna.octalDigit = range('0', '7');
    Myna.alphaNumeric = choice(Myna.letter, Myna.digit);
    Myna.underscore = text("_");
    Myna.identifierFirst = choice(Myna.letter, Myna.underscore);
    Myna.identifierNext = choice(Myna.alphaNumeric, Myna.underscore);
    Myna.identifier = seq(Myna.identifierFirst, Myna.identifierNext.star);
    Myna.hyphen = text("-");
    Myna.crlf = text("\r\n");
    Myna.newLine = choice(Myna.crlf, "\n");
    Myna.space = text(" ");
    Myna.tab = text("\t");
    Myna.ws = char(" \t\r\n").star;
    //===============================================================
    // Grammar functions 
    // The following are helper functions for grammar objects. A grammar is a loosely defined concept.
    // It is any JavaScript object where one or more member fields are instances of the Rule class.    
    // Returns all properties of an object that correspond to Rules 
    function grammarRules(g) {
        return Object
            .keys(g)
            .map(function (k) { return g[k]; })
            .filter(function (v) { return v instanceof Rule; });
    }
    Myna.grammarRules = grammarRules;
    // Returns the representation using the standard PEG notation 
    function grammarToString(g) {
        return grammarRules(g)
            .map(function (r) { return r.toString(); })
            .join('\n');
    }
    Myna.grammarToString = grammarToString;
    // Initializes a grammar object by setting names for all of the rules
    // from the name of the field it is associated with combined with the 
    // name of the grammar. Each rule is stored in Myna.rules and each 
    // grammar is stored in Myna.grammars. 
    function registerGrammar(grammarName, grammar) {
        for (var k in grammar) {
            if (grammar[k] instanceof Rule) {
                var ruleName = grammarName + "." + k;
                var rule = grammar[k];
                rule.setName(ruleName);
                Myna.rules[ruleName] = rule;
            }
        }
        Myna.grammars[grammarName] = grammar;
    }
    Myna.registerGrammar = registerGrammar;
    //===========================================================================
    // Initialization code
    // Myna itself is a grammar in that it has member fields that are rules. 
    // This sets names for each of the built-in rules 
    registerGrammar("core", Myna);
})(Myna || (Myna = {}));
if (typeof module === "object" && module.exports)
    module.exports.Myna = Myna;
//# sourceMappingURL=myna.js.map