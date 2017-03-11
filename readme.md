# Myna Parsing Library 

[![npm version](https://badge.fury.io/js/myna-parser.svg)](https://badge.fury.io/js/myna-parser) 
[![Build Status](https://travis-ci.org/cdiggins/myna-parser.svg?branch=master)](https://travis-ci.org/cdiggins/myna-parser)

Myna is a lightweight general purpose JavaScript library for syntactic analysis (text parsing) based on the [PEG formalism](http://bford.info/pub/lang/peg). This means that Myna is capable of recognizing any pattern that can be described using a regular-expression or context-free grammar (CFG). Myna is written using [TypeScript 2.0](https://www.typescriptlang.org/) and targets [ECMAScript 5.1](https://www.ecma-international.org/ecma-262/5.1/). 

Unlike several popular syntactic analyzers (e.g. [Jison](http://jison.org/), [PEG.js](https://pegjs.org/), [nearley](http://nearley.js.org/), [ANTLR](http://www.antlr.org/)) Myna is an API, not a code generation tool, which makes it easier for programmers to write, debug, and maintain their parsing algorithms. This makes Myna closest to [Parsimmon](https://github.com/jneen/parsimmon) and [Chevrotain](https://github.com/SAP/chevrotain). Myna has no dependencies, you can just download [myna.js](https://github.com/cdiggins/myna-parser/raw/master/myna.js) and start using it immediately.

Myna, and the accompanying grammars, are implemented as CommonJS and Node.js compatible JavaScript modules that also "just work" in the browser without the need for an additional module loader. 

# Introduction 

## How is Myna different from a Regular Expression

In many respects any parsing library that can recognize a context-free grammar (CFG) like Myna is similar to writing a regular expression. Many of the same concepts carry over (e.g. concatenation, alternation, Kleene closure, quantification, etc.). The advantages of Myna are that you can easily find and capture patterns that have a nested structure, such as [nested parentheses](http://stackoverflow.com/questions/133601/can-regular-expressions-be-used-to-match-nested-patterns). Other advantages are the you can express sub-patterns as variables or functions, and automatically create a parse tree.  

## Why another parsing library? 

I am currently working on a programming language implementation that can run in the browser. I wanted a JavaScript library (not a code generator) based on the PEG formalism that was easy to extend, robust, and efficient. The JavaScript library that comes closest to what I was looking for in terms of API is probably [Parsimmon](https://github.com/jneen/parsimmon). It did not satisfy my particular needs for the project I am working on, so since I had done this a few times before, [first using C++ templates](http://www.drdobbs.com/cpp/recursive-descent-peg-parsers-using-c-te/212700432), [then in C#](https://www.codeproject.com/Articles/272494/Implementing-Programming-Languages-using-Csharp), I decided to implement my own parser combinator using TypeScript.

When I looked under the hood at many popular JavaScript libraries that perform text parsing for specific goals (e.g. parsing Markdown, CSV, JSON, XML, JavaScript, TypeScript, YAML), they often use custom hand-written parsers combined with regular expressions. I believe that with enough work a PEG parsing library should  be able to have performance on par with these hand-written parsers while making it easier to extend, maintain, re-use, and debug the code-bases. 

## Related Parsing Libraries

Like many developers you are probably trying to evaluate which library is best suited for your needs. In my own research here are some JavaScript parsing libraries and parser generators that I found on GitHub, listed according to the number of times the repo has been starred on Github (as of January 2, 2017).

- [Jison](https://github.com/zaach/jison) (2611)
- [Peg.js](https://github.com/pegjs/pegjs) (2078)
- [Ohm](https://github.com/harc/ohm) (814)
- [Nearley](https://github.com/Hardmath123/nearley) (571)
- [Parsimmon](https://github.com/jneen/parsimmon) (413)
- [Chevrotain](https://github.com/SAP/chevrotain) (304)
- [JSParse](https://github.com/doublec/jsparse) (103)
- [Bennu](https://github.com/mattbierner/bennu) (81)
- [Packrattle](https://github.com/robey/packrattle) (66)

# Using Myna 

You can download the latest [`myna.js`](https://github.com/cdiggins/myna-parser/raw/master/myna.js) directly and just start using it in your project, or you can also install the latest Myna package from npm using:

> npm i myna-parser

## Example Grammars 

For examples of how to construct a parser in JavaScript using Myna see the following pages:

- https://github.com/cdiggins/myna-parser/blob/master/grammars/csv.js
- https://github.com/cdiggins/myna-parser/blob/master/grammars/json.js
- https://github.com/cdiggins/myna-parser/blob/master/grammars/arithmetic.js

You might also want to take a look at `tests/tests.js` to see how the API and grammars are being tested. 

## Myna Source Code and Dependencies

The Myna library is written in TypeScript 2.0 and is contained in one file `myna.ts`. There are no other dependencies.
 
## Building Myna

The `myna.js` library is generated from the `myna.ts` source file using the TypeScript 2.0 compiler (tsc). I use [npm](http://npmjs.com) as my build tool and task runner. 
I would welcome submissions for making my package cross platform. I use Visual Studio Code as my development environment.  

<!--
The commands you can use from the shell once you have npm installed are:

- `npm run build` - Runs the TypeScript compiler (tsc) to generate `myna.js` from `myna.ts`. 

- The post build steps are to run `test`, `wincover`, `makedist` and `copyfiles` 

- `npm run test` or `npm tests` - Runs the Mocha test runner on the test suite `tests\mocha_runner.js`
- `npm run makdist` - Creates a minified version of myna `dist\myna.min.js`
- `npm run copyfiles` - Copies test files and build results to the documentation folder.  
- `npm run wincover` - Creates a code coverage report build using Istanbul (re-runs Mocha)  
-->

You can look at the `package.json` file to see how each of the scripts are implemented.    

## Myna Tests  

I am using [QUnit](http://qunitjs.com) to [test Myna in the browser](https://cdiggins.github.io/myna-parser/qunit.html), [Mocha](http://mochajs.org) to run the unit tests on Node.js via `npm test`, and [Istanbul](http://istanbul-js.org) to measure [code coverage](https://cdiggins.github.io/myna-parser/coverage/lcov-report/index.html). I am currently testing on Node.js v4.5.0 and Chrome v55 on Windows 10. I do not use any  assertion libraries instead there is an agnostic test suite (see `test/tests.js`) that is can be fed run to different test runners.    
 
## Minification   

I am providing a minified/obfuscated version for convenience `dist/myna.min.js` that is being generated with [uglify.js](https://www.npmjs.com/package/uglify-js). Note that for time being I am not testing or supporting the minified version.  

# Bugs and Issues

Please submit any issues, questions, or feature requests via the [GitHub issue tracker](https://github.com/cdiggins/myna-parser/issues).

# Supporting Myna

You can show your support by reporting issues, making suggestions, contributing fixes, offering ideas, and providing feedback or critiques of any aspect of this project. Whether it is about code, development environment, documentation, processes, tests, philosophy, or general approach, it is all appreciated and helpful. I want this library to be as useful to you, as it is for me, and I want to continue to learn to be a better developer.

Letting me know how you use Myna, or why you decided against it would also be helpful, as would sharing your grammars with us!           

# Author 

[Christopher Diggins](https://github.com/cdiggins)

# License

Myna is licensed under the MIT License.   

# Acknowledgements 

Thank you to my three gatitas Anneye, Anna, and Beatrice for their love, patience, and support. Also thank you to everyone who has ever written open-source code. We are doing this together!  

 