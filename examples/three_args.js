

var schript = require('../translate').schript;
var input = "((lambda (x y z) (* x y (* x z))) 2 3 4)";
var LOCAL_ENV = {};
var output = schript(input, LOCAL_ENV);

console.log("\n\ninput: ", input);
console.log("\n\noutput: ", output + "\n");
