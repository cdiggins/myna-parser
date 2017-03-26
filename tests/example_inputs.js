var testInputs = {

markdown : 
'# Biggest Heading\n\
\n\
This is a paragraph. \n\
That is continued on another \n\
line.\n\
\n\
## Another heading but smaller \n\
\n\
- unordered list item 1\n\
- unordered list item 2\n\
  - nested list item 1\n\
  - nested list item 2\n\
- unordered list item 3\n\
\n\
Here is a quote:\n\
> Somebody famous said \n\
> this\n\
\n\
Here is some *very __important__ text*. \n\
~~I changed my mind about this~~.\n\
',

arithmetic : '(1 + 2) * 0.3 / 4.5 - (1 + 2 + 3)',

csv : 'Field_A1,field A2,"field A3,has,commas"\nField_B1,field B2,"Field B3 is quoted also\n"',

json : 
'{\n\
    "field1":42, \n\
    "x" : "blabla"\n\
    "field2": [\n\
        12, 13, 14, "15", 1.6, {}\n\
    ],\n\
    "field 3" : { "a":1, "b":2 },\n\
    "" : ""\n\
}',

template : 'This is a template. Regular brackets (e.g. `{ }`) don\'t change anything.\nHowever a {{variable}} is something special\n\
 as is a {{#section}}section{{/section}}. {{!Comments are just ignored.}}. We can include files {{> includeme.js}}.\n\
 Some variables can also be included without escapaing. Method 1 {{{unescaped_var}}} and Method 2 {{&unescaped_var}}.\n\
 There are also {{^section}}inverted sections{{/section}}.'

}