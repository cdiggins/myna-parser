"use strict";

// Implements a small subset of the TypeScriptGrammar
// See https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#A
function TypeScriptGrammar(myna)  
{
    // Setup a shorthand for the Myna parsing library object
    let m = myna;    

    // Grab the JSON grammar 
    let jg = m.grammars.json;
    if (jg === undefined)
        throw "The typescript grammar depends on the JSON grammar";
    
    this.identifier = m.identifier.copy;
    this.className = this.identifier.copy;
    this.interfaceName = this.identifier.copy;
    this.declarePreamble = m.wsSeq(m.keyword("declare").opt, m.keyword("export").opt);
    this.letDecl = m.wsSeq(this.declarePreamble, m.keyword("class"), this.letDecl);
    this.classDecl = m.wsSeq(this.declarePreamble, m.keyword("class"), this.className);
    this.interfaceDecl = m.seq(this.declarePreamble, m.keyword("interface"), this.interfaceName); 

    // Finalize the grammar and make it available to all users of the Myna module 
    m.registerGrammar("typescript", this);    
};

// Export the function for use use with Node.js
if (typeof module === "object" && module.exports) 
    module.exports = TypeScriptGrammar;