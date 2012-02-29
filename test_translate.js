// test_translate.js
// Translate Scheme to JavaScript using translate.js


var translator = require('./translate.js');
var equation1 = "(* 3 9 6(- 456456 90 (expt 8 (sqrt (* 98 23 (remainder 5656 45))))) 9 8 (modulo 76 (/ 12 4)))";

console.log("input: %s", equation1);
console.log("output: %s", translator.translate(equation1));













