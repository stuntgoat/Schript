// test_lambda.js

var t = require('./translate.js');

expression = "(lambda (x y z) (+ x (* y z)))";
var a = t.translate(expression);

console.log(a);














