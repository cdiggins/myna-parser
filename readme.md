# Myna Parsing Library for JavaScript 

Myna is a PEG parsing library for JavaScript written in TypeScript.  
It is designed to make it easier to write and maintain various parsing algorithms and tools. 
For example: syntactic analyzers, transformers, tokenizers, and pattern matchers. 

Myna is a JavaScript/TypeScript API, not a code generation tool, meaning parsers are constructed from a set of 
functions that define parsing rules. Each rule is an instance of the Rule base class and has a parse function. 
The Rule.parse(index:ParseIndex):ParseNode function accepts as input an object of type ParseIndex which represents a 
string of characters or tokens, and will return either a ParseNode if successful, or null otherwise.

Rules can be combined to create new rules using functions called combinators [*]. Examples of rule combinators 
are "seq" or "choice", which define a rule based on the success or failure of parsing other rules in a specific
order. 

NOTE: if we want to be 100% pedantic Myna rules are not combinators because they are returning objects, not 
functions, but this is an academic distinction. The advantage of using objects is that we can associate additional
information with rules, such as the name, and whether or not the AST nodes should be kept or discarded.  

https://en.wikipedia.org/wiki/Parsing_expression_grammar 
https://en.wikipedia.org/wiki/Parser_combinator   

Myna can be used to construct parsers for languages (patterns) whose structure  
can be described using a context-free grammar (CFG) or a regular expression (RE)
For more information on the relationship between these two pattern types 
see: http://en.wikipedia.org/wiki/Chomsky_hierarchy.

## Related parsing libraries

* Parsimmon - https://github.com/jneen/parsimmon (Combinator) 
* Bennu - http://bennu-js.com/ (Combinator)
* Paka - https://github.com/weidagang/paka-js (Combinators)
* Parsing.combinators - https://www.npmjs.com/package/parsing.combinators (Combinators) 
* JSParse - https://github.com/doublec/jsparse (Combinators)
* Warbler - https://github.com/msvbg/warbler (Combinators)
* Chevrotain - LALR https://github.com/SAP/chevrotain (LALR)
* Js-Parse - https://www.npmjs.com/package/js-parse (LR(1)) 
* Packrattle - https://github.com/robey/packrattle (GLL, Parser combinator)

## Popular JavaScript parser generators

* Peg.JS - http://pegjs.org/ (PEG)
* OMeta - http://www.tinlizzie.org/ometa/ (PEG) 
* Nearly - http://nearley.js.org/ (Earley)
* Jison - http://zaa.ch/jison/ (LALR)

## Hand-written parsers

If you are interested in hand-writing your own parser, I suggest reading an excellent
article on top-down operator precedence parsing by Douglas Crockford: 
* http://javascript.crockford.com/tdop/tdop.html  

## Who is Christopher Diggins?

I'm a programmer who has an unhealthy fascination with programming language 
design and implementation. My claim to minor notoriety in some cicles is that I wrote 
a few articles for Doctor Dobbs Journal and the C++ Users Journal, co-authored an O'Reilly C++ cookbook, 
and designed a toy language called Cat. To the best of my knowledge Cat was the first statically typed
, higher-order, stack-based language and influenced a couple of programming projects including Kitten. 
 
   
