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
- Can Imake a generative grammar from a PEG?
- How can I express the AST as a class? 
- Maybe using a class? 
- I think I can figure out the AST looking at the grammar.

    this.ast = {
        document: {
            zeroOrMore : ['heading', 'list', 'quote', 'codeBlock', 'paragraph'],                        
        },
        heading: {
            seq : ['headingLevel', 'restOfLine'],
        }
    }
