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


    this.float = m.digit.zeroOrMore.then(m.seq('.', m.digits).opt).ast;    
    this.boostFactor = m.float.ast;
    this.boost = this.text("^").then(this.boostFactor).ast;

    this.termChar = m.alphaNumeric.or(m.chars("?*"));
    this.fuzzFactor = this.float.ast; 
    this.fuzzy = m.seq('~', this.fuzzFactor.opt).ast;    
    this.single = m.termChar.oneOrMore.then(this.fuzzy.opt).ast;    
    this.proximity = m.seq('~', this.digits.opt).ast;    
    this.phrase = m.doubleQuoted(m.charExcept('"')).ast;
    this.regex = m.seq('/', m.charExcept('/').zeroOrMore, '/').ast;
    this.endPoint = m.choice(m.char('*')); 
    this.inclusiveRange = m.seq('[', m.charExcept(']'), ']').ast;
    this.exclusiveRange = m.seq('{', m.charExcept('}'), '}').ast;
    this.range = m.inclusiveRange.or(m.exclusiveRange).ast;
    this.modifier = m.chars("+-").opt.ast;
    this.term = m.seq(this.modifier, m.opt(this.field.then(':')), m.choice(this.single, this.phrase, this.regex), this.boost.opt).ast;
    
    this.group = m.parenthesized(this.term).ast;
    this.clause = m.choice(this.group);
    this.operator = m.keywords("OR NOT", "AND NOT", "OR", "AND", "NOT", "||", "&&", "!").opt.ast;

    this.ws = m.chars(' \t\n\r\f').oneOrMore;
    this.keyChar = m.letter.or(".");
    this.escapedChar = m.char('\\').then(m.advance);
    this.key = this.keyChar.oneOrMore.ast;
    this.singleQuotedValue= m.seq("'", this.escapedChar.or(m.anyCharExcept("'")), "'").ast;
    this.doubleleQuotedValue= m.seq('"', this.escapedChar.or(m.anyCharExcept('"')), "'").ast;
    this.value = m.choice(this.singleQuotedString, this.doubleQuotedString, this.query).ast;
    this.keyValue = this.key.then('=').opt.then(this.value).ast;
    this.localParams = m.seq('{!', m.delimited(this.keyValue, this.ws), m.assert('}')).ast;

    this.terms = m.delimited(this.term.then(this.ws.opt), this.operator.then(this.ws.opt)).ast;
    this.query = m.seq(this.localParams.opt, this.terms).ast;
}




// TODO: date time

// /HOUR ... Round to the start of the current hour
// /DAY ... Round to the start of the current day
// +2YEARS ... Exactly two years in the future from now
// -1DAY ... Exactly 1 day prior to now
// /DAY+6MONTHS+3DAYS ... 6 months and 3 days in the future from the start of the current day
// +6MONTHS+3DAYS/DAY ... 6 months and 3 days in the future from now, rounded down to nearest day
// MINUTE and MINUTES; MILLI, MILLIS, MILLISECOND, and MILLISECONDS

/*
title:"The Right Way" AND text:go
title:"Do it right" AND right
title:Doing it wrong
te?t
test*
te*t
roam~
1972-05-20T17:33:18.772Z+6MONTHS+3DAYS/DAY
\(1\+1\)\:2
"(1+1):2"
1972-05-20T17:33:18.772Z
1972-05-20T17:33:18.77Z
1972-05-20T17:33:18.7Z
timestamp:[* TO NOW]
createdate:[1976-03-06T23:59:59.999Z TO *]
createdate:[1995-12-31T23:59:59.999Z TO 2007-03-06T00:00:00Z]
pubdate:[NOW-1YEAR/DAY TO NOW/DAY+1DAY]
createdate:[1976-03-06T23:59:59.999Z TO 1976-03-06T23:59:59.999Z+1YEAR]
createdate:[1976-03-06T23:59:59.999Z/YEAR TO 1976-03-06T23:59:59.999Z]
+popularity:[10 TO  *] +section:0
field:[* TO 100] 
field:[100 TO *] 
field:[* TO *]
{!lucene q.op=AND df=text}myfield:foo +bar -baz
{!func}popularity
start_date:[* TO NOW]

// Function query syntax
_val_:myfield
_val_:"recip(rord(myfield),1,2,3)"

// Local params
{!q.op=AND df=title}solr rocks
{!type=dismax qf='myfield yourfield'}solr rocks
{!type=dismax qf="myfield yourfield"}solr rocks
{!dismax qf=myfield}solr rocks
{!type=dismax qf=myfield}solr rocks
{!type=dismax qf=myfield v='solr rocks'}
{!type=dismax qf=myfield v=$qq}&qq=solr rocks
*/