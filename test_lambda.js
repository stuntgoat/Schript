// test_lambda.js

var t = require('./translate.js');

expression = "((lambda (x y z) (+ x (* y z))) 1 2 3)";
expression1 = "(lambda (x y z) (lambda (a b c) (+ x a (* y b (/ c z)))))";

var a = t.translate(expression);
console.log("input:", expression);
console.log("output:", a);














