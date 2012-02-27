// 

var lexer = require('./lexer.js');
var parser = require('./parser.js');

var expression = "(- 2(*(- 4 6 -6)-3 7 56)99)";

var tokenized = lexer.tokenize(expression);
var parsed = parser.parse(tokenized);

console.log("lexer.tokenized given Scheme expression:\n%s", expression);
console.log("returns:\n%s", JSON.stringify(tokenized));
console.log("parser.parse given tokenized:\n%s", JSON.stringify(tokenized));
console.log("returns:");
console.log(JSON.stringify(parsed));

