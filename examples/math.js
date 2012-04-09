var schript = require('../translate').schript;
var input = "(+ 6 77(- 27 9 11))";
var LOCAL_ENV = {};
var output = schript(input, LOCAL_ENV);

console.log("\n\ninput: ", input);
console.log("\n\noutput: ", output + "\n");

 
