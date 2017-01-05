# Myna Parsing Library 

[![npm version](https://badge.fury.io/js/myna-parser.svg)](https://badge.fury.io/js/myna-parser)

Myna is a lightweight general purpose JavaScript library for syntactic analysis (text parsing) based on the [PEG formalism](http://bford.info/pub/lang/peg). Myna is written using [TypeScript 2.0](https://www.typescriptlang.org/)) and targets [ECMAScript 5.1](https://www.ecma-international.org/ecma-262/5.1/)). 

Unlike many popular syntactic analyzers (e.g. [Jison](http://jison.org/), [PEG.js](https://pegjs.org/), [nearley](http://nearley.js.org/), [ANTLR](http://www.antlr.org/)) Myna is an API, not a code generation tool, which makes it easier for programmers to write, debug, and maintain their parsing algorithms. Myna has no dependencies, you can just download [myna.js](https://github.com/cdiggins/myna-parser/raw/master/myna.js) and start using it immediately.

Myna, and the accompanying grammars, are implemented as CommonJS and Node.js compatible JavaScript modules that also "just work" in the browser without the need for an additional module loader. 

# Introduction 

## Why another parsing library? 

I am working on a programming language implementation that can run in the browser. I wanted a JavaScript library (not a code generator) based on the PEG formalism that was easy to extend, robust, and sufficiently efficient. The JavaScript library that comes closest to what I was looking for in terms of API is probably [Parsimmon](https://github.com/jneen/parsimmon). It didn't satisfy my particular needs for the project I'm working on so since I had done this a few times before, [first using C++ templates](http://www.drdobbs.com/cpp/recursive-descent-peg-parsers-using-c-te/212700432), [then in C#]([https://www.codeproject.com/Articles/272494/Implementing-Programming-Languages-using-Csharp), I decided to implement my own parser combinator using TypeScript.     

## Related Libraries

Like many developers you are probably trying to evaluate which library is best suited for your needs. In my own research here are some JavaScript parsing libraries and parser generators that I found on GitHub, listed very unscientifically according to the number of times the repo has been favorited on Github (as of January 2, 2017).

- https://github.com/zaach/jison (2611)
- https://github.com/pegjs/pegjs (2078)
- https://github.com/Hardmath123/nearley (571)
- https://github.com/jneen/parsimmon (413)
- https://github.com/SAP/chevrotain (304)
- https://github.com/doublec/jsparse (103)
- https://github.com/mattbierner/bennu (81)
- https://github.com/robey/packrattle (66)

# Using Myna 

You can download the latest `myna.js` directly and just start using it. If you want a minified version I have provided for convenience: `dist/myna.min.js` which is generated via [uglify.js](https://www.npmjs.com/package/uglify-js). Note that, at least for now, I am not testing or supporting the minified version. Instead I would suggest that for production uses you should choose your own tool for minifying and/or obfuscating your code depending on your particular needs and tool-chain. 

## Building Myna

The Myna library is written in TypeScript 2.0 and is contained in one file myna.ts. In the interest of keeping the toolchain simple I just use plain old [npm](http://npmjs.com) as the task runner instead of Gulp or Grunt. Since my development environment is Windows some of the hacks in the package.json file might not work on other platforms, and I would welcome submissions for making my package cross platform. 

## Unit-testing Myna  

I am using [QUnit](http://qunitjs.com) to [test Myna in the browser](https://cdiggins.github.io/myna-parser/qunit.html), [Mocha](http://mochajs.org) to run the unit tests on Node.js via `npm test`, and [Istanbul](http://istanbul-js.org) to measure [code coverage](https://cdiggins.github.io/myna-parser/coverage/lcov-report/index.html). I am currently testing on Node.js v4.5.0 and Chrome v55 on Windows 10. I do not use any fancy assertion libraries instead I rolled my own parser test suite that could be run via different test runners (see `test/tests.js`)   
 
## Example Grammars 

For examples of how to construct a parser using Myna see the following pages:

- https://github.com/cdiggins/myna-parser/blob/master/grammars/csv.js
- https://github.com/cdiggins/myna-parser/blob/master/grammars/json.js
- https://github.com/cdiggins/myna-parser/blob/master/grammars/arithmetic.js

# Author 

[Christopher Diggins](https://github.com/cdiggins) is the author and maintainer of the Myna parser. While he sometimes talks and acts like an old-timer, he never actually had to program on punch-cards.   

## License

Myna is licensed under the MIT License.   

## Acknowledgements 

Thank you to my three gatitas Anneye, Anna, and Beatrice. Also thank you to everyone who has ever written open-source code. We are doing this together!  

 