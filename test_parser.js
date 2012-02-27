// 

var parser = require('./parser.js');
var lexer = require('./lexer.js');

var expression111 = "(- 2(*(- 4 6 -6)-3 7 56)99)";

var tokenized = lexer.tokenize(expression111);

var parsed = parser.parse(tokenized);

var st = parser.ast(parsed);

console.log("given:");
console.log(parsed);
console.log("returns:");
console.log(JSON.stringify(st));

