"use strict";

// Implements a parser for common programming language comments
// C++, Java, C#, JavaScript, TypeScript, etc. 
function CommentsGrammar(myna)  
{
    // Setup a shorthand for the Myna parsing library object
    let m = myna;    

    this.ws = m.space.or(m.tab).star; 
    this.newLine = this.newLine.copy.ast;
    this.lineCommentContents = m.advanceWhileNot(this.newLine).ast;
    this.lineComment = m.seq("//", m.star("/").ws, this.lineCommentContents, this.newLine);
    this.lineComments = this.lineComment.plus.ast;

    this.blockCommentLineContents = m.advanceWhileNot(m.choice("*/"), this.newLine).ast;
    this.blockCommentLine = m.seq(this.ws, m.star("*").ws, this.blockCommentLineComments); 
    this.blockComment = m.seq("/*", this.blockCommentLine.then(this.newLine).star, "*/").ast;

    this.code = m.seq(m.advanceWhileNot(m.or(this.newLine, m.blockComment, m.lineComment))).ast;
    this.element = m.choice(this.ws, this.code, this.blockComment, this.lineComment, this.newLine);

    this.file = this.element.star; 

    // Finalize the grammar and make it available to all users of the Myna module 
    m.registerGrammar("comments", this);    
};

// Export the function for use use with Node.js
if (typeof module === "object" && module.exports) 
    module.exports = CommentsGrammar;