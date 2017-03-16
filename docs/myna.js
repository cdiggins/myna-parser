// Myna Parsing Library
// Copyright (c) 2016 Christopher Diggins
// Usage permitted under terms of MIT License
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// A parsing combinator library for JavaScript/TypeScript based on the PEG formalism.
// Myna is a syntactic analyzer: like a regular expression, except it can recognize 
// patterns that can't be expressed using a regular expression.  
// For examples see:
// * [grammar](./grammars) 
// * [examples](./examples)
// For more information see http://www.github.com/cdiggins/myna-parser
// NOTE: we are explicitly bypassing using the TypeScript "export" keyword for 
// the Myna module otherwise the module won't be usable from browsers without 
// using an additional moduler loader library. Instead we use some manual  
// export code at the bottom of the file. 
var Myna;
(function (Myna_1) {
    //===============================================================
    // Global parse functions 
    // Called whenever a new parsing session is started  
    function _initialize(text) {
        _input = text;
        _childNodes = [];
    }
    // Return true or false depending on whether the rule matches 
    // the beginning of the input string. 
    function match(r, s) {
        _initialize(s);
        return r.match(0);
    }
    Myna_1.match = match;
    // Returns the root node of the abstract syntax tree created 
    // by parsing the rule. If no exceptions are thrown, this will 
    // always return at least one node. If the content fails to parse 
    // the returned node will have an end position of "failed" (-1).  
    // Note that only rules returned from the ast 
    // property will add nodes in the tree (e.g. identifier.ast) when
    // parsed.
    function parse(r, s) {
        _initialize(s);
        var curNode = new AstNode(r.ast);
        curNode.children = _childNodes;
        curNode.end = r.parse(0);
        _childNodes = [];
        return curNode;
    }
    Myna_1.parse = parse;
    // Returns an array of nodes created by parsing the given rule repeatedly until 
    // it fails or the end of the input is arrived. One Astnode is created for each time 
    // the token is parsed successfully, whether or not it explicitly has the "_createAstNode" 
    // flag set explicitly. 
    function tokenize(r, s) {
        return parse(r.ast.zeroOrMore, s).children;
    }
    Myna_1.tokenize = tokenize;
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
    })(Myna_1.Exceptions || (Myna_1.Exceptions = {}));
    var Exceptions = Myna_1.Exceptions;
    //====================================================================================
    // Internal variables used by the Myna library
    // A lookup table of all grammars registered with the Myna module 
    Myna_1.grammars = {};
    // A lookup table of all named rules registered with the Myna module
    Myna_1.allRules = {};
    // Generates a new ID for each rule 
    var _nextId = 0;
    function genId() {
        return _nextId++;
    }
    // The returned value of a failed parse
    var failed = -1;
    // This is the input text 
    var _input = "";
    // The AST being constructed 
    var _childNodes;
    // Given a RuleType returns an instance of a Rule.
    function RuleTypeToRule(rule) {
        if (rule instanceof Rule)
            return rule;
        if (typeof (rule) === "string")
            return text(rule);
        if (typeof (rule) === "boolean")
            return rule ? Myna_1.truePredicate : Myna_1.falsePredicate;
        throw Exceptions.InvalidRuleType;
    }
    Myna_1.RuleTypeToRule = RuleTypeToRule;
    //===============================================================
    // AstNode class 
    // Represents a node in the generated parse tree. These nodes are returned by the Rule.parse function. If a Rule 
    // has the "_createAstNode" field set to true (because you created the rule using the ".ast" property), then the 
    // generated node will also be added to the constructed parse tree.   
    var AstNode = (function () {
        // Constructs a new node associated with the given rule.  
        function AstNode(rule, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = failed; }
            this.rule = rule;
            this.start = start;
            this.end = end;
            // The list of child nodes in the parse tree. This is not allocated unless used, to minimize memory consumption 
            this.children = null;
        }
        Object.defineProperty(AstNode.prototype, "name", {
            // Returns the name of the rule associated with this node
            get: function () { return this.rule != null ? this.rule.name : "unnamed"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstNode.prototype, "fullName", {
            // Returns the name of the rule, preceded by the grammar name, associated with this node
            get: function () { return this.rule != null ? this.rule.fullName : "unnamed"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstNode.prototype, "allText", {
            // Returns the parsed text associated with this node's start and end locations  
            get: function () { return _input.slice(this.start, this.end); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstNode.prototype, "isLeaf", {
            // Returns true if this node has no children
            get: function () { return this.children == null || this.children.length == 0; },
            enumerable: true,
            configurable: true
        });
        // Returns the first child with the given name, or null if no named child is found. 
        AstNode.prototype.child = function (name) {
            if (this.children)
                for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                    var c = _a[_i];
                    if (c.name == name)
                        return c;
                }
            return null;
        };
        Object.defineProperty(AstNode.prototype, "_firstChildStart", {
            // The position of the first child, or the end position for the entire node if no children 
            get: function () {
                return this.isLeaf ? this.end : this.children[0].start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstNode.prototype, "_lastChildEnd", {
            // The end position of the last child, or the end position for the entire node if no children 
            get: function () {
                return this.isLeaf ? this.end : this.children[0].end;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstNode.prototype, "beforeChildrenText", {
            // Returns the text before the children, or if no children returns the entire text. 
            get: function () {
                return _input.slice(this.start, this._firstChildStart);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstNode.prototype, "afterChildrenText", {
            // Returns the text after the children, or if no children returns the empty string.
            get: function () {
                return _input.slice(this._lastChildEnd, this.end);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstNode.prototype, "allChildrenText", {
            // Returns the text from the beginning of the first child to the end of the last child.
            get: function () {
                return _input.slice(this._firstChildStart, this._lastChildEnd);
            },
            enumerable: true,
            configurable: true
        });
        return AstNode;
    }());
    Myna_1.AstNode = AstNode;
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
            // Identifies the grammar that this rule belongs to 
            this.grammarName = "";
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
                // Remember the old AST node
                var oldAst = _childNodes;
                // Create a new AST node 
                var node = new AstNode(this, index);
                // Create a new array of child nodes
                _childNodes = [];
                // Call the implementation of the parse function 
                var end_1 = this.parseImplementation(index);
                // If the parse failed then we can return 
                if (end_1 === failed) {
                    // Restore the previous AST state 
                    _childNodes = oldAst;
                    return failed;
                }
                // We succeeded, so update the children of this node 
                // with the "_ast"
                node.children = _childNodes;
                // Restore the previous AST state 
                _childNodes = oldAst;
                // We are going to add the node to the list of children 
                _childNodes.push(node);
                // Set the end of the node parsed to be the current parse result
                node.end = end_1;
                // Return the parse result 
                return end_1;
            }
        };
        // Defines the type of rules. Used for defining new rule types as combinators.
        // Warning: this modifies the rule, use "copy" first if you don't want to update the rule.
        Rule.prototype.setType = function (typeName) {
            this.type = typeName;
            return this;
        };
        // Sets the name of the rule, and the grammar 
        // Warning: this modifies the rule, use "copy" first if you don't want to update the rule.
        Rule.prototype.setName = function (grammarName, ruleName) {
            this.grammarName = grammarName;
            this.name = ruleName;
            return this;
        };
        Object.defineProperty(Rule.prototype, "definition", {
            // Returns a default definition of the rule
            get: function () {
                return this.type + "(" + this.rules.map(function (r) { return r.toString(); }).join(", ") + ")";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "fullName", {
            // Returns the name of trhe rule preceded by the grammar name and a "."
            get: function () {
                return this.grammarName + "." + this.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "nameOrDefinition", {
            // Returns either the name of the rule, or it's definition
            get: function () {
                return this.name
                    ? this.fullName
                    : this.definition;
            },
            enumerable: true,
            configurable: true
        });
        // Returns a string representation of the rule 
        Rule.prototype.toString = function () {
            return this.nameOrDefinition;
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
                r.grammarName = this.grammarName;
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
        Object.defineProperty(Rule.prototype, "hasAstChildRule", {
            //  Returns true if any of the child rules are "ast rules" meaning they create nodes in the 
            // parse tree.
            get: function () {
                return this.rules.filter(function (r) { return r.isAstRule; }).length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "isAstRule", {
            // Returns true if this rule when parsed successfully will create a node in the parse tree 
            get: function () {
                return this._createAstNode || (this.hasAstChildRule
                    && (this instanceof Sequence || this instanceof Choice || this instanceof Bounded));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "astRuleDefn", {
            // Returns a string that describes the AST nodes created by this rule.
            // Will throw an exception if this is not a valid AST rule (this.isAstRule != true)
            get: function () {
                var rules = this.rules.filter(function (r) { return r.isAstRule; });
                if (!rules.length)
                    return this.name;
                if (rules.length == 1) {
                    var result = rules[0].astRuleNameOrDefn;
                    if (this instanceof Bounded)
                        result += "[" + this.min + "," + this.max + "]";
                    return result;
                }
                if (this instanceof Sequence)
                    return "seq(" + rules.map(function (r) { return r.astRuleNameOrDefn; }).join(",") + ")";
                if (this instanceof Choice)
                    return "choice(" + rules.map(function (r) { return r.astRuleNameOrDefn; }).join(",") + ")";
                throw "Internal error: not a valid AST rule";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "astRuleNameOrDefn", {
            // Returns a string that is either the name of the AST parse node, or a definition 
            // (schema) describing the makeup of the rules. 
            get: function () {
                if (this._createAstNode)
                    return this.name;
                return this.astRuleDefn;
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
        Object.defineProperty(Rule.prototype, "zeroOrMore", {
            get: function () { return zeroOrMore(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "oneOrMore", {
            get: function () { return oneOrMore(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "not", {
            get: function () { return not(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "advance", {
            get: function () { return this.then(Myna_1.advance); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "ws", {
            get: function () { return this.then(Myna_1.ws); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "all", {
            get: function () { return this.then(Myna_1.all); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "end", {
            get: function () { return this.then(Myna_1.end); },
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
        Rule.prototype.butNot = function (r) { return not(r).then(this); };
        return Rule;
    }());
    Myna_1.Rule = Rule;
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
            this.type = "seq";
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
            get: function () {
                var result = this.rules.map(function (r) { return r.toString(); }).join(" ");
                if (this.rules.length > 1)
                    result = "(" + result + ")";
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Sequence.prototype.cloneImplementation = function () { return new Sequence(this.rules); };
        return Sequence;
    }(Rule));
    Myna_1.Sequence = Sequence;
    // Tries to match each rule in order until one succeeds. Succeeds if any of the sub-rules succeed. 
    var Choice = (function (_super) {
        __extends(Choice, _super);
        function Choice(rules) {
            _super.call(this, rules);
            this.type = "choice";
        }
        Choice.prototype.parseImplementation = function (index) {
            var state = _childNodes.length;
            for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
                var r = _a[_i];
                var result = r.parse(index);
                if (result === failed) {
                    // Throw away any created nodes
                    _childNodes.length = state;
                    continue;
                }
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
            get: function () {
                var result = this.rules.map(function (r) { return r.toString(); }).join(" / ");
                if (this.rules.length > 1)
                    result = "(" + result + ")";
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Choice.prototype.cloneImplementation = function () { return new Choice(this.rules); };
        return Choice;
    }(Rule));
    Myna_1.Choice = Choice;
    // A generalization of several rules such as zeroOrMore (0+), oneOrMore (1+), opt(0 or 1),
    // When matching with an unbounded upper limit set the maxium to  -1   
    var Bounded = (function (_super) {
        __extends(Bounded, _super);
        function Bounded(rule, min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = Infinity; }
            _super.call(this, [rule]);
            this.min = min;
            this.max = max;
            this.type = "bounded";
        }
        Bounded.prototype.parseImplementation = function (index) {
            var result = index;
            // This can loop forever 
            for (var i = 0; i < this.max; ++i) {
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
        Object.defineProperty(Bounded.prototype, "definition", {
            get: function () {
                if (this.min == 0 && this.max == 1)
                    return this.firstChild.toString() + "?";
                if (this.min == 0 && this.max == Infinity)
                    return this.firstChild.toString() + "*";
                if (this.min == 1 && this.max == Infinity)
                    return this.firstChild.toString() + "+";
                return this.firstChild.toString() + "{" + this.min + "," + this.max + "}";
            },
            enumerable: true,
            configurable: true
        });
        Bounded.prototype.cloneImplementation = function () { return new Bounded(this.firstChild, this.min, this.max); };
        return Bounded;
    }(Rule));
    Myna_1.Bounded = Bounded;
    // Advances the parser by one token unless at the end
    var Advance = (function (_super) {
        __extends(Advance, _super);
        function Advance() {
            _super.call(this, []);
            this.type = "advance";
        }
        Advance.prototype.parseImplementation = function (index) { return index < _input.length ? index + 1 : failed; };
        Object.defineProperty(Advance.prototype, "definition", {
            get: function () {
                return ".";
            },
            enumerable: true,
            configurable: true
        });
        Advance.prototype.cloneImplementation = function () { return new Advance(); };
        return Advance;
    }(Rule));
    Myna_1.Advance = Advance;
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
            get: function () {
                var _this = this;
                return '{' + Object.keys(this.lookup).map(function (k) { return '"' + escapeChars(k) + '" :' + _this.lookup[k].toString(); }).join(',') + '}';
            },
            enumerable: true,
            configurable: true
        });
        Lookup.prototype.cloneImplementation = function () { return new Lookup(this.lookup, this.onDefault); };
        return Lookup;
    }(Rule));
    Myna_1.Lookup = Lookup;
    // Creates a dictionary from a set of tokens, mapping each one to the same rule.     
    function tokensToDictionary(tokens, rule) {
        var d = {};
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var t = tokens_1[_i];
            if (t in d)
                throw Exceptions.TokenIncludedTwiceInLookup;
            d[t] = RuleTypeToRule(rule);
        }
        return d;
    }
    Myna_1.tokensToDictionary = tokensToDictionary;
    // A specialization of the lookup 
    var CharSet = (function (_super) {
        __extends(CharSet, _super);
        function CharSet(chars) {
            _super.call(this, tokensToDictionary(chars.split(""), Myna_1.advance), Myna_1.falsePredicate);
            this.chars = chars;
            this.type = "charSet";
        }
        Object.defineProperty(CharSet.prototype, "definition", {
            get: function () { return "[" + escapeChars(this.chars) + "]"; },
            enumerable: true,
            configurable: true
        });
        ;
        CharSet.prototype.cloneImplementation = function () { return new CharSet(this.chars); };
        return CharSet;
    }(Lookup));
    Myna_1.CharSet = CharSet;
    // A specialization of the lookup 
    var NegatedCharSet = (function (_super) {
        __extends(NegatedCharSet, _super);
        function NegatedCharSet(chars) {
            _super.call(this, tokensToDictionary(chars.split(""), Myna_1.falsePredicate), Myna_1.truePredicate);
            this.chars = chars;
            this.type = "negatedCharSet";
        }
        Object.defineProperty(NegatedCharSet.prototype, "definition", {
            get: function () { return "[^" + escapeChars(this.chars) + "]"; },
            enumerable: true,
            configurable: true
        });
        ;
        NegatedCharSet.prototype.cloneImplementation = function () { return new NegatedCharSet(this.chars); };
        return NegatedCharSet;
    }(Lookup));
    Myna_1.NegatedCharSet = NegatedCharSet;
    // Creates a dictionary from a range of tokens, mapping each one to the same rule.
    function rangeToDictionary(min, max, rule) {
        if (min.length != 1 || max.length != 1)
            throw Exceptions.RangeRequiresChars;
        var minChar = min.charCodeAt(0);
        var maxChar = max.charCodeAt(0);
        var d = {};
        for (var x = minChar; x <= maxChar; ++x)
            d[String.fromCharCode(x)] = rule;
        return d;
    }
    Myna_1.rangeToDictionary = rangeToDictionary;
    // Advances if the current token is within a range of characters, otherwise returns false
    var CharRange = (function (_super) {
        __extends(CharRange, _super);
        function CharRange(min, max) {
            _super.call(this, rangeToDictionary(min, max, Myna_1.advance), Myna_1.falsePredicate);
            this.min = min;
            this.max = max;
            this.type = "charRange";
        }
        Object.defineProperty(CharRange.prototype, "definition", {
            get: function () { return "[" + this.min + ".." + this.max + "]"; },
            enumerable: true,
            configurable: true
        });
        ;
        CharRange.prototype.cloneImplementation = function () { return new CharRange(this.min, this.max); };
        return CharRange;
    }(Lookup));
    Myna_1.CharRange = CharRange;
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
            get: function () { return '"' + escapeChars(this.text) + '"'; },
            enumerable: true,
            configurable: true
        });
        ;
        Text.prototype.cloneImplementation = function () { return new Text(this.text); };
        return Text;
    }(Rule));
    Myna_1.Text = Text;
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
        Delay.prototype.cloneImplementation = function () { return new Delay(this.fn); };
        Object.defineProperty(Delay.prototype, "definition", {
            get: function () { return "delay(" + this.fn() + ")"; },
            enumerable: true,
            configurable: true
        });
        return Delay;
    }(Rule));
    Myna_1.Delay = Delay;
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
        // This prevents the creation of parse nodes.     
        PredicateRule.prototype.parse = function (index) {
            var result = failed;
            // We create a new array of children 
            // New nodes will parse this, but will get thrown away if it fails. 
            var state = _childNodes.length;
            if (this.match(index))
                result = index;
            // This discards any nodes created and restores
            _childNodes.length = state;
            return result;
        };
        return PredicateRule;
    }(Rule));
    Myna_1.PredicateRule = PredicateRule;
    // Returns true only if the child rule fails to match.
    var Not = (function (_super) {
        __extends(Not, _super);
        function Not(rule) {
            _super.call(this, [rule]);
            this.type = "not";
        }
        Not.prototype.match = function (index) { return !this.firstChild.match(index); };
        Not.prototype.cloneImplementation = function () { return new Not(this.firstChild); };
        Object.defineProperty(Not.prototype, "definition", {
            get: function () { return "!" + this.firstChild.toString(); },
            enumerable: true,
            configurable: true
        });
        return Not;
    }(PredicateRule));
    Myna_1.Not = Not;
    // Returns true only if the child rule matches, but does not advance the parser
    var At = (function (_super) {
        __extends(At, _super);
        function At(rule) {
            _super.call(this, [rule]);
            this.type = "at";
        }
        At.prototype.match = function (index) { return this.firstChild.match(index); };
        At.prototype.cloneImplementation = function () { return new At(this.firstChild); };
        Object.defineProperty(At.prototype, "definition", {
            get: function () { return "&" + this.firstChild.toString(); },
            enumerable: true,
            configurable: true
        });
        return At;
    }(PredicateRule));
    Myna_1.At = At;
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
        Object.defineProperty(Predicate.prototype, "definition", {
            get: function () { return "predicate(" + this.fn + ")"; },
            enumerable: true,
            configurable: true
        });
        return Predicate;
    }(PredicateRule));
    Myna_1.Predicate = Predicate;
    //===============================================================
    // Rule creation function
    // Create a rule that matches the text 
    function text(text) {
        return new Text(text);
    }
    Myna_1.text = text;
    // Matches a series of rules in order, and succeeds if they all do
    function seq() {
        var rules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rules[_i - 0] = arguments[_i];
        }
        return new Sequence(rules.map(RuleTypeToRule));
    }
    Myna_1.seq = seq;
    // Tries to match each rule in order, and succeeds if one does 
    function choice() {
        var rules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rules[_i - 0] = arguments[_i];
        }
        return new Choice(rules.map(RuleTypeToRule));
    }
    Myna_1.choice = choice;
    // Enables Rules to be defined in terms of variables that are defined later on.
    // This enables recursive rule definitions.  
    function delay(fxn) {
        return new Delay(function () { return RuleTypeToRule(fxn()); });
    }
    Myna_1.delay = delay;
    // Parses successfully if the given rule does not match the input at the current location  
    function not(rule) {
        return new Not(RuleTypeToRule(rule));
    }
    Myna_1.not = not;
    ;
    // Attempts to apply a rule between min and max number of times inclusive. If the maximum is set to Infinity, 
    // it will attempt to match as many times as it can, but throw an exception if the parser does not advance 
    function bounded(rule, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = Infinity; }
        return new Bounded(RuleTypeToRule(rule), min, max);
    }
    Myna_1.bounded = bounded;
    // Attempts to apply the rule 0 or more times. Will always succeed unless the parser does not 
    // advance, in which case an exception is thrown.    
    function zeroOrMore(rule) {
        return bounded(rule).setType("zeroOrMore");
    }
    Myna_1.zeroOrMore = zeroOrMore;
    ;
    // Attempts to apply the rule 1 or more times. Will throw an exception if the parser does not advance.  
    function oneOrMore(rule) {
        return bounded(rule, 1).setType("oneOrMore");
    }
    Myna_1.oneOrMore = oneOrMore;
    // Attempts to match a rule 0 or 1 times. Always succeeds.   
    function opt(rule) {
        return bounded(rule, 0, 1).setType("opt");
    }
    Myna_1.opt = opt;
    ;
    // Attempts to apply a rule a precise number of times
    function repeat(rule, count) {
        return bounded(rule, count, count).setType("repeat");
    }
    Myna_1.repeat = repeat;
    // Returns true if the rule successfully matches, but does not advance the parser index. 
    function at(rule) {
        return new At(RuleTypeToRule(rule));
    }
    Myna_1.at = at;
    ;
    // Looks up the rule to parse based on whether the token in the array of not.      
    function lookup(tokens, rule, onDefault) {
        if (onDefault === void 0) { onDefault = false; }
        return new Lookup(tokensToDictionary(tokens, rule), RuleTypeToRule(onDefault));
    }
    Myna_1.lookup = lookup;
    //===============================================================    
    // Character set rules
    // Returns true if one of the characters is present, but does not advance the parser position
    function atChar(chars) { return at(char(chars)); }
    Myna_1.atChar = atChar;
    // Returns true if none of the characters are present, but does not advance the parser position 
    function notAtChar(chars) { return not(char(chars)); }
    Myna_1.notAtChar = notAtChar;
    // Advances if none of the characters are present.
    function charExcept(chars) { return notAtChar(chars).advance; }
    Myna_1.charExcept = charExcept;
    // Returns true if one of the characters are present, and advances the parser position
    function char(chars) { return new CharSet(chars); }
    Myna_1.char = char;
    // Advances if one of the characters are present, or returns false
    function range(min, max) { return new CharRange(min, max); }
    Myna_1.range = range;
    // Advance if on of the characters are not in the range
    function exceptRange(min, max) { return range(min, max).not.then(Myna_1.advance); }
    Myna_1.exceptRange = exceptRange;
    //===============================================================    
    // Advanced rule operators 
    function delimited(rule, delimiter) { return opt(seq(rule, zeroOrMore(seq(delimiter, rule)))).setType("delimitedList"); }
    Myna_1.delimited = delimited;
    function except(condition, rule) { return seq(not(condition), rule).setType("except"); }
    Myna_1.except = except;
    function repeatWhileNot(body, condition) { return zeroOrMore(except(condition, body)).setType("whileNot"); }
    Myna_1.repeatWhileNot = repeatWhileNot;
    function repeatUntilPast(body, condition) { return seq(repeatWhileNot(body, condition), condition).setType("repeatUntilPast"); }
    Myna_1.repeatUntilPast = repeatUntilPast;
    function advanceWhileNot(rule) { return not(rule).advance.zeroOrMore.setType("advanceWhileNot"); }
    Myna_1.advanceWhileNot = advanceWhileNot;
    function advanceUntilPast(rule) { return seq(advanceWhileNot(rule), rule).setType("advanceUntilPast"); }
    Myna_1.advanceUntilPast = advanceUntilPast;
    function advanceUnless(rule) { return Myna_1.advance.butNot(rule).setType("advanceUnless"); }
    Myna_1.advanceUnless = advanceUnless;
    //===============================================================    
    // Predicates and actions  
    function predicate(fn) { return new Predicate(fn); }
    Myna_1.predicate = predicate;
    function action(fn) { return predicate(function (index) { fn(index); return true; }).setType("action"); }
    Myna_1.action = action;
    function err(ex) { return action(function (p) { ex.location = p; throw (ex); }).setType("err"); }
    Myna_1.err = err;
    function log(msg) {
        if (msg === void 0) { msg = ""; }
        return action(function (p) { console.log(msg); }).setType("log");
    }
    Myna_1.log = log;
    function assert(rule) { return choice(rule, err({ rule: rule, type: "assert" })).setType("assert"); }
    Myna_1.assert = assert;
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
    Myna_1.guardedSeq = guardedSeq;
    // Common guarded sequences 
    function doubleQuoted(rule) { return guardedSeq("\"", rule, "\"").setType("doubleQuoted"); }
    Myna_1.doubleQuoted = doubleQuoted;
    function singleQuoted(rule) { return guardedSeq("'", rule, "'").setType("singleQuoted"); }
    Myna_1.singleQuoted = singleQuoted;
    // Create an array rule by injecting another rule in between each pairs
    function join(sep) {
        var xs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            xs[_i - 1] = arguments[_i];
        }
        var r = [];
        for (var i = 0; i < xs.length; ++i) {
            if (i > 0)
                r.push(sep);
            r.push(xs[i]);
        }
        return r;
    }
    Myna_1.join = join;
    // Given a list of rules, maps the text to keywords 
    function keywordMap() {
        var rules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rules[_i - 0] = arguments[_i];
        }
        return rules.map(function (r) { return typeof r == "string" ? keyword(r) : r; });
    }
    Myna_1.keywordMap = keywordMap;
    // Add whitespace matching rule in between each other rule. 
    function seqWs() {
        var rules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rules[_i - 0] = arguments[_i];
        }
        return seq.apply(void 0, join.apply(void 0, [Myna_1.ws].concat(rules)));
    }
    Myna_1.seqWs = seqWs;
    // Common guarded sequences: with internal whitespace
    function parenthesized(rule) { return guardedSeq("(", Myna_1.ws, rule, Myna_1.ws, ")").setType("parenthesized"); }
    Myna_1.parenthesized = parenthesized;
    function braced(rule) { return guardedSeq("{", Myna_1.ws, rule, Myna_1.ws, "}").setType("braced"); }
    Myna_1.braced = braced;
    function bracketed(rule) { return guardedSeq("[", Myna_1.ws, rule, Myna_1.ws, "]").setType("bracketed"); }
    Myna_1.bracketed = bracketed;
    function tagged(rule) { return guardedSeq("<", Myna_1.ws, rule, Myna_1.ws, ">").setType("tagged"); }
    Myna_1.tagged = tagged;
    // A complete identifier, with no other letters or numbers
    function keyword(text) { return seq(text, not(Myna_1.identifierNext)).setType("keyword"); }
    Myna_1.keyword = keyword;
    function keywords() {
        var words = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            words[_i - 0] = arguments[_i];
        }
        return choice.apply(void 0, words.map(keyword));
    }
    Myna_1.keywords = keywords;
    //===============================================================    
    // Core grammar rules 
    Myna_1.truePredicate = predicate(function (index) { return true; });
    Myna_1.falsePredicate = predicate(function (index) { return false; });
    Myna_1.end = predicate(function (index) { return index >= _input.length; });
    Myna_1.notEnd = predicate(function (index) { return index < _input.length; });
    Myna_1.advance = new Advance();
    Myna_1.all = Myna_1.advance.zeroOrMore;
    Myna_1.letterLower = range('a', 'z');
    Myna_1.letterUpper = range('A', 'Z');
    Myna_1.letter = choice(Myna_1.letterLower, Myna_1.letterUpper);
    Myna_1.letters = Myna_1.letter.oneOrMore;
    Myna_1.digit = range('0', '9');
    Myna_1.digits = Myna_1.digit.oneOrMore;
    Myna_1.digitNonZero = range('1', '9');
    Myna_1.integer = choice('0', seq(Myna_1.digitNonZero, Myna_1.digit.zeroOrMore));
    Myna_1.hexDigit = choice(Myna_1.digit, range('a', 'f'), range('A', 'F'));
    Myna_1.binaryDigit = char('01');
    Myna_1.octalDigit = range('0', '7');
    Myna_1.alphaNumeric = choice(Myna_1.letter, Myna_1.digit);
    Myna_1.underscore = text("_");
    Myna_1.identifierFirst = choice(Myna_1.letter, Myna_1.underscore);
    Myna_1.identifierNext = choice(Myna_1.alphaNumeric, Myna_1.underscore);
    Myna_1.identifier = seq(Myna_1.identifierFirst, Myna_1.identifierNext.zeroOrMore);
    Myna_1.hyphen = text("-");
    Myna_1.crlf = text("\r\n");
    Myna_1.newLine = choice(Myna_1.crlf, "\n");
    Myna_1.space = text(" ");
    Myna_1.tab = text("\t");
    Myna_1.ws = char(" \t\r\n\u00A0\uFEFF").zeroOrMore;
    Myna_1.wordChar = Myna_1.letter.or(char("-'"));
    Myna_1.word = Myna_1.letter.then(Myna_1.wordChar.zeroOrMore);
    //===============================================================
    // Grammar functions 
    // The following are helper functions for grammar objects. A grammar is a loosely defined concept.
    // It is any JavaScript object where one or more member fields are instances of the Rule class.    
    // Returns all rules that belong to a specific grammar and that create AST nodes. 
    function grammarAstRules(grammarName) {
        return grammarRules(grammarName).filter(function (r) { return r._createAstNode; });
    }
    Myna_1.grammarAstRules = grammarAstRules;
    // Returns all rules that belong to a specific grammar
    function grammarRules(grammarName) {
        return allGrammarRules().filter(function (r) { return r.grammarName == grammarName; });
    }
    Myna_1.grammarRules = grammarRules;
    // Returns all rules as an array sorted by name.
    function allGrammarRules() {
        return Object.keys(Myna_1.allRules).sort().map(function (k) { return Myna_1.allRules[k]; });
    }
    Myna_1.allGrammarRules = allGrammarRules;
    // Returns an array of names of the grammars
    function grammarNames() {
        return Object.keys(Myna_1.grammars).sort();
    }
    Myna_1.grammarNames = grammarNames;
    // Creates a string representation of a grammar 
    function grammarToString(grammarName) {
        return grammarRules(grammarName).map(function (r) { return r.fullName + " <- " + r.definition; }).join('\n');
    }
    Myna_1.grammarToString = grammarToString;
    // Creates a string representation of the AST schema generated by parsing the grammar 
    function astSchemaToString(grammarName) {
        return grammarAstRules(grammarName).map(function (r) { return r.name + " <- " + r.astRuleDefn; }).join('\n');
    }
    Myna_1.astSchemaToString = astSchemaToString;
    // Creates and initializes a Grammar object from a constructor.  
    // Sets names for all of the rules from the name of the field it is associated with combined with the 
    // name of the grammar. Each rule is stored in Myna.rules and each  grammar is stored in Myna.grammars. 
    function registerGrammar(grammarName, grammarCtor) {
        var grammar = new grammarCtor(this);
        initializeGrammar(grammarName, grammar);
    }
    Myna_1.registerGrammar = registerGrammar;
    // Given a constructed grammar, stores it and its rules, and sets the name of the rules/
    function initializeGrammar(grammarName, grammar) {
        for (var k in grammar) {
            if (grammar[k] instanceof Rule) {
                var rule = grammar[k];
                rule.setName(grammarName, k);
                Myna_1.allRules[rule.fullName] = rule;
            }
        }
        Myna_1.grammars[grammarName] = grammar;
    }
    Myna_1.initializeGrammar = initializeGrammar;
    //===========================================================================
    // Utility functions
    function escapeChars(text) {
        var r = JSON.stringify(text);
        return r.slice(1, r.length - 1);
    }
    Myna_1.escapeChars = escapeChars;
    //===========================================================================
    // Initialization code
    // The Myna module itself is a grammar. 
    initializeGrammar("core", Myna);
})(Myna || (Myna = {}));
if (typeof module === "object" && module.exports)
    module.exports = Myna;
//# sourceMappingURL=myna.js.map