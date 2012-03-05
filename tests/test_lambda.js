// test_lambda.js

var t = require('../translate.js');

expression = "(lambda (x y z) (+ x (* y z)))";
expression1 = "((lambda (x y z) (+ x (* y z))) 1 2 3)";

expression2 = "((lambda (x y z) ((lambda (a b c) (+ x a (* y b (/ c z)))) 1 2 3)) 9 8 7.0) ";

expression3 = "((lambda (x y z) ((lambda (a b c) (+ x a (* y b ((lambda (l m n) (* 3 (+ n (- m l)))) a y c) (/ c z)))) 1 2 3)) 9 8 7.0) ";

console.log('\n');

var a = t.translate(expression);
console.log("input:", expression);
console.log("output:", a);

console.log('\n');

var b = t.translate(expression1);
console.log("input:", expression1);
console.log("output:", b);

console.log('\n');

var c = t.translate(expression2);
console.log("input:", expression2);
console.log("output:", c);


var d = t.translate(expression3);
console.log("input:", expression3);
console.log("output:", d);






