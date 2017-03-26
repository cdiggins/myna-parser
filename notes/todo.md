# Things to do 

- [ ] start work on the optimizer 
  - [ ] get the myna-parser CSV parser faster than Papa parse 
- [ ] more sample grammars and tools
    - [ ] write a commented-JSON parser and a tool, strips comments from JSON. 
    - [ ] finish the "C++ comment" parser 
    - [ ] write a parser for Github flavored markdown (GitMarkdown)
    - [ ] finish the JavaScript tokenizer 
        - [ ] interactive tester 
        - [ ] special test function . . . given some JavaScript generate tokens 
- [ ] figure out how 

# Ideas

## For Blog Posts

- Why are Grammars defined as classes. 
- Why the grammars have Myna as an argument: the dependency injection pattern 
- Git Markdown versus CommonMark 
- Why the grammars aren't included automatically. 
- Let versus Var 
- JavaScript versus TypeScript
- Why parsers are releva nt. 
- Linear versus non-linear thinking 
- Emotions in the workplace 
- Hand-rolling a parser: why is everyone doing it? 
- Code generation versus APIs. 
- CommonJS versus AMD
- Gulp, Grunt, and Node
- Testing a Myna grammar 
- Why hand-roll an export and not use "browserify"? 
- Testing APIs is hard: writing test frameworks 
- Mocha + QUnit + Istanbul in the browser and using node
- General text scanning with Myna
- Replacing regular expressions with a syntax analyzer
- Common regular expressions as AST. 
- Using "lookups" for faster PEG parsing. 
- PEG optimization
- Greedy matching of words, even when not interested. 
- Why do most rules in the grammar end with ".ast"? (maybe make "ast" the default?).
- 750 assertions.
- Analyzing code complexity 
- Why I stopped measuring code coverage 
- The importance of supplying grammars. 
- A minimal parser combinator library
- If they are objects are they really combinators? 
- How stateless is Myna really.
- If static global data is evil why am I using it in Myna.
- Relearning JavaScript / CSS, and what not
- Fluent APIs 
- Difference between concrete syntax tree (CST) and abstract syntax tree (AST)
- Why we don't capture the CST.
- How to speed up PEG parsers
- Why I am so in love with TypeScript, JavaScript. 
- What to watch out for with PEGs and performance. 
- Why aren't people using parsing libraries? 
- How tests reveal assumptions about your code
- Why tests are not replacements for types
- Lots of small functions.
- The data-driven nature of JavaScript 
- How JavaScript worsk better when not used as an object oriented language
- Interfaces over classes
- Good designs for Interfaces
- 30 years of programming, seriously. I earned these white hairs.
- The problem of opinion, 
- Why shouldn't a programmer making more than a master mechanic?
- Lookahead parsers and PEG parsers, don't really need to change
- Merging the lexer and parser
- Why you shouldn't encode actions in a grammar (unless debugging )
- Why an API instead of a code generator. 
- How to build a type-inference engine http://stackoverflow.com/questions/415532/implementing-type-inference
- Checking for infinite loops in a PEG parser
- How assertions work 
- The mistake I made of using global state 
- What exactly is the parser class. 
- Why so much code? 
- A faster HTML character escaper. Why it works? 
- What is a Fluent API and why should we care
- Why I prefer the "?:" syntax? 
- Expressions over statements, except when iit hurts debugging 
- THe lookup rule, how it works and why it is important. 
- What should a new language have as a minimal set of features 
- "this" in JavaScript is complicated and can/should be avoided. 
- Composition versus inheritance
- Signature based polymorphism versus explicit 
- 3D Logo programming
- Growing up a Logo kid
- unstructured programming
- The problems with GPGPU programming with WebGL: two languages none of them well structured, 
- Death of a language due to lack of a module system 
- My regrets about MCG 
- WebGL programming tricks 
- Making a JavaScript file friendly for Node.JS modules and browser, without the crazy syntax. 
- Versioning source code? 
- Exception
- Strings are almost exclusively for debugging (e.g. the ToString)
- The danger of assert 
- Crashing is not acceptable 
- Rules for good documentation
- How to evaluate an open-source library 
- If you only know C/C++ I probably wouldn't hire you, and here is why. 
- I made it past 20 years of professional experience, and here is what I done and learned 
- The embarassments of my youth 
- The squatters on my web-sites
- Why I moved on from ... forum A, project B, language C, technology D, paradigm E. 
- Thoughts on UI libraries and frameworks. 
- https://github.com/PARC/Libparc/blob/03028c898671112bea6432eb7b31bc4e1db62d43/documentation/Jekyll/PARC/_posts/2014-11-20-PARC-Conventions-Documentation.md
- What happened with the "Any" class. 
- Principles of Good programming: https://github.com/BMDuke/google_homepage/blob/82fc1a46d715174632c82abe894ee62b3ca79a5f/web_development_101/principles_of_good_programming.md 
- I need to fix something: Abrahams.
- How to build a type-inference engine. You first need how to build Prolog. 
- Some of my reviews: you overwhelm us with information, you make other people feel less smart, you come across as a narcissist. I'm sorry!!! 
- 

## For tester

- For every rule: choose the rule. 
- Output a description oif the rule.
- AST utilities  
- AST to HTML 
- From grammar to text and from text to grammar. 
- Record all of the rules that are tested
- Choose input, choose grammar, show grammar (list rules), create AST 

## For Myna

- Find all
- Find first
- Find last 
- Can I make a generative grammar from a PEG?

## Bugs

"AdvanceWhileNot" should "advancePast"