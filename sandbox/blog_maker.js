"use strict";

// Modules
let fs = require('fs');
let path = require('path');

// Global variables
let rootDir = ".";
let publishDir = rootDir + "/publish";
let srcDir = rootDir + "/src";

// Functions 

// Returns all of the files in a directory 
function getFiles(dir, recursive) {
    let results = []
    let list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        let stat = fs.statSync(file)
        if (stat && stat.isDirectory() && recursive) 
            results = results.concat(getFiles(file))
        else 
            results.push(file)
    })
    return results
}

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

function getArticleSrc() {    
}

function clearDirectory(dir) {
    fs.rmdirSync(dir);
    fs.mkdirSync(dir);
}

function getFiles() {
}

function isMarkDown(file) {
    return path.extname(file) == ".md";
}

function publishArticles() {
     clearDirectory(publishDir);
     let articles = getFiles(dir, recursive).filter(isMarkDown);
     articles.forEach(publishArticle);
}

function articleSrcToPublish(file) {
    return path.resolve(publishDir, path.basename(file));
}

function articlesByDate() {
}


function publishArticle(srcFile) {
    // TODO: get the input from the in
    let markdownAst = myna.parse(markdownRule, input);
    let templateAst = myna.parse(templateRule, template)
    let publishFile = md2html(markdownAstToHtml(markdownAst, []);
}

publishArticles();
