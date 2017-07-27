"use strict";

var fs = require('fs');
var mdToHtml = require('../tools/myna_markdown_to_html');
var md = fs.readFileSync('readme.md', 'utf-8');
var content = mdToHtml(md);
fs.writeFileSync('tests/output/readme.html', content, { encoding:'utf-8' });
process.exit();