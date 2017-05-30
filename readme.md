# [Myna Parsing Library](https://cdiggins.github.io/myna-parser)

[![npm version](https://badge.fury.io/js/myna-parser.svg)](https://badge.fury.io/js/myna-parser) 
[![Build Status](https://travis-ci.org/cdiggins/myna-parser.svg?branch=master)](https://travis-ci.org/cdiggins/myna-parser)

### [Home Page](https://cdiggins.github.io/myna-parser) | [QUnit Tests](https://cdiggins.github.io/myna-parser/tests/qunit.html) | [Source Code](https://github.com/cdiggins/myna-parser/blob/master/myna.ts) 

Myna is an efficient and easy to use parsing library for JavaScript written using [TypeScript 2.0](https://www.typescriptlang.org/) which targets [ECMAScript 5.1](https://www.ecma-international.org/ecma-262/5.1/). 

Unlike several popular parsing libraries (e.g. [Jison](http://jison.org/), [PEG.js](https://pegjs.org/), [nearley](http://nearley.js.org/), and [ANTLR](http://www.antlr.org/)) Myna is an API, not a code generation tool, which makes it easier for programmers to write, debug, and maintain their parsing algorithms. This makes Myna closest to [Parsimmon](https://github.com/jneen/parsimmon) and [Chevrotain](https://github.com/SAP/chevrotain). Myna has no dependencies, you can just download myna.js and start using it immediately.

There are several [example tools](https://github.com/cdiggins/myna-parser/tree/master/tools) that demonstrate how to use Myna parsers and 
a number of [sample grammars](https://github.com/cdiggins/myna-parser/tree/master/grammars) shipped with Myna that you can use or modify as needed. 

# Getting Started

You can either download the latest `myna.js` file [via GitHub](https://github.com/cdiggins/myna-parser/raw/master/myna.js) or [via Unpkg](https://unpkg.com/myna-parser) and start using it in your project, or you can [install Myna from npm](https://www.npmjs.com/package/myna-parser). 

## Using Myna 

Myna parsers are defined as one or more *rules*. Each rule defines how to recognize a syntactic phrase in the language you are parsing. 
Rules can be combined using functions like `seq` or `choice` which are known as *combinators*. 
A collection of rule defined within a single object are called a *grammar*. 
For example a simple grammar for parsing Comma Separated Values (CSV) could look like this:

```
    let m = myna;

    let g = new function() 
    {
        this.textdata   = m.notChar('\n\r"' + delimiter);    
        this.quoted     = m.doubleQuoted(m.notChar('"').or('""').zeroOrMore);
        this.field      = this.textdata.or(this.quoted).zeroOrMore.ast;
        this.record     = this.field.delimited(delimiter).ast;
        this.file       = this.record.delimited(m.newLine).ast;   
    }
```

Once a grammar is constructed it suffices to register it with the Myna module providing a name, and a reference to the starting rule of the grammar:

```
    myna.registerGrammar("csv", g, g.file);
```

Once the grammar is registered with Myna a parse function is exposed that will take an input string and output a *parse tree*, also knowns as an *abstract syntax tree* or *AST* for short. In the case of the CSV example the parse function is `myna.parsers.csv`. 

Only rules that are defined with the `.ast` property will generate nodes in the parse tree. 

## Myna Source Code and Dependencies

The Myna library is written in TypeScript 2.0 and is contained in one file [`myna.ts`](https://github.com/cdiggins/myna-parser/tree/master/myna.ts). 
The generated Myna JavaScript file that you would include in your project is [`myna.js`](https://github.com/cdiggins/myna-parser/tree/master/myna.js). 

Myna has no run-time dependencies. The Myna module, and the grammars are designed to be able to be run from the browser or from Node.JS.
 
## Building Myna

The `myna.js` library is generated from the `myna.ts` source file using the TypeScript 2.0 compiler (tsc). I use [npm](http://npmjs.com) as my build tool and task runner. 
I would welcome submissions for making my package cross platform. I use Visual Studio Code as my development environment. 

## Myna Tests  

There are over a [1000 unit tests](https://cdiggins.github.io/myna-parser/qunit.html) written using [QUnit](http://qunitjs.com). There are also individual test files for each example tool, which you can run as a suite using `node tests\test_all_tools.js`.

## Minification   

For convenience I am providing a minified/obfuscated version `dist/myna.min.js` that is being generated with [uglify.js](https://www.npmjs.com/package/uglify-js). 

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

Thanks to Eric Lindahl of [Sciumo](https://sciumo.com/) for being the first person to financially support the Myna project.

 
