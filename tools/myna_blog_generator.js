'use strict';

let fs = require("fs");
let path = require('path');
let mdToHtml = require('../tools/myna_markdown_to_html');
let expand = require('../tools/myna_mustache_expander');

function replaceExt(fileName, newExt) {
    let i = fileName.lastIndexOf(".");
    let base = i >= 0 ? fileName.substring(0, i) : fileName;
    return base + newExt;
}

function createLink(href, text) {
    return "<a href='" + href + "'>" + text + "</a>";
}

function articleLink(article) {
    return article ? createLink(article.url, article.title) : '';
}

function saveToFile(folder, fileName, content) {
    fs.writeFileSync(folder + "/" + fileName, content, { encoding:'utf-8' });
}

function readJsonFile(file) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function generateBlogs(inputFolder, outputFolder, templateFile, articlesFile) {
    if (!fs.existsSync(outputFolder))
        fs.mkdirSync(dir);
    
    // Read the template
    let template = fs.readFileSync(templateFile, 'utf-8');

    // Read a JSON object
    let articles = readJsonFile(articlesFile);
    
    // We just want the array
    articles = articles.posts;

    // Convert dates strings into date objects (makes sorting and displaying easier)
    articles.forEach(function(a) { a.date = new Date(a.date); });

    // Sort articles by date    
    articles.sort(function (a,b) { return b.date -a.date; });

    // Generate the content for each page 
    for (let i=0; i < articles.length; ++i) {
        try {
            let a = articles[i];
            a.url = replaceExt(a.src, ".html");
            a.prev = articles[i+1];
            a.next = articles[i-1];
            a.linkPrev = articleLink(a.prev);
            a.linkNext = articleLink(a.next);
            a.sideBar = '';
            a.srcFile = inputFolder + '/' + a.src;
            a.markDown = fs.readFileSync(a.srcFile, 'utf-8');
            a.content = mdToHtml(a.markDown);
            a.html = expand(template, a);
            saveToFile(outputFolder, a.url, a.html);
        }
        catch (ex)
        {
            console.log(ex);
        }

    }
}

generateBlogs(
    './sandbox/blog/articles', 
    './sandbox/blog/publish', 
    './sandbox/blog/input/article_template.html', 
    './sandbox/blog/input/articles.json');

console.log('finished');
process.exit();