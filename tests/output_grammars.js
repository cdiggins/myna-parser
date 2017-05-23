"use strict";

// This project outputs the grammars and the schemas of the AST trees 

var myna = require('../myna');
require('../grammars/grammar_arithmetic')(myna);
require('../grammars/grammar_csv')(myna);
require('../grammars/grammar_html_reserved_chars')(myna);
require('../grammars/grammar_json')(myna);
require('../grammars/grammar_lucene')(myna);
require('../grammars/grammar_markdown')(myna);
require('../grammars/grammar_template')(myna);

for (let g of myna.grammarNames()) 
{
    console.log("==============================");
    console.log("Grammar: " + g);
    console.log("==============================");
    console.log(myna.grammarToString(g));

    console.log("==============================");
    console.log("AST Schema: " + g);
    console.log("==============================");
    console.log(myna.astSchemaToString(g));
}

