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
- Why you shouldn't encode actions in a grammar
- Why an API instead of a code generator. 
- How to build a type-inference engine http://stackoverflow.com/questions/415532/implementing-type-inference


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