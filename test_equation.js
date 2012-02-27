
var translator = require('./equation.js');

var equation1 = "(* 7 3 (- 23 (/ 2 7)))";
var equation2 = "(* 7 (/ 34 234) 6 (- 23 (/ 2 7)))";
var equation3 = "(* 7 4)";




console.log("input: %s", equation2);
console.log("output: %s", translator.translate_scheme(equation2));












