"use strict";

let expand = require('../template_expander');

function testExpand(template, data) {
    console.log("Expanding template: ", template);
    console.log("Data: ", data);
    console.log("Result: ", expand(template, data));
}

testExpand("{{a}} {{b}} {{c}} {{d}}", { a:10, b:"hello", d:true});
testExpand("{{a}}", { a:"<<>>"});
