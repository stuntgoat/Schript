// 

var lexer = require('./lexer.js');
var parser = require('./parser.js');


// var expression = "(- 2(*(- 4 6 -6)-3 7 56)99)";
var expression = "(lambda (x y z) (+ x (* y z)))";
eq2 = "(define fib (lambda (n) (if (= n 0) 0 (if (= n 1) 1 (+ (fib (- n 1)) (fib (- n 2)))))))";
eq3 = "(lambda (x y z) (* x y z))"

// var tokenized = lexer.tokenize(expression);
// var parsed = parser.parse(tokenized);

// console.log("lexer.tokenized given Scheme expression:\n%s", expression);
// console.log("returns:\n%s", JSON.stringify(tokenized));
// console.log("parser.parse given tokenized:\n%s", JSON.stringify(tokenized));
// console.log("returns:");
// console.log(JSON.stringify(parsed));



var lambda = require('./lambda.js');

var tokenized = lexer.tokenize(eq3);
var parsed = parser.parse(tokenized);

console.log("lexer.tokenized given Scheme expression:\n%s", eq3);
console.log("returns:\n%s", JSON.stringify(tokenized));
console.log("parser.parse given tokenized:\n%s", JSON.stringify(tokenized));
console.log("returns:");
console.log(JSON.stringify(parsed));
console.log(lambda.lambda);


