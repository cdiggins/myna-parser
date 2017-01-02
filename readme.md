# Myna Parsing Library

Myna is a lightweight general purpose JavaScript library (https://www.typescriptlang.org/) based on the [PEG formalism](http://bford.info/pub/lang/peg). Myna is written using TypeScript 2.0 and targets [ECMAScript 5.1](https://www.ecma-international.org/ecma-262/5.1/)). 

Unlike many popular syntactic analyzers (e.g. [PEG.js](https://pegjs.org/), [nearley](http://nearley.js.org/), [ANTLR](http://www.antlr.org/)) Myna is an API, not a code generation tool, which makes it easier for programmers to write, debug, and maintain their parsing algorithms. 

Myna has no dependencies, you can download [myna.js](https://github.com/cdiggins/myna-parser/raw/master/myna.js) and start using it.

For examples of how to construct a parser using Myna see the following pages:

- https://github.com/cdiggins/myna-parser/blob/master/grammars/csv.js
- https://github.com/cdiggins/myna-parser/blob/master/grammars/json.js
- https://github.com/cdiggins/myna-parser/blob/master/grammars/arithmetic.js
