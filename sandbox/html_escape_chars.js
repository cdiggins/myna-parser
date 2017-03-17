'use strict';

// Load the Myna module 
let myna = require('../myna.js');

function HtmlReservedCharsGrammar(myna) {
    let escapeChars = '&<>"\'';        
    this.specialChar = myna.advance.ast;
    this.plainText = myna.advanceWhileNot(m.char(escapeChars)).ast;
    this.text = myna.lookup(escapeChars, this.specialChar, this.plainText).zeroOrMore;
}

myna.registerGrammar('html_reserved_chars', HtmlReservedCharsGrammar);

// Add the template grammar to Myna
function escapeHtmlChar(text) {
    switch (text) {
        case '&': return "&amp;";
        case '<': return "&lt;";
        case '>': return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#039;";
    };    
    return text;
}

function escapeHtmlChars(text) {
    let rule = myna.all_rules('html_reserved_chars.text');
    return myna
        .parse(templateRule)
        .children.map(escapeHtmlChars).join('');
}

