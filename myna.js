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
// using an additional moduler loader library. Instead we have manual  
// export code at the bottom of the file. 
var Myna;
(function (Myna) {
    //====================================================================================
    // Internal variables used by the Myna library
    // A lookup table of all grammars registered with the Myna module 
    Myna.grammars = {};
    // A lookup table of all named rules registered with the Myna module
    Myna.allRules = {};
    // Generates a new ID for each rule 
    var _nextId = 0;
    function genId() {
        return _nextId++;
    }
    // The returned value of a failed parse
    var failed = -1;
    //===============================================================
    // Classes 
    // A special immutable class used internally for creating AstNodes 
    var NodeBldr = (function () {
        function NodeBldr(rule, begin, end, nodes) {
            if (rule === void 0) { rule = null; }
            if (begin === void 0) { begin = null; }
            if (end === void 0) { end = null; }
            if (nodes === void 0) { nodes = null; }
            this.rule = rule;
            this.begin = begin;
            this.end = end;
            this.nodes = nodes;
        }
        // Adds a new AstNode to the NodeBldr 
        NodeBldr.prototype.addNode = function (rule, begin, end) {
            return new NodeBldr(rule, begin, end, this);
        };
        // Creates an AstNode from the NodeBldr 
        NodeBldr.prototype.toAst = function () {
            // TODO: create the child arrays and stuff
            return this.begin && this.end
                ? new AstNode(this.rule, this.begin.input, this.begin.index, this.end.index)
                : null;
        };
        return NodeBldr;
    }());
    // This stores the state of the parser and is passed to the parse and match functions.
    var ParseState = (function () {
        function ParseState(input, index, nodes) {
            this.input = input;
            this.index = index;
            this.nodes = nodes;
            this.code = -1;
            this.code = input.charCodeAt(index);
        }
        Object.defineProperty(ParseState.prototype, "inRange", {
            // Returns true if the index is within the input range. 
            get: function () {
                return this.index >= 0 && this.index < this.input.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParseState.prototype, "location", {
            // Returns a string representation of the location. 
            get: function () {
                return this.index.toString();
            },
            enumerable: true,
            configurable: true
        });
        // Returns a shallow copy of the parser that advances its position
        ParseState.prototype.advance = function (n) {
            if (n === void 0) { n = 1; }
            return new ParseState(this.input, this.index + n, this.nodes);
        };
        // A stateful advance function 
        ParseState.prototype._advance = function () {
            this.code = this.input.charCodeAt(++this.index);
        };
        // Creates a new ParseState with a node added to it.
        ParseState.prototype.addNode = function (rule, begin) {
            return new ParseState(this.input, this.index, this.nodes.addNode(rule, begin, this));
        };
        Object.defineProperty(ParseState.prototype, "debugContext", {
            // Returns a string that helps debugging to figure out exactly where we are in the input string 
            get: function () {
                var contextWidth = 5;
                var start = this.index - contextWidth - 1;
                if (start < 0)
                    start = 0;
                var prefix = this.input.slice(start, this.index - 1);
                var end = this.index + contextWidth;
                if (end >= this.input.length)
                    end = this.input.length - 1;
                var postfix = this.input.slice(this.index, end);
                return prefix + ">>>" + this.input[this.index] + "<<<" + postfix;
            },
            enumerable: true,
            configurable: true
        });
        return ParseState;
    }());
    Myna.ParseState = ParseState;
    // Represents a parse error, and contains the parse state at the time of the error  
    var ParseError = (function (_super) {
        __extends(ParseError, _super);
        function ParseError(parser, message) {
            _super.call(this, message);
            this.parser = parser;
            this.message = message;
        }
        return ParseError;
    }(Error));
    Myna.ParseError = ParseError;
    //===============================================================
    // Main Myna functions 
    // Returns the root node of the abstract syntax tree created 
    // by parsing the rule. 
    function parse(r, s) {
        var p = new ParseState(s, 0, new NodeBldr());
        p = r.ast.parser(p);
        return p ? p.nodes.toAst() : null;
    }
    Myna.parse = parse;
    // Returns an array of nodes created by parsing the given rule repeatedly until 
    // it fails or the end of the input is arrived. One Astnode is created for each time 
    // the token is parsed successfully, whether or not it explicitly has the "_createAstNode" 
    // flag set explicitly. 
    function tokenize(r, s) {
        var result = this.parse(r.ast.zeroOrMore, s);
        return result ? result.children : [];
    }
    Myna.tokenize = tokenize;
    // Given a RuleType returns an instance of a Rule.
    function RuleTypeToRule(rule) {
        if (rule instanceof Rule)
            return rule;
        if (typeof (rule) === "string")
            return text(rule);
        if (typeof (rule) === "boolean")
            return rule ? Myna.truePredicate : Myna.falsePredicate;
        throw new Error("Invalid rule type: " + rule);
    }
    Myna.RuleTypeToRule = RuleTypeToRule;
    // Represents a node in the generated parse tree. These nodes are returned by the Rule.parse function. If a Rule 
    // has the "_createAstNode" field set to true (because you created the rule using the ".ast" property), then the 
    // generated node will also be added to the constructed parse tree.   
    var AstNode = (function () {
        // Constructs a new node associated with the given rule.  
        function AstNode(rule, input, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = failed; }
            this.rule = rule;
            this.input = input;
            this.start = start;
            this.end = end;
            // The list of child nodes in the parse tree. 
            // This is not allocated unless used, to minimize memory consumption 
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
            get: function () { return this.input.slice(this.start, this.end); },
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
                return this.input.slice(this.start, this._firstChildStart);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstNode.prototype, "afterChildrenText", {
            // Returns the text after the children, or if no children returns the empty string.
            get: function () {
                return this.input.slice(this._lastChildEnd, this.end);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AstNode.prototype, "allChildrenText", {
            // Returns the text from the beginning of the first child to the end of the last child.
            get: function () {
                return this.input.slice(this._firstChildStart, this._lastChildEnd);
            },
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
        // Constructor
        // Note: child-rules are exposed as a public field
        function Rule(rules) {
            this.rules = rules;
            // Identifies individual rule
            this.name = "";
            // Identifies the grammar that this rule belongs to 
            this.grammarName = "";
            // Identifies types of rules. Rules can have "types" that are different than the class name
            this.type = "";
            // Used to provide access to the name of the class 
            this.className = "Rule";
            // Indicates whether generated nodes should be added to the abstract syntax tree
            this._createAstNode = false;
            // A parser function, computed in a rule's constructor. If successful returns either the original or a new 
            // ParseState object. If it fails it returns null.
            this.parser = null;
            // A lexer function, computed in a rule's constructor. The lexer may update the ParseState if successful.
            // If it fails it is required that the lexer restore the ParseState
            this.lexer = null;
        }
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
                return this.className + "(" + this.rules.map(function (r) { return r.toString(); }).join(", ") + ")";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "fullName", {
            // Returns the name of the rule preceded by the grammar name and a "."
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
        Rule.prototype.setType = function (type) {
            this.type = type;
            return this;
        };
        // Returns a copy of this rule with default values for all fields.  
        // Note: Every new rule class must override cloneImplemenation
        Rule.prototype.cloneImplementation = function () {
            throw new Error("Missing override for cloneImplementation");
        };
        Object.defineProperty(Rule.prototype, "copy", {
            // Returns a copy of this rule with all fields copied.  
            get: function () {
                var r = this.cloneImplementation();
                if (typeof (r) !== typeof (this))
                    throw new Error("Error in implementation of cloneImplementation: not returning object of correct type");
                r.name = this.name;
                r.grammarName = this.grammarName;
                r._createAstNode = this._createAstNode;
                return r;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "ast", {
            // Returns a copy of the rule that will create a node in the parse tree.
            // This property is the only way to create rules that generate nodes in a parse tree. 
            get: function () {
                var r = this.copy;
                r._createAstNode = true;
                var parser = r.parser;
                r.parser = function (p) {
                    var result = parser(p);
                    if (result == null)
                        return null;
                    return result.addNode(r, p);
                };
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
                    && (this instanceof Sequence || this instanceof Choice || this instanceof Quantified));
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
                    if (this instanceof Quantified)
                        result += "[" + this.min + "," + this.max + "]";
                    return result;
                }
                if (this instanceof Sequence)
                    return "seq(" + rules.map(function (r) { return r.astRuleNameOrDefn; }).join(",") + ")";
                if (this instanceof Choice)
                    return "choice(" + rules.map(function (r) { return r.astRuleNameOrDefn; }).join(",") + ")";
                throw new Error("Internal error: not a valid AST rule");
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
            //======================================================
            // Extensions to support method/property chaining. 
            // This is also known as a fluent API syntax
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
        Object.defineProperty(Rule.prototype, "at", {
            get: function () { return at(this); },
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
        Object.defineProperty(Rule.prototype, "assert", {
            get: function () { return assert(this); },
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
        Rule.prototype.quantified = function (min, max) { return quantified(this, min, max); };
        Rule.prototype.delimited = function (delimiter) { return delimited(this, delimiter); };
        Rule.prototype.unless = function (r) { return unless(this, r); };
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
            this.type = "seq";
            this.className = "Sequence";
            var length = rules.length;
            var parsers = this.rules.map(function (r) { return r.parser; });
            this.parser = function (p) {
                for (var i = 0, len = length; i < len; ++i)
                    if (!(p = parsers[i](p)))
                        return null;
                return p;
            };
            var lexers = this.rules.map(function (r) { return r.lexer; });
            this.lexer = function (p) {
                var index = p.index;
                for (var i = 0, len = length; i < len; ++i) {
                    if (!lexers[i](p)) {
                        p.index = index;
                        return false;
                    }
                }
                return true;
            };
        }
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
    Myna.Sequence = Sequence;
    // Tries to match each rule in order until one succeeds. Succeeds if any of the sub-rules succeed. 
    var Choice = (function (_super) {
        __extends(Choice, _super);
        function Choice(rules) {
            _super.call(this, rules);
            this.type = "choice";
            this.className = "Choice";
            var length = rules.length;
            var parsers = this.rules.map(function (p) { return p.parser; });
            this.parser = function (p) {
                var tmp = null;
                for (var i = 0, len = length; i < len; ++i)
                    if (tmp = parsers[i](p))
                        return tmp;
                return null;
            };
            var lexers = this.rules.map(function (r) { return r.lexer; });
            this.lexer = function (p) {
                var index = p.index;
                for (var i = 0, len = length; i < len; ++i) {
                    if (lexers[i](p))
                        return true;
                }
                return false;
            };
        }
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
    Myna.Choice = Choice;
    // A generalization of several rules such as zeroOrMore (0+), oneOrMore (1+), opt(0 or 1),
    // When matching with an unbounded upper limit set the maxium to  -1   
    var Quantified = (function (_super) {
        __extends(Quantified, _super);
        function Quantified(rule, min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = Infinity; }
            _super.call(this, [rule]);
            this.min = min;
            this.max = max;
            this.type = "quantified";
            this.className = "Quantified";
            var pChild = this.firstChild.parser;
            this.parser = function (p) {
                for (var i = 0; i < max; ++i) {
                    var tmp = pChild(p);
                    // If parsing the rule fails, we return the last result, or failed 
                    // if the minimum number of matches is not met. 
                    if (tmp == null)
                        return i >= min ? p : null;
                    // Check for progress, to assure we aren't hitting an infinite loop  
                    // Without this it is possible to accidentally put a zeroOrMore with a predicate.
                    // For example: myna.truePredicate.zeroOrMore would loop forever 
                    if (i === 1 && max === Infinity && tmp.index === p.index)
                        throw new Error("Infinite loop: unbounded quanitifed rule is not making progress");
                    p = tmp;
                }
                return p;
            };
            var lChild = this.firstChild.lexer;
            this.lexer = function (p) {
                var index = p.index;
                for (var i = 0; i < max; ++i) {
                    if (!lChild(p)) {
                        if (i < min) {
                            p.index = index;
                            return false;
                        }
                        return true;
                    }
                    // Check for progress, to assure we aren't hitting an infinite loop  
                    // Without this it is possible to accidentally put a zeroOrMore with a predicate.
                    // For example: myna.truePredicate.zeroOrMore would loop forever 
                    if (i === 1 && max === Infinity && p.index === index)
                        throw new Error("Infinite loop: unbounded quanitifed rule is not making progress");
                }
                return true;
            };
        }
        Object.defineProperty(Quantified.prototype, "definition", {
            // Used for creating a human readable definition of the grammar.
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
        Quantified.prototype.cloneImplementation = function () { return new Quantified(this.firstChild, this.min, this.max); };
        return Quantified;
    }(Rule));
    Myna.Quantified = Quantified;
    // Advances the parser by one token unless at the end
    // Never creates a node.
    var Advance = (function (_super) {
        __extends(Advance, _super);
        function Advance() {
            _super.call(this, []);
            this.type = "advance";
            this.className = "Advance";
            this.parser = function (p) { return p.inRange ? p.advance() : null; };
            this.lexer = function (p) { if (!p.inRange)
                return false; p._advance(); return true; };
        }
        Object.defineProperty(Advance.prototype, "definition", {
            get: function () { return "<advance>"; },
            enumerable: true,
            configurable: true
        });
        Advance.prototype.cloneImplementation = function () { return new Advance(); };
        return Advance;
    }(Rule));
    Myna.Advance = Advance;
    // Returns true if the 
    var CharSet = (function (_super) {
        __extends(CharSet, _super);
        function CharSet(chars) {
            var _this = this;
            _super.call(this, []);
            this.chars = chars;
            this.type = "charSet";
            this.className = "CharSet";
            var vals = [];
            var length = chars.length;
            for (var i = 0; i < length; ++i)
                vals[i] = chars.charCodeAt(i);
            this.lexer = function (p) {
                var code = p.code;
                for (var i_1 = 0, len = length; i_1 < len; ++i_1)
                    if (code === vals[i_1])
                        return true;
                return false;
            };
            this.parser = function (p) { return _this.lexer(p) ? p : null; };
        }
        Object.defineProperty(CharSet.prototype, "definition", {
            get: function () { return "[" + escapeChars(this.chars) + "]"; },
            enumerable: true,
            configurable: true
        });
        ;
        CharSet.prototype.cloneImplementation = function () { return new CharSet(this.chars); };
        return CharSet;
    }(Rule));
    Myna.CharSet = CharSet;
    // Advances if the current token is within a range of characters, otherwise returns false
    var CharRange = (function (_super) {
        __extends(CharRange, _super);
        function CharRange(min, max) {
            var _this = this;
            _super.call(this, []);
            this.min = min;
            this.max = max;
            this.type = "charRange";
            this.className = "CharRange";
            var minCode = min.charCodeAt(0);
            var maxCode = max.charCodeAt(0);
            this.lexer = function (p) {
                var code = p.code;
                return code >= minCode && code <= maxCode;
            };
            this.parser = function (p) { return _this.lexer(p) ? p : null; };
        }
        Object.defineProperty(CharRange.prototype, "definition", {
            get: function () { return "[" + this.min + ".." + this.max + "]"; },
            enumerable: true,
            configurable: true
        });
        ;
        CharRange.prototype.cloneImplementation = function () { return new CharRange(this.min, this.max); };
        return CharRange;
    }(Rule));
    Myna.CharRange = CharRange;
    // Used to match a string in the input string 
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(text) {
            var _this = this;
            _super.call(this, []);
            this.text = text;
            this.type = "text";
            this.className = "Text";
            var length = text.length;
            var vals = [];
            for (var i = 0; i < length; ++i)
                vals.push(text.charCodeAt(i));
            this.lexer = function (p) {
                if (p.code !== vals[0])
                    return false;
                var index = p.index;
                p._advance();
                for (var i = 1; i < length; ++i, p._advance()) {
                    if (p.code !== vals[i]) {
                        p.index = index;
                        return false;
                    }
                }
                return true;
            };
            this.parser = function (p) { return _this.lexer(p) ? p : null; };
        }
        Object.defineProperty(Text.prototype, "definition", {
            get: function () { return '"' + escapeChars(this.text) + '"'; },
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
            this.className = "Delay";
            var tmpParser = null;
            this.parser = function (p) { return (tmpParser ? tmpParser : tmpParser = fn().parser)(p); };
            var tmpLexer = null;
            this.lexer = function (p) { return (tmpLexer ? tmpLexer : tmpLexer = fn().lexer)(p); };
        }
        Delay.prototype.cloneImplementation = function () { return new Delay(this.fn); };
        Object.defineProperty(Delay.prototype, "definition", {
            get: function () { return "<delay>"; },
            enumerable: true,
            configurable: true
        });
        return Delay;
    }(Rule));
    Myna.Delay = Delay;
    // Returns true only if the child rule fails to match.
    var Not = (function (_super) {
        __extends(Not, _super);
        function Not(rule) {
            var _this = this;
            _super.call(this, [rule]);
            this.type = "not";
            this.className = "Not";
            var childLexer = rule.lexer;
            this.lexer = function (p) { var index = p.index; if (childLexer(p)) {
                p.index = index;
                return false;
            } return true; };
            this.parser = function (p) { return _this.lexer(p) ? null : p; };
        }
        Not.prototype.cloneImplementation = function () { return new Not(this.firstChild); };
        Object.defineProperty(Not.prototype, "definition", {
            get: function () { return "!" + this.firstChild.toString(); },
            enumerable: true,
            configurable: true
        });
        return Not;
    }(Rule));
    Myna.Not = Not;
    // Returns true only if the child rule matches, but does not advance the parser
    var At = (function (_super) {
        __extends(At, _super);
        function At(rule) {
            var _this = this;
            _super.call(this, [rule]);
            this.type = "at";
            this.className = "At";
            var childLexer = rule.lexer;
            this.lexer = function (p) { var index = p.index; if (!childLexer(p)) {
                p.index = index;
                return false;
            } return true; };
            this.parser = function (p) { return _this.lexer(p) ? null : p; };
        }
        At.prototype.cloneImplementation = function () { return new At(this.firstChild); };
        Object.defineProperty(At.prototype, "definition", {
            get: function () { return "&" + this.firstChild.toString(); },
            enumerable: true,
            configurable: true
        });
        return At;
    }(Rule));
    Myna.At = At;
    // Uses a function to return true or not based on the behavior of the predicate rule
    var Predicate = (function (_super) {
        __extends(Predicate, _super);
        function Predicate(fn) {
            var _this = this;
            _super.call(this, []);
            this.fn = fn;
            this.type = "predicate";
            this.className = "Predicate";
            this.lexer = fn;
            this.parser = function (p) { return _this.lexer(p) ? p : null; };
        }
        Predicate.prototype.cloneImplementation = function () { return new Predicate(this.fn); };
        Object.defineProperty(Predicate.prototype, "definition", {
            get: function () { return "<predicate>"; },
            enumerable: true,
            configurable: true
        });
        return Predicate;
    }(Rule));
    Myna.Predicate = Predicate;
    //===============================================================
    // Rule creation function
    // Create a rule that matches the text 
    function text(text) { return new Text(text); }
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
    // Enables Rules to be defined in terms of variables that are defined later on.
    // This enables recursive rule definitions.  
    function delay(fxn) { return new Delay(fxn); }
    Myna.delay = delay;
    // Parses successfully if the given rule does not match the input at the current location  
    function not(rule) { return new Not(RuleTypeToRule(rule)); }
    Myna.not = not;
    ;
    // Returns true if the rule successfully matches, but does not advance the parser index. 
    function at(rule) { return new At(RuleTypeToRule(rule)); }
    Myna.at = at;
    ;
    // Attempts to apply a rule between min and max number of times inclusive. If the maximum is set to Infinity, 
    // it will attempt to match as many times as it can, but throw an exception if the parser does not advance 
    function quantified(rule, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = Infinity; }
        return new Quantified(RuleTypeToRule(rule), min, max);
    }
    Myna.quantified = quantified;
    // Attempts to apply the rule 0 or more times. Will always succeed unless the parser does not 
    // advance, in which case an exception is thrown.    
    function zeroOrMore(rule) { return quantified(rule).setType("zeroOrMore"); }
    Myna.zeroOrMore = zeroOrMore;
    ;
    // Attempts to apply the rule 1 or more times. Will throw an exception if the parser does not advance.  
    function oneOrMore(rule) { return quantified(rule, 1).setType("oneOrMore"); }
    Myna.oneOrMore = oneOrMore;
    // Attempts to match a rule 0 or 1 times. Always succeeds.   
    function opt(rule) { return quantified(rule, 0, 1).setType("optional"); }
    Myna.opt = opt;
    // Attempts to apply a rule a precise number of times
    function repeat(rule, count) { return quantified(rule, count, count).setType("repeat"); }
    Myna.repeat = repeat;
    // Returns true if one of the characters are present, and advances the parser position
    function char(chars) { return new CharSet(chars); }
    Myna.char = char;
    // Advances if one of the characters are present, or returns false
    function range(min, max) { return new CharRange(min, max); }
    Myna.range = range;
    // Returns true if on of the characters are not in the range, but does not advance the parser position
    function notRange(min, max) { return range(min, max).not; }
    Myna.notRange = notRange;
    // Repeats a rule zero or more times, with a delimiter between each one. 
    function delimited(rule, delimiter) { return opt(seq(rule, zeroOrMore(seq(delimiter, rule)))).setType("delimitedList"); }
    Myna.delimited = delimited;
    // Executes the rule, if the condition is not true
    function unless(rule, condition) { return seq(not(condition), rule).setType("unless"); }
    Myna.unless = unless;
    // Repeats the rule while the condition is not true
    function repeatWhileNot(body, condition) { return unless(body, condition).setType("whileNot"); }
    Myna.repeatWhileNot = repeatWhileNot;
    // Repeats the rule until just after the condition is true once 
    function repeatUntilPast(body, condition) { return repeatWhileNot(body, condition).then(condition).setType("repeatUntilPast"); }
    Myna.repeatUntilPast = repeatUntilPast;
    // Advances the parse state while the rule is not true. 
    function advanceWhileNot(rule) { return advanceUnless(rule).zeroOrMore.setType("advanceWhileNot"); }
    Myna.advanceWhileNot = advanceWhileNot;
    // Advance the parser until just after the rule is executed 
    function advanceUntilPast(rule) { return advanceWhileNot(rule).then(rule).setType("advanceUntilPast"); }
    Myna.advanceUntilPast = advanceUntilPast;
    // Advances the parser unless the rule is true. 
    function advanceUnless(rule) { return Myna.advance.unless(rule).setType("advanceUnless"); }
    Myna.advanceUnless = advanceUnless;
    // Parses successfully if  the predictate passes
    function predicate(fn) { return new Predicate(fn); }
    Myna.predicate = predicate;
    // Executes an action when arrived at and continues 
    function action(fn) { return predicate(function (p) { fn(p); return true; }).setType("action"); }
    Myna.action = action;
    // Logs a message as an action 
    function log(msg) {
        if (msg === void 0) { msg = ""; }
        return action(function (p) { console.log(msg); }).setType("log");
    }
    Myna.log = log;
    // Throw a ParseError if reached 
    function err(message) { return action(function (p) { throw new ParseError(p, message); }).setType("err"); }
    Myna.err = err;
    // Asserts that the rule is executed 
    // This has to be embedded in a function because the rule might be in a circular definition.  
    function assert(rule) {
        return choice(rule, action(function (p) {
            throw new ParseError(p, "assertion failed, expected: " + RuleTypeToRule(rule));
        }));
    }
    Myna.assert = assert;
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
    // Parses the given rule surrounded by double quotes 
    function doubleQuoted(rule) { return seq("\"", rule, "\"").setType("doubleQuoted"); }
    Myna.doubleQuoted = doubleQuoted;
    // Parses the given rule surrounded by single quotes 
    function singleQuoted(rule) { return seq("'", rule, "'").setType("singleQuoted"); }
    Myna.singleQuoted = singleQuoted;
    // Parses the given rule surrounded by parentheses, and consumes whitespace  
    function parenthesized(rule) { return seq("(", Myna.ws, rule, Myna.ws, ")").setType("parenthesized"); }
    Myna.parenthesized = parenthesized;
    // Parses the given rule surrounded by curly braces, and consumes whitespace 
    function braced(rule) { return seq("{", Myna.ws, rule, Myna.ws, "}").setType("braced"); }
    Myna.braced = braced;
    // Parses the given rule surrounded by square brackets, and consumes whitespace 
    function bracketed(rule) { return seq("[", Myna.ws, rule, Myna.ws, "]").setType("bracketed"); }
    Myna.bracketed = bracketed;
    // Parses the given rule surrounded by angle brackets, and consumes whitespace 
    function tagged(rule) { return seq("<", Myna.ws, rule, Myna.ws, ">").setType("tagged"); }
    Myna.tagged = tagged;
    // A complete identifier, with no other letters or numbers
    function keyword(text) { return seq(text, not(Myna.identifierNext)).setType("keyword"); }
    Myna.keyword = keyword;
    // Chooses one of a a list of identifiers
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
    Myna.truePredicate = new Predicate(function (p) { return true; });
    Myna.falsePredicate = new Predicate(function (p) { return true; });
    Myna.end = new Predicate(function (p) { return p.inRange; });
    Myna.notEnd = new Predicate(function (p) { return !p.inRange; });
    Myna.advance = new Advance();
    Myna.all = Myna.advance.zeroOrMore;
    Myna.atLetterLower = range('a', 'z');
    Myna.atLetterUpper = range('A', 'Z');
    Myna.atLetter = choice(Myna.atLetterLower, Myna.atLetterUpper);
    Myna.atDigit = range('0', '9');
    Myna.atHexDigit = choice(Myna.atDigit, range('a', 'f'), range('A', 'F'));
    Myna.atBinaryDigit = char('01');
    Myna.atOctalDigit = range('0', '7');
    Myna.atAlphaNumeric = choice(Myna.atLetter, Myna.atDigit);
    Myna.atUnderscore = text("_");
    Myna.atSpace = text(" ");
    Myna.atTab = text("\t");
    Myna.letterLower = Myna.atLetterLower.advance;
    Myna.letterUpper = Myna.atLetterUpper.advance;
    Myna.letter = Myna.atLetter.advance;
    Myna.letters = Myna.letter.oneOrMore;
    Myna.digit = Myna.atDigit.advance;
    Myna.digits = Myna.digit.oneOrMore;
    Myna.hexDigit = Myna.atHexDigit.advance;
    Myna.binaryDigit = Myna.atBinaryDigit.advance;
    Myna.octalDigit = Myna.atOctalDigit.advance;
    Myna.alphaNumeric = Myna.atAlphaNumeric.advance;
    Myna.underscore = Myna.atUnderscore.advance;
    Myna.identifierFirst = choice(Myna.atLetter, Myna.atUnderscore).advance;
    Myna.identifierNext = choice(Myna.atAlphaNumeric, Myna.atUnderscore).advance;
    Myna.identifier = seq(Myna.identifierFirst, Myna.identifierNext.zeroOrMore);
    Myna.hyphen = text("-");
    Myna.crlf = text("\r\n");
    Myna.newLine = choice(Myna.crlf, "\n");
    Myna.space = text(" ");
    Myna.tab = text("\t");
    // JSON definition of white-space 
    Myna.ws = char(" \t\r\n\u00A0\uFEFF").zeroOrMore;
    //===============================================================
    // Grammar functions 
    // The following are helper functions for grammar objects. A grammar is a loosely defined concept.
    // It is any JavaScript object where one or more member fields are instances of the Rule class.    
    // Returns all rules that belong to a specific grammar and that create AST nodes. 
    function grammarAstRules(grammarName) {
        return grammarRules(grammarName).filter(function (r) { return r._createAstNode; });
    }
    Myna.grammarAstRules = grammarAstRules;
    // Returns all rules that belong to a specific grammar
    function grammarRules(grammarName) {
        return allGrammarRules().filter(function (r) { return r.grammarName == grammarName; });
    }
    Myna.grammarRules = grammarRules;
    // Returns all rules as an array sorted by name.
    function allGrammarRules() {
        return Object.keys(Myna.allRules).sort().map(function (k) { return Myna.allRules[k]; });
    }
    Myna.allGrammarRules = allGrammarRules;
    // Returns an array of names of the grammars
    function grammarNames() {
        return Object.keys(Myna.grammars).sort();
    }
    Myna.grammarNames = grammarNames;
    // Creates a string representation of a grammar 
    function grammarToString(grammarName) {
        return grammarRules(grammarName).map(function (r) { return r.fullName + " <- " + r.definition; }).join('\n');
    }
    Myna.grammarToString = grammarToString;
    // Creates a string representation of the AST schema generated by parsing the grammar 
    function astSchemaToString(grammarName) {
        return grammarAstRules(grammarName).map(function (r) { return r.name + " <- " + r.astRuleDefn; }).join('\n');
    }
    Myna.astSchemaToString = astSchemaToString;
    // Initializes and register a grammar object and all of the rules. 
    // Sets names for all of the rules from the name of the field it is associated with combined with the 
    // name of the grammar. Each rule is stored in Myna.rules and each grammar is stored in Myna.grammars. 
    function registerGrammar(grammarName, grammar) {
        for (var k in grammar) {
            if (grammar[k] instanceof Rule) {
                var rule = grammar[k];
                rule.setName(grammarName, k);
                Myna.allRules[rule.fullName] = rule;
            }
        }
        Myna.grammars[grammarName] = grammar;
        return grammar;
    }
    Myna.registerGrammar = registerGrammar;
    //===========================================================================
    // Utility functions
    // Replaces characters with the JSON escaped version
    function escapeChars(text) {
        var r = JSON.stringify(text);
        return r.slice(1, r.length - 1);
    }
    Myna.escapeChars = escapeChars;
    // Creates a dictionary from a set of tokens, mapping each one to the same rule.     
    function charsToDictionary(chars, rule) {
        var d = {};
        var tokens = chars.split("");
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var t = tokens_1[_i];
            d[t] = RuleTypeToRule(rule);
        }
        return d;
    }
    // Creates a dictionary from a range of tokens, mapping each one to the same rule.     
    function charRangeToDictionary(min, max, rule) {
        if (min.length != 1 || max.length != 1)
            throw new Error("rangeToDictionary requires characters as inputs");
        var d = {};
        var a = min.charCodeAt(0);
        var b = max.charCodeAt(0);
        for (var i = a; i <= b; ++i)
            d[String.fromCharCode(i)] = RuleTypeToRule(rule);
        return d;
    }
    //===========================================================================
    // Initialization
    // The entire module is a grammar because it is an object that exposes rules as properties
    registerGrammar("core", Myna);
})(Myna || (Myna = {}));
if (typeof module === "object" && module.exports)
    module.exports = Myna;
//# sourceMappingURL=myna.js.map