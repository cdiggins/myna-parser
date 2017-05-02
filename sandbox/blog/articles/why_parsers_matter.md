# Why Parsers Matter

Text parsing is a very powerful tool in a programmer's arsenal. The ability to convert from one structured textual form to another
can be used to construct a wide range of tools. 

## Libraries that use Parsers

Many popular JavaScript libraries have text parsing algorithms at their core, but many of these do not use parsing libraries. Here
are some examples of JavaScript libraries where text parsing is a primary component. I have linked to their core parsing code where possible. 

- JavaScript 
  - [UglifyJS2](https://github.com/mishoo/UglifyJS2/blob/master/lib/parse.js) (5858)
  - [Esprima](https://github.com/jquery/esprima/blob/master/src/) (3526)
  - [Acorn](https://github.com/ternjs/acorn/blob/master/src/tokenize.js) (2116)
- YAML 
  - [JS-YAML](https://github.com/nodeca/js-yaml/blob/master/lib/js-yaml/loader.js)  
- JSON
  - [JSON 3](https://github.com/bestiejs/json3/blob/master/lib/json3.js) (921)
  - [JsonParser](https://github.com/creationix/jsonparse/blob/master/jsonparse.js)
- Argument parsing 
  - [Nomnom](https://github.com/harthur/nomnom/blob/master/nomnom.js) (443)
  - [yargs-parser](https://github.com/yargs/yargs-parser/blob/master/index.js) (53)
  - [ArgParse](https://github.com/nodeca/argparse/blob/master/lib/argument_parser.js) (170)
- CSV
  - [PapaParse](https://github.com/mholt/PapaParse/blob/master/papaparse.js) 
  - [CSV.js](https://github.com/knrz/CSV.js/blob/master/csv.js) (1337)
  - [CSV-JS](https://github.com/gkindel/CSV-JS/blob/master/csv.js) (82)
- Spreadsheet
  - [js-xslx](https://github.com/SheetJS/js-xlsx/blob/master/xlsx.js) (4533)
- Markdown
  - [marked](https://github.com/chjj/marked/blob/master/lib/marked.js) (11520)
  - [markdown-js](https://github.com/evilstreak/markdown-js/blob/master/src/parser.js) (5464)
  - [Remarkable](https://github.com/jonschlinkert/remarkable/blob/master/lib/parser_core.js) (3027)
  - [Commonmark](https://github.com/jgm/commonmark.js/blob/master/lib/blocks.js) (408)
- XML
  - [node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js/blob/master/src/parser.coffee) (2255)
  - [sax js](https://github.com/isaacs/sax-js/blob/master/lib/sax.js) (667)
  - [node-xml](https://github.com/robrighter/node-xml/blob/master/lib/node-xml.js) (195)
- PDF
  - [PDF.js](https://github.com/mozilla/pdf.js/blob/master/src/core/parser.js)
- Textile 
  - [textile.js](https://github.com/borgar/textile-js/blob/master/src/textile/flow.js)
- RTF
  - [rtf-parser](https://github.com/iarna/rtf-parser/blob/master/rtf-parser.js)
  - [RTF2HTML](https://github.com/Novlr/rtf2html/blob/master/index.js) 
- Date/Time
  - [Fecha](https://github.com/taylorhakes/fecha/blob/master/fecha.js) (791)
  - [Chrono](https://github.com/wanasit/chrono/blob/master/chrono.js) (745)
- Content-Type Header
  - [Parse Content-Type Header Strings](https://github.com/jsdom/content-type-parser/blob/master/lib/content-type-parser.js)
- HTML
  - [HTMLMinifier](https://github.com/kangax/html-minifier/blob/gh-pages/src/htmlparser.js) (2029)
  - [Parse5](https://github.com/inikulin/parse5/blob/master/lib/parser/index.js) (1285)
  - [HTML5 Parser for Node.js](https://github.com/aredridel/html5/blob/master/lib/Tokenizer.js) (559)
  - [Pure JavaScript HTML5 Parser](https://github.com/blowsie/Pure-JavaScript-HTML5-Parser/blob/master/htmlparser.js) (68)
  - [Himalya](https://github.com/andrejewski/himalaya/blob/master/src/parser.js)
- CSS
  - [css.js](https://github.com/jotform/css.js/blob/master/css.js) (321)
  - [CSSOM](https://github.com/NV/CSSOM/blob/gh-pages/lib/parse.js) (493)
  - [CSSPrima](https://github.com/ezequiel/cssprima)
  - [post-css-parser](https://github.com/TrySound/postcss-value-parser/blob/master/lib/parse.js) (34)
- Less
  - [less](https://github.com/less/less.js/blob/3.x/lib/less/parser/parser.js) (14367)  
- Math 
  - [Math-Expression-Evaluator](https://github.com/redhivesoftware/math-expression-evaluator/blob/master/src/lexer.js) (13)
- ASCII Math
  - [MathJax](https://github.com/mathjax/MathJax/blob/master/unpacked/jax/input/AsciiMath/jax.js) (3704)
- Documentation
  - [JSDoc](https://github.com/jsdoc3/jsdoc/blob/master/lib/jsdoc/src/parser.js) (5733)
- URL 
  - [Purl](https://github.com/allmarkedup/purl/blob/master/purl.js) (1829)
  - [js-url](https://github.com/websanova/js-url/blob/master/url.js) (1647)
- Querystring
  - [qs](https://github.com/ljharb/qs/blob/master/lib/parse.js) (921)
  - [query-string](https://github.com/sindresorhus/query-string/blob/master/index.js) (742)
- User Agent
  - [UAParser.js](https://github.com/faisalman/ua-parser-js/blob/master/src/ua-parser.js) (1755)
  - [UserAgent](https://github.com/3rd-Eden/useragent/blob/master/lib/regexps.js) (498)
- Glob
  - [Parse-glob](https://github.com/jonschlinkert/parse-glob/blob/master/index.js)
- Regular Expression
  - [Regulex](https://github.com/JexCheng/regulex/blob/master/src/parse.js) (2770)
- Syntax coloring
  - [Highlight.js](https://github.com/isagalaev/highlight.js/blob/master/src/highlight.js) (9011)
  - [Prism](https://github.com/PrismJS/prism/blob/master/prism.js) (3759)
- BBCode
  - [Extendible-BBCode-Parser](https://github.com/patorjk/Extendible-BBCode-Parser/blob/master/xbbcode.js) (77)
- INI file
  - [INI Parser for node](https://github.com/npm/ini/blob/master/ini.js) (211)
- Template Languages
  - [Mustache](https://github.com/janl/mustache.js/blob/master/mustache.js) (10269)
  - [doT](https://github.com/olado/doT/blob/master/doT.js) (3151)
- LaTeX
  - [MathJax](https://github.com/mathjax/MathJax/blob/master/unpacked/jax/input/TeX/jax.js) (3704)
  - [JaxEdit](https://github.com/zohooo/jaxedit/blob/master/typejax/typejax.js) (87)
- Plain Text
  - [Knwl.js](https://github.com/mathjax/MathJax/blob/master/unpacked/jax/input/AsciiMath/jax.js) (5204)
- Wavefront OBJ
  - [Three.js](https://github.com/mrdoob/three.js/blob/master/src/loaders/ObjectLoader.js) (30109)
  - [parse-wavefront-obj](https://github.com/thibauts/parse-wavefront-obj/blob/master/index.js#L109) (13)
- GLSL
  - [glsl-parser](https://github.com/stackgl/glsl-parser/blob/master/lib/index.js) (40)
- Log files
  - [chrome-http2-log-parser](https://github.com/rmurphey/chrome-http2-log-parser/blob/master/lib/parse.js) (82)
  - [node-logfmt](https://github.com/csquared/node-logfmt/blob/master/lib/logfmt_parser.js) (77)
  - [Logaentxc](https://github.com/sematext/logagent-js/blob/master/lib/parser/parser.js) (53)

