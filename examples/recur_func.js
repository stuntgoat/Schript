var schript = require('../translate').schript;
var input = "(define (recurs x) (if (= x 0) x (+ x (recurs (- x 1)))))";
var output = schript(input, {});
console.log("\n\ninput: ", input);
console.log("\n\noutput: ", output + "\n");






