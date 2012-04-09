

var schript = require('../translate').schript;
var input =  "(let ((y 8)(z 7)) (* y z) (+ y z))";

var LOCAL_ENV = {};
var output = schript(input, LOCAL_ENV);

console.log("\n\ninput: ", input);
console.log("\n\noutput: ", output + "\n");
