"use strict";

// Implements a CSV (comma separated values) grammar using the Myna parsing library
// See https://tools.ietf.org/html/rfc4180
// Because this grammar is computed at run-time, it can support tab delimited data by passing in "\t" 
// to the constructor as the delimiter.  
function CsvGrammar(myna, delimiter)  
{
    if (delimiter === undefined)
        delimiter = ",";

    // Set a shorthand for the Myna parsing library object
    let m = myna;

    this.textdata   = m.charExcept('\n\r"' + delimiter);    
    this.quoted     = m.doubleQuoted(m.charExcept('"').or('""').star);
    this.field      = this.textdata.or(this.quoted).star.ast;
    this.record     = this.field.delimited(delimiter).ast;
    this.file       = this.record.delimited(m.newLine);   

    // Finalize the grammar and make it available to all users of the Myna module 
    m.registerGrammar("csv", this);        
}

// Export the function when using Node.js
if (typeof module === "object" && module.exports) 
    module.exports = CsvGrammar;