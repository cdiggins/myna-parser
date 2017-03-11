'use strict';

// Load the file system module 
let fs = require('fs');

// Load the Myna module 
let myna = require('../myna.js');

// Load the Myna markdown grammar module 
let mdGrammar = require('../grammars/markdown.js');

// Register the Myna grammar 
myna.registerGrammar("markdown", mdGrammar);

// Returns the contents of a file is utf-8
function readAllText(path) {
    return fs.readFileSync(path, 'utf8');
}

// Writes text to a file, creating it if necessary 
function writeAllText(path, text) {
    fs.writeFile(path, text, function(err) {
        if(err) return console.log(err);
    });
} 

// Outputs a parse tree given a string 
function outputParseTreeForString(input, rule) {
    let ast = myna.parse(rule, input);
    let html = markdownAstToHtml(ast, []);    
    console.log(html.join(""));
}

function outputParseTreeForFile(path, rule) {
    return outputParseTreeForString(readAllText(path), rule);
}

function startTag(tag, attr) {
    let attrStr = "";
    if (attr) {
        attrStr = " " + Object.keys(attr).map(function(k) { 
            return k + ' = "' + attr[k] + '"';
        }).join(" ");
    }
    return "<" + tag + attrStr + ">";
}

function endTag(tag) {
    return "</" + tag + ">";
}

function markdownAstToHtml(ast, htmlBuilder) {
    if (htmlBuilder == undefined)
        htmlBuilder = [];

    // Adds each element of the array as markdown 
    function addArray(ast) {
        for (let child of ast)
            markdownAstToHtml(child, htmlBuilder);
        return htmlBuilder;
    }

    // Adds tagged content 
    function addTag(tag, ast) {
        htmlBuilder.push(startTag(tag));
        if (ast instanceof Array)
            addArray(ast); 
        else
            markdownAstToHtml(ast, htmlBuilder);
        htmlBuilder.push(endTag(tag));
        return htmlBuilder;
    }

    function addLink(url, ast) {
        htmlBuilder.push(startTag('a', { href:url }));
        addArray(ast.children);
        htmlBuilder.push(endTag('a')) ;
        return htmlBuilder;
    }

    function addImg(url) {
        htmlBuilder.push(startTag('img', { src:url }));
        htmlBuilder.push(endTag('img')) ;
        return htmlBuilder;
    }

    switch (ast.name)
    {
        case "heading": 
            {
                let headingLevel = ast.children[0];
                let restOfLine = ast.children[1];
                let h = headingLevel.selfText.length;
                switch (h)
                {
                    case 1: return addTag("h1", restOfLine); 
                    case 2: return addTag("h2", restOfLine); 
                    case 3: return addTag("h3", restOfLine); 
                    case 4: return addTag("h4", restOfLine); 
                    case 5: return addTag("h5", restOfLine); 
                    case 6: return addTag("h6", restOfLine); 
                    default: throw "Heading level must be from 1 to 6"
                }
            }
        case "paragraph":
            return addTag("p", ast.children);
        case "list":
            return addTag("ul", ast.children);
        case "unorderedListItem":
            return addTag("li", ast.children);
        case "orderedListItem":
            return addTag("li", ast.children);
        case "bold":
            return addTag("b", ast.children);
        case "italic":
            return addTag("i", ast.children);
        case "code":
            return addTag("code", ast.children);
        case "quote":
            return addTag("blockquote", ast.children);
        case "link":
            return addLink(ast.children[1].allText, ast.children[0]);
        case "image":
            return addImg(ast.children[0]);
        default:
            if (ast.isLeaf)
                htmlBuilder.push(ast.selfText);
            else 
                ast.children.forEach(function(c) { markdownAstToHtml(c, htmlBuilder); });
    }
    return htmlBuilder;
}

function demoMarkDown()
{
    outputParseTreeForFile('readme.md', myna.allRules["markdown.document"]);
}

demoMarkDown();
