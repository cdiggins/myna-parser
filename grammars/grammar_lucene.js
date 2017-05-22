"use strict";

// This is a grammar for Lucene 4.0 and Solr queries
// http://lucene.apache.org/core/4_0_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html
// https://wiki.apache.org/solr/SolrQuerySyntax

// Additional grammars to be built
// https://cwiki.apache.org/confluence/display/solr/Spatial+Search
// https://wiki.apache.org/solr/SpatialSearch
// http://lucene.apache.org/core/4_0_0/core/org/apache/lucene/util/automaton/RegExp.html?is-external=true
// http://lucene.apache.org/solr/6_5_1/solr-core/org/apache/solr/util/DateMathParser.html

// Sample grammars
// https://github.com/canassa/solr-mock/blob/master/lucene-query.grammar
// https://github.com/bripkens/lucene/blob/master/lib/lucene.grammar
// https://github.com/thoward/lucene-query-parser.js
// https://github.com/thoward/lucene-query-parser.js/blob/master/lib/lucene-query.grammar
// https://github.com/lrowe/lucenequery/blob/master/lucenequery/StandardLuceneGrammar.g4
// https://github.com/romanchyla/montysolr/blob/master/contrib/antlrqueryparser/grammars/StandardLuceneGrammar.g

// TODO: is a&&b a single term? Or two terms? 

function CreateLuceneGrammar(myna) 
{
    let m = myna;

    let g = new function() 
    { 
        let _this = this; 
        this.delayedTerm = m.delay(function () { return _this.term; });

        let specialChars = m.char(': \t\r\n\f{}()"/^~[]');

        this.ws = m.char(' \t\n\r\f').zeroOrMore;
        this.escapedChar = m.char('\\').advance;

        this.float = m.digit.zeroOrMore.then(m.seq('.', m.digits).opt).ast;    
        this.boostFactor = this.float.ast;
        this.boost = m.text("^").then(this.boostFactor).opt.ast;
        
        this.fuzzFactor = this.float.ast; 
        this.fuzzy = m.seq('~', this.fuzzFactor.opt).ast;    
        this.proximity = m.seq('~', m.digits.opt).ast;    
        this.modifier = m.char("+-").ast;

        this.symbolicOperator = m.choice("||", "&&", "!");
        this.operator = m.keywords("OR NOT", "AND NOT", "OR", "AND", "NOT").or(this.symbolicOperator).opt.ast;

        // Represents valid termchars 
        this.termChar = m.seq(this.symbolicOperator.not, m.charExcept(specialChars)).or(escapedChar);

        this.singleTerm = m.termChar.oneOrMore.then(this.fuzzy.opt).ast;    
        this.fieldName = this.singleTerm.ast;
        this.field = this.fieldName.then(':');

        // TODO: this should be in Myna
        this.phrase = m.doubleQuoted(m.charExcept('"')).ast;
        this.regex = m.seq('/', m.charExcept('/').zeroOrMore, '/').ast;
        
        // TODO: use the whitespace in the grammar 
        this.group = m.parenthesized(this.delayedTerm).ast;
                        
        // TODO: make the ranges  a guarded sequence 
        this.endPoint  = m.seq(this.ws, this.singleTerm, this.ws);
        this.inclusiveRange = m.seq('[', this.endPoint, m.keyword("TO"), this.endPoint, ']').ast;
        this.exclusiveRange = m.seq('{', this.endPoint, m.keyword("TO"), this.endPoint, '}').ast;
        this.range = m.choice(this.inclusiveRange, this.exclusiveRange).ast;

        this.term = m.seq(this.modifier.opt, this.field.opt, m.choice(this.group, this.singleTerm, this.phrase, this.regex, this.range), this.boost).ast;
        

        // localParams
        this.keyChar = m.letter.or(".");
        this.escapedChar = m.char('\\').then(m.advance);
        this.key = this.keyChar.oneOrMore.ast;
        this.singleQuotedValue= m.seq("'", this.escapedChar.or(m.anyCharExcept("'")), "'").ast;
        this.doubleleQuotedValue= m.seq('"', this.escapedChar.or(m.anyCharExcept('"')), "'").ast;
        this.value = m.choice(this.singleQuotedString, this.doubleQuotedString, this.query).ast;
        this.keyValue = this.key.then('=').opt.then(this.value).ast;
        this.localParams = m.seq('{!', m.delimited(this.keyValue, this.ws), m.assert('}')).ast;

        this.terms = m.delimited(this.term.then(this.ws.opt), this.operator.then(this.ws.opt)).ast;
        this.query = m.seq(this.localParams.opt, this.ws.opt, this.terms).ast;
    };

    return m.registerGrammar("lucene", g);
}
