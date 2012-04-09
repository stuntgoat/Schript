

var schript = require('../translate').schript;
var input = "(define x 27)(define y 9)(+ x y)";
var LOCAL_ENV = {};
var output = schript(input, LOCAL_ENV);

console.log("\n\ninput: ", input);
console.log("\n\noutput: ", output + "\n");

