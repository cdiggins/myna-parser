// http://lucene.apache.org/core/4_0_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html
// https://wiki.apache.org/solr/SolrQuerySyntax

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

"use strict";

function CreateLuceneGrammar(myna) {
    let m = myna;
    let specialChars = m.chars('+-&|!(){}[]^"~*?:\//');
    this.ws = m.chars(' \t\n\r\f').oneOrMore;

    this.float = m.digit.zeroOrMore.then(m.seq('.', m.digits).opt).ast;    
    this.boostFactor = m.float.ast;
    this.boost = this.text("^").then(this.boostFactor).opt.ast;

    this.termChar = m.alphaNumeric.or(m.chars("?*"));
    this.fuzzFactor = this.float.ast; 
    this.fuzzy = m.seq('~', this.fuzzFactor.opt).ast;    
    this.proximity = m.seq('~', this.digits.opt).ast;    
    this.endPoint = m.choice(m.char('*')); 
    this.inclusiveRange = m.seq('[', m.charExcept(']'), ']').ast;
    this.exclusiveRange = m.seq('{', m.charExcept('}'), '}').ast;
    this.range = m.choice(this.inclusiveRange, this.exclusiveRange).ast;
    this.modifier = m.chars("+-").opt.ast;
    this.field = this.identifer.ast;

    let _this = this; 
    this.delayedTerm = m.delay(function () { return _this.term; });

    // Core term types 
    this.single = m.termChar.oneOrMore.then(this.fuzzy.opt).ast;    
    this.phrase = m.doubleQuoted(m.charExcept('"')).ast;
    this.regex = m.seq('/', m.charExcept('/').zeroOrMore, '/').ast;
    this.group = m.parenthesized(this.delayedTerm).ast;

    this.term = m.seq(this.modifier, m.opt(this.field.then(':')), m.choice(this.group, this.single, this.phrase, this.regex), this.boost).ast;
    
    this.operator = m.keywords("OR NOT", "AND NOT", "OR", "AND", "NOT").or(m.choice("||", "&&", "!")).opt.ast;

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
}