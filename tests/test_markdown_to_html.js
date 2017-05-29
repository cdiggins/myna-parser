"use strict";

let fs = require('fs');
let mdToHtml = require('../tools/myna_markdown_to_html');

let md = fs.readFileSync('readme.md', 'utf-8');
let content = mdToHtml(md);
fs.writeFileSync('tests/output/readme.html', content, { encoding:'utf-8' });

process.exit();