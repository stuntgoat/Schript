// test_lambda.js

var t = require('./translate.js');

expression = "(lambda (x y z) (+ x (* y z)))";
expression1 = "(lambda (x y z) (lambda (a b c) (+ x a (* y b (/ c z)))))";

var a = t.translate(expression1);
console.log("input:", expression1);
console.log("output:", a);














